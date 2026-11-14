// ============================================================
// HELPERS DE WHATSAPP
// ------------------------------------------------------------
// Construcción de enlaces y mensajes. El número llega como
// parámetro (business.whatsappNumber) para que el enlace siga
// al contenido en vivo del panel.
// ============================================================

const WA_BASE = "https://wa.me";

/** Mensaje genérico desde el botón principal. */
export const WA_MESSAGE_GENERAL =
  "Hola JP Accesorios, me gustaría información sobre las piezas de la web.";

/** Mensaje de consulta sobre una pieza concreta. */
export function waProductMessage(productName: string): string {
  return `Hola JP Accesorios, me interesa la pieza «${productName}». ¿Sigue disponible?`;
}

/** Mensaje de consulta sobre el probador AR. */
export function waTryOnMessage(): string {
  return "Hola JP Accesorios, he probado el probador de la web y me gustaría pedir una pieza.";
}

/**
 * Mensaje de pedido: resumen del carrito con importes.
 * Se usa cuando el cliente confirma el pedido por WhatsApp y la
 * tienda le manda el enlace de Bizum.
 */
export function waOrderMessage(
  items: { name: string; quantity: number; price: number }[],
  options: { shipping?: string; notes?: string } = {},
): string {
  const lines = items.map(
    (item) => `• ${item.name} × ${item.quantity} — ${formatEuros(item.price * item.quantity)}`,
  );
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const parts = [
    "Hola JP Accesorios, quiero confirmar este pedido:",
    "",
    ...lines,
    "",
    `Total de piezas: ${formatEuros(total)}`,
  ];

  if (options.shipping) {
    parts.push(`Envío: ${options.shipping}`);
  }
  if (options.notes) {
    parts.push(`Notas: ${options.notes}`);
  }
  parts.push("", "¿Me confirmáis disponibilidad y forma de pago?");

  return parts.join("\n");
}

/** Importe en euros con el formato español. */
export function formatEuros(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

/** Enlace wa.me con número y mensaje. */
export function waLink(number: string, message: string): string {
  const clean = number.replace(/\D/g, "");
  return `${WA_BASE}/${clean}?text=${encodeURIComponent(message)}`;
}
