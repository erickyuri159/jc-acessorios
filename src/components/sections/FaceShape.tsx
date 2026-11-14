import { CtaLink } from "@/components/ui/CtaLink";
import { FaceSilhouette } from "@/components/ui/FaceSilhouette";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FACE_SHAPE_ADVICE, FACE_SHAPE_LABELS, type FaceShape } from "@/lib/face";
import type { SiteConfig } from "@/lib/content";

type FaceShapeProps = {
  site: SiteConfig;
};

const SHAPES: FaceShape[] = [
  "redondo",
  "cuadrado",
  "ovalado",
  "corazon",
  "diamante",
  "triangular",
  "alargado",
];

const GRADIENTS: Record<FaceShape, { from: string; to: string }> = {
  redondo: { from: "#ff2e63", to: "#ffd84d" },
  cuadrado: { from: "#ffd84d", to: "#00e5a0" },
  ovalado: { from: "#00e5a0", to: "#3b82f6" },
  corazon: { from: "#ff2e63", to: "#a855f7" },
  diamante: { from: "#3b82f6", to: "#a855f7" },
  triangular: { from: "#a855f7", to: "#ff2e63" },
  alargado: { from: "#ffd84d", to: "#ff2e63" },
};

/**
 * Recomendador por forma de rostro. Cada forma tiene su silueta
 * y su color, para que la recomendación se entienda de un vistazo.
 */
export function FaceShape({ site }: FaceShapeProps) {
  return (
    <section id="forma-rostro" className="py-20 sm:py-28">
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                kicker={site.faceShape.kicker}
                title={site.faceShape.title}
                intro={site.faceShape.intro}
                index="04"
              />
            </Reveal>

            <Reveal delay={120}>
              <CtaLink href="/provador" variant="outline" className="mt-8">
                {site.faceShape.cta}
              </CtaLink>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <ul className="grid gap-px overflow-hidden rounded-sm bg-linea sm:grid-cols-2">
              {SHAPES.map((shape, index) => (
                <li key={shape} className="bg-noche-2 p-6">
                  <Reveal delay={index * 50}>
                    <div className="flex items-start gap-4">
                      <FaceSilhouette
                        shape={shape}
                        className="h-16 w-12 shrink-0"
                        from={GRADIENTS[shape].from}
                        to={GRADIENTS[shape].to}
                      />
                      <div>
                        <h3 className="font-display text-xl text-marfil">
                          {FACE_SHAPE_LABELS[shape]}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-humo">
                          {FACE_SHAPE_ADVICE[shape]}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
