import ebookImage from "./assets/manual-extensiones-pestanas.jpg";
import cursaliaLogo from "./assets/cursalia-logo.webp";

/**
 * CONFIGURACIÓN CENTRAL DEL PRODUCTO
 * Las credenciales privadas continúan exclusivamente en Railway.
 */
export const PRODUCT_CONFIG = {
  id: "extensiones-pestanas",
  brand: "Cursalia Lash Academy",
  platformBrand: "Cursalia",
  brandSubtitle: "Manual + curso de extensiones de pestañas",
  courseSubtitle: "Mi curso de pestañas",
  productName: "Curso de Extensiones de Pestañas",
  metaDescription: "Manual, videos y plantillas de práctica para aprender extensiones de pestañas desde cero y comenzar tu emprendimiento lash.",
  price: 85,
  currency: "MXN",
  checkoutUrl: import.meta.env.VITE_CHECKOUT_URL || "",
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "521XXXXXXXXXX",
  assets: {
    logo: cursaliaLogo,
    ebook: ebookImage,
    samplePdf: "/vista-previa-pestanas.pdf"
  },
  media: {
    hero: "https://images.pexels.com/photos/16554435/pexels-photo-16554435.jpeg?auto=compress&cs=tinysrgb&w=1100",
    baking: "https://images.pexels.com/photos/36930354/pexels-photo-36930354.jpeg?auto=compress&cs=tinysrgb&w=900",
    treats: "https://images.pexels.com/photos/5128233/pexels-photo-5128233.jpeg?auto=compress&cs=tinysrgb&w=900",
    dog: "https://images.pexels.com/photos/29391092/pexels-photo-29391092.jpeg?auto=compress&cs=tinysrgb&w=900",
    puppy: "https://images.pexels.com/photos/34930095/pexels-photo-34930095.jpeg?auto=compress&cs=tinysrgb&w=800",
    kitchen: "https://images.pexels.com/photos/33637444/pexels-photo-33637444.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  hero: {
    eyebrow: "MANUAL DIGITAL + VIDEOS + PLANTILLAS",
    title: "Domina tu técnica.",
    accentTitle: "Emprende como lashista.",
    descriptionLead: "Aprende extensiones de pestañas desde cero",
    description: "con una guía completa, procedimientos visuales y hojas de práctica para trabajar con seguridad y precisión.",
    audienceTitle: "Para principiantes y lashistas",
    audienceText: "Aprende, perfecciona y comienza a ofrecer tus servicios"
  },
  pills: ["Técnicas paso a paso", "Manual descargable", "Plantillas de práctica"],
  trust: [["20+", "temas profesionales"], ["4", "técnicas principales"], ["∞", "repasa a tu ritmo"]],
  darkFeatures: [
    ["01", "Bases profesionales", "Anatomía, higiene y bioseguridad."],
    ["02", "Aplicación visual", "Observa aislamiento, postura y dirección."],
    ["03", "Diseños y mapping", "Adapta cada diseño al tipo de ojo."],
    ["04", "Siempre disponible", "Consulta el material a tu propio ritmo."]
  ],
  modules: [
    ["01", "Manual profesional", "Fundamentos, anatomía, higiene, patologías, materiales y preparación correcta de la clienta."],
    ["02", "Técnicas de aplicación", "Clásica pelo a pelo, volumen ruso, técnica híbrida, mega volumen y aplicación por capas."],
    ["03", "Mapping y diseño de mirada", "Grosores, largos, curvaturas y elección del diseño según la forma de cada ojo."],
    ["04", "Videos + plantillas", "Procedimientos explicativos, hojas de práctica, consentimientos y fichas de atención."]
  ],
  faqs: [
    ["¿Necesito experiencia previa?", "No. El contenido comienza desde las bases y también ayuda a lashistas que desean reforzar su técnica."],
    ["¿El material es digital?", "Sí. Recibirás acceso al manual, videos y archivos descargables después de confirmarse tu pago."],
    ["¿Puedo aprender desde mi celular?", "Sí. Puedes consultar el curso desde Android, iPhone, tablet o computadora."],
    ["¿Incluye hojas de práctica?", "Sí. Recibes plantillas para practicar mapping, curvaturas, diseños y diferentes tipos de ojos."],
    ["¿Cuándo recibo el acceso?", "El acceso se libera automáticamente cuando Mercado Pago confirma la compra."]
  ],
  sections: {
    experienceTitle: "Observa cada detalle. Perfecciona cada mirada.",
    experienceText: "Aprende visualmente los procedimientos que marcan la diferencia: preparación, aislamiento, postura, dirección, aplicación, mantenimiento y retiro seguro.",
    packageLead: "Todo para comenzar:",
    packageAccent: "técnica, práctica y negocio.",
    packageText: "Una formación digital completa para desarrollar una técnica segura, crear diseños personalizados y dar tus primeros pasos como lashista.",
    finalTitle: "Aprende hoy.",
    finalAccent: "Emprende como lashista.",
    finalText: "Manual profesional + videos explicativos + plantillas de práctica"
  }
};

export const formatPrice = (withCurrency = true) =>
  `$${PRODUCT_CONFIG.price}${withCurrency ? ` ${PRODUCT_CONFIG.currency}` : ""}`;
