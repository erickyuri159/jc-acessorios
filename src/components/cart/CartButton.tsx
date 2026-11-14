"use client";

import { useCart } from "./CartProvider";

/**
 * Botón de carrito en la cabecera. Muestra el número de piezas y
 * abre el panel lateral.
 */
export function CartButton() {
  const { count, setOpen } = useCart();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Abrir carrito (${count} ${count === 1 ? "pieza" : "piezas"})`}
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-linea text-marfil transition-colors hover:border-oro hover:text-oro"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
        />
      </svg>
      {count > 0 ? (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-prisma px-1 text-[0.6875rem] font-bold text-noche">
          {count}
        </span>
      ) : null}
    </button>
  );
}
