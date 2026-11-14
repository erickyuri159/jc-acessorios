// ============================================================
// TEXTOS EDITORIALES DEL SITIO
// ------------------------------------------------------------
// Todo el texto visible de la web está aquí. Los componentes
// leen estos datos; no hace falta tocar código para cambiar una
// frase.
//
// Tono de voz: cercano, valenciano y con carácter. Se habla de
// piezas y de Innovative, no de «productos» ni de «funcionalidades».
// ============================================================

export const site = {
  meta: {
    title: "JP Accesorios — Bisutería y joyería en Mislata, Valencia",
    description:
      "Pendientes, collares, pulseras y anillos con envío a toda España y Europa. Pruébatelos con el probador de realidad aumentada desde el móvil y pide por Bizum o WhatsApp.",
  },

  hero: {
    kicker: "Mislata · Valencia",
    title: "La joya que no te has probado todavía",
    subtitle:
      "Enciendes la cámara, te pones los pendientes y los ves en tu cara antes de comprarlos. Sin app, sin descargar nada, desde el móvil. Después, envío a toda España y Europa.",
    image: {
      src: "/images/hero/colar-praiano.webp",
      alt: "Collar Praiano con conchas y estrella de mar de la colección JP Accesorios.",
    },
    ctaPrimary: "Probar pendientes en cámara",
    ctaSecondary: "Ver la colección",
  },

  catalog: {
    kicker: "La colección",
    title: "Todo lo que ves, comprado en dos toques",
    intro:
      "Piezas para usar a diario, no para un armario. Filtra por categoría, pruébalas en el probador y ten el pedido en el WhatsApp de la tienda en menos de un minuto.",
  },

  tryOn: {
    kicker: "El probador",
    title: "Pruébatelos antes de comprarlos",
    intro:
      "El probador funciona en el navegador: sin app, sin registro y sin que ninguna imagen salga de tu móvil. Solo la cámara y el espejo de tu dispositivo.",
    bullets: [
      "Cámara frontal y análisis del rostro en el dispositivo",
      "La imagen nunca se sube a ningún servidor",
      "Comparte el resultado directo a Stories",
    ],
    cta: "Abrir el probador",
  },

  faceShape: {
    kicker: "Tu rostro, tu joyería",
    title: "El probador te dice qué te favorece",
    intro:
      "Midiendo la forma de tu rostro, el probador recomienda las piezas que mejor te quedan: largos para rostros redondos, statement para rostros cuadrados, delicados para rostros de corazón.",
    cta: "Descubrir mi forma de rostro",
  },

  passport: {
    kicker: "Passport JP",
    title: "Cada compra suma. El sexto sello es un regalo.",
    intro:
      "Acumula sellos con cada pedido y desbloquea descuentos, envío gratis o una pieza de regalo. Tu saldo te lo guardamos en el móvil: no hace falta cuenta ni tarjeta.",
    points: [
      "Un sello por cada 10 € de compra",
      "Descuento del 10 % al llegar a 5 sellos",
      "Envío gratis desde el primer sello de tu segundo pedido",
    ],
    cta: "Ver mi passport",
  },

  shipping: {
    kicker: "Envíos",
    title: "De Mislata a tu casa, en España y en Europa",
    intro:
      "Trabajo con las mismas agencias que usan el resto de tiendas de la zona. Puedes recoger en el local sin coste.",
    points: [
      "Recogida en Mislata: sin coste",
      "Entrega a domicilio en 24 h en Mislata y Valencia",
      "Envío a toda España y a toda la Unión Europea",
    ],
  },

  instagram: {
    kicker: "Instagram",
    title: "Lo nuevo se publica primero allí",
    intro:
      "El catálogo de la web se alimenta del Instagram de la tienda. Lo que ves hoy en Instagram aparece aquí el mismo día, sin que nadie tenga que mantener la web.",
    cta: "Abrir el Instagram de la tienda",
  },

  contact: {
    kicker: "Contacto",
    title: "Escríbenos y te respondemos el mismo día",
    text:
      "Resolvemos dudas de tallas, materiales y envíos por WhatsApp. Si prefieres, también puedes pasar por el local en Mislata.",
  },

  nav: [
    { label: "Colección", href: "/coleccion" },
    { label: "Probador AR", href: "/provador" },
    { label: "Cómo comprar", href: "/como-comprar" },
    { label: "Contacto", href: "#contacto" },
  ],
} as const;
