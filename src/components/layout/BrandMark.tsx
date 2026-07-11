import { Fish } from "lucide-react";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`grid place-items-center rounded-full bg-gradient-to-br from-gold via-amber-300 to-ocean text-gold-foreground shadow-lg ${className}`}
      aria-hidden="true"
    >
      <Fish className="h-[62%] w-[62%]" />
    </div>
  );
}
