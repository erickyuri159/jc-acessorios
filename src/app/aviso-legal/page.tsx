import { LegalShell, legalMetadata } from "@/components/legal/LegalShell";
import { business, siteUrl } from "@/data/business";

export const metadata = legalMetadata(
  "Aviso legal",
  "Información del titular y condiciones de uso del sitio web de JP Accesorios (Mislata, Valencia).",
  "/aviso-legal",
);

export default function AvisoLegalPage() {
  return (
    <LegalShell
      kicker="Aviso legal"
      title="Información y condiciones de uso"
      updated="21 de octubre de 2026"
      blocks={[
        {
          heading: "1. Titular del sitio web",
          paragraphs: [
            `En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI), se informa de que el titular de este sitio web es ${business.legalName}, con identificador fiscal ${business.taxId}, con domicilio en ${business.address.street}, ${business.address.postalCode} ${business.address.locality} (${business.address.region}) y correo electrónico de contacto ${business.email}.`,
            `Teléfono de contacto: ${business.telephone}.`,
            "Los datos marcados entre corchetes deben ser completados por la titular antes de la publicación del sitio.",
          ],
        },
        {
          heading: "2. Objeto y contenido",
          paragraphs: [
            `El presente sitio web, accesible en ${siteUrl}, tiene por objeto la promoción y venta de bisutería y joyería, la presentación del catálogo de piezas y la información sobre envíos, formas de pago y devoluciones.`,
            "Los precios se expresan en euros e incluyen el IVA que resulte aplicable según el territorio de entrega. Las características de cada pieza se describen en su ficha de producto.",
          ],
        },
        {
          heading: "3. Contrato de compra y pago",
          paragraphs: [
            "El pedido se formaliza a través de WhatsApp: la cliente selecciona las piezas, la tienda confirma la disponibilidad y el importe, y remite el enlace de pago por Bizum. La aceptación del pedido por parte de la tienda es el momento en que el contrato queda formalizado.",
            "En el momento del pago, la titular confirma si la pieza está disponible, el plazo de preparación y el coste final del envío según el destino.",
          ],
        },
        {
          heading: "4. Propiedad intelectual e industrial",
          paragraphs: [
            "Los textos, fotografías, ilustraciones, marca y demás elementos del sitio web pertenecen a su titular o a terceros que han autorizado su uso, y están protegidos por la normativa de propiedad intelectual e industrial. Queda prohibida su reproducción, distribución o transformación sin autorización expresa.",
            "Las fotografías de las piezas y de los perfiles de las clientas que se compartan en redes sociales siguen siendo propiedad de sus titulares.",
          ],
        },
        {
          heading: "5. El probador de realidad aumentada",
          paragraphs: [
            "El probador analiza la imagen de la cámara directamente en el dispositivo del usuario mediante un modelo que se descarga desde este mismo sitio web. Ninguna imagen se transmite a los servidores del titular ni a terceros, y no se crea ningún perfil ni registro del usuario.",
            "El resultado del probador es orientativo y no sustituye la prueba física de la pieza: el color, el acabado y el tamaño reales pueden variar según la pantalla y la iluminación.",
          ],
        },
        {
          heading: "6. Responsabilidad",
          paragraphs: [
            "El titular no se hace responsable del mal uso que se haga de los contenidos del sitio, ni de los daños derivados del acceso o de la imposibilidad de acceso al mismo, ni de los enlaces externos a servicios de terceros (WhatsApp, Instagram, Google Maps, la web de pago de Bizum u otros) y sus respectivas políticas de privacidad.",
          ],
        },
        {
          heading: "7. Legislación aplicable y jurisdicción",
          paragraphs: [
            `Las presentes condiciones se rigen por la legislación española. Para cualquier controversia derivada del uso del sitio, las partes se someten a los juzgados y tribunales de ${business.address.locality}, salvo que la normativa disponga otra cosa.`,
          ],
        },
      ]}
    />
  );
}
