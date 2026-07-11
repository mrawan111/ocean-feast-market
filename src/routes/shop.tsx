import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Search } from "lucide-react";
import { useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { useI18n, pickLocalized } from "@/lib/i18n";
import { categoriesQuery, productsQuery } from "@/lib/queries";

const searchSchema = z.object({
  category: fallback(z.string(), "").default(""),
  q: fallback(z.string(), "").default(""),
});
type ShopSearch = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/shop")({
  validateSearch: zodValidator(searchSchema),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(productsQuery),
    ]);
  },
  head: () => ({ meta: [{ title: "المتجر — Shop | Abu Naji Seafood" }] }),
  component: Shop,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
});

function Shop() {
  const { t, lang } = useI18n();
  const { category, q } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: products } = useSuspenseQuery(productsQuery);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category && p.category_id !== category) return false;
      if (q) {
        const needle = q.toLowerCase();
        if (!p.name_ar.toLowerCase().includes(needle) && !p.name_en.toLowerCase().includes(needle)) return false;
      }
      return true;
    });
  }, [products, category, q]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-bold md:text-4xl">{t("nav_shop")}</h1>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => navigate({ search: (prev: ShopSearch) => ({ ...prev, q: e.target.value }) })}
              placeholder={t("search_products")}
              className="w-full rounded-full border border-border bg-card ps-10 pe-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => navigate({ search: (prev: ShopSearch) => ({ ...prev, category: "" }) })}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${category === "" ? "border-gold bg-gold text-gold-foreground" : "border-border bg-card hover:border-gold"}`}
          >{t("all_categories")}</button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate({ search: (prev: ShopSearch) => ({ ...prev, category: c.id }) })}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${category === c.id ? "border-gold bg-gold text-gold-foreground" : "border-border bg-card hover:border-gold"}`}
            >{pickLocalized(c, "name", lang)}</button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
        {filtered.length === 0 && (
          <p className="mt-16 text-center text-muted-foreground">— {t("cart_empty")} —</p>
        )}
      </div>
      <Footer />
    </div>
  );
}