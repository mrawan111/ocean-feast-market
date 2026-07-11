import { Link } from "@tanstack/react-router";
import { ShoppingBag, Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import logoAsset from "@/assets/logo.jpg.asset.json";

export function Header() {
  const { t, lang, setLang } = useI18n();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-ocean/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <img src={logoAsset.url} alt={t("brand")} className="h-11 w-11 rounded-full object-cover ring-2 ring-gold/60" />
          <span className="truncate text-lg font-bold text-gold-gradient">{t("brand")}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm text-foreground/80 hover:text-gold transition-colors">{t("nav_home")}</Link>
          <Link to="/shop" className="text-sm text-foreground/80 hover:text-gold transition-colors">{t("nav_shop")}</Link>
          <a href="#contact" className="text-sm text-foreground/80 hover:text-gold transition-colors">{t("contact")}</a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground/80 hover:border-gold hover:text-gold transition-colors"
            aria-label="Toggle language"
          >
            <Globe className="h-3.5 w-3.5" />{t("lang_switch")}
          </button>
          <Link to="/cart" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface hover:bg-gold hover:text-gold-foreground transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-gold-foreground">
                {count}
              </span>
            )}
          </Link>
          <button className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface" onClick={() => setOpen(!open)} aria-label="menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-ocean px-4 py-4 flex flex-col gap-3">
          <Link to="/" onClick={() => setOpen(false)} className="text-sm">{t("nav_home")}</Link>
          <Link to="/shop" onClick={() => setOpen(false)} className="text-sm">{t("nav_shop")}</Link>
          <a href="#contact" onClick={() => setOpen(false)} className="text-sm">{t("contact")}</a>
        </div>
      )}
    </header>
  );
}