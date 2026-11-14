import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SiteConfig } from "@/lib/content";

type PassportProps = {
  site: SiteConfig;
};

/**
 * Passport JP: programa de fidelización sin cuenta ni registro.
 * El saldo vive en el móvil del cliente.
 */
export function Passport({ site }: PassportProps) {
  const stamps = [1, 2, 3, 4, 5, 6];

  return (
    <section
      id="passport"
      className="relative overflow-hidden border-y border-linea bg-noche-2 py-20 sm:py-28"
    >
      <div className="container-site relative">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <SectionHeading
                kicker={site.passport.kicker}
                title={site.passport.title}
                intro={site.passport.intro}
                index="05"
                accent="prisma"
              />
            </Reveal>

            <Reveal delay={120}>
              <ul className="mt-8 space-y-3">
                {site.passport.points.map((point) => (
                  <li
                    key={point}
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
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={150} className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-sm border border-linea bg-noche p-8">
              <div
                className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-esmeralda opacity-20 blur-[80px]"
                aria-hidden="true"
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="label text-oro">Tu passport</p>
                  <span className="relative grid h-12 w-12 place-items-center">
                    <span className="anillo-prisma" aria-hidden="true" />
                    <span className="font-poster text-2xl text-marfil">JP</span>
                  </span>
                </div>

                <ul className="mt-6 grid grid-cols-6 gap-3">
                  {stamps.map((stamp) => (
                    <li
                      key={stamp}
                      className={`flex aspect-square items-center justify-center rounded-full border border-dashed font-display text-lg ${
                        stamp <= 2
                          ? "border-oro bg-oro/15 text-oro"
                          : "border-linea text-humo-2"
                      }`}
                    >
                      {stamp}
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-xs leading-relaxed text-humo-2">
                  El sello se añade automáticamente con cada pedido confirmado. En el
                  siguiente pedido, el saldo aparece aquí mismo.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
