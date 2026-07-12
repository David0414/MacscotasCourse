import ebookImage from "./assets/ebook-reposteria-canina.webp";
import cursaliaLogo from "./assets/cursalia-logo.webp";

/**
 * CONFIGURACIÓN CENTRAL DEL PRODUCTO
 * Duplica el repositorio y modifica este archivo para crear otra landing.
 * Las claves privadas, R2, Mercado Pago y Brevo permanecen en Railway.
 */
export const PRODUCT_CONFIG = {
  id: "reposteria-canina",
  brand: "Patitas & Horno",
  platformBrand: "Cursalia",
  brandSubtitle: "Recetario + cursos de repostería canina",
  courseSubtitle: "Mi curso",
  productName: "Curso de Repostería Canina",
  metaDescription: "Recetario digital y curso en video de repostería canina para consentir a tus mascotas o comenzar a emprender.",
  price: 55,
  currency: "MXN",
  checkoutUrl: import.meta.env.VITE_CHECKOUT_URL || "",
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "521XXXXXXXXXX",
  assets: {
    logo: cursaliaLogo,
    ebook: ebookImage,
    samplePdf: "/vista-previa-ebook.pdf"
  },
  media: {
    hero: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&fm=webp&w=1100&q=74",
    baking: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&fm=webp&w=900&q=72",
    treats: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&fm=webp&w=900&q=72",
    dog: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&fm=webp&w=900&q=72",
    puppy: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&fm=webp&w=800&q=72",
    kitchen: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&fm=webp&w=900&q=72"
  },
  hero: {
    eyebrow: "RECETARIO DIGITAL + CURSO EN VIDEO",
    title: "Hornea amor.",
    accentTitle: "Emprende desde casa.",
    descriptionLead: "Recetario completo y clases en video",
    description: "para crear premios para tus mascotas o comenzar tu propio emprendimiento de repostería canina.",
    audienceTitle: "Para consentir o emprender",
    audienceText: "Sin experiencia previa"
  },
  modules: [
    ["01", "Repostería canina", "Galletas, cupcakes, pastelitos y opciones frías explicadas paso a paso."],
    ["02", "Snacks y premios", "Ideas prácticas con distintos formatos, sabores y texturas para consentir o vender."],
    ["03", "Guía para comenzar", "Bases claras para preparar, presentar y convertir tus recetas en una oportunidad."],
    ["04", "Clases en video", "2.5 horas de contenido para aprender a tu ritmo desde cualquier dispositivo."]
  ],
  faqs: [
    ["¿El curso es físico o digital?", "Es completamente digital. Recibirás las instrucciones de acceso después de confirmar tu pago."],
    ["¿Puedo verlo desde mi celular?", "Sí. Puedes consultar el material desde celular, tablet o computadora con conexión a internet."],
    ["¿Necesito experiencia previa?", "No. El contenido está pensado para comenzar desde lo más básico."],
    ["¿Cuándo recibo el material?", "Después de que el pago quede aprobado. La entrega puede realizarse por correo o WhatsApp."],
    ["¿Sustituye la orientación veterinaria?", "No. Es material educativo y no reemplaza una valoración veterinaria o nutricional personalizada."]
  ],
  sections: {
    experienceTitle: "Recetas para compartir, consentir y vender.",
    experienceText: "Clases visuales para dominar texturas, consistencias y presentación. Prepara premios para tus mascotas o crea productos atractivos para tus primeros clientes.",
    packageLead: "Más que recetas:",
    packageAccent: "una oportunidad para crear.",
    packageText: "Contenido práctico para consentir a tus mascotas, preparar regalos especiales o dar los primeros pasos con tu emprendimiento.",
    finalTitle: "Consiente hoy.",
    finalAccent: "Emprende mañana.",
    finalText: "Recetario completo + clases en video + materiales para comenzar"
  }
};

export const formatPrice = (withCurrency = true) =>
  `$${PRODUCT_CONFIG.price}${withCurrency ? ` ${PRODUCT_CONFIG.currency}` : ""}`;
