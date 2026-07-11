import { useSuspenseQuery } from "@tanstack/react-query";
import { Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { settingsQuery } from "@/lib/queries";

export function Footer() {
  const { t, lang } = useI18n();
  const { data: s } = useSuspenseQuery(settingsQuery);
  if (!s) return null;
  const address = lang === "ar" ? s.address_ar : s.address_en;
  const hours = ((s.opening_hours as { ar?: string; en?: string }) ?? {})[lang];

  return (
    <footer id="contact" className="border-t border-border bg-ocean mt-24">
      <div className="mx-auto max-w-7xl grid gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <h3 className="text-xl font-bold text-gold-gradient mb-3">{t("brand")}</h3>
          <p className="text-sm text-muted-foreground">{t("tagline")}</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gold">{t("contact")}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href={`tel:${s.phone}`} className="flex items-center gap-2 hover:text-gold"><Phone className="h-4 w-4"/>{s.phone}</a></li>
            <li><a href={`https://wa.me/${s.whatsapp.replace(/\D/g,"")}`} className="flex items-center gap-2 hover:text-gold"><MessageCircle className="h-4 w-4"/>{t("whatsapp")}: {s.whatsapp}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gold">{t("location")}</h4>
          <p className="flex items-start gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 mt-0.5 shrink-0"/>{address}</p>
          <a href={s.maps_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-gold hover:underline">{t("open_map")} →</a>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gold">{t("open_map") /* dummy */}</h4>
          <p className="flex items-start gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4 mt-0.5 shrink-0"/>{hours}</p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {t("brand")} — {t("powered_by")}
      </div>
    </footer>
  );
}