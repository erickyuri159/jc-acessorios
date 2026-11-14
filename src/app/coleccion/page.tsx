import type { Metadata } from "next";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories, type CategoryId } from "@/data/products";
import { getSiteContent } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Colección",
  description:
    "Todas las piezas de JP Accesorios: pendientes, collares, pulseras, anillos y sets. Envío a toda España y Europa.",
  alternates: { canonical: "/coleccion" },
};

type ColeccionPageProps = {
  searchParams: Promise<{ categoria?: string }>;
};

export default async function ColeccionPage({ searchParams }: ColeccionPageProps) {
  const { categoria } = await searchParams;
  const { products, site } = await getSiteContent();

  const valid = categories.some((category) => category.id === categoria);
  const active: CategoryId | null = valid ? (categoria as CategoryId) : null;

  const shown = active
    ? products.filter((product) => product.category === active)
    : products;

  const activeTitle = categories.find((category) => category.id === active)?.title;

  return (
    <div className="relative py-16 sm:py-24">
      <div
        className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-oro opacity-[0.07] blur-[100px]"
        aria-hidden="true"
      />
      <div className="container-site relative">
        <Reveal>
          <SectionHeading
            kicker={site.catalog.kicker}
            title={activeTitle ?? "Toda la colección"}
            intro={
              active
                ? "Las piezas de esta categoría. Pruébatelas en el probador antes de decidir."
                : site.catalog.intro
            }
            accent="prisma"
          />
        </Reveal>

        <nav aria-label="Filtrar por categoría" className="mt-10">
          <ul className="flex flex-wrap gap-2">
            <li>
              <a
                href="/coleccion"
                aria-current={active ? undefined : "page"}
                className={`inline-block rounded-full border px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "border-linea text-humo hover:border-oro hover:text-oro"
                    : "border-oro bg-oro text-noche"
                }`}
              >
                Todo
              </a>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <a
                  href={`/coleccion?categoria=${category.id}`}
                  aria-current={active === category.id ? "page" : undefined}
                  className={`inline-block rounded-full border px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-[0.14em] transition-colors ${
                    active === category.id
                      ? "border-oro bg-oro text-noche"
                      : "border-linea text-humo hover:border-oro hover:text-oro"
                  }`}
                >
                  {category.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {shown.length === 0 ? (
          <p className="mt-16 text-center text-humo">
            No hay piezas en esta categoría todavía. Escríbenos por WhatsApp y te
            decimos cuándo llega la próxima.
          </p>
        ) : (
          <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((product, index) => (
              <li key={product.id}>
                <Reveal delay={(index % 4) * 70}>
                  <ProductCard product={product} />
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
