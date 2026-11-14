import { AddToCart } from "./AddToCart";
import { PieceImage } from "@/components/ui/PieceImage";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";

type ProductCardProps = {
  product: Product;
  /** Etiqueta superior (p. ej. «Novedad» o «Recomendado para ti»). */
  badge?: string;
  compact?: boolean;
};

function getPromoBadge(product: Product) {
  if (product.compareAtPrice && product.compareAtPrice > product.price) {
    const discount = Math.round(
      ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
    );
    if (discount > 0) {
      return { text: `OFERTA -${discount}%`, className: "tag tag--sale" };
    }
  }
  if (product.stock === "low-stock") {
    return { text: "ÚLTIMAS UNIDADES", className: "tag tag--low" };
  }
  return null;
}

/**
 * Tarjeta de producto: pieza sobre fondo de gema, nombre, precio y
 * acción de compra. El enlace cubre la imagen y el nombre.
 */
export function ProductCard({ product, badge, compact = false }: ProductCardProps) {
  const promo = getPromoBadge(product);
  const displayBadge = promo ?? (badge ? { text: badge, className: "tag" } : null);

  return (
    <article className="group flex flex-col">
      <div className="relative">
        <a
          href={`/producto/${product.slug}`}
          className="piece-frame block overflow-hidden rounded-sm"
          aria-label={`Ver ${product.name}`}
        >
          <div
            className={`relative ${compact ? "aspect-square" : "aspect-[4/5]"}`}
          >
            <div
              className="absolute inset-0 bg-prisma opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20"
              aria-hidden="true"
            />
            <PieceImage
              src={product.image}
              alt={product.name}
              className="relative object-contain p-6 transition-transform duration-700 ease-editorial group-hover:scale-[1.06]"
            />
          </div>
        </a>

        {displayBadge ? (
          <span className={`${displayBadge.className} absolute top-3 left-3`}>
            {displayBadge.text}
          </span>
        ) : null}

        {product.arImage ? (
          <a
            href={`/provador?pieza=${product.slug}`}
            className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full border border-oro/40 bg-noche/90 px-3 py-1.5 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-oro backdrop-blur transition-colors hover:bg-oro hover:text-noche"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 7.5h16.5v10.5H3.75zM8.25 7.5l1.5-2.5h4.5l1.5 2.5"
              />
            </svg>
            Probar
          </a>
        ) : null}
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-humo-2">
          {product.category}
        </p>
        <h3 className="font-display mt-1 text-xl leading-tight text-marfil">
          <a href={`/producto/${product.slug}`} className="transition-colors hover:text-oro">
            {product.name}
          </a>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-humo">
          {product.shortDescription}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3 pt-1">
          <p className="flex items-baseline gap-2">
            <span className="font-display text-lg text-oro tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice ? (
              <span className="text-sm text-humo-2 line-through tabular-nums">
                {formatPrice(product.compareAtPrice)}
              </span>
            ) : null}
          </p>
          <AddToCart product={product} />
        </div>
      </div>
    </article>
  );
}
