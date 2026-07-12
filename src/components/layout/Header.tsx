import { Link } from "@tanstack/react-router";
import logoUrl from "@/assets/logo.png";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-ocean/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-3 md:h-16 md:flex-row md:gap-4 md:py-0">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <img src={logoUrl} alt="أسماك أبو ناجي" className="h-11 w-11 rounded-full object-cover ring-2 ring-gold/60" />
          <span className="truncate text-lg font-bold text-gold-gradient">أسماك أبو ناجي</span>
        </Link>
        <nav className="flex w-full items-center justify-center gap-4 text-sm md:w-auto md:justify-end md:gap-8">
          <a href="#menu" className="text-foreground/80 transition-colors hover:text-gold">القائمة</a>
          <a
            href="https://ocean-feast-market.lovable.app/admin"
            className="flex items-center transition-transform hover:scale-105"
            aria-label="الانتقال إلى صفحة الأدمن"
          >
            <img src={logoUrl} alt="الأدمن" className="h-7 w-7 rounded-full object-cover ring-1 ring-gold/50" />
          </a>
          <a href="#contact" className="text-foreground/80 transition-colors hover:text-gold">تواصل معنا</a>
        </nav>
      </div>
    </header>
  );
}
