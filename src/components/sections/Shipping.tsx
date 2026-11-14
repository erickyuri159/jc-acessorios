import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { BusinessConfig, SiteConfig } from "@/lib/content";
import { formatEuros } from "@/lib/whatsapp";

type ShippingProps = {
  business: BusinessConfig;
  site: SiteConfig;
};

/**
 * Envíos: las cuatro opciones con su coste y plazo. Los datos
 * vienen de business.ts para que la dueña los cambie sin tocar
 * componentes.
 */
export function Shipping({ business, site }: ShippingProps) {
  const { shipping } = business;

  const options = [
    {
      title: "Recogida en Mislata",
      detail: shipping.localPickupNote,
      meta: "Sin coste · listo en 24 h",
      accent: "bg-esmeralda",
    },
    {
      title: "Entrega local en 24 h",
      detail: shipping.localDeliveryNote,
      meta: "Mislata y Valencia ciudad",
      accent: "bg-citrino",
    },
    {
      title: "España",
      detail: shipping.spainNote,
      meta: `${shipping.spainDeliveryDays} días laborables · ${formatEuros(
        shipping.spainShippingCost,
      )}`,
      accent: "bg-zafiro",
    },
    {
      title: "Unión Europea",
      detail: shipping.europeNote,
      meta: `${shipping.europeDeliveryDays} días laborables · ${formatEuros(
        shipping.europeShippingCost,
      )}`,
      accent: "bg-ametista",
    },
  ];

  return (
    <section id="envios" className="py-20 sm:py-28">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            kicker={site.shipping.kicker}
            title={site.shipping.title}
            intro={site.shipping.intro}
            align="center"
            index="06"
          />
        </Reveal>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-sm bg-linea sm:grid-cols-2 lg:grid-cols-4">
          {options.map((option, index) => (
            <li key={option.title} className="bg-noche-2 p-7">
              <Reveal delay={index * 70}>
                <span
                  className={`block h-2.5 w-2.5 rotate-45 ${option.accent}`}
                  aria-hidden="true"
                />
                <h3 className="font-display mt-5 text-xl text-marfil">
                  {option.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-humo">
                  {option.detail}
                </p>
                <p className="mt-4 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-oro">
                  {option.meta}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={200}>
          <p className="mt-8 text-center text-sm text-humo">
            Envío gratuito a partir de {formatEuros(shipping.freeShippingFrom)} en
            pedidos a España y Europa.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
