import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Fish, Phone, MessageCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarqueeText } from "@/components/ui/MarqueeText";
import { productsQuery, settingsQuery, categoriesQuery } from "@/lib/queries";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productsQuery),
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(settingsQuery),
    ]);
  },
  component: ProductPage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-destructive">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gold">المنتج غير موجود</h1>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 text-gold hover:underline">
          <ArrowRight className="h-4 w-4" /> العودة للقائمة
        </Link>
      </div>
      <Footer />
    </div>
  ),
});

function formatPrice(p: Tables<"products">) {
  if (p.is_market_price) return "سعر اليوم";
  if (p.price_per_kg) return `${Number(p.price_per_kg).toLocaleString("ar-EG")} ج/كجم`;
  if (p.price) return `${Number(p.price).toLocaleString("ar-EG")} جنيه`;
  return "";
}

function ProductPage() {
  const { id } = Route.useParams();
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const product = products.find((p) => p.id === id);
  if (!product) throw notFound();
  const category = categories.find((c) => c.id === product.category_id);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold">
          <ArrowRight className="h-4 w-4" /> العودة للقائمة
        </Link>

        <div className="grid gap-8 rounded-3xl border border-gold/30 bg-gradient-to-br from-surface to-card p-6 md:grid-cols-2 md:p-10">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-ocean/60 ring-1 ring-gold/30">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name_ar} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center">
                <Fish className="h-24 w-24 text-gold/40" />
              </div>
            )}
            {!product.available && (
              <span className="absolute top-4 right-4 rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">
                غير متاح حالياً
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-col">
            {category && (
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                {category.name_ar}
              </span>
            )}
            <h1 className="mt-2 max-w-full text-3xl font-black leading-tight text-gold md:text-4xl">
              <MarqueeText speed={18}>{product.name_ar}</MarqueeText>
            </h1>

            <div className="mt-5 inline-flex w-fit items-baseline gap-2 rounded-2xl border border-gold/40 bg-ocean/40 px-5 py-3">
              <span className="text-2xl font-black text-gold md:text-3xl">{formatPrice(product)}</span>
            </div>

            {product.description_ar && (
              <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-foreground/85">
                {product.description_ar}
              </p>
            )}

            {settings && (
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`tel:${settings.phone}`}
                  className="gold-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-gold-foreground shadow-lg transition-transform hover:scale-105"
                >
                  <Phone className="h-4 w-4" /> اطلب الآن
                </a>
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`مرحبا، أريد الاستفسار عن: ${product.name_ar}`)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-gold/60 bg-surface px-6 py-3 text-sm font-semibold text-gold hover:bg-gold/10"
                >
                  <MessageCircle className="h-4 w-4" /> واتساب
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}