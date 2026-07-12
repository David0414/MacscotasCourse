import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import nodemailer from "nodemailer";
import { GetObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  MercadoPagoConfig,
  Payment,
  Preference,
  WebhookSignatureValidator
} from "mercadopago";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3000);
const baseUrl = (process.env.APP_URL || `http://localhost:${port}`).replace(/\/$/, "");
const courseDir = path.resolve(process.env.COURSE_FILES_DIR || path.join(__dirname, "private", "course"));
const dataDir = path.resolve(process.env.DATA_DIR || path.join(__dirname, "data"));
const deliveriesFile = path.join(dataDir, "deliveries.json");
const allowedExtensions = new Set([".pdf", ".mp4", ".webm", ".mov"]);
const hasR2 = ["R2_ENDPOINT", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"].every((key) => process.env[key]);
const r2 = hasR2 ? new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY }
}) : null;

fs.mkdirSync(courseDir, { recursive: true });
fs.mkdirSync(dataDir, { recursive: true });

const required = ["MERCADO_PAGO_ACCESS_TOKEN", "ACCESS_LINK_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) console.warn(`[config] Faltan variables: ${missing.join(", ")}`);

const mpClient = process.env.MERCADO_PAGO_ACCESS_TOKEN
  ? new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN })
  : null;

app.disable("x-powered-by");
app.use(express.json({ limit: "200kb" }));

const safeEqual = (a, b) => {
  const one = Buffer.from(String(a));
  const two = Buffer.from(String(b));
  return one.length === two.length && crypto.timingSafeEqual(one, two);
};

function signAccess(payment) {
  const payload = Buffer.from(JSON.stringify({
    paymentId: String(payment.id),
    email: payment.payer?.email || "",
    exp: Date.now() + Number(process.env.ACCESS_LINK_DAYS || 365) * 86400000
  })).toString("base64url");
  const signature = crypto.createHmac("sha256", process.env.ACCESS_LINK_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function readAccess(token) {
  try {
    const [payload, signature] = String(token || "").split(".");
    if (!payload || !signature || !process.env.ACCESS_LINK_SECRET) return null;
    const expected = crypto.createHmac("sha256", process.env.ACCESS_LINK_SECRET).update(payload).digest("base64url");
    if (!safeEqual(signature, expected)) return null;
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return decoded.exp > Date.now() ? decoded : null;
  } catch {
    return null;
  }
}

async function getPayment(paymentId) {
  if (!mpClient || !/^\d+$/.test(String(paymentId || ""))) return null;
  return new Payment(mpClient).get({ id: String(paymentId) });
}

function isValidPurchase(payment) {
  return payment?.status === "approved" &&
    payment.currency_id === (process.env.PRODUCT_CURRENCY || "MXN") &&
    Number(payment.transaction_amount) === Number(process.env.PRODUCT_PRICE || 55) &&
    String(payment.external_reference || "").startsWith("patitas-");
}

async function courseFiles(token) {
  if (r2) {
    const prefix = String(process.env.R2_COURSE_PREFIX || "course/").replace(/^\/+/, "");
    const result = await r2.send(new ListObjectsV2Command({ Bucket: process.env.R2_BUCKET, Prefix: prefix }));
    const objects = (result.Contents || []).filter((item) => item.Key && allowedExtensions.has(path.extname(item.Key).toLowerCase()));
    return Promise.all(objects.sort((a, b) => a.Key.localeCompare(b.Key, "es", { numeric: true })).map(async (item) => {
      const name = item.Key;
      const displayName = path.basename(name);
      const base = { name, title: path.parse(displayName).name.replace(/^\d+[-_. ]*/, "").replace(/[-_]/g, " "), type: path.extname(name).toLowerCase() === ".pdf" ? "pdf" : "video" };
      const expiresIn = Math.min(Number(process.env.R2_URL_EXPIRES_SECONDS || 3600), 604800);
      const url = await getSignedUrl(r2, new GetObjectCommand({ Bucket: process.env.R2_BUCKET, Key: name }), { expiresIn });
      const downloadUrl = await getSignedUrl(r2, new GetObjectCommand({ Bucket: process.env.R2_BUCKET, Key: name, ResponseContentDisposition: `attachment; filename="${displayName.replace(/"/g, "")}"` }), { expiresIn });
      return { ...base, url, downloadUrl };
    }));
  }
  return fs.readdirSync(courseDir, { withFileTypes: true })
    .filter((item) => item.isFile() && allowedExtensions.has(path.extname(item.name).toLowerCase()))
    .map((item) => ({
      name: item.name,
      title: path.parse(item.name).name.replace(/^\d+[-_. ]*/, "").replace(/[-_]/g, " "),
      type: path.extname(item.name).toLowerCase() === ".pdf" ? "pdf" : "video",
      url: `/api/course/file/${encodeURIComponent(item.name)}?token=${encodeURIComponent(token)}`,
      downloadUrl: `/api/course/file/${encodeURIComponent(item.name)}?token=${encodeURIComponent(token)}&download=1`
    }));
}

function readDeliveries() {
  try { return JSON.parse(fs.readFileSync(deliveriesFile, "utf8")); }
  catch { return {}; }
}

function markDelivered(paymentId, email) {
  const deliveries = readDeliveries();
  deliveries[paymentId] = { email, sentAt: new Date().toISOString() };
  const temp = `${deliveriesFile}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(deliveries, null, 2));
  fs.renameSync(temp, deliveriesFile);
}

async function sendAccessEmail(payment, accessUrl) {
  const email = payment.payer?.email;
  if (!email) throw new Error("El pago aprobado no contiene correo del comprador");
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#173434"><div style="background:#0b4b49;padding:28px;border-radius:20px 20px 0 0;color:#fff"><h1 style="margin:0">¡Tu curso está listo!</h1></div><div style="padding:28px;border:1px solid #e8e1d7;border-top:0;border-radius:0 0 20px 20px"><p>Gracias por tu compra. Tu pago fue confirmado correctamente.</p><p>Desde el siguiente botón podrás ver las clases y abrir o descargar todos tus PDFs:</p><p style="text-align:center;margin:30px 0"><a href="${accessUrl}" style="display:inline-block;background:#ff6b2c;color:#fff;text-decoration:none;padding:16px 24px;border-radius:12px;font-weight:bold">Acceder a mi curso</a></p><p style="font-size:13px;color:#647674">Guarda este correo. Tu enlace es personal y no debes compartirlo.</p></div></div>`;
  const from = process.env.EMAIL_FROM || `Patitas & Horno <${process.env.GMAIL_USER}>`;

  if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [email], subject: "Tu acceso a Repostería Canina 🐾", html })
    });
    if (!response.ok) throw new Error(`Resend respondió ${response.status}: ${await response.text()}`);
    return true;
  }

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, "") }
    });
    await transporter.sendMail({ from, to: email, subject: "Tu acceso a Repostería Canina 🐾", html });
    return true;
  }

  {
    console.warn(`[email] Configuración incompleta. Acceso para ${email}: ${accessUrl}`);
    return false;
  }
}

async function deliverPurchase(payment) {
  const paymentId = String(payment.id);
  const token = signAccess(payment);
  const accessUrl = `${baseUrl}/curso?token=${encodeURIComponent(token)}`;
  if (!readDeliveries()[paymentId]) {
    const sent = await sendAccessEmail(payment, accessUrl);
    if (sent) markDelivered(paymentId, payment.payer?.email);
  }
  return { token, accessUrl };
}

app.get("/api/health", (_req, res) => res.json({ ok: true, mercadoPago: Boolean(mpClient), email: Boolean((process.env.RESEND_API_KEY && process.env.EMAIL_FROM) || (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)), storage: hasR2 ? "r2" : "local" }));

app.get("/api/sample-status", (_req, res) => {
  res.json({ available: fs.existsSync(path.join(__dirname, "public", "vista-previa-ebook.pdf")) });
});

app.post("/api/checkout", async (req, res) => {
  try {
    if (!mpClient) return res.status(503).json({ error: "Mercado Pago todavía no está configurado." });
    const email = String(req.body?.email || "").trim().toLowerCase();
    const name = String(req.body?.name || "").trim().slice(0, 80);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Escribe un correo válido." });

    const preference = await new Preference(mpClient).create({ body: {
      items: [{ id: "curso-reposteria-canina", title: process.env.PRODUCT_NAME || "Curso de Repostería Canina", quantity: 1, currency_id: process.env.PRODUCT_CURRENCY || "MXN", unit_price: Number(process.env.PRODUCT_PRICE || 55) }],
      payer: { email, name: name || undefined },
      external_reference: `patitas-${crypto.randomUUID()}`,
      back_urls: {
        success: `${baseUrl}/gracias`,
        pending: `${baseUrl}/pago-pendiente`,
        failure: `${baseUrl}/pago-error`
      },
      auto_return: "approved",
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      statement_descriptor: "PATITAS HORNO",
      metadata: { buyer_email: email, buyer_name: name }
    }});
    res.json({ checkoutUrl: preference.init_point });
  } catch (error) {
    console.error("[checkout]", error);
    res.status(500).json({ error: "No pudimos iniciar el pago. Intenta nuevamente." });
  }
});

app.post("/api/webhooks/mercadopago", async (req, res) => {
  const dataId = String(req.query["data.id"] || req.body?.data?.id || "");
  try {
    if (process.env.MERCADO_PAGO_WEBHOOK_SECRET) {
      WebhookSignatureValidator.validate({
        xSignature: req.headers["x-signature"],
        xRequestId: req.headers["x-request-id"],
        dataId,
        secret: process.env.MERCADO_PAGO_WEBHOOK_SECRET
      });
    }
    if ((req.query.type || req.body?.type) !== "payment") return res.sendStatus(200);
    const payment = await getPayment(dataId);
    if (isValidPurchase(payment)) await deliverPurchase(payment);
    res.sendStatus(200);
  } catch (error) {
    console.error("[webhook]", error);
    if (!res.headersSent) res.sendStatus(401);
  }
});

app.get("/api/payment/status", async (req, res) => {
  try {
    const payment = await getPayment(req.query.payment_id);
    if (!payment) return res.status(400).json({ status: "invalid" });
    if (!isValidPurchase(payment)) return res.json({ status: payment.status || "invalid" });
    const delivery = await deliverPurchase(payment);
    res.json({ status: "approved", token: delivery.token, accessUrl: delivery.accessUrl, email: payment.payer?.email || "" });
  } catch (error) {
    console.error("[payment-status]", error);
    res.status(500).json({ status: "error" });
  }
});

app.get("/api/course", async (req, res) => {
  const access = readAccess(req.query.token);
  if (!access) return res.status(401).json({ error: "Este enlace no es válido o ya venció." });
  try { res.json({ email: access.email, files: await courseFiles(req.query.token) }); }
  catch (error) { console.error("[course-files]", error); res.status(500).json({ error: "No pudimos cargar el contenido del curso." }); }
});

app.get("/api/course/file/:name", (req, res) => {
  const access = readAccess(req.query.token);
  if (!access) return res.status(401).send("Enlace no válido o vencido.");
  const name = path.basename(req.params.name);
  const file = path.join(courseDir, name);
  if (!allowedExtensions.has(path.extname(name).toLowerCase()) || !fs.existsSync(file)) return res.sendStatus(404);
  res.setHeader("Cache-Control", "private, max-age=3600");
  if (req.query.download === "1") res.setHeader("Content-Disposition", `attachment; filename="${name.replace(/"/g, "")}"`);
  res.sendFile(file);
});

app.use(express.static(path.join(__dirname, "dist"), { index: false }));
app.get("/{*splat}", (_req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));

app.listen(port, () => console.log(`Patitas & Horno disponible en ${baseUrl}`));
