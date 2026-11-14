import { LegalShell, legalMetadata } from "@/components/legal/LegalShell";
import { business } from "@/data/business";

export const metadata = legalMetadata(
  "Condiciones de venta",
  "Condiciones de venta, envío, pago y devoluciones de JP Accesorios.",
  "/condiciones-de-venta",
);

export default function CondicionesVentaPage() {
  return (
    <LegalShell
      kicker="Condiciones de venta"
      title="Pedidos, envíos, pago y devoluciones"
      updated="21 de octubre de 2026"
      blocks={[
        {
          heading: "1. Identificación del vendedor",
          paragraphs: [
            `${business.legalName}, CIF ${business.taxId}, con domicilio en ${business.address.street}, ${business.address.postalCode} ${business.address.locality} (${business.address.region}), correo electrónico ${business.email} y teléfono ${business.telephone}.`,
          ],
        },
        {
          heading: "2. Cómo se formaliza el pedido",
          paragraphs: [
            "La web permite añadir piezas al carrito y enviar el resumen del pedido por WhatsApp. Ese mensaje no constituye por sí mismo un pedido en firme: la tienda comprueba la disponibilidad de cada pieza y confirma el importe final y la forma de envío.",
            "La venta se formaliza cuando la cliente acepta el enlace de pago de Bizum y este se completa. Desde ese momento, la tienda prepara el envío y comunica el número de seguimiento.",
          ],
        },
        {
          heading: "3. Precios y pagos",
          paragraphs: [
            "Los precios se expresan en euros e incluyen el IVA aplicable en el territorio de entrega. El pago se realiza exclusivamente mediante Bizum, que permite identificar a la persona compradora con un teléfono móvil.",
            "El coste del envío se calcula en el propio carrito según el destino y el importe del pedido. El envío es gratuito a partir del importe indicado en la web y siempre gratuito en la recogida en el local de Mislata.",
          ],
        },
        {
          heading: "4. Envíos",
          paragraphs: [
            "Los pedidos se preparan en 24 horas laborables desde la confirmación del pago. Las piezas bajo pedido se preparan en 48 horas.",
          ],
          list: [
            "Recogida en el local de Mislata: sin coste, disponible en 24 horas.",
            "Entrega a domicilio en Mislata y Valencia ciudad: 24 horas.",
            `España: ${business.shipping.spainDeliveryDays} días laborables (${business.shipping.spainShippingCost} €).`,
            `Unión Europea: ${business.shipping.europeDeliveryDays} días laborables (${business.shipping.europeShippingCost} €).`,
          ],
        },
        {
          heading: "5. IVA en las entregas dentro de la Unión Europea",
          paragraphs: [
            "En las entregas dentro de la Unión Europea se aplica el IVA del país de destino. Cuando la tienda opera bajo el régimen de IOSS (envíos de hasta 150 €), el IVA del país de destino queda incluido en el precio mostrado. [CONFIRMAR CON LA ASESORÍA FISCAL EL RÉGIMEN APLICABLE Y SU INSCRIPCIÓN EN EL REGISTRO EUROPEO DE OPERACIONES TELEMÁTICAS.]",
          ],
        },
        {
          heading: "6. Entrega y riesgo",
          paragraphs: [
            "El riesgo de pérdida o destrucción de las piezas se transfiere a la cliente en el momento de la entrega material. Si el paquete aparece dañado, la cliente debe indicarlo en las 24 horas siguientes a la recepción para poder reclamar a la agencia de transporte.",
          ],
        },
        {
          heading: "7. Derecho de desistimiento y devoluciones",
          paragraphs: [
            "La cliente puede desistir del contrato en un plazo de 14 días naturales desde la recepción del pedido, sin necesidad de justificación, conforme al Real Decreto Legislativo 1/2007 (texto refundido de la Ley General para la Defensa de los Consumidores).",
            "Para ejercer este derecho, la cliente debe enviar un correo a la dirección de contacto indicando su orden de desistimiento, o devolver las piezas de forma física. El reembolso se efectuará en un plazo máximo de 14 días desde la recepción de la devolución, por el mismo medio de pago utilizado.",
            "Quedan excluidos del derecho de desistimiento los productos personalizados (por ejemplo, anillos con grabado) y las piezas que hayan sido abiertas o usadas de forma que impida su reventa.",
          ],
        },
        {
          heading: "8. Garantías",
          paragraphs: [
            "Todas las piezas cuentan con la garantía legal de conformidad de dos años prevista en el texto refundido de la Ley General para la Defensa de los Consumidores. La garantía cubre los defectos de fabricación y materiales.",
            "No cubre el desgaste por uso, la pérdida de baño o color por contacto con perfumes, cosméticos o agua, ni los daños producidos por golpes o uso indebido.",
          ],
        },
        {
          heading: "9. Incidencias y notificaciones",
          paragraphs: [
            `Cualquier incidencia relacionada con un pedido se notificará por WhatsApp o por correo electrónico a ${business.email}, indicando el número de pedido. La tienda responde en un plazo máximo de 48 horas laborables.`,
          ],
        },
        {
          heading: "10. Legislación aplicable y jurisdicción",
          paragraphs: [
            `La relación comercial se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de ${business.address.locality}.`,
          ],
        },
      ]}
    />
  );
}
