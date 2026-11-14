import { LegalShell, legalMetadata } from "@/components/legal/LegalShell";

export const metadata = legalMetadata(
  "Política de cookies",
  "Cookies y almacenamiento local que utiliza el sitio web de JP Accesorios.",
  "/politica-de-cookies",
);

export default function CookiesPage() {
  return (
    <LegalShell
      kicker="Cookies"
      title="Política de cookies"
      updated="21 de octubre de 2026"
      blocks={[
        {
          heading: "1. Qué son las cookies",
          paragraphs: [
            "Las cookies son pequeños archivos que un sitio web guarda en el dispositivo del usuario para recordar información entre visitas. Este sitio utiliza además el almacenamiento local del navegador (localStorage), que funciona con la misma finalidad y sobre el que también se aplican las mismas garantías.",
          ],
        },
        {
          heading: "2. Cookies y almacenamiento propios",
          paragraphs: [
            "Este sitio no instala cookies publicitarias ni de seguimiento de terceros, y no utiliza herramientas de analítica que permitan identificar a la persona visitante.",
          ],
          list: [
            "jp-accesorios:carrito (almacenamiento local): guarda las piezas que has añadido a la cesta para que puedas retomar el pedido. Se elimina al vaciar la cesta o al borrar los datos del navegador.",
            "jp-accesorios:passport (almacenamiento local): guarda los sellos de fidelidad acumulados en ese dispositivo. No contiene datos personales identificables.",
            "Preferencias de cookies y de imbalance de imagen: no se utilizan, por lo que no es necesario mostrar un banner de consentimiento.",
          ],
        },
        {
          heading: "3. Cookies y contenidos de terceros",
          paragraphs: [
            "Determinadas partes del sitio dependen de servicios de terceros que sí pueden instalar cookies o utilizar almacenamiento propio:",
          ],
          list: [
            "WhatsApp: al pulsar los botones de contacto se abre la aplicación o el servicio web de WhatsApp, con su propia política de privacidad.",
            "Google Maps: el mapa de la sección de contacto incrusta un mapa de Google, que puede instalar cookies propias.",
            "Instagram: el acceso a la cuenta de la tienda se realiza desde la propia aplicación o web de Instagram, con sus propias condiciones.",
            "Vercel: plataforma de alojamiento de la web, que registra datos técnicos básicos de seguridad y funcionamiento del servidor.",
          ],
        },
        {
          heading: "4. Cómo rechazar o eliminar cookies",
          paragraphs: [
            "Puedes bloquear o eliminar las cookies y el almacenamiento local desde la configuración de tu navegador. Ten en cuenta que si eliminas el almacenamiento local, la cesta y los sellos de fidelidad se reinician en ese dispositivo.",
            "Puedes consultar las herramientas oficiales de control de cookies de los navegadores más usados (Chrome, Firefox, Safari, Edge) para configurarlas con detalle.",
          ],
        },
        {
          heading: "5. Cambios en esta política",
          paragraphs: [
            "Si se incorporan nuevos servicios de terceros o herramientas de analítica, esta política se actualizará y, cuando sea necesario, se añadirá el banner de consentimiento previo.",
          ],
        },
      ]}
    />
  );
}
