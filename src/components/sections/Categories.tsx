import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { CategoryId } from "@/data/products";

type CategoriesProps = {
  categories: { id: CategoryId; title: string; tagline: string }[];
  site: { catalog: { kicker: string; title: string; intro: string } };
};

const ACCENTS = [
  "bg-rubi",
  "bg-citrino",
  "bg-esmeralda",
  "bg-zafiro",
  "bg-ametista",
];

/**
 * Filtro por categoría. Cada tarjeta lleva al catálogo ya filtrado
 * y una gema de color como marcador de acento.
 */
export function Categories({ categories, site }: CategoriesProps) {
  return (
    <section id="categorias" className="py-20 sm:py-28">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            kicker={site.catalog.kicker}
            title={site.catalog.title}
            intro={site.catalog.intro}
            align="center"
            index="01"
            accent="prisma"
          />
        </Reveal>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-sm bg-linea sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category, index) => (
            <li key={category.id}>
              <Reveal delay={index * 60}>
                <a
                  href={`/coleccion?categoria=${category.id}`}
                  className="group flex h-full flex-col justify-between gap-6 bg-noche-2 p-7 transition-colors duration-300 hover:bg-noche-3"
                >
                  <span
                    className={`h-2.5 w-2.5 rotate-45 ${ACCENTS[index % ACCENTS.length]}`}
                    aria-hidden="true"
                  />
                  <span className="font-display text-2xl text-marfil transition-colors group-hover:text-oro">
                    {category.title}
                  </span>
                  <span className="text-sm leading-relaxed text-humo">
                    {category.tagline}
                  </span>
                  <span
                    className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-prisma"
                    aria-hidden="true"
                  >
                    Ver →
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
