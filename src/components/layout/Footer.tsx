import { useSuspenseQuery } from "@tanstack/react-query";
import { Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { settingsQuery } from "@/lib/queries";
import { Wordmark } from "./Wordmark";

export function Footer() {
  const { data: s } = useSuspenseQuery(settingsQuery);
  if (!s) return null;
  const hours = ((s.opening_hours as { ar?: string; en?: string }) ?? {}).ar ?? "";

  return (
    <footer id="contact" className="border-t border-border bg-ocean mt-20">
      <div className="mx-auto max-w-7xl grid gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <Wordmark className="h-20 md:h-24 mb-3" />
          <p className="text-sm text-muted-foreground">من البحر إلى مائدتك</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gold">تواصل معنا</h4>
          <ul className="space-y-2 text-sm">
            <li><a href={`tel:${s.phone}`} className="flex items-center gap-2 hover:text-gold"><Phone className="h-4 w-4"/>{s.phone}</a></li>
            <li><a href={`https://wa.me/${s.whatsapp.replace(/\D/g,"")}`} className="flex items-center gap-2 hover:text-gold"><MessageCircle className="h-4 w-4"/>واتساب: {s.whatsapp}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gold">موقعنا</h4>
          <p className="flex items-start gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 mt-0.5 shrink-0"/>{s.address_ar}</p>
          <a href={s.maps_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-gold hover:underline">افتح الخريطة ←</a>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gold">مواعيد العمل</h4>
          <p className="flex items-start gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4 mt-0.5 shrink-0"/>{hours}</p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} أسماك أبو ناجي — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}