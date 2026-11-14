"use client";

import { useEffect, useRef, useState } from "react";
import { PieceImage } from "@/components/ui/PieceImage";
import { useCart } from "./CartProvider";
import type { BusinessConfig } from "@/lib/content";
import { shippingCost, shippingOptions, type ShippingZone } from "@/lib/shipping";
import { formatEuros, waLink, waOrderMessage } from "@/lib/whatsapp";

type CartDrawerProps = {
  business: BusinessConfig;
};

/**
 * Panel lateral del carrito. El checkout es deliberadamente
 * humano: el pedido se manda por WhatsApp y la tienda confirma
 * disponibilidad y envía el enlace de Bizum.
 */
export function CartDrawer({ business }: CartDrawerProps) {
  const { items, total, open, setOpen, update, clear } = useCart();
  const [zone, setZone] = useState<ShippingZone>("pickup");
  const closeRef = useRef<HTMLButtonElement>(null);

  const options = shippingOptions(business.shipping);
  const selected = options.find((option) => option.id === zone) ?? options[0];
  const shipping = shippingCost(selected, total, business.shipping);
  const grandTotal = total + shipping;

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  if (!open) return null;

  const orderMessage = waOrderMessage(
    items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    { shipping: selected.label },
  );

  const remaining = business.shipping.freeShippingFrom - total;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compra"
    >
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-noche/80 backdrop-blur-sm"
      />

      <div className="relative flex h-full w-full max-w-md flex-col border-l border-linea bg-noche-2 shadow-2xl">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-prisma opacity-15 blur-[80px]"
          aria-hidden="true"
        />

        <div className="relative flex items-center justify-between border-b border-linea px-6 py-5">
          <div>
            <p className="kicker">Tu selección</p>
            <h2 className="font-display mt-1 text-3xl text-marfil">La cesta</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar carrito"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-linea text-marfil transition-colors hover:border-oro hover:text-oro"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <span
              className="grid h-16 w-16 place-items-center rotate-45 border border-oro/40 bg-oro/10"
              aria-hidden="true"
            >
              <span className="-rotate-45 font-poster text-xl text-oro">JP</span>
            </span>
            <p className="font-display text-2xl text-marfil">
              Todavía no hay piezas
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-humo">
              Elige una pieza y Pruébatela en el probador antes de decidir.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-outline"
            >
              Ver la colección
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-linea overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-5">
                  <div className="piece-frame relative h-20 w-20 shrink-0 overflow-hidden rounded-sm">
                    <PieceImage
                      src={item.image}
                      alt=""
                      className="object-contain p-1"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <p className="font-display text-lg leading-tight text-marfil">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm text-oro">
                        {formatEuros(item.price)}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-linea">
                        <button
                          type="button"
                          onClick={() => update(item.id, item.quantity - 1)}
                          aria-label={`Quitar una unidad de ${item.name}`}
                          className="flex h-8 w-8 items-center justify-center text-marfil transition-colors hover:text-oro"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums text-marfil">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => update(item.id, item.quantity + 1)}
                          aria-label={`Añadir una unidad de ${item.name}`}
                          className="flex h-8 w-8 items-center justify-center text-marfil transition-colors hover:text-oro"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-marfil tabular-nums">
                        {formatEuros(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-linea bg-noche/60 px-6 py-5">
              <fieldset className="mb-5">
                <legend className="label mb-3 text-oro">Forma de envío</legend>
                <div className="space-y-2">
                  {options.map((option) => {
                    const cost = shippingCost(option, total, business.shipping);
                    const id = `envio-${option.id}`;
                    return (
                      <label
                        key={option.id}
                        htmlFor={id}
                        className="flex cursor-pointer items-center gap-3 rounded-sm border border-linea bg-noche/50 px-3 py-2.5 transition-colors has-[:checked]:border-oro has-[:checked]:bg-oro/10"
                      >
                        <input
                          id={id}
                          type="radio"
                          name="envio"
                          value={option.id}
                          checked={zone === option.id}
                          onChange={() => setZone(option.id)}
                          className="h-4 w-4 accent-[#e7be6a]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-marfil">
                            {option.label}
                          </span>
                          <span className="block text-xs text-humo-2">
                            {option.days}
                          </span>
                        </span>
                        <span className="text-sm font-semibold text-oro tabular-nums">
                          {cost === 0 ? "Gratis" : formatEuros(cost)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between text-humo">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums">{formatEuros(total)}</dd>
                </div>
                <div className="flex justify-between text-humo">
                  <dt>Envío</dt>
                  <dd className="tabular-nums">
                    {shipping === 0 ? "Gratis" : formatEuros(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-linea pt-3 text-base font-bold text-marfil">
                  <dt>Total</dt>
                  <dd className="tabular-nums text-oro">
                    {formatEuros(grandTotal)}
                  </dd>
                </div>
              </dl>

              {remaining > 0 ? (
                <p className="mt-3 rounded-sm border border-linea bg-noche px-3 py-2 text-xs text-humo">
                  Te faltan {formatEuros(remaining)} para el envío gratuito.
                </p>
              ) : (
                <p className="mt-3 rounded-sm border border-esmeralda/30 bg-esmeralda/10 px-3 py-2 text-xs text-esmeralda">
                  Envío gratuito aplicado.
                </p>
              )}

              <a
                href={waLink(business.whatsappNumber, orderMessage)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => clear()}
                className="btn-primary mt-5 w-full"
              >
                Pedir por WhatsApp
              </a>

              {business.payments.bizumEnabled ? (
                business.payments.bizumPaymentLink ? (
                  <a
                    href={business.payments.bizumPaymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline mt-3 w-full"
                  >
                    Pagar con Bizum
                  </a>
                ) : (
                  <a
                    href={waLink(
                      business.whatsappNumber,
                      `Hola JP Accesorios, quiero pagar con Bizum el pedido de ${formatEuros(
                        grandTotal,
                      )} (${selected.label}).`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline mt-3 w-full"
                  >
                    Pagar con Bizum
                  </a>
                )
              ) : null}

              <p className="mt-4 text-xs leading-relaxed text-humo-2">
                Confirmas el pedido por WhatsApp. La tienda comprueba la
                disponibilidad y te envía el enlace de pago por Bizum.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
