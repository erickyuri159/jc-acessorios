import type { Metadata } from "next";
import Link from "next/link";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { business } from "@/data/business";
import { shippingOptions } from "@/lib/shipping";

export const metadata: Metadata = {
  title: "Cómo comprar — JP Accesorios",
  description:
    "Guía de compra en JP Accesorios: cómo pedir, formas de pago con Bizum, envíos a España y Europa, plazos y devoluciones.",
  alternates: { canonical: "/como-comprar" },
};

const faq = [
  {
    question: "¿Cómo hago un pedido?",
    answer:
      "Añade las piezas al carrito y pulsa el botón de WhatsApp. Se abrirá el chat con el resumen de tu pedido listo para enviar. La tienda confirma la disponibilidad, el coste de envío y te pasa el enlace de pago.",
  },
  {
    question: "¿Cómo se paga?",
    answer:
      "Por Bizum, que es inmediato y no pide datos de tarjeta. Al confirmar el pedido, la tienda te envía el número o el enlace de Bizum. También puedes recoger en el local y pagar en mano.",
  },
  {
    question: "¿Cuánto tarda el envío?",
    answer:
      "En Mislata y Valencia, 24 horas. En el resto de España, de 2 a 4 días laborables. En el resto de la Unión Europea, de 4 a 8 días laborables. Los pedidos se preparan en 24 horas laborables desde la confirmación del pago.",
  },
  {
    question: "¿Cuánto cuesta el envío?",
    answer:
      "El envío es gratuito en la recogida en el local y en entregas en Mislata y Valencia. Fuera de la Comunidad Valenciana se aplica un coste único por zona, y el envío es gratuito a partir de 49 € de compra.",
  },
  {
    question: "¿Puedo devolver una pieza?",
    answer:
      "Sí. Tienes 14 días naturales desde recibir el pedido para desistir, sin dar explicaciones. Las piezas personalizadas con grabado quedan excluidas. El reembolso se hace en un máximo de 14 días desde que recibes la devolución.",
  },
  {
    question: "¿El probador de realidad aumentada es real?",
    answer:
      "El probador funciona con tu cámara y te enseña cómo queda la pieza sobre tu rostro o cuello. Funciona en el propio móvil, sin enviar tu imagen a ningún servidor. Es orientativo: el color y el acabado reales pueden variar ligeramente.",
  },
];

export default function ComoComprarPage() {
  const options = shippingOptions(business.shipping);

  return (
    <div className="relative pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div
        className="pointer-events-none absolute top-0 left-1/3 h-80 w-[46rem] rounded-full bg-esmeralda opacity-[0.08] blur-[120px]"
        aria-hidden="true"
      />
      <div className="container-site relative">
        <div className="max-w-2xl">
          <p className="kicker">Guía</p>
          <h1 className="font-display mt-6 text-4xl leading-[1.02] text-marfil sm:text-5xl">
            Cómo comprar
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-humo">
            Pedir en JP Accesorios es sencillo: eliges tus piezas, lo envías por
            WhatsApp y pagas con Bizum. Todo lo que necesitas saber, aquí.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <SectionHeading
              kicker="Paso a paso"
              title="Del carrito al paquete"
              index="01"
              accent="prisma"
            />
            <ol className="mt-8 space-y-6">
              {[
                {
                  n: "01",
                  title: "Elige tus piezas",
                  body: "Navega el catálogo, pruébalas en el probador y añádelas al carrito. El probador te dice además qué forma de rostro tienes y qué piezas te favorecen.",
                },
                {
                  n: "02",
                  title: "Envía el pedido por WhatsApp",
                  body: "El carrito genera un mensaje con las piezas, el importe y tus datos de envío. Solo tienes que revisarlo y enviarlo.",
                },
                {
                  n: "03",
                  title: "Confirmamos y cobramos",
                  body: "Comprobamos que las piezas están disponibles, ajustamos el envío según el destino y te enviamos el enlace de pago por Bizum.",
                },
                {
                  n: "04",
                  title: "Preparamos y enviamos",
                  body: "Embalamos con cuidado, te enviamos el número de seguimiento y te avisamos por WhatsApp cuando salga hacia su destino.",
                },
              ].map((step) => (
                <li
                  key={step.n}
                  className="flex gap-5 border-t border-linea pt-6 first:border-0 first:pt-0"
                >
                  <span className="font-poster text-2xl text-prisma">{step.n}</span>
                  <div>
                    <h3 className="font-display text-xl text-marfil">{step.title}</h3>
                    <p className="mt-2 leading-relaxed text-humo">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={120}>
            <aside className="sticky top-28 rounded-sm border border-linea bg-noche-2 p-7">
              <h2 className="font-display text-xl text-marfil">Envíos</h2>
              <ul className="mt-5 space-y-4">
                {options.map((option) => (
                  <li key={option.id} className="text-sm">
                    <p className="font-semibold text-marfil">{option.label}</p>
                    <p className="text-humo">{option.detail}</p>
                    <p className="mt-1 text-xs tracking-wide text-oro uppercase">
                      {option.cost === 0 ? "Gratis" : `${option.cost} €`} ·{" "}
                      {option.days}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-linea pt-4 text-xs text-humo-2">
                Envío gratuito a partir de {business.shipping.freeShippingFrom} €.
                Los costes y plazos son orientativos: la tienda los confirma al
                cerrar el pedido.
              </p>
            </aside>
          </Reveal>
        </div>

        <Reveal className="mt-20">
          <SectionHeading
            kicker="Preguntas"
            title="Lo que más se pregunta"
            index="02"
          />
          <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {faq.map((item) => (
              <div key={item.question}>
                <h3 className="font-display text-lg text-marfil">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-humo">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-20 border-t border-linea pt-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl text-marfil">
                Las condiciones completas
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-humo">
                El texto legal completo de las condiciones de venta, con el
                detalle de IVA, desistimiento y garantía, está en{" "}
                <Link
                  href="/condiciones-de-venta"
                  className="link-underline font-semibold text-oro"
                >
                  condiciones de venta
                </Link>
                .
              </p>
            </div>
            <CtaLink href="/coleccion" variant="gold">
              Ver el catálogo
            </CtaLink>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
