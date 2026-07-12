import { useEffect, useMemo, useRef, useState } from "react";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { SITE_CONFIG } from "./config";
import { trackMeta } from "./lib/tracking";
import ebookImage from "./assets/ebook-reposteria-canina.webp";
import cursaliaLogo from "./assets/cursalia-logo.webp";

const media = {
  hero: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&fm=webp&w=1100&q=74",
  baking: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&fm=webp&w=900&q=72",
  treats: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&fm=webp&w=900&q=72",
  dog: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&fm=webp&w=900&q=72",
  puppy: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&fm=webp&w=800&q=72",
  kitchen: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&fm=webp&w=900&q=72"
};

const videoFiles = import.meta.glob("./*.{mp4,webm,mov}", {
  eager: true,
  query: "?url",
  import: "default"
});

const modules = [
  ["01", "Repostería canina", "Galletas, cupcakes, pastelitos y opciones frías explicadas paso a paso."],
  ["02", "Snacks y premios", "Ideas prácticas con distintos formatos, sabores y texturas para consentir o vender."],
  ["03", "Guía para comenzar", "Bases claras para preparar, presentar y convertir tus recetas en una oportunidad."],
  ["04", "Clases en video", "2.5 horas de contenido para aprender a tu ritmo desde cualquier dispositivo."]
];

const faqs = [
  ["¿El curso es físico o digital?", "Es completamente digital. Recibirás las instrucciones de acceso después de confirmar tu pago."],
  ["¿Puedo verlo desde mi celular?", "Sí. Puedes consultar el material desde celular, tablet o computadora con conexión a internet."],
  ["¿Necesito experiencia previa?", "No. El contenido está pensado para comenzar desde lo más básico."],
  ["¿Cuándo recibo el material?", "Después de que el pago quede aprobado. La entrega puede realizarse por correo o WhatsApp."],
  ["¿Sustituye la orientación veterinaria?", "No. Es material educativo y no reemplaza una valoración veterinaria o nutricional personalizada."]
];

function App() {
  const [toast, setToast] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const currentPath = useMemo(() => window.location.pathname.toLowerCase(), []);
  const videoSrc = Object.values(videoFiles)[0];

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
      <div className="announcement"><span>✦ PRECIO ESPECIAL DE LANZAMIENTO</span><strong>$55 MXN</strong><span className="hidden sm:inline">Acceso digital inmediato tras confirmar tu pago</span></div>
      <Header onBuy={handleBuy} />

      <main>
        <section id="inicio" className="hero-section">
          <div className="orb orb-one" /><div className="orb orb-two" />
          <div className="container-page relative z-10 grid items-center gap-12 py-14 lg:grid-cols-[1.02fr_.98fr] lg:py-20">
            <div className="reveal">
              <div className="eyebrow"><span className="live-dot" /> RECETARIO DIGITAL + CURSO EN VIDEO</div>
              <h1 className="hero-title mt-6">Hornea amor.<span>Emprende desde casa.</span></h1>
              <p className="hero-description mt-6 max-w-xl text-lg leading-8 text-[#526967]"><strong>Recetario completo y clases en video</strong> para crear premios para tus mascotas o comenzar tu propio emprendimiento de repostería canina.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["2.5 h en video", "Material descargable", "Acceso a tu ritmo"].map(item => <span className="pill" key={item}>✓ {item}</span>)}
              </div>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button onClick={handleBuy} className="btn btn-accent min-h-16 px-8">Quiero empezar · $55 MXN <span>→</span></button>
                <a href="#experiencia" className="btn min-h-14 px-5 text-teal">Ver el curso <span className="play-mini">▶</span></a>
              </div>
              <div className="mt-7 flex items-center gap-4 text-sm text-[#617876]">
                <div className="avatar-stack">{[media.dog, media.puppy, media.hero].map((src, i) => <img key={src} src={src} alt="" style={{ zIndex: 3-i }} />)}</div>
                <p><strong className="block text-ink">Para consentir o emprender</strong>Sin experiencia previa</p>
              </div>
            </div>

            <div className="hero-collage reveal delay-1">
              <div className="hero-photo"><img src={media.hero} alt="Perro feliz esperando su premio" /><div className="photo-shade" /></div>
              <div className="floating-card card-top"><span>★★★★★</span><strong>Aprende a tu ritmo</strong><small>Desde cualquier dispositivo</small></div>
              <div className="floating-card price-badge"><small>HOY</small><strong>$55</strong><small>MXN</small></div>
              <img className="mini-photo ebook-mini" src={ebookImage} alt="Ebook Repostería Canina: recetas para consentir" />
              <div className="scribble">rico<br />y bonito <span>↗</span></div>
            </div>
          </div>
        </section>

        <section className="trust-bar"><div className="container-page">{[["2.5H", "de clases prácticas"], ["100%", "contenido digital"], ["∞", "repasa a tu ritmo"], ["$55", "pago único"]].map(([big, text]) => <div key={text}><strong>{big}</strong><span>{text}</span></div>)}</div></section>

        <section id="experiencia" className="relative bg-ink py-20 text-white lg:py-28">
          <div className="texture" />
          <div className="container-page relative z-10 grid items-center gap-14 lg:grid-cols-[.88fr_1.12fr] lg:gap-24">
            <div className="phone-stage">
              <div className="phone-glow" />
              <div className="phone-frame">
                {videoSrc ? <video src={videoSrc} controls playsInline preload="metadata" /> : <div className="video-placeholder"><img src={media.baking} alt="Preparando recetas caseras" /><div className="video-overlay"><span className="play-button">▶</span><strong>Tu video vertical irá aquí</strong><small>Agrega un MP4, WEBM o MOV directamente en src</small></div></div>}
              </div>
              <div className="video-note">CLASES<br />PASO A PASO <span>↙</span></div>
            </div>
            <div>
              <span className="kicker text-yellow">MIRA · APRENDE · CREA</span>
              <h2 className="editorial-title mt-4 text-white">Recetas para compartir, consentir y vender.</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">Clases visuales para dominar texturas, consistencias y presentación. Prepara premios para tus mascotas o crea productos atractivos para tus primeros clientes.</p>
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {[['01','Ingredientes claros','Prepara todo antes de comenzar.'],['02','Proceso visual','Observa cada detalle en pantalla.'],['03','Resultado bonito','Aprende a cuidar la presentación.'],['04','Siempre disponible','Consulta el contenido a tu ritmo.']].map(([n,t,x]) => <article className="dark-feature" key={n}><span>{n}</span><div><strong>{t}</strong><p>{x}</p></div></article>)}
              </div>
              <button onClick={handleBuy} className="btn btn-accent mt-10 px-7 py-4">Quiero ver todas las clases →</button>
            </div>
          </div>
        </section>

        <section id="incluye" className="py-20 lg:py-28">
          <div className="container-page">
            <SectionHeading kicker="TODO LO QUE RECIBES" title={<>Más que recetas:<br/><em>una oportunidad para crear.</em></>} text="Contenido práctico para consentir a tus mascotas, preparar regalos especiales o dar los primeros pasos con tu emprendimiento." />
            <div className="module-grid">{modules.map(([n,title,text], i) => <article className={`module-card module-${i+1}`} key={n}><span className="module-number">{n}</span><div><h3>{title}</h3><p>{text}</p></div>{i === 0 && <img className="ebook-product" src={ebookImage} alt="Portada del ebook Repostería Canina" />}{i === 2 && <img src={media.puppy} alt="Perrito feliz" />}</article>)}</div>
            <div className="medical-note"><span>✚</span><p><strong>Su bienestar va primero.</strong> Cada perro tiene necesidades distintas. Este curso es educativo y no sustituye la orientación de un médico veterinario.</p></div>
          </div>
        </section>

        <PdfPreview onBuy={handleBuy} />

        <section id="galeria" className="gallery-section py-20 lg:py-28">
          <div className="container-page">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><SectionHeading kicker="UN POQUITO DE INSPIRACIÓN" title={<>Bonito por fuera.<br/><em>Listo para sorprender.</em></>} /><p className="max-w-sm pb-10 text-[#617876]">Convierte ingredientes sencillos en premios especiales para tus mascotas o productos que puedes ofrecer a tus clientes.</p></div>
            <div className="masonry-gallery">
              <figure className="gallery-a"><img src={media.baking} alt="Preparación artesanal en cocina" loading="lazy" decoding="async"/><figcaption>Preparaciones desde cero</figcaption></figure>
              <figure className="gallery-b"><img src={media.dog} alt="Perro esperando un premio" loading="lazy" decoding="async"/><figcaption>Para tu mejor amigo</figcaption></figure>
              <figure className="gallery-c"><img src={media.treats} alt="Premios horneados" loading="lazy" decoding="async"/><figcaption>Recetas que enamoran</figcaption></figure>
              <figure className="gallery-d"><img src={media.kitchen} alt="Cocina cálida y luminosa" loading="lazy" decoding="async"/><figcaption>Desde tu propia cocina</figcaption></figure>
            </div>
          </div>
        </section>

        <section className="process-section py-20 lg:py-28"><div className="container-page grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24"><div className="lg:sticky lg:top-32 lg:self-start"><span className="kicker">ASÍ DE FÁCIL</span><h2 className="editorial-title mt-4">Tres pasos.<br/><em>Cero complicaciones.</em></h2><p className="mt-5 text-[#617876]">Compra una vez y empieza a disfrutar el contenido.</p></div><div className="process-list">{[["01","Elige comenzar","Presiona el botón y completa tu pago de forma segura."],["02","Recibe tu acceso","Cuando se confirme el pago te enviamos las instrucciones."],["03","Hornea a tu ritmo","Abre las clases, elige una receta y disfruta el proceso."]].map(([n,t,x])=><article key={n}><span>{n}</span><div><h3>{t}</h3><p>{x}</p></div><b>↗</b></article>)}</div></div></section>

        <section id="preguntas" className="bg-cream py-20 lg:py-28"><div className="container-page grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-24"><div><span className="kicker">ANTES DE EMPEZAR</span><h2 className="editorial-title mt-4">Preguntas<br/><em>frecuentes.</em></h2><button onClick={handleWhatsApp} className="btn mt-7 border-2 border-teal px-6 py-3 text-teal">Hablar por WhatsApp</button></div><div className="faq-list">{faqs.map(([q,a],i)=><div key={q}><button onClick={()=>setOpenFaq(openFaq===i?-1:i)} aria-expanded={openFaq===i}><span>{String(i+1).padStart(2,'0')}</span>{q}<b>{openFaq===i?'−':'+'}</b></button>{openFaq===i&&<p>{a}</p>}</div>)}</div></div></section>

        <section className="final-cta"><img src={media.hero} alt="Perro feliz"/><div className="final-overlay"/><div className="container-page relative z-10 text-center text-white"><span className="kicker text-yellow">TU PRIMERA RECETA TE ESPERA</span><h2>Consiente hoy.<br/><em>Emprende mañana.</em></h2><p>Recetario completo + clases en video + materiales para comenzar</p><button onClick={handleBuy} className="btn btn-accent mt-8 min-h-16 px-9">Empezar ahora por $55 MXN →</button><small>🔒 Pago único · Acceso digital</small></div></section>
      </main>

      <Footer onWhatsApp={handleWhatsApp}/>
      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} onError={setToast} />}
      <button onClick={handleWhatsApp} className="whatsapp" aria-label="Contactar por WhatsApp">✆</button>
      <div className="mobile-buy"><div><small>Precio de lanzamiento</small><strong>$55 MXN</strong></div><button onClick={handleBuy} className="btn btn-accent px-5 py-3">Comprar ahora</button></div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function LogoMark() { return <img className="brand-logo" src={cursaliaLogo} alt="Cursalia" /> }

function Header({onBuy}) { return <header className="site-header"><nav className="container-page"><a href="#inicio" className="brand"><LogoMark/><div><strong>Patitas & Horno</strong><small>Recetario + cursos de repostería canina</small></div></a><div className="nav-links"><a href="#experiencia">Experiencia</a><a href="#incluye">Contenido</a><a href="#galeria">Inspiración</a><a href="#preguntas">Preguntas</a></div><button onClick={onBuy} className="btn btn-primary hidden px-5 py-3 sm:inline-flex">Quiero el curso →</button></nav></header> }

function SectionHeading({kicker,title,text}) { return <div className="mb-10 max-w-3xl"><span className="kicker">{kicker}</span><h2 className="editorial-title mt-4">{title}</h2>{text&&<p className="mt-5 max-w-2xl text-lg leading-8 text-[#617876]">{text}</p>}</div> }

function Footer({onWhatsApp}) { return <footer><div className="container-page"><div className="brand text-white"><LogoMark/><div><strong>Patitas & Horno</strong><small>Repostería canina desde casa</small></div></div><div className="footer-links"><a href="#incluye">Contenido</a><a href="#preguntas">Preguntas</a><button onClick={onWhatsApp}>Soporte</button></div><p>© {new Date().getFullYear()} Cursalia · Material educativo</p></div></footer> }

function PdfPreview({ onBuy }) {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    fetch("/vista-previa-ebook.pdf", { method: "HEAD", cache: "no-store" })
      .then((response) => setAvailable(response.ok))
      .catch(() => setAvailable(false));
  }, []);
  return <section id="muestra" className="pdf-preview-section py-20 lg:py-28"><div className="container-page grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20"><div><span className="kicker">HOJEA ANTES DE COMPRAR</span><h2 className="editorial-title mt-4">Una probadita<br/><em>del recetario.</em></h2><p className="mt-6 text-lg text-[#617876]">Lee aquí mismo algunas páginas del material. La versión completa y las clases en video se entregan automáticamente después de aprobarse tu pago.</p><button onClick={onBuy} className="btn btn-accent mt-8 px-7 py-4">Obtener recetario + curso →</button></div><div className="pdf-browser"><div className="pdf-browser-bar"><span/><span/><span/><strong>Vista previa · Repostería Canina</strong></div>{available ? <PdfReader url="/vista-previa-ebook.pdf" /> : <div className="pdf-empty"><span>📖</span><strong>La vista previa está preparada</strong><p>Coloca el archivo <code>vista-previa-ebook.pdf</code> dentro de la carpeta <code>public</code>.</p></div>}<div className="pdf-lock"><span>🔒</span><div><strong>Vista previa gratuita</strong><small>El recetario completo se entrega después del pago</small></div></div></div></div></section>;
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
  if (!document) return <div className="pdf-reader-message"><span className="status-loader"/>Cargando recetario…</div>;
  return <div className={`pdf-reader ${courseMode?"course-pdf-reader":""}`} ref={wrapRef}><div className="pdf-canvas-wrap"><canvas ref={canvasRef}/></div><div className="pdf-controls"><button aria-label="Página anterior" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button><strong>Página {page} de {document.numPages}</strong><button aria-label="Página siguiente" disabled={page===document.numPages} onClick={()=>setPage(p=>p+1)}>›</button></div></div>;
}

function CheckoutModal({ onClose, onError }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("52");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setLoading(true);
    try {
      const response = await fetch("/api/checkout", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({name,email,phone:`${phoneCountry}${phone.replace(/\D/g, "")}`}) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo iniciar el pago.");
      window.location.href = data.checkoutUrl;
    } catch (error) { onError(error.message); setLoading(false); }
  };
  return <div className="checkout-backdrop" role="dialog" aria-modal="true" aria-labelledby="checkout-title" onMouseDown={(e)=>e.target===e.currentTarget&&onClose()}><div className="checkout-modal"><button className="checkout-close" onClick={onClose} aria-label="Cerrar">×</button><span className="checkout-icon">🐾</span><span className="kicker">ESTÁS A UN PASO</span><h2 id="checkout-title">¿Dónde recibes tu curso?</h2><p>Usaremos estos datos para enviarte el enlace privado cuando Mercado Pago confirme tu pago.</p><form onSubmit={submit}><label>Tu nombre<input value={name} onChange={e=>setName(e.target.value)} autoComplete="name" placeholder="Ej. Ana" maxLength="80" required/></label><label>Correo donde recibirás el curso<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="tu@correo.com" required/></label><label>Tu WhatsApp<div className="phone-field"><select value={phoneCountry} onChange={e=>setPhoneCountry(e.target.value)} aria-label="País"><option value="52">🇲🇽 +52</option><option value="1">🇺🇸 +1</option><option value="57">🇨🇴 +57</option><option value="54">🇦🇷 +54</option><option value="51">🇵🇪 +51</option><option value="56">🇨🇱 +56</option><option value="34">🇪🇸 +34</option></select><input type="tel" inputMode="numeric" value={phone} onChange={e=>setPhone(e.target.value.replace(/[^\d\s-]/g,""))} autoComplete="tel-national" placeholder="442 123 4567" required/></div></label><button disabled={loading} className="btn btn-accent min-h-16 w-full">{loading?"Preparando pago…":"Continuar a Mercado Pago · $55 MXN"}</button></form><small>🔒 Pago seguro procesado por Mercado Pago</small></div></div>;
}

function ThankYouPage() {
  const [result, setResult] = useState({ status:"loading" });
  useEffect(() => {
    const paymentId = new URLSearchParams(window.location.search).get("payment_id") || new URLSearchParams(window.location.search).get("collection_id");
    if (!paymentId) return setResult({status:"invalid"});
    fetch(`/api/payment/status?payment_id=${encodeURIComponent(paymentId)}`).then(r=>r.json()).then(setResult).catch(()=>setResult({status:"error"}));
  }, []);
  return <StatusLayout>{result.status==="loading"&&<><span className="status-loader"/><h1>Confirmando tu pago…</h1><p>Estamos consultando directamente con Mercado Pago.</p></>}{result.status==="approved"&&<><span className="status-success">✓</span><h1>¡Tu curso está listo!</h1><p>Enviamos el acceso a <strong>{result.email}</strong>. También puedes guardarlo ahora.</p><div className="status-actions"><a href={result.accessUrl} className="btn btn-accent px-8 py-4">Entrar a mi curso →</a>{result.whatsappUrl&&<a href={result.whatsappUrl} target="_blank" rel="noreferrer" className="btn whatsapp-save px-8 py-4">Guardar en WhatsApp</a>}</div><small>El acceso se envía al correo escrito antes de pagar.</small></>}{result.status==="pending"&&<><span className="text-5xl">⌛</span><h1>Tu pago está pendiente</h1><p>Te enviaremos el acceso automáticamente cuando Mercado Pago lo apruebe.</p><a href="/" className="btn btn-primary mt-7 px-7 py-4">Volver al inicio</a></>}{["invalid","error","rejected","cancelled"].includes(result.status)&&<><span className="text-5xl">⚠️</span><h1>No pudimos validar el pago</h1><p>No se entregó ningún acceso. Vuelve a intentarlo o contáctanos si ya ves el cargo.</p><a href="/" className="btn btn-primary mt-7 px-7 py-4">Volver al inicio</a></>}</StatusLayout>;
}

function PaymentStatePage({state}) { const pending=state==="pending"; return <StatusLayout><span className="text-5xl">{pending?"⌛":"↻"}</span><h1>{pending?"Pago pendiente":"El pago no se completó"}</h1><p>{pending?"Cuando Mercado Pago confirme la operación recibirás automáticamente tu correo y enlace privado.":"No se realizó ningún cargo aprobado. Puedes regresar e intentarlo nuevamente."}</p><a href="/" className="btn btn-primary mt-7 px-7 py-4">Regresar a la página</a></StatusLayout> }

function StatusLayout({children}) { return <main className="status-page"><div className="status-card"><a href="/" className="brand justify-center"><LogoMark/><div><strong>Patitas & Horno</strong><small>Repostería canina</small></div></a><div className="status-content">{children}</div></div></main> }

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
      <div className="course-menu-head"><a href="/" className="brand"><LogoMark/><div><strong>Patitas & Horno</strong><small>Mi curso</small></div></a><button onClick={()=>setMenuOpen(false)} aria-label="Cerrar menú">×</button></div>
      <div className="course-welcome"><small>BIENVENIDA</small><strong>{course.email}</strong></div>
      <nav>{course.files.map((file,i)=><button className={active?.name===file.name?"active":""} onClick={()=>{setActive(file);setMenuOpen(false)}} key={file.name}><span>{file.type==="pdf"?"PDF":"▶"}</span><div><small>{file.type==="pdf"?"RECETA":"CLASE"} {String(i+1).padStart(2,"0")}</small><strong>{file.title}</strong></div></button>)}</nav>
      <p>Tu enlace es personal. Guárdalo para volver cuando quieras.</p>
    </aside>
    <main>
      <div className="course-mobile-bar"><button onClick={()=>setMenuOpen(true)} aria-label="Abrir clases"><span>☰</span> Clases y materiales</button><strong>Patitas & Horno</strong></div>
      <div className="course-top"><div><span className="kicker">{active?.type==="pdf"?"RECETARIO DIGITAL":"TU CONTENIDO"}</span><h1>{active?.title||"Curso de Repostería Canina"}</h1></div>{active&&<div className={`course-actions ${active.type==="pdf"?"single-action":""}`}><a href={active.downloadUrl} download className="btn btn-accent px-5 py-3">↓ Descargar</a>{active.type!=="pdf"&&<a href={fileUrl} target="_blank" rel="noreferrer" className="btn border-2 border-teal px-5 py-3 text-teal">Abrir ↗</a>}</div>}</div>
      {!active?<div className="course-empty">Aún no hay archivos. Agrega el contenido en Cloudflare R2 o en <code>private/course</code>.</div>:active.type==="pdf"?<div className="course-pdf-shell"><PdfReader url={fileUrl} courseMode /></div>:<video className="course-video" src={fileUrl} controls playsInline preload="metadata"/>}
    </main>
  </div>;
}

export default App;
