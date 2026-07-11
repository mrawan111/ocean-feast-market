import { Link } from "@tanstack/react-router";
import { Fish } from "lucide-react";
import { useState } from "react";
import { useI18n, pickLocalized } from "@/lib/i18n";
import type { Tables } from "@/integrations/supabase/types";

export function ProductCard({ p }: { p: Tables<"products"> }) {
  const { t, lang } = useI18n();
  const [imageFailed, setImageFailed] = useState(false);
  const name = pickLocalized(p, "name", lang);
  const price = p.is_market_price
    ? t("market_price")
    : p.price_per_kg
      ? `${Number(p.price_per_kg).toLocaleString()} ${t("currency")}/${t("kg")}`
      : p.price
        ? `${Number(p.price).toLocaleString()} ${t("currency")}`
        : "";

  return (
    <Link
      to="/product/$id"
      params={{ id: p.id }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-gold hover:shadow-[0_10px_40px_-15px_oklch(0.78_0.14_82/0.35)]"
    >
      <div className="aspect-[4/3] overflow-hidden bg-ocean">
        {p.image_url && !imageFailed ? (
          <img
            src={p.image_url}
            alt={name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gold/30">
            <Fish className="h-16 w-16" />
          </div>
        )}
        {!p.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-sm font-semibold text-gold">
            {t("unavailable")}
          </div>
        )}
        {p.featured && p.available && (
          <span className="absolute top-3 start-3 rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold text-gold-foreground">★</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-base font-semibold">{name}</h3>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-bold text-gold">{price}</span>
          <span className="text-xs text-muted-foreground group-hover:text-gold">{t("view_details")} →</span>
        </div>
      </div>
    </Link>
  );
}
