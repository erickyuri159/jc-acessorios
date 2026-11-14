import { CtaLink } from "@/components/ui/CtaLink";
import { PieceImage } from "@/components/ui/PieceImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SiteConfig } from "@/lib/content";

type TryOnProps = {
  site: SiteConfig;
};

/**
 * Bloque del probador AR. Es el corazón de la web: por eso tiene
 * su propio escenario oscuro con retícula HUD, como una interfaz
 * de scanner.
 */
export function TryOn({ site }: TryOnProps) {
  return (
    <section
      id="provador"
      className="relative overflow-hidden border-y border-linea bg-noche-2 py-20 sm:py-28"
    >
      <div className="rejilla absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 h-96 w-[52rem] -translate-x-1/2 rounded-full bg-zafiro opacity-20 blur-[130px]"
        aria-hidden="true"
      />

      <div className="container-site relative">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <div className="ar-stage relative overflow-hidden rounded-sm border border-linea">
              <div className="scanline" aria-hidden="true" />
              <PieceImage
                src="/images/provador.svg"
                alt="Vista del probador de joyería en realidad aumentada"
                className="object-contain"
                sizes="(min-width: 1024px) 50vw, 92vw"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-linea bg-noche/80 px-5 py-3 backdrop-blur">
                <span className="flex items-center gap-2 text-[0.625rem] font-bold uppercase tracking-[0.18em] text-humo">
                  <span className="punto-estado" aria-hidden="true" />
                  Tracking facial activo
                </span>
                <span className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-oro">
                  30 fps · en el dispositivo
                </span>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-6">
            <Reveal>
              <SectionHeading
                kicker={site.tryOn.kicker}
                title={site.tryOn.title}
                intro={site.tryOn.intro}
                index="03"
                accent="prisma"
              />
            </Reveal>

            <Reveal delay={120}>
              <ul className="mt-8 space-y-3">
                {site.tryOn.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-3 text-sm text-humo"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="mt-0.5 h-4 w-4 shrink-0 text-oro"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                    {bullet}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-10 flex flex-wrap gap-4">
                <CtaLink href="/provador" variant="prisma">
                  {site.tryOn.cta}
                </CtaLink>
                <CtaLink href="/coleccion" variant="outline">
                  Ver pendientes
                </CtaLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
