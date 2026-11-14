import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { BusinessConfig, SiteConfig } from "@/lib/content";
import { WA_MESSAGE_GENERAL, waLink } from "@/lib/whatsapp";

type ContactProps = {
  business: BusinessConfig;
  site: SiteConfig;
};

/**
 * Contacto: WhatsApp como canal principal, con los datos del local
 * y el mapa cuando haya coordenadas confirmadas.
 */
export function Contact({ business, site }: ContactProps) {
  const hasMap =
    typeof business.map.latitude === "number" &&
    typeof business.map.longitude === "number";
  const hasAddress = !business.address.street.startsWith("[");
  const hasHours = !business.openingHours.mondayToFriday.startsWith("[");

  return (
    <section id="contacto" className="py-20 sm:py-28">
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                kicker={site.contact.kicker}
                title={site.contact.title}
                intro={site.contact.text}
                index="08"
              />
            </Reveal>

            <Reveal delay={120}>
              <CtaLink
                href={waLink(business.whatsappNumber, WA_MESSAGE_GENERAL)}
                external
                variant="prisma"
                className="mt-8"
              >
                Escribir por WhatsApp
              </CtaLink>
            </Reveal>

            <Reveal delay={180}>
              <dl className="mt-10 space-y-5 text-sm">
                {hasAddress ? (
                  <div>
                    <dt className="label text-oro">Dirección</dt>
                    <dd className="mt-1.5 text-marfil">
                      {business.address.street}
                      <br />
                      {business.address.postalCode} {business.address.locality}
                      {business.address.region
                        ? `, ${business.address.region}`
                        : ""}
                    </dd>
                  </div>
                ) : null}

                {hasHours ? (
                  <div>
                    <dt className="label text-oro">Horario</dt>
                    <dd className="mt-1.5 text-marfil">
                      {business.openingHours.mondayToFriday}
                      {business.openingHours.saturday
                        ? ` · Sáb: ${business.openingHours.saturday}`
                        : ""}
                      {business.openingHours.sunday
                        ? ` · Dom: ${business.openingHours.sunday}`
                        : ""}
                    </dd>
                  </div>
                ) : null}

                <div>
                  <dt className="label text-oro">Teléfono</dt>
                  <dd className="mt-1.5">
                    <a
                      href={`tel:${business.telephone.replace(/\s/g, "")}`}
                      className="link-underline text-marfil"
                    >
                      {business.telephone}
                    </a>
                  </dd>
                </div>

                {business.email ? (
                  <div>
                    <dt className="label text-oro">Email</dt>
                    <dd className="mt-1.5">
                      <a
                        href={`mailto:${business.email}`}
                        className="link-underline text-marfil"
                      >
                        {business.email}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={140} className="lg:col-span-7">
            {hasMap ? (
              <div className="overflow-hidden rounded-sm border border-linea">
                <iframe
                  title="Mapa de la tienda"
                  src={`https://www.google.com/maps?q=${business.map.latitude},${business.map.longitude}&hl=es&z=16&output=embed`}
                  className="h-full min-h-[420px] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className="relative flex h-full min-h-[320px] items-center justify-center overflow-hidden rounded-sm border border-dashed border-linea bg-noche-2 p-10 text-center">
                <div
                  className="pointer-events-none absolute inset-0 opacity-40"
                  aria-hidden="true"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.12) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                  }}
                />
                <p className="relative max-w-sm text-sm text-humo">
                  El mapa se activa en cuanto se confirmen las coordenadas del
                  local. Por ahora, escríbenos y te indicamos cómo llegar.
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
