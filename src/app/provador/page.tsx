import type { Metadata } from "next";
import { TryOnStudio } from "@/components/ar/TryOnStudio";
import { Reveal } from "@/components/ui/Reveal";
import { demoTryOnPieces } from "@/data/products";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Probador de realidad aumentada",
  description:
    "Prueba pendientes y collares de JP Accesorios con la cámara del móvil. La imagen se analiza en tu dispositivo y no se envía a ningún servidor.",
  alternates: { canonical: "/provador" },
};

type ProbadorPageProps = {
  searchParams: Promise<{ pieza?: string }>;
};

export default async function ProbadorPage({ searchParams }: ProbadorPageProps) {
  const { pieza } = await searchParams;
  const { products, site } = await getSiteContent();

  // El collar de ejemplo abre la lista (es con el que arranca el
  // probador); después el catálogo real y, al final, los demás ejemplos.
  const probables = [
    ...demoTryOnPieces.filter((piece) => piece.arType === "necklace"),
    ...products.filter(
      (product) =>
        product.arImage &&
        (product.arType === "earring" || product.arType === "necklace"),
    ),
    ...demoTryOnPieces.filter((piece) => piece.arType !== "necklace"),
  ].filter(
    (piece, index, all) =>
      all.findIndex((other) => other.slug === piece.slug) === index,
  );

  return (
    <div className="relative py-12 sm:py-20">
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-96 w-[52rem] -translate-x-1/2 rounded-full bg-zafiro opacity-[0.14] blur-[130px]"
        aria-hidden="true"
      />
      <div className="container-site relative">
        <Reveal>
          <p className="kicker">{site.tryOn.kicker}</p>
          <h1 className="font-display mt-4 max-w-3xl text-[2.5rem] leading-[1.05] text-marfil sm:text-5xl">
            {site.tryOn.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-humo">
            {site.tryOn.intro}
          </p>
        </Reveal>

        <div className="mt-12">
          {probables.length > 0 ? (
            <TryOnStudio products={probables} initialSlug={pieza} />
          ) : (
            <p className="rounded-sm border border-linea bg-noche-2 p-8 text-humo">
              Todavía no hay piezas preparadas para el probador. En cuanto la
              tienda prepare las fotos con fondo transparente, aparecerán aquí.
            </p>
          )}
        </div>

        <Reveal delay={150}>
          <div className="mt-16 grid gap-6 border-t border-linea pt-10 sm:grid-cols-3">
            <div>
              <h2 className="font-display text-lg text-marfil">
                Nada sale de tu móvil
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-humo">
                El detector de rostros y el análisis de la imagen se ejecutan
                dentro del navegador. No se sube ninguna imagen a ningún servidor.
              </p>
            </div>
            <div>
              <h2 className="font-display text-lg text-marfil">
                Sin app y sin registro
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-humo">
                Funciona en el navegador de cualquier móvil. No hay que instalar
                nada ni crear una cuenta para probarse las piezas.
              </p>
            </div>
            <div>
              <h2 className="font-display text-lg text-marfil">
                Ajusta el resultado
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-humo">
                Cada pieza tiene su propia escala. Si algo queda grande o
                pequeño, usa los controles de tamaño y altura hasta que encaje.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

