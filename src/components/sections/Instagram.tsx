import { CtaLink } from "@/components/ui/CtaLink";
import { PieceImage } from "@/components/ui/PieceImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { BusinessConfig, SiteConfig } from "@/lib/content";

type InstagramProps = {
  business: BusinessConfig;
  site: SiteConfig;
};

/**
 * Bloque de Instagram. Explica el vínculo entre el feed y el
 * catálogo de la web: es el argumento que convierte a la dueña.
 */
export function Instagram({ business, site }: InstagramProps) {
  if (!business.social.instagram) return null;

  return (
    <section id="instagram" className="py-20 sm:py-28">
      <div className="container-site">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-sm border border-linea bg-noche-2 p-8">
              <div
                className="pointer-events-none absolute -top-20 -left-16 h-48 w-48 rounded-full bg-prisma opacity-25 blur-[70px]"
                aria-hidden="true"
              />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-oro-claro via-oro to-oro-profundo text-noche">
                    <span className="font-display text-lg">JP</span>
                  </div>
                  <div>
                    <p className="font-semibold text-marfil">jp_accesoriosvlc</p>
                    <p className="text-xs text-humo">Mislata, Valencia</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  {[
                    "/images/productos/gota-cristal.svg",
                    "/images/productos/cascada-perlas.svg",
                    "/images/productos/set-oro.svg",
                    "/images/productos/collar-cadena.svg",
                    "/images/productos/pulsera-cabecilla.svg",
                    "/images/productos/anillo-sello.svg",
                  ].map((src) => (
                    <div
                      key={src}
                      className="piece-frame relative aspect-square overflow-hidden rounded-sm"
                    >
                      <PieceImage
                        src={src}
                        alt=""
                        className="object-contain p-2"
                        sizes="120px"
                      />
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-xs leading-relaxed text-humo-2">
                  El feed manda: cuando publicas una pieza, aparece en la web el
                  mismo día.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <SectionHeading
                kicker={site.instagram.kicker}
                title={site.instagram.title}
                intro={site.instagram.intro}
                index="07"
                accent="prisma"
              />
            </Reveal>

            <Reveal delay={120}>
              <CtaLink
                href={business.social.instagram}
                external
                variant="outline"
                className="mt-8"
              >
                {site.instagram.cta}
              </CtaLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
