import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Product } from "@/data/products";

type CatalogProps = {
  products: Product[];
  site: { catalog: { kicker: string; title: string; intro: string } };
};

/**
 * Catálogo destacado en la portada. Muestra las piezas marcadas
 * como destacadas en el panel de control.
 */
export function Catalog({ products, site }: CatalogProps) {
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const shown = featured.length ? featured : products.slice(0, 4);

  return (
    <section id="coleccion" className="relative py-20 sm:py-28">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeading
              kicker={site.catalog.kicker}
              title="Las más pedidas"
              intro={site.catalog.intro}
              index="02"
            />
          </Reveal>

          <Reveal delay={100}>
            <a
              href="/coleccion"
              className="link-underline text-sm font-semibold text-oro hover:text-marfil"
            >
              Ver las {products.length} piezas →
            </a>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((product, index) => (
            <li key={product.id}>
              <Reveal delay={index * 70}>
                <ProductCard
                  product={product}
                  badge={index === 0 ? "Top ventas" : undefined}
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
