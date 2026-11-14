"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  addToCart,
  cartCount,
  cartTotal,
  setQuantity,
  type CartItem,
} from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  open: boolean;
  add: (item: Omit<CartItem, "quantity">) => void;
  update: (id: string, quantity: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

/* ------------------------------------------------------------
 * Almacén del carrito sobre localStorage
 * ------------------------------------------------------------
 * `useSyncExternalStore` mantiene la coherencia entre servidor y
 * cliente sin(setState dentro de un efecto): el servidor siempre
 * ve un carrito vacío y el cliente recupera el suyo tras la
 * hidratación, sin desajustes de HTML.
 * ---------------------------------------------------------- */

const EMPTY: CartItem[] = [];

const listeners = new Set<() => void>();
let cache: CartItem[] = EMPTY;
let hydrated = false;

function readStorage(): CartItem[] {
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return EMPTY;
    const parsed = JSON.parse(stored) as CartItem[];
    return Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    // Carrito corrupto o almacenamiento no disponible.
    return EMPTY;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): CartItem[] {
  if (!hydrated) {
    hydrated = true;
    cache = readStorage();
  }
  return cache;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

function persist(items: CartItem[]) {
  cache = items;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Modo privado o cuota llena: el carrito sigue en memoria.
  }
  listeners.forEach((listener) => listener());
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [open, setOpen] = useState(false);

  const add = useCallback((item: Omit<CartItem, "quantity">) => {
    persist(addToCart(getSnapshot(), item));
    setOpen(true);
  }, []);

  const update = useCallback((id: string, quantity: number) => {
    persist(setQuantity(getSnapshot(), id, quantity));
  }, []);

  const clear = useCallback(() => persist([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: cartCount(items),
      total: cartTotal(items),
      open,
      add,
      update,
      clear,
      setOpen,
    }),
    [items, open, add, update, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return context;
}
