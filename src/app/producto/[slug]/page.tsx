import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/product/AddToCart";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductImageZoom } from "@/components/product/ProductImageZoom";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getSiteContent } from "@/lib/content";
import { breadcrumbSchema, productSchema } from "@/lib/schema";
import { formatEuros, waLink, waProductMessage } from "@/lib/whatsapp";

export const revalidate = 60;

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { products } = await getSiteContent();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { products } = await getSiteContent();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return { title: "Pieza no encontrada" };
  }

  return {
    title: product.name,
    description: product.shortDescription || product.description,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      title: `${product.name} · JP Accesorios`,
      description: product.shortDescription,
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

const STOCK_LABEL: Record<string, string> = {
  "in-stock": "Disponible",
  "low-stock": "Últimas unidades",
  "made-to-order": "Bajo pedido (48 h)",
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const { business, products } = await getSiteContent();
  const product = products.find((item) => item.slug === slug);

  if (!product) notFound();

  const related = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4);
  const fallbackRelated =
    related.length > 0
      ? related
      : products.filter((item) => item.id !== product.id).slice(0, 4);

  const breadcrumbs = [
    { name: "Inicio", href: "/" },
    { name: "Colección", href: "/coleccion" },
    { name: product.name, href: `/producto/${product.slug}` },
  ];

  return (
    <div className="relative py-12 sm:py-20">
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-96 w-[50rem] -translate-x-1/2 rounded-full bg-oro opacity-[0.08] blur-[120px]"
        aria-hidden="true"
      />
      <div className="container-site relative">
        <nav aria-label="Migas de pan" className="text-xs text-humo">
          <ol className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                <Link href={crumb.href} className="hover:text-oro">
                  {crumb.name}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="piece-frame gem-cut">
              <ProductImageZoom
                src={product.image}
                alt={product.name}
                priority
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-humo">
                {product.category}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <h1 className="font-display text-[2.5rem] leading-[1.05] text-marfil sm:text-4xl">
                  {product.name}
                </h1>
                {product.compareAtPrice && product.compareAtPrice > product.price ? (
                  <span className="tag tag--sale">
                    OFERTA -
                    {Math.round(
                      ((product.compareAtPrice - product.price) /
                        product.compareAtPrice) *
                        100,
                    )}
                    %
                  </span>
                ) : null}
                {product.stock === "low-stock" ? (
                  <span className="tag tag--low">ÚLTIMAS UNIDADES</span>
                ) : null}
              </div>
              <p className="mt-4 text-lg leading-relaxed text-humo">
                {product.shortDescription}
              </p>
            </Reveal>

            <Reveal delay={80}>
              <div className="mt-7 flex items-baseline gap-3">
                <span className="font-display text-3xl text-marfil tabular-nums">
                  {formatEuros(product.price)}
                </span>
                {product.compareAtPrice ? (
                  <span className="text-lg text-humo line-through tabular-nums">
                    {formatEuros(product.compareAtPrice)}
                  </span>
                ) : null}
                <span className="tag ml-2">{STOCK_LABEL[product.stock]}</span>
              </div>
              <p className="mt-2 text-xs text-humo">
                IVA incluido. Envío calculated al confirmar el pedido.
              </p>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-8 flex flex-wrap gap-3">
                <AddToCart product={product} className="px-8 py-3.5" />
                {product.arImage ? (
                  <Link
                    href={`/provador?pieza=${product.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-oro px-8 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-oro transition-colors hover:bg-oro hover:text-noche"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 7.5h16.5v10.5H3.75zM8.25 7.5l1.5-2.5h4.5l1.5 2.5"
                      />
                    </svg>
                    Probar en cámara
                  </Link>
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={200}>
              <a
                href={waLink(
                  business.whatsappNumber,
                  waProductMessage(product.name),
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline mt-6 inline-block text-sm font-semibold text-marfil hover:text-oro"
              >
                ¿Tienes dudas? Pregunta por WhatsApp
              </a>
            </Reveal>

            <Reveal delay={260}>
              <dl className="mt-10 divide-y divide-linea border-y border-linea text-sm">
                <div className="py-5">
                  <dt className="label text-oro">
                    Descripción
                  </dt>
                  <dd className="mt-2 leading-relaxed text-marfil">
                    {product.description}
                  </dd>
                </div>
                {product.materials ? (
                  <div className="py-5">
                    <dt className="label text-oro">
                      Materiales
                    </dt>
                    <dd className="mt-2 text-marfil">{product.materials}</dd>
                  </div>
                ) : null}
                <div className="py-5">
                  <dt className="label text-oro">
                    Envíos y devolución
                  </dt>
                  <dd className="mt-2 leading-relaxed text-marfil">
                    Recogida en Mislata sin coste. Entrega a domicilio en 24 h en
                    Mislata y Valencia. Envío a toda España y a la Unión Europea
                    en {business.shipping.spainDeliveryDays}–
                    {business.shipping.europeDeliveryDays} días laborables. Cambio
                    de talla o devolución durante los 14 días siguientes a la
                    entrega (ver condiciones de venta).
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>

        {fallbackRelated.length > 0 ? (
          <section className="mt-24">
            <Reveal>
              <SectionHeading
                kicker="También te puede gustar"
                title="Con esta pieza"
                className="max-w-xl"
              />
            </Reveal>
            <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {fallbackRelated.map((item, index) => (
                <li key={item.id}>
                  <Reveal delay={index * 70}>
                    <ProductCard product={item} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            productSchema(product),
            breadcrumbSchema(breadcrumbs),
          ]),
        }}
      />
    </div>
  );
}
