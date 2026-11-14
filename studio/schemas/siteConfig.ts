import { defineField, defineType } from "sanity";

/**
 * Documento único con TODO el contenido editable del sitio:
 * datos de la tienda, textos de portada, envíos y pagos.
 *
 * Los nombres de campo deben coincidir con los que lee la web en
 * src/lib/content.ts.
 */

export default defineType({
  name: "siteConfig",
  type: "document",
  title: "Ajustes del sitio",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Nombre de la tienda",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortName",
      type: "string",
      title: "Nombre corto (logotipo)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "legalName",
      type: "string",
      title: "Razón social / titular",
      description: "Aparece en el aviso legal y el pie de página.",
    }),
    defineField({
      name: "taxId",
      type: "string",
      title: "CIF / NIF",
      description: "Aparece en el aviso legal y en las facturas.",
    }),
    defineField({
      name: "telephone",
      type: "string",
      title: "Teléfono de contacto",
      description: "Se muestra como teléfono clicable. Ej.: 678 264 279",
    }),
    defineField({
      name: "telephoneE164",
      type: "string",
      title: "Teléfono internacional",
      description: "Con prefijo y sin espacios. Ej.: +34678264279",
    }),
    defineField({
      name: "whatsappNumber",
      type: "string",
      title: "Número de WhatsApp",
      description: "Con prefijo de país, sin + ni espacios. Ej.: 34678264279",
    }),
    defineField({
      name: "email",
      type: "string",
      title: "Correo electrónico",
    }),

    defineField({
      name: "address",
      type: "object",
      title: "Dirección",
      fields: [
        { name: "street", type: "string", title: "Calle y número" },
        { name: "locality", type: "string", title: "Población" },
        { name: "region", type: "string", title: "Provincia / Región" },
        { name: "postalCode", type: "string", title: "Código postal" },
      ],
    }),

    defineField({
      name: "openingHours",
      type: "object",
      title: "Horario",
      description: "Ej.: «10:00 – 14:00 · 16:00 – 20:00». Vacío = no se muestra.",
      fields: [
        { name: "mondayToFriday", type: "string", title: "Lunes a viernes" },
        { name: "saturday", type: "string", title: "Sábado" },
        { name: "sunday", type: "string", title: "Domingo" },
      ],
    }),

    defineField({
      name: "map",
      type: "object",
      title: "Ubicación en el mapa",
      description: "Al rellenar las coordenadas, el mapa de la web se activa.",
      fields: [
        { name: "latitude", type: "number", title: "Latitud (ej.: 39.476700)" },
        { name: "longitude", type: "number", title: "Longitud (ej.: -0.412200)" },
        { name: "mapsProfileUrl", type: "url", title: "Enlace al perfil de Google Maps" },
      ],
    }),

    defineField({
      name: "social",
      type: "object",
      title: "Redes sociales",
      fields: [
        { name: "instagram", type: "url", title: "Instagram" },
        { name: "facebook", type: "url", title: "Facebook" },
      ],
    }),

    defineField({
      name: "shipping",
      type: "object",
      title: "Envíos",
      fields: [
        { name: "localPickup", type: "boolean", title: "Recogida en el local" },
        { name: "localPickupNote", type: "string", title: "Texto de recogida" },
        { name: "localDeliveryNote", type: "string", title: "Texto de entrega local" },
        { name: "spainNote", type: "string", title: "Texto de envío a España" },
        { name: "europeNote", type: "string", title: "Texto de envío a la UE" },
        { name: "spainShippingCost", type: "number", title: "Coste de envío en España (€)" },
        { name: "europeShippingCost", type: "number", title: "Coste de envío en la UE (€)" },
        { name: "spainDeliveryDays", type: "string", title: "Plazo España (texto)" },
        { name: "europeDeliveryDays", type: "string", title: "Plazo UE (texto)" },
        { name: "freeShippingFrom", type: "number", title: "Envío gratis a partir de (€)" },
      ],
    }),

    defineField({
      name: "payments",
      type: "object",
      title: "Pagos",
      fields: [
        { name: "bizumEnabled", type: "boolean", title: "Bizum activado" },
        { name: "bizumPhone", type: "string", title: "Móvil para Bizum" },
        { name: "bizumPaymentLink", type: "url", title: "Enlace de pago de Bizum" },
        { name: "cardEnabled", type: "boolean", title: "Tarjeta activada" },
        { name: "bankTransferEnabled", type: "boolean", title: "Transferencia activada" },
      ],
    }),

    defineField({
      name: "newsletterFormUrl",
      type: "url",
      title: "Formulario del newsletter",
      description: "Enlace a Formspree, Google Forms… Si está vacío, no se muestra.",
    }),

    defineField({
      name: "meta",
      type: "object",
      title: "SEO (portada)",
      fields: [
        { name: "title", type: "string", title: "Título para buscadores" },
        { name: "description", type: "text", title: "Descripción para buscadores" },
      ],
    }),

    defineField({
      name: "hero",
      type: "object",
      title: "Portada (inicio)",
      fields: [
        { name: "kicker", type: "string", title: "Etiqueta pequeña" },
        { name: "title", type: "string", title: "Titular" },
        { name: "subtitle", type: "text", title: "Subtítulo" },
        { name: "image", type: "image", title: "Fotografía principal" },
        { name: "imageAlt", type: "string", title: "Texto alternativo de la foto" },
        { name: "ctaPrimary", type: "string", title: "Botón principal" },
        { name: "ctaSecondary", type: "string", title: "Botón secundario" },
      ],
    }),

    defineField({
      name: "catalog",
      type: "object",
      title: "Sección «Catálogo»",
      fields: [
        { name: "kicker", type: "string", title: "Etiqueta pequeña" },
        { name: "title", type: "string", title: "Titular" },
        { name: "intro", type: "text", title: "Texto introductorio" },
      ],
    }),

    defineField({
      name: "tryOn",
      type: "object",
      title: "Sección «Probador AR»",
      fields: [
        { name: "kicker", type: "string", title: "Etiqueta pequeña" },
        { name: "title", type: "string", title: "Titular" },
        { name: "intro", type: "text", title: "Texto introductorio" },
        {
          name: "bullets",
          type: "array",
          title: "Ventajas (lista corta)",
          of: [{ type: "string" }],
        },
        { name: "cta", type: "string", title: "Texto del botón" },
      ],
    }),

    defineField({
      name: "faceShape",
      type: "object",
      title: "Sección «Forma de rostro»",
      fields: [
        { name: "kicker", type: "string", title: "Etiqueta pequeña" },
        { name: "title", type: "string", title: "Titular" },
        { name: "intro", type: "text", title: "Texto introductorio" },
        { name: "cta", type: "string", title: "Texto del botón" },
      ],
    }),

    defineField({
      name: "passport",
      type: "object",
      title: "Sección «Passport de fidelidad»",
      fields: [
        { name: "kicker", type: "string", title: "Etiqueta pequeña" },
        { name: "title", type: "string", title: "Titular" },
        { name: "intro", type: "text", title: "Texto introductorio" },
        {
          name: "points",
          type: "array",
          title: "Puntos (lista corta)",
          of: [{ type: "string" }],
        },
        { name: "cta", type: "string", title: "Texto del botón" },
      ],
    }),

    defineField({
      name: "shippingFlow",
      type: "object",
      title: "Sección «Envíos»",
      fields: [
        { name: "kicker", type: "string", title: "Etiqueta pequeña" },
        { name: "title", type: "string", title: "Titular" },
        { name: "intro", type: "text", title: "Texto introductorio" },
        {
          name: "points",
          type: "array",
          title: "Pasos (lista corta)",
          of: [{ type: "string" }],
        },
      ],
    }),

    defineField({
      name: "instagram",
      type: "object",
      title: "Sección «Instagram»",
      fields: [
        { name: "kicker", type: "string", title: "Etiqueta pequeña" },
        { name: "title", type: "string", title: "Titular" },
        { name: "intro", type: "text", title: "Texto introductorio" },
        { name: "cta", type: "string", title: "Texto del botón" },
      ],
    }),

    defineField({
      name: "contact",
      type: "object",
      title: "Sección «Contacto»",
      fields: [
        { name: "kicker", type: "string", title: "Etiqueta pequeña" },
        { name: "title", type: "string", title: "Titular" },
        { name: "text", type: "text", title: "Texto" },
      ],
    }),

    defineField({
      name: "nav",
      type: "array",
      title: "Menú de navegación",
      description: "Normalmente no necesita cambios.",
      of: [
        {
          type: "object",
          name: "navItem",
          title: "Enlace",
          fields: [
            { name: "label", type: "string", title: "Texto" },
            { name: "href", type: "string", title: "Destino (ej.: /coleccion)" },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "name" },
  },
});
