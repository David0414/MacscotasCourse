import { useEffect, useMemo, useRef, useState } from "react";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { SITE_CONFIG } from "./config";
import { trackMeta } from "./lib/tracking";
import { PRODUCT_CONFIG, formatPrice } from "./product-config";

const media = PRODUCT_CONFIG.media;
const ebookImage = PRODUCT_CONFIG.assets.ebook;
const cursaliaLogo = PRODUCT_CONFIG.assets.logo;

const videoFiles = import.meta.glob("./video.{mp4,webm,mov}", {
  eager: true,
  query: "?url",
  import: "default"
});

const modules = PRODUCT_CONFIG.modules;
const faqs = PRODUCT_CONFIG.faqs;
const pills = PRODUCT_CONFIG.pills;
const darkFeatures = PRODUCT_CONFIG.darkFeatures;

function App() {
  const [toast, setToast] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const currentPath = useMemo(() => window.location.pathname.toLowerCase(), []);
  const videoSrc = Object.values(videoFiles)[0];

  useEffect(() => {
    document.title = `${PRODUCT_CONFIG.brand} | ${PRODUCT_CONFIG.productName}`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", PRODUCT_CONFIG.metaDescription);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const whatsappUrl = (message) => `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  const handleBuy = () => {
    trackMeta("InitiateCheckout", { value: SITE_CONFIG.price, currency: SITE_CONFIG.currency, content_name: SITE_CONFIG.productName });
    setShowCheckout(true);
  };

  const handleWhatsApp = () => {
    trackMeta("Contact");
    window.open(whatsappUrl(`Hola, quiero información sobre el ${SITE_CONFIG.productName}.`), "_blank", "noopener,noreferrer");
  };

  if (currentPath === "/curso") return <CoursePage />;
  if (currentPath.includes("gracias")) return <ThankYouPage />;
  if (currentPath.includes("pago-pendiente")) return <PaymentStatePage state="pending" />;
  if (currentPath.includes("pago-error")) return <PaymentStatePage state="failure" />;

  return (
    <div className="overflow-x-hidden bg-paper">
      <div className="announcement"><span>✦ PRECIO ESPECIAL DE LANZAMIENTO</span><strong>{formatPrice()}</strong><span className="hidden sm:inline">Acceso digital inmediato tras confirmar tu pago</span></div>
      <Header onBuy={handleBuy} />

      <main>
        <section id="inicio" className="hero-section">
          <div className="orb orb-one" /><div className="orb orb-two" />
          <div className="container-page relative z-10 grid items-center gap-12 py-14 lg:grid-cols-[1.02fr_.98fr] lg:py-20">
            <div className="reveal">
              <div className="eyebrow"><span className="live-dot" /> {PRODUCT_CONFIG.hero.eyebrow}</div>
              <h1 className="hero-title mt-6">{PRODUCT_CONFIG.hero.title}<span>{PRODUCT_CONFIG.hero.accentTitle}</span></h1>
              <p className="hero-description mt-6 max-w-xl text-lg leading-8 text-[#526967]"><strong>{PRODUCT_CONFIG.hero.descriptionLead}</strong> {PRODUCT_CONFIG.hero.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {pills.map(item => <span className="pill" key={item}>✓ {item}</span>)}
              </div>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button onClick={handleBuy} className="btn btn-accent min-h-16 px-8">Quiero empezar · {formatPrice()} <span>→</span></button>
                <a href="#experiencia" className="btn min-h-14 px-5 text-teal">Ver el curso <span className="play-mini">▶</span></a>
              </div>
              <div className="mt-7 flex items-center gap-4 text-sm text-[#617876]">
                <div className="avatar-stack">{[media.dog, media.puppy, media.hero].map((src, i) => <img key={src} src={src} alt="" style={{ zIndex: 3-i }} />)}</div>
                <p><strong className="block text-ink">{PRODUCT_CONFIG.hero.audienceTitle}</strong>{PRODUCT_CONFIG.hero.audienceText}</p>
              </div>
            </div>

            <div className="hero-collage reveal delay-1">
              <div className="hero-photo"><img src={media.hero} alt="Aplicación profesional de extensiones de pestañas" /><div className="photo-shade" /></div>
              <div className="floating-card card-top"><span>★★★★★</span><strong>Aprende a tu ritmo</strong><small>Desde cualquier dispositivo</small></div>
              <div className="floating-card price-badge"><small>HOY</small><strong>{formatPrice(false)}</strong><small>{PRODUCT_CONFIG.currency}</small></div>
              <img className="mini-photo ebook-mini" src={ebookImage} alt={`Ebook ${PRODUCT_CONFIG.productName}`} />
              <div className="scribble">precisión<br />y belleza <span>↗</span></div>
            </div>
          </div>
        </section>

        <section className="trust-bar"><div className="container-page">{[...PRODUCT_CONFIG.trust, [formatPrice(false), "pago único"]].map(([big, text]) => <div key={text}><strong>{big}</strong><span>{text}</span></div>)}</div></section>

        <section id="experiencia" className="relative bg-ink py-20 text-white lg:py-28">
          <div className="texture" />
          <div className="container-page relative z-10 grid items-center gap-14 lg:grid-cols-[.88fr_1.12fr] lg:gap-24">
            <div className="phone-stage">
              <div className="phone-glow" />
              <div className="phone-frame">
                {videoSrc ? <video src={videoSrc} controls playsInline preload="metadata" /> : <div className="video-placeholder"><img src={media.baking} alt="Aplicación de pestañas paso a paso" /><div className="video-overlay"><span className="play-button">▶</span><strong>Tu video vertical irá aquí</strong><small>Agrega un MP4, WEBM o MOV directamente en src</small></div></div>}
              </div>
              <div className="video-note">CLASES<br />PASO A PASO <span>↙</span></div>
            </div>
            <div>
              <span className="kicker text-yellow">MIRA · APRENDE · CREA</span>
              <h2 className="editorial-title mt-4 text-white">{PRODUCT_CONFIG.sections.experienceTitle}</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">{PRODUCT_CONFIG.sections.experienceText}</p>
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {darkFeatures.map(([n,t,x]) => <article className="dark-feature" key={n}><span>{n}</span><div><strong>{t}</strong><p>{x}</p></div></article>)}
              </div>
              <button onClick={handleBuy} className="btn btn-accent mt-10 px-7 py-4">Quiero ver todas las clases →</button>
            </div>
          </div>
        </section>

        <section id="incluye" className="py-20 lg:py-28">
          <div className="container-page">
            <SectionHeading kicker="TODO LO QUE RECIBES" title={<>{PRODUCT_CONFIG.sections.packageLead}<br/><em>{PRODUCT_CONFIG.sections.packageAccent}</em></>} text={PRODUCT_CONFIG.sections.packageText} />
            <div className="module-grid">{modules.map(([n,title,text], i) => <article className={`module-card module-${i+1}`} key={n}><span className="module-number">{n}</span><div><h3>{title}</h3><p>{text}</p></div>{i === 0 && <img className="ebook-product" src={ebookImage} alt={`Portada de ${PRODUCT_CONFIG.productName}`} />}{i === 2 && <img src={media.puppy} alt="Perrito feliz" />}</article>)}</div>
            <div className="medical-note"><span>✦</span><p><strong>La seguridad también es técnica.</strong> Aprende normas de higiene, bioseguridad, patologías oculares, cuidados posteriores y retiro seguro.</p></div>
          </div>
        </section>

        <PdfPreview onBuy={handleBuy} />

        <section id="galeria" className="gallery-section py-20 lg:py-28">
          <div className="container-page">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><SectionHeading kicker="INSPIRACIÓN LASH" title={<>Precisión en cada detalle.<br/><em>Miradas que destacan.</em></>} /><p className="max-w-sm pb-10 text-[#617876]">Aprende a elegir grosores, largos, curvaturas y mappings para crear diseños personalizados y profesionales.</p></div>
            <div className="masonry-gallery">
              <figure className="gallery-a"><img src={media.baking} alt="Técnica de aplicación de pestañas" loading="lazy" decoding="async"/><figcaption>Aplicación paso a paso</figcaption></figure>
              <figure className="gallery-b"><img src={media.dog} alt="Trabajo profesional de lashista" loading="lazy" decoding="async"/><figcaption>Precisión profesional</figcaption></figure>
              <figure className="gallery-c"><img src={media.treats} alt="Extensiones de pestañas" loading="lazy" decoding="async"/><figcaption>Diseños para cada mirada</figcaption></figure>
              <figure className="gallery-d"><img src={media.kitchen} alt="Estudio profesional de pestañas" loading="lazy" decoding="async"/><figcaption>Tu próximo emprendimiento</figcaption></figure>
              <figure className="gallery-e"><img src={media.technique} alt="Lashista aplicando extensiones con pinzas de precisión" loading="lazy" decoding="async" width="1280" height="768"/><figcaption>Técnica limpia y precisa</figcaption></figure>
              <figure className="gallery-f"><img src={media.studio} alt="Emprendedora organizando su estudio de pestañas" loading="lazy" decoding="async" width="1280" height="768"/><figcaption>Convierte tu habilidad en un negocio</figcaption></figure>
            </div>
          </div>
        </section>

        <section className="process-section py-20 lg:py-28"><div className="container-page grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24"><div className="lg:sticky lg:top-32 lg:self-start"><span className="kicker">ASÍ DE FÁCIL</span><h2 className="editorial-title mt-4">Tres pasos.<br/><em>Una nueva habilidad.</em></h2><p className="mt-5 text-[#617876]">Compra una vez y estudia a tu propio ritmo.</p></div><div className="process-list">{[["01","Decide comenzar","Presiona el botón y completa tu pago de forma segura."],["02","Recibe tu acceso","Cuando se confirme el pago te enviaremos el enlace personal."],["03","Practica a tu ritmo","Estudia las técnicas, descarga las plantillas y perfecciona cada movimiento."]].map(([n,t,x])=><article key={n}><span>{n}</span><div><h3>{t}</h3><p>{x}</p></div><b>↗</b></article>)}</div></div></section>

        <section id="preguntas" className="bg-cream py-20 lg:py-28"><div className="container-page grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-24"><div><span className="kicker">ANTES DE EMPEZAR</span><h2 className="editorial-title mt-4">Preguntas<br/><em>frecuentes.</em></h2><button onClick={handleWhatsApp} className="btn mt-7 border-2 border-teal px-6 py-3 text-teal">Hablar por WhatsApp</button></div><div className="faq-list">{faqs.map(([q,a],i)=><div key={q}><button onClick={()=>setOpenFaq(openFaq===i?-1:i)} aria-expanded={openFaq===i}><span>{String(i+1).padStart(2,'0')}</span>{q}<b>{openFaq===i?'−':'+'}</b></button>{openFaq===i&&<p>{a}</p>}</div>)}</div></div></section>

        <section className="final-cta"><img src={media.hero} alt="Curso digital de extensiones de pestañas"/><div className="final-overlay"/><div className="container-page relative z-10 text-center text-white"><span className="kicker text-yellow">TU CAMINO COMO LASHISTA COMIENZA AQUÍ</span><h2>{PRODUCT_CONFIG.sections.finalTitle}<br/><em>{PRODUCT_CONFIG.sections.finalAccent}</em></h2><p>{PRODUCT_CONFIG.sections.finalText}</p><button onClick={handleBuy} className="btn btn-accent mt-8 min-h-16 px-9">Empezar ahora por {formatPrice()} →</button><small>🔒 Pago único · Acceso digital</small></div></section>
      </main>

      <Footer onWhatsApp={handleWhatsApp}/>
      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} onError={setToast} />}
      <button onClick={handleWhatsApp} className="whatsapp" aria-label="Contactar por WhatsApp">✆</button>
      <div className="mobile-buy"><div><small>Precio de lanzamiento</small><strong>{formatPrice()}</strong></div><button onClick={handleBuy} className="btn btn-accent px-5 py-3">Comprar ahora</button></div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function LogoMark() { return <img className="brand-logo" src={cursaliaLogo} alt={PRODUCT_CONFIG.platformBrand} /> }

function Header({onBuy}) { return <header className="site-header"><nav className="container-page"><a href="#inicio" className="brand"><LogoMark/><div><strong>{PRODUCT_CONFIG.brand}</strong><small>{PRODUCT_CONFIG.brandSubtitle}</small></div></a><div className="nav-links"><a href="#experiencia">Experiencia</a><a href="#incluye">Contenido</a><a href="#galeria">Inspiración</a><a href="#preguntas">Preguntas</a></div><button onClick={onBuy} className="btn btn-primary hidden px-5 py-3 sm:inline-flex">Quiero el curso →</button></nav></header> }

function SectionHeading({kicker,title,text}) { return <div className="mb-10 max-w-3xl"><span className="kicker">{kicker}</span><h2 className="editorial-title mt-4">{title}</h2>{text&&<p className="mt-5 max-w-2xl text-lg leading-8 text-[#617876]">{text}</p>}</div> }

function Footer({onWhatsApp}) { return <footer><div className="container-page"><div className="brand text-white"><LogoMark/><div><strong>{PRODUCT_CONFIG.brand}</strong><small>{PRODUCT_CONFIG.brandSubtitle}</small></div></div><div className="footer-links"><a href="#incluye">Contenido</a><a href="#preguntas">Preguntas</a><button onClick={onWhatsApp}>Soporte</button></div><p>© {new Date().getFullYear()} {PRODUCT_CONFIG.platformBrand} · Material educativo</p></div></footer> }

function PdfPreview({ onBuy }) {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    fetch(PRODUCT_CONFIG.assets.samplePdf, { method: "HEAD", cache: "no-store" })
      .then((response) => setAvailable(response.ok))
      .catch(() => setAvailable(false));
  }, []);
  return <section id="muestra" className="pdf-preview-section py-20 lg:py-28"><div className="container-page grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20"><div><span className="kicker">CONOCE EL MATERIAL</span><h2 className="editorial-title mt-4">Una mirada<br/><em>al manual.</em></h2><p className="mt-6 text-lg text-[#617876]">Lee aquí mismo algunas páginas de muestra. El manual completo, los videos y las plantillas se entregan automáticamente después de aprobarse tu pago.</p><button onClick={onBuy} className="btn btn-accent mt-8 px-7 py-4">Obtener el curso completo →</button></div><div className="pdf-browser"><div className="pdf-browser-bar"><span/><span/><span/><strong>Vista previa · {PRODUCT_CONFIG.productName}</strong></div>{available ? <PdfReader url={PRODUCT_CONFIG.assets.samplePdf} /> : <div className="pdf-empty"><span>📖</span><strong>La vista previa está preparada</strong><p>Coloca el PDF configurado dentro de la carpeta <code>public</code>.</p></div>}<div className="pdf-lock"><span>🔒</span><div><strong>Vista previa gratuita</strong><small>El material completo se entrega después del pago</small></div></div></div></div></section>;
}

function PdfReader({ url, courseMode = false }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [document, setDocument] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    let task;
    let cancelled = false;
    setPage(1);
    setDocument(null);
    setError("");
    import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
      task = pdfjs.getDocument(url);
      return task.promise;
    }).then((pdf) => { if (!cancelled) setDocument(pdf); }).catch(() => !cancelled && setError("No pudimos abrir la vista previa."));
    return () => { cancelled = true; task?.destroy(); };
  }, [url]);

  useEffect(() => {
    if (!document || !canvasRef.current || !wrapRef.current) return;
    let renderTask;
    let cancelled = false;
    document.getPage(page).then((pdfPage) => {
      if (cancelled) return;
      const base = pdfPage.getViewport({ scale: 1 });
      const availableWidth = Math.max(260, wrapRef.current.clientWidth - 24);
      const cssScale = availableWidth / base.width;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = pdfPage.getViewport({ scale: cssScale * pixelRatio });
      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width / pixelRatio}px`;
      canvas.style.height = `${viewport.height / pixelRatio}px`;
      renderTask = pdfPage.render({ canvasContext: canvas.getContext("2d"), viewport });
      return renderTask.promise;
    }).catch(() => !cancelled && setError("No pudimos mostrar esta página."));
    return () => { cancelled = true; renderTask?.cancel(); };
  }, [document, page]);

  if (error) return <div className="pdf-reader-message">{error}</div>;
  if (!document) return <div className="pdf-reader-message"><span className="status-loader"/>Cargando manual…</div>;
  return <div className={`pdf-reader ${courseMode?"course-pdf-reader":""}`} ref={wrapRef}><div className="pdf-canvas-wrap"><canvas ref={canvasRef}/></div><div className="pdf-controls"><button aria-label="Página anterior" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button><strong>Página {page} de {document.numPages}</strong><button aria-label="Página siguiente" disabled={page===document.numPages} onClick={()=>setPage(p=>p+1)}>›</button></div></div>;
}

function CheckoutModal({ onClose, onError }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("52");
  const [loading, setLoading] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const countryLabel = {
    52: "🇲🇽 +52", 1: "🇺🇸 +1", 57: "🇨🇴 +57", 54: "🇦🇷 +54",
    51: "🇵🇪 +51", 56: "🇨🇱 +56", 34: "🇪🇸 +34"
  }[phoneCountry];
  const review = (event) => {
    event.preventDefault();
    setName(name.trim());
    setEmail(email.trim().toLowerCase());
    setReviewing(true);
  };
  const startPayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({name,email,phone:`${phoneCountry}${phone.replace(/\D/g, "")}`}) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo iniciar el pago.");
      window.location.href = data.checkoutUrl;
    } catch (error) { onError(error.message); setLoading(false); }
  };
  return <div className="checkout-backdrop" role="dialog" aria-modal="true" aria-labelledby="checkout-title" onMouseDown={(e)=>e.target===e.currentTarget&&onClose()}><div className="checkout-modal"><button className="checkout-close" onClick={onClose} aria-label="Cerrar">×</button><span className="checkout-icon">{reviewing?"✓":"✨"}</span><span className="kicker">{reviewing?"CONFIRMA ANTES DE PAGAR":"ESTÁS A UN PASO"}</span><h2 id="checkout-title">{reviewing?"Revisa bien tus datos":"¿Dónde recibes tu curso?"}</h2><p>{reviewing?"El acceso se enviará exactamente al correo y WhatsApp que aparecen aquí.":"Usaremos estos datos para enviarte el enlace privado cuando Mercado Pago confirme tu pago."}</p>{reviewing?<div className="checkout-review"><div className="review-card"><div><span>Nombre</span><strong>{name}</strong></div><div className="review-email"><span>Correo de entrega</span><strong>{email}</strong></div><div><span>WhatsApp</span><strong>{countryLabel} {phone}</strong></div></div><div className="review-warning"><span>✦</span><p><strong>Revisa letra por letra tu correo.</strong> Ahí recibirás el enlace personal para entrar al curso.</p></div><div className="review-actions"><button type="button" disabled={loading} onClick={()=>setReviewing(false)} className="btn review-edit">← Corregir datos</button><button type="button" disabled={loading} onClick={startPayment} className="btn btn-accent">{loading?"Preparando pago…":`Sí, proceder al pago · ${formatPrice()}`}</button></div></div>:<form onSubmit={review}><label>Tu nombre<input value={name} onChange={e=>setName(e.target.value)} autoComplete="name" placeholder="Ej. Ana" maxLength="80" required/></label><label>Correo donde recibirás el curso<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="tu@correo.com" required/></label><label>Tu WhatsApp<div className="phone-field"><select value={phoneCountry} onChange={e=>setPhoneCountry(e.target.value)} aria-label="País"><option value="52">🇲🇽 +52</option><option value="1">🇺🇸 +1</option><option value="57">🇨🇴 +57</option><option value="54">🇦🇷 +54</option><option value="51">🇵🇪 +51</option><option value="56">🇨🇱 +56</option><option value="34">🇪🇸 +34</option></select><input type="tel" inputMode="numeric" value={phone} onChange={e=>setPhone(e.target.value.replace(/[^\d\s-]/g,""))} autoComplete="tel-national" placeholder="442 123 4567" required/></div></label><button className="btn btn-accent min-h-16 w-full">Revisar mis datos →</button></form>}<small>🔒 Pago seguro procesado por Mercado Pago</small></div></div>;
}

function ThankYouPage() {
  const [result, setResult] = useState({ status:"loading" });
  useEffect(() => {
    const paymentId = new URLSearchParams(window.location.search).get("payment_id") || new URLSearchParams(window.location.search).get("collection_id");
    if (!paymentId) return setResult({status:"invalid"});
    fetch(`/api/payment/status?payment_id=${encodeURIComponent(paymentId)}`).then(r=>r.json()).then((data)=>{
      setResult(data);
      if(data.status==="approved"){
        const purchaseKey=`meta-purchase-${paymentId}`;
        if(!sessionStorage.getItem(purchaseKey)){
          trackMeta("Purchase",{value:SITE_CONFIG.price,currency:SITE_CONFIG.currency,content_name:SITE_CONFIG.productName});
          sessionStorage.setItem(purchaseKey,"1");
        }
      }
    }).catch(()=>setResult({status:"error"}));
  }, []);
  return <StatusLayout>{result.status==="loading"&&<><span className="status-loader"/><h1>Confirmando tu pago…</h1><p>Estamos consultando directamente con Mercado Pago.</p></>}{result.status==="approved"&&<><span className="status-success">✓</span><h1>¡Tu curso está listo!</h1><p>Enviamos el acceso a <strong>{result.email}</strong>. También puedes guardarlo ahora.</p><div className="status-actions"><a href={result.accessUrl} className="btn btn-accent px-8 py-4">Entrar a mi curso →</a>{result.whatsappUrl&&<a href={result.whatsappUrl} target="_blank" rel="noreferrer" className="btn whatsapp-save px-8 py-4">Guardar en WhatsApp</a>}</div><small>El acceso se envía al correo escrito antes de pagar.</small></>}{result.status==="approved_delivery_pending"&&<><span className="status-success">✓</span><h1>Tu pago sí fue aprobado</h1><p>Tu compra está segura, pero el acceso todavía se está preparando. <strong>No vuelvas a pagar.</strong></p><div className="status-actions"><button onClick={()=>window.location.reload()} className="btn btn-accent px-8 py-4">Reintentar acceso</button><a href="/" className="btn btn-primary px-8 py-4">Volver al inicio</a></div><small>Referencia de pago: {result.paymentId}</small></>}{result.status==="pending"&&<><span className="text-5xl">⌛</span><h1>Tu pago está pendiente</h1><p>Te enviaremos el acceso automáticamente cuando Mercado Pago lo apruebe.</p><a href="/" className="btn btn-primary mt-7 px-7 py-4">Volver al inicio</a></>}{["invalid","error","rejected","cancelled"].includes(result.status)&&<><span className="text-5xl">⚠️</span><h1>No pudimos validar el pago</h1><p>No se entregó ningún acceso. Vuelve a intentarlo o contáctanos si ya ves el cargo.</p><a href="/" className="btn btn-primary mt-7 px-7 py-4">Volver al inicio</a></>}</StatusLayout>;
}

function PaymentStatePage({state}) { const pending=state==="pending"; return <StatusLayout><span className="text-5xl">{pending?"⌛":"↻"}</span><h1>{pending?"Pago pendiente":"El pago no se completó"}</h1><p>{pending?"Cuando Mercado Pago confirme la operación recibirás automáticamente tu correo y enlace privado.":"No se realizó ningún cargo aprobado. Puedes regresar e intentarlo nuevamente."}</p><a href="/" className="btn btn-primary mt-7 px-7 py-4">Regresar a la página</a></StatusLayout> }

function StatusLayout({children}) { return <main className="status-page"><div className="status-card"><a href="/" className="brand justify-center"><LogoMark/><div><strong>{PRODUCT_CONFIG.brand}</strong><small>{PRODUCT_CONFIG.brandSubtitle}</small></div></a><div className="status-content">{children}</div></div></main> }

function CoursePage() {
  const token = new URLSearchParams(window.location.search).get("token") || "";
  const [course, setCourse] = useState({loading:true});
  const [active, setActive] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(()=>{fetch(`/api/course?token=${encodeURIComponent(token)}`).then(async r=>{const data=await r.json();if(!r.ok)throw new Error(data.error);return data}).then(data=>{setCourse(data);setActive(data.files[0]||null)}).catch(error=>setCourse({error:error.message}))},[token]);
  if(course.loading) return <StatusLayout><span className="status-loader"/><h1>Abriendo tu curso…</h1></StatusLayout>;
  if(course.error) return <StatusLayout><span className="text-5xl">🔒</span><h1>Acceso no disponible</h1><p>{course.error}</p><a href="/" className="btn btn-primary mt-7 px-7 py-4">Volver al inicio</a></StatusLayout>;
  const fileUrl=active?.url||"";
  return <div className={`course-shell ${menuOpen?"menu-open":""}`}>
    <button className="course-backdrop" onClick={()=>setMenuOpen(false)} aria-label="Cerrar menú"/>
    <aside>
      <div className="course-menu-head"><a href="/" className="brand"><LogoMark/><div><strong>{PRODUCT_CONFIG.brand}</strong><small>{PRODUCT_CONFIG.courseSubtitle}</small></div></a><button onClick={()=>setMenuOpen(false)} aria-label="Cerrar menú">×</button></div>
      <div className="course-welcome"><small>BIENVENIDA</small><strong>{course.email}</strong></div>
      <nav>{course.files.map((file,i)=><button className={active?.name===file.name?"active":""} onClick={()=>{setActive(file);setMenuOpen(false)}} key={file.name}><span>{file.type==="pdf"?"PDF":"▶"}</span><div><small>{file.type==="pdf"?"MATERIAL":"CLASE"} {String(i+1).padStart(2,"0")}</small><strong>{file.title}</strong></div></button>)}</nav>
      <p>Tu enlace es personal. Guárdalo para volver cuando quieras.</p>
    </aside>
    <main>
      <div className="course-mobile-bar"><button onClick={()=>setMenuOpen(true)} aria-label="Abrir clases"><span>☰</span> Clases y materiales</button><strong>{PRODUCT_CONFIG.brand}</strong></div>
      <div className="course-top"><div><span className="kicker">{active?.type==="pdf"?"MANUAL Y PLANTILLAS":"TU CONTENIDO"}</span><h1>{active?.title||PRODUCT_CONFIG.productName}</h1></div>{active&&<div className={`course-actions ${active.type==="pdf"?"single-action":""}`}><a href={active.downloadUrl} download className="btn btn-accent px-5 py-3">↓ Descargar</a>{active.type!=="pdf"&&<a href={fileUrl} target="_blank" rel="noreferrer" className="btn border-2 border-teal px-5 py-3 text-teal">Abrir ↗</a>}</div>}</div>
      {!active?<div className="course-empty">Aún no hay archivos. Agrega el contenido en Cloudflare R2 o en <code>private/course</code>.</div>:active.type==="pdf"?<div className="course-pdf-shell"><PdfReader url={fileUrl} courseMode /></div>:<video className="course-video" src={fileUrl} controls playsInline preload="metadata"/>}
    </main>
  </div>;
}

export default App;
