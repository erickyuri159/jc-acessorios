import { LegalShell, legalMetadata } from "@/components/legal/LegalShell";
import { business } from "@/data/business";

export const metadata = legalMetadata(
  "Política de privacidad",
  "Treatment of personal data under the GDPR and LOPDGDD on the JP Accesorios website.",
  "/politica-de-privacidad",
);

export default function PrivacidadPage() {
  return (
    <LegalShell
      kicker="Privacidad"
      title="Política de privacidad"
      updated="21 de octubre de 2026"
      blocks={[
        {
          heading: "1. Responsable del tratamiento",
          paragraphs: [
            `El responsable del tratamiento de los datos personales es ${business.legalName}, con CIF ${business.taxId}, con domicilio en ${business.address.street}, ${business.address.postalCode} ${business.address.locality} (${business.address.region}) y correo electrónico ${business.email}.`,
          ],
        },
        {
          heading: "2. Qué datos tratamos y con qué finalidad",
          paragraphs: [
            "Este sitio web no tiene registro de usuarios ni área de cliente: no hay cuenta, ni contraseña, ni base de datos de clientes en el servidor.",
          ],
          list: [
            "Datos de contacto y del pedido (nombre, teléfono, correo electrónico, dirección de envío y productos comprados): se tratan para gestionar el pedido, el pago, el envío y la entrega, y para atender las consultas que la cliente pueda dirigir por WhatsApp o correo electrónico.",
            "Base legal: ejecución del contrato (art. 6.1.b RGPD) y cumplimiento de obligaciones legales (art. 6.1.c RGPD).",
            "Datos de facturación: se conservan para cumplir las obligaciones fiscales y contables.",
            "Datos que la cliente nos facilite a través de WhatsApp o correo electrónico: se conservan mientras dure la relación comercial y los plazos legales de prescripción.",
          ],
        },
        {
          heading: "3. El probador de realidad aumentada",
          paragraphs: [
            "El probador funciona íntegramente en el navegador del usuario. El detector de rostros (MediaPipe) se descarga desde este mismo sitio web y se ejecuta en el propio dispositivo. La imagen capturada por la cámara no se transmite, no se almacena en el servidor y no se utiliza con ninguna otra finalidad. Al cerrar o recargar la página, la imagen desaparece de la memoria del dispositivo.",
            "Ni el probador ni el resto del sitio generan perfiles de navegación ni cookies de seguimiento propias. La única información que puede guardarse en el dispositivo es el contenido del carrito y del passport de fidelidad, y se conserva localmente bajo control de la propia cliente.",
          ],
        },
        {
          heading: "4. Destinatarios de los datos",
          paragraphs: [
            "Los datos se ceden a los proveedores estrictamente necesarios para prestar el servicio: la empresa de messaging y la de transporte y paquetería, así como la entidad de pago (Bizum) cuando la cliente completa un pago. Cada uno de ellos trata los datos conforme a su propia política de privacidad y a los acuerdos de encargo de tratamiento previstos en el RGPD.",
            "No se ceden datos a terceros con fines comerciales ni se contratan perfiles publicitarios.",
          ],
        },
        {
          heading: "5. Transferencias internacionales",
          paragraphs: [
            "Algunos de los proveedores utilizados (mensajería, pago y alojamiento web) pueden tratar datos fuera del Espacio Económico Europeo. En esos casos se aplican las garantías del RGPD: cláusulas contractuales tipo y decisiones de adecuación de la Comisión Europea.",
          ],
        },
        {
          heading: "6. Conservación",
          paragraphs: [
            "Los datos de contacto y del pedido se conservan mientras dure la relación comercial y, tras su finalización, durante los plazos de prescripción legales. Los datos fiscales se conservan durante los plazos exigidos por la normativa fiscal y contable española.",
          ],
        },
        {
          heading: "7. Derechos de la persona interesada",
          paragraphs: [
            `La cliente puede ejercer en cualquier momento sus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a ${business.email}. También puede presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).`,
          ],
        },
        {
          heading: "8. Menores de edad",
          paragraphs: [
            "Esta web está dirigida a personas mayores de edad. No tratamos de forma intencionada datos de menores de edad. Si una persona menor de edad realiza una compra, la persona tutora legal deberá confirmar el pedido.",
          ],
        },
      ]}
    />
  );
}
