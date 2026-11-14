import { CtaLink } from "@/components/ui/CtaLink";
import { PieceImage } from "@/components/ui/PieceImage";
import { Reveal } from "@/components/ui/Reveal";
import type { BusinessConfig, SiteConfig } from "@/lib/content";

type HeroProps = {
  business: BusinessConfig;
  site: SiteConfig;
};

/**
 * Portada. El mensaje principal es el probador: por eso el CTA
 * principal abre la cámara y no el catálogo. La composición mezcla
 * un titular de revista con un cartel de campaña y una vitrina de
 * gema con la pieza en su halo.
 */
export function Hero({ business, site }: HeroProps) {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden pb-20 pt-12 sm:pb-28 sm:pt-16 lg:pb-32 lg:pt-20"
    >
      <div
        className="aurora aurora-rubi -top-40 -left-32 h-[34rem] w-[34rem] opacity-45"
        aria-hidden="true"
      />
      <div
        className="aurora aurora-zafiro top-10 -right-24 h-[30rem] w-[30rem] opacity-35"
        aria-hidden="true"
      />
      <div
        className="aurora aurora-ametis bottom-[-12rem] left-1/3 h-[28rem] w-[28rem] opacity-30"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 75%)",
        }}
      />

      <div className="container-site relative">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="punto-estado" aria-hidden="true" />
                <p className="kicker text-oro">{site.hero.kicker}</p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <p className="font-poster mt-6 text-lg tracking-[0.18em] text-prisma sm:text-xl">
                PROBADOR DE REALIDAD AUMENTADA
              </p>
            </Reveal>

            <Reveal delay={140}>
              <h1 className="font-display mt-4 text-[3.1rem] leading-[0.98] text-marfil sm:text-[4.4rem] lg:text-[5.2rem]">
                La joya que{" "}
                <span className="text-oro-metal">no te has</span>{" "}
                <span className="text-prisma italic">probado</span>{" "}
                <span className="text-oro-metal">todavía</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-8 h-px w-full bg-gradient-to-r from-oro via-oro/40 to-transparent" />
            </Reveal>

            <Reveal delay={240}>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-humo">
                {site.hero.subtitle}
              </p>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-11 flex flex-wrap items-center gap-4">
                <CtaLink href="/provador" variant="prisma">
                  {site.hero.ctaPrimary}
                </CtaLink>
                <CtaLink href="/coleccion" variant="outline">
                  {site.hero.ctaSecondary}
                </CtaLink>
              </div>
            </Reveal>

            <Reveal delay={380}>
              <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-humo">
                {[
                  "Envío a España y Europa",
                  "Pago por Bizum",
                  "Recogida en Mislata",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rotate-45 bg-oro"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={220} className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              <div
                className="absolute -inset-10 rounded-full bg-prisma opacity-25 blur-[90px]"
                aria-hidden="true"
              />

              <figure className="piece-frame relative aspect-[4/5] overflow-hidden gem-cut">
                <PieceImage
                  src={site.hero.image.src}
                  alt={site.hero.image.alt}
                  className="object-contain p-10"
                  priority
                  sizes="(min-width: 1024px) 40vw, 92vw"
                />
                <figcaption className="sr-only">{business.name}</figcaption>
              </figure>

              <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-full border border-oro/30 bg-noche/90 px-5 py-3 backdrop-blur">
                <span className="h-2 w-2 rotate-45 bg-esmeralda" aria-hidden="true" />
                <span className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-marfil">
                  Sin app · Sin registro
                </span>
              </div>

              <div className="absolute -top-5 -right-3 rounded-full border border-linea bg-noche/90 px-4 py-2.5 backdrop-blur">
                <span className="font-display text-sm text-oro">Envío gratis</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
