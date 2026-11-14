// ============================================================
// CARRITO
// ------------------------------------------------------------
// Tipo y helpers del carrito. El estado vive en el navegador
// (localStorage): no hay cuenta ni servidor de por medio.
// ============================================================

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export const CART_STORAGE_KEY = "jp-accesorios:carrito";

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/** Añade una pieza al carrito. Si ya existe, suma cantidad. */
export function addToCart(items: CartItem[], item: Omit<CartItem, "quantity">): CartItem[] {
  const existing = items.find((entry) => entry.id === item.id);
  if (existing) {
    return items.map((entry) =>
      entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
    );
  }
  return [...items, { ...item, quantity: 1 }];
}

/** Cambia la cantidad de una pieza. Si llega a 0, se elimina. */
export function setQuantity(
  items: CartItem[],
  id: string,
  quantity: number,
): CartItem[] {
  if (quantity <= 0) return items.filter((entry) => entry.id !== id);
  return items.map((entry) =>
    entry.id === id ? { ...entry, quantity } : entry,
  );
}
