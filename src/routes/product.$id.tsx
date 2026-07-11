import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Fish, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useI18n, pickLocalized } from "@/lib/i18n";
import { productByIdQuery } from "@/lib/queries";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/product/$id")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(productByIdQuery(params.id)),
  component: ProductPage,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-8 text-center">Product not found</div>,
});

const COOKING = ["fried", "grilled", "oven", "clean"] as const;
const EXTRAS = ["rice", "tahini", "salad", "bread"] as const;

function ProductPage() {
  const { id } = Route.useParams();
  const { t, lang } = useI18n();
  const { data: p } = useSuspenseQuery(productByIdQuery(id));
  const { add } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [weight, setWeight] = useState<number>(1);
  const [method, setMethod] = useState<string>("grilled");
  const [extras, setExtras] = useState<string[]>([]);

  if (!p) return null;
  const name = pickLocalized(p, "name", lang);
  const desc = pickLocalized(p, "description", lang);
  const perKg = !!p.price_per_kg;
  const unitPrice = Number(p.price_per_kg ?? p.price ?? 0);

  function toggleExtra(x: string) {
    setExtras((prev) => (prev.includes(x) ? prev.filter((y) => y !== x) : [...prev, x]));
  }

  function handleAdd() {
    add({
      productId: p!.id,
      nameAr: p!.name_ar, nameEn: p!.name_en,
      imageUrl: p!.image_url,
      unitPrice,
      quantity: qty,
      weightKg: perKg ? weight : null,
      cookingMethod: method,
      extras,
      isMarketPrice: p!.is_market_price,
    });
    toast.success(t("add_to_cart") + " ✓");
    navigate({ to: "/cart" });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-3xl border border-border bg-card">
          {p.image_url ? (
            <img src={p.image_url} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-gold/30"><Fish className="h-32 w-32"/></div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">{name}</h1>
            <p className="mt-2 text-2xl font-bold text-gold">
              {p.is_market_price ? t("market_price") : perKg
                ? `${Number(p.price_per_kg).toLocaleString()} ${t("currency")}/${t("kg")}`
                : `${Number(p.price).toLocaleString()} ${t("currency")}`}
            </p>
            {desc && <p className="mt-4 text-muted-foreground">{desc}</p>}
          </div>

          {perKg && (
            <div>
              <label className="mb-2 block text-sm font-semibold">{t("weight_kg")}</label>
              <div className="flex items-center gap-2">
                {[0.5, 1, 1.5, 2, 3].map((w) => (
                  <button key={w} onClick={() => setWeight(w)}
                    className={`rounded-full border px-4 py-2 text-sm ${weight === w ? "border-gold bg-gold text-gold-foreground" : "border-border bg-card"}`}>
                    {w} {t("kg")}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold">{t("cooking_method")}</label>
            <div className="flex flex-wrap gap-2">
              {COOKING.map((c) => (
                <button key={c} onClick={() => setMethod(c)}
                  className={`rounded-full border px-4 py-2 text-sm ${method === c ? "border-gold bg-gold text-gold-foreground" : "border-border bg-card"}`}>
                  {t(`cm_${c}` as const)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">{t("extras")}</label>
            <div className="flex flex-wrap gap-2">
              {EXTRAS.map((x) => (
                <button key={x} onClick={() => toggleExtra(x)}
                  className={`rounded-full border px-4 py-2 text-sm ${extras.includes(x) ? "border-gold bg-gold text-gold-foreground" : "border-border bg-card"}`}>
                  {t(`extra_${x}` as const)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">{t("quantity")}</label>
            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-9 w-9 rounded-full hover:bg-surface"><Minus className="mx-auto h-4 w-4"/></button>
              <span className="w-10 text-center font-bold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="h-9 w-9 rounded-full hover:bg-surface"><Plus className="mx-auto h-4 w-4"/></button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!p.available}
            className="gold-gradient inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold text-gold-foreground shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag className="h-5 w-5"/> {p.available ? t("add_to_cart") : t("unavailable")}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}