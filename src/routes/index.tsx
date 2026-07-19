import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Fish, Phone, MapPin, MessageCircle, Waves } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Wordmark } from "@/components/layout/Wordmark";
import { MarqueeText } from "@/components/ui/MarqueeText";
import { categoriesQuery, productsQuery, settingsQuery } from "@/lib/queries";
import type { Tables } from "@/integrations/supabase/types";
import logoUrl from "@/assets/logo.png";
import watermarkUrl from "@/assets/brand-watermark.png";
import heroImg from "@/assets/hero-ocean.jpg";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(productsQuery),
      context.queryClient.ensureQueryData(settingsQuery),
    ]);
  },
  component: Home,
  errorComponent: ({ error }) => <div className="p-8 text-center text-destructive">{error.message}</div>,
});

function formatPrice(p: Tables<"products">) {
  if (p.is_market_price) return "سعر اليوم";
  if (p.price_per_kg) return `${Number(p.price_per_kg).toLocaleString("ar-EG")} ج/كجم`;
  if (p.price) return `${Number(p.price).toLocaleString("ar-EG")} جنيه`;
  return "";
}

function Home() {
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: settings } = useSuspenseQuery(settingsQuery);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <img src={heroImg} alt="" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean/40 via-ocean/80 to-background" />
        <img
          src={watermarkUrl}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 w-[145vw] max-w-none -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.10] md:w-[105vw] lg:w-[90rem]"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:py-28 md:items-center">
          <div className="text-center md:text-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
              <Waves className="h-3.5 w-3.5" /> من البحر إلى مائدتك
            </span>
            <h1 className="mt-6 flex justify-center md:justify-start">
              <Wordmark className="h-36 md:h-52" />
              <span className="sr-only">أسماك أبو ناجي</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground md:text-xl">
              أطيب المأكولات البحرية الطازجة — تصفح قائمتنا واختر ما يحلو لك.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              {settings && (
                <a href={`tel:${settings.phone}`} className="gold-gradient inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-gold-foreground shadow-lg transition-transform hover:scale-105">
                  <Phone className="h-4 w-4" /> اتصل بنا
                </a>
              )}
              {settings && (
                <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g,"")}`} className="inline-flex items-center gap-2 rounded-full border border-gold/60 bg-surface px-6 py-3.5 text-sm font-semibold text-gold hover:bg-gold/10">
                  <MessageCircle className="h-4 w-4" /> واتساب
                </a>
              )}
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <img src={logoUrl} alt="أسماك أبو ناجي" className="relative h-full w-full object-contain drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* CATEGORY CIRCLES — horizontal scroll on mobile */}
      <section className="mx-auto max-w-7xl px-4 py-10" id="menu">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">الأقسام</p>
          <h2 className="mt-1 text-3xl font-bold md:text-4xl">تصفح القائمة</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 md:justify-center md:flex-wrap md:overflow-visible snap-x snap-mandatory scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => scrollTo(`cat-${c.id}`)}
              className="group flex shrink-0 snap-start flex-col items-center gap-2 focus:outline-none"
            >
              <div className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-full border-2 border-gold/40 bg-gradient-to-br from-ocean to-surface ring-4 ring-transparent transition-all group-hover:border-gold group-hover:ring-gold/20 md:h-28 md:w-28">
                {c.image_url ? (
                  <img src={c.image_url} alt={c.name_ar} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                ) : (
                  <Fish className="h-10 w-10 text-gold transition-transform group-hover:scale-110" />
                )}
              </div>
              <span className="text-xs font-semibold md:text-sm">{c.name_ar}</span>
            </button>
          ))}
        </div>
      </section>

      {/* MENU BY CATEGORY */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        {categories.map((c) => {
          const items = products.filter((p) => p.category_id === c.id);
          if (!items.length) return null;
          return (
            <div key={c.id} id={`cat-${c.id}`} className="scroll-mt-24 py-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-l from-gold/60 to-transparent" />
                <h3 className="break-words text-center text-2xl font-bold text-gold-gradient md:text-3xl">{c.name_ar}</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-gold/60 to-transparent" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <Link
                    key={p.id}
                    to="/product/$id"
                    params={{ id: p.id }}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:border-gold/60 hover:scale-[1.01]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-ocean/50">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name_ar} loading="lazy" className="h-full w-full object-cover" />
                        ) : (
                          <Fish className="h-6 w-6 text-gold/50" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold leading-tight">
                          <MarqueeText className="max-w-full text-base" speed={20}>
                            {p.name_ar}
                          </MarqueeText>
                        </h4>
                        {p.description_ar && (
                          <p className="line-clamp-1 text-xs text-muted-foreground">{p.description_ar}</p>
                        )}
                        {!p.available && <span className="text-[10px] text-destructive">غير متاح</span>}
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-gold">{formatPrice(p)}</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* LOCATION + CTA */}
      {settings && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-6 rounded-3xl border border-gold/30 bg-gradient-to-br from-surface to-card p-8 md:grid-cols-2 md:p-12">
            <div className="flex items-start gap-3">
              <MapPin className="h-6 w-6 shrink-0 text-gold" />
              <div>
                <h3 className="font-semibold">موقعنا</h3>
                <p className="mt-1 text-sm text-muted-foreground">{settings.address_ar}</p>
                <a href={settings.maps_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-gold hover:underline">افتح الخريطة ←</a>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <a href={`tel:${settings.phone}`} className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-bold text-gold-foreground hover:opacity-90">
                <Phone className="h-4 w-4" /> {settings.phone}
              </a>
              <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g,"")}`} className="inline-flex items-center gap-2 rounded-full border border-gold px-4 py-2.5 text-sm font-bold text-gold hover:bg-gold/10">
                <MessageCircle className="h-4 w-4" /> واتساب
              </a>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}


