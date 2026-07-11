import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Trash2, ShoppingBag } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useI18n } from "@/lib/i18n";
import { useCart, calcLineTotal, formatMoney } from "@/lib/cart";
import { settingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/cart")({
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  head: () => ({ meta: [{ title: "Cart | Abu Naji Seafood" }] }),
  component: CartPage,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
});

function CartPage() {
  const { t, lang } = useI18n();
  const { items, update, remove, subtotal } = useCart();
  const { data: s } = useSuspenseQuery(settingsQuery);
  const cur = t("currency");
  const deliveryFee = Number(s?.delivery_fee ?? 0);
  const total = subtotal + (items.length ? deliveryFee : 0);

  if (!items.length) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gold/40" />
          <h1 className="mt-6 text-2xl font-bold">{t("cart_empty")}</h1>
          <Link to="/shop" className="mt-6 inline-block gold-gradient rounded-full px-6 py-3 text-sm font-bold text-gold-foreground">{t("cart_continue")}</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">{t("nav_cart")}</h1>
          {items.map((i) => {
            const name = lang === "ar" ? i.nameAr : i.nameEn;
            return (
              <div key={i.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ocean">
                  {i.imageUrl && <img src={i.imageUrl} alt={name} className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate font-semibold">{name}</h3>
                    <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4"/></button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {i.cookingMethod && `${t(`cm_${i.cookingMethod}` as never)} · `}
                    {i.weightKg && `${i.weightKg} ${t("kg")} · `}
                    {i.extras.length > 0 && i.extras.map(e => t(`extra_${e}` as never)).join(", ")}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border p-1">
                      <button onClick={() => update(i.id, { quantity: Math.max(1, i.quantity - 1) })} className="h-7 w-7 rounded-full hover:bg-surface">−</button>
                      <span className="w-6 text-center text-sm">{i.quantity}</span>
                      <button onClick={() => update(i.id, { quantity: i.quantity + 1 })} className="h-7 w-7 rounded-full hover:bg-surface">+</button>
                    </div>
                    <span className="font-bold text-gold">
                      {i.isMarketPrice ? t("market_price") : formatMoney(calcLineTotal(i), cur)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 space-y-3">
          <div className="flex justify-between text-sm"><span>{t("subtotal")}</span><span>{formatMoney(subtotal, cur)}</span></div>
          <div className="flex justify-between text-sm"><span>{t("delivery_fee")}</span><span>{formatMoney(deliveryFee, cur)}</span></div>
          <div className="border-t border-border pt-3 flex justify-between text-lg font-bold"><span>{t("total")}</span><span className="text-gold">{formatMoney(total, cur)}</span></div>
          <Link to="/checkout" className="mt-2 block gold-gradient rounded-full py-3 text-center text-sm font-bold text-gold-foreground">{t("checkout")}</Link>
        </aside>
      </div>
      <Footer />
    </div>
  );
}