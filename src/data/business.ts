// ============================================================
// DATOS DEL NEGOCIO
// ------------------------------------------------------------
// ÚNICO sitio donde se edita la información de la tienda.
// Los componentes leen estos datos; no hace falta tocar código.
//
// Regla: solo datos confirmados. Lo que no se sabe queda como
// placeholder visible entre corchetes y se sustituye cuando la
// dueña lo confirme.
// ============================================================

// URL base del sitio en producción. Se usa para el canonical y el
// sitemap. Sustituir por el dominio real cuando esté contratado.
export const siteUrl = "https://jp-accesorios.es";

export const business = {
  name: "JP Accesorios",
  shortName: "JP Accesorios",
  legalName: "[ RAZÓN SOCIAL ]",
  taxId: "[ CIF / NIF ]",

  telephone: "[ TELÉFONO ]",
  telephoneE164: "[ +34600000000 ]",
  whatsappNumber: "[ NÚMERO SIN + NI ESPACIOS, p. ej. 34600000000 ]",

  email: "[ EMAIL DE CONTACTO ]",

  address: {
    street: "Av. Gregorio Gea, 26 Bajo 2",
    locality: "Mislata",
    region: "Valencia",
    postalCode: "46920",
  },

  // [HORARIO POR CONFIRMAR] Sin valor → no aparece en el sitio.
  openingHours: {
    mondayToFriday: "[ HORARIO POR CONFIRMAR ]",
    saturday: "",
    sunday: "",
  },

  // [CONFIRMAR UBICACIÓN] Sin valor → la sección de mapa muestra un aviso.
  // Cuando la dirección esté confirmada, rellenar:
  //   latitude: 39.476700,
  //   longitude: -0.412200,
  map: {
    latitude: null as number | null,
    longitude: null as number | null,
  },

  mapsProfileUrl: "",

  social: {
    instagram: "https://www.instagram.com/jp_accesoriosvlc/",
    facebook: "",
  },

  // ==========================================================
  // VENTA Y ENVÍOS
  // ------------------------------------------------------------
  // La tienda vende a toda España y Europa (confirmado). Falta
  // concretizar las tarifas y los plazos por zona.
  // ==========================================================
  shipping: {
    localPickup: true,
    localPickupNote: "Recogida en Mislata sin coste.",
    localDeliveryNote: "Entrega a domicilio en 24 h en Mislata y Valencia ciudad.",
    spainNote: "Envío a toda España peninsula.",
    europeNote: "Envío a toda la Unión Europea.",
    // [CONFIRMAR] Coste único de envío en península (€).
    spainShippingCost: 3.9,
    // [CONFIRMAR] Coste único de envío a la UE (€).
    europeShippingCost: 6.9,
    // [CONFIRMAR] Plazo orientativo en días laborables.
    spainDeliveryDays: "2 – 4",
    europeDeliveryDays: "4 – 8",
    freeShippingFrom: 49,
  },

  // ==========================================================
  // PAGOS
  // ------------------------------------------------------------
  // Bizum es el método local por excelencia. La dueña envía la
  // solicitud de pago desde su app; desde la web el cliente pide
  // el enlace. `paymentLink` admite un enlace de pago de Bizum
  // si la tienda dispone de uno.
  // ==========================================================
  payments: {
    bizumEnabled: true,
    bizumPhone: "[ MÓVIL BIZUM ]",
    bizumPaymentLink: "",
    cardEnabled: false,
    bankTransferEnabled: false,
  },

  // Enlace al formulario de contacto (Formspree, Google Forms…) que
  // se usará en el newsletter. Vacío → el bloque no se muestra.
  newsletterFormUrl: "",
} as const;

export type Business = typeof business;
