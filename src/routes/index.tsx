import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Fish, Star, Phone, MapPin, MessageCircle, Waves, Truck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { useI18n, pickLocalized } from "@/lib/i18n";
import { categoriesQuery, featuredProductsQuery, todaysCatchQuery, reviewsQuery, settingsQuery } from "@/lib/queries";
import logoUrl from "@/assets/logo.jpeg";
import heroImg from "@/assets/hero-ocean.jpg";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(featuredProductsQuery),
      context.queryClient.ensureQueryData(todaysCatchQuery),
      context.queryClient.ensureQueryData(reviewsQuery),
      context.queryClient.ensureQueryData(settingsQuery),
    ]);
  },
  component: Home,
  errorComponent: ({ error }) => <div className="p-8 text-center text-destructive">{error.message}</div>,
});

function Home() {
  const { t, lang } = useI18n();
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: featured } = useSuspenseQuery(featuredProductsQuery);
  const { data: todays } = useSuspenseQuery(todaysCatchQuery);
  const { data: reviews } = useSuspenseQuery(reviewsQuery);
  const { data: settings } = useSuspenseQuery(settingsQuery);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <img src={heroImg} alt="" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean/40 via-ocean/80 to-background" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:py-32 md:items-center">
          <div className="text-center md:text-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
              <Waves className="h-3.5 w-3.5" /> {t("tagline")}
            </span>
            <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">
              <span className="text-gold-gradient">{lang === "ar" ? settings?.hero_title_ar : settings?.hero_title_en}</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground md:text-xl">
              {lang === "ar" ? settings?.hero_subtitle_ar : settings?.hero_subtitle_en}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link to="/shop" className="gold-gradient rounded-full px-8 py-3.5 text-sm font-bold text-gold-foreground shadow-lg transition-transform hover:scale-105">
                {t("hero_cta")}
              </Link>
              <a href={`tel:${settings?.phone ?? ""}`} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-semibold hover:border-gold">
                <Phone className="h-4 w-4" /> {t("call_us")}
              </a>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-full bg-gold/20 blur-3xl" />
            <img src={logoUrl} alt={t("brand")} className="relative h-full w-full rounded-full object-cover ring-4 ring-gold/50 shadow-2xl" />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">{t("categories")}</p>
            <h2 className="mt-1 text-3xl font-bold md:text-4xl">{t("nav_shop")}</h2>
          </div>
          <Link to="/shop" className="text-sm text-gold hover:underline shrink-0">{t("view_details")} →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/shop"
              search={{ category: c.id }}
              className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition-all hover:border-gold hover:bg-surface"
            >
              <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-ocean/40 ring-1 ring-border">
                {c.image_url ? (
                  <img
                    src={c.image_url}
                    alt={pickLocalized(c, "name", lang)}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <Fish className="h-8 w-8 text-gold transition-transform group-hover:scale-110" />
                )}
              </div>
              <span className="text-xs font-semibold leading-tight md:text-sm">{pickLocalized(c, "name", lang)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* TODAYS CATCH */}
      {todays.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">{t("todays_catch")}</p>
            <h2 className="mt-1 text-3xl font-bold md:text-4xl">{t("market_price")}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {todays.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">{t("featured")}</p>
            <h2 className="mt-1 text-3xl font-bold md:text-4xl">{t("featured")}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

      {/* REVIEWS */}
      {reviews.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">{t("reviews")}</p>
            <h2 className="mt-1 text-3xl font-bold md:text-4xl">{t("reviews")}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-3 flex gap-0.5 text-gold">
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-sm text-muted-foreground italic">"{lang === "ar" ? r.comment_ar : r.comment_en}"</p>
                <p className="mt-4 text-sm font-semibold">{r.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LOCATION + CTA */}
      {settings && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-6 rounded-3xl border border-gold/30 bg-gradient-to-br from-surface to-card p-8 md:grid-cols-3 md:p-12">
            <div className="flex items-start gap-3">
              <MapPin className="h-6 w-6 shrink-0 text-gold" />
              <div>
                <h3 className="font-semibold">{t("location")}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{lang === "ar" ? settings.address_ar : settings.address_en}</p>
                <a href={settings.maps_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-gold hover:underline">{t("open_map")} →</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="h-6 w-6 shrink-0 text-gold" />
              <div>
                <h3 className="font-semibold">{t("delivery_fee")}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{Number(settings.delivery_fee).toLocaleString()} {t("currency")}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <a href={`tel:${settings.phone}`} className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-bold text-gold-foreground hover:opacity-90">
                <Phone className="h-4 w-4" /> {settings.phone}
              </a>
              <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g,"")}`} className="inline-flex items-center gap-2 rounded-full border border-gold px-4 py-2.5 text-sm font-bold text-gold hover:bg-gold/10">
                <MessageCircle className="h-4 w-4" /> {t("whatsapp")}
              </a>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
