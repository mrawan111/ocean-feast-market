import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  id: string;
  productId: string;
  nameAr: string;
  nameEn: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  weightKg: number | null;
  cookingMethod: string | null;
  extras: string[];
  isMarketPrice: boolean;
}

interface CartCtx {
  items: CartItem[];
  add: (i: Omit<CartItem, "id">) => void;
  update: (id: string, patch: Partial<CartItem>) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "abunaji_cart_v1";

function lineTotal(i: CartItem): number {
  const base = i.weightKg ? i.unitPrice * i.weightKg : i.unitPrice;
  return base * i.quantity;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const value = useMemo<CartCtx>(() => ({
    items,
    add: (i) => setItems((prev) => [...prev, { ...i, id: crypto.randomUUID() }]),
    update: (id, patch) => setItems((p) => p.map((it) => (it.id === id ? { ...it, ...patch } : it))),
    remove: (id) => setItems((p) => p.filter((it) => it.id !== id)),
    clear: () => setItems([]),
    count: items.reduce((s, i) => s + i.quantity, 0),
    subtotal: items.reduce((s, i) => s + lineTotal(i), 0),
  }), [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be inside CartProvider");
  return v;
}

export function calcLineTotal(i: CartItem) { return lineTotal(i); }

export function formatMoney(n: number, currency: string) {
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency}`;
}