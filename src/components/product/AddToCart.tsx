"use client";

import { useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/data/products";

type AddToCartProps = {
  product: Product;
  className?: string;
  label?: string;
};

/**
 * Botón de añadir al carrito. Cliente puro: usa el contexto del
 * carrito y no necesita ningún endpoint.
 */
export function AddToCart({ product, className = "", label }: AddToCartProps) {
  const { add } = useCart();

  return (
    <button
      type="button"
      onClick={() =>
        add({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
        })
      }
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-oro/60 px-6 py-3 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-oro transition-all duration-300 hover:bg-oro hover:text-noche ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      {label ?? "Añadir"}
    </button>
  );
}
