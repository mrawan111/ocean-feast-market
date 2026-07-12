import { Link } from "@tanstack/react-router";
import logoUrl from "@/assets/logo.jpeg";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-ocean/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <img src={logoUrl} alt="أسماك أبو ناجي" className="h-11 w-11 rounded-full object-cover ring-2 ring-gold/60" />
          <span className="truncate text-lg font-bold text-gold-gradient">أسماك أبو ناجي</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#menu" className="text-sm text-foreground/80 transition-colors hover:text-gold">القائمة</a>
          <a
            href="https://ocean-feast-market.lovable.app/admin"
            className="flex items-center transition-transform hover:scale-105"
            aria-label="الانتقال إلى صفحة الأدمن"
          >
            <img src={logoUrl} alt="الأدمن" className="h-7 w-7 rounded-full object-cover ring-1 ring-gold/50" />
          </a>
          <a href="#contact" className="text-sm text-foreground/80 hover:text-gold transition-colors">تواصل معنا</a>
        </nav>
      </div>
    </header>
  );
}
