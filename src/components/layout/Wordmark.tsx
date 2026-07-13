import wordmark from "@/assets/brand-wordmark.png.asset.json";

export function Wordmark({ className = "h-10 md:h-12" }: { className?: string }) {
  return (
    <img
      src={wordmark.url}
      alt="أسماك أبو ناجي"
      className={`w-auto object-contain drop-shadow-[0_0_18px_rgba(212,175,55,0.35)] ${className}`}
      loading="eager"
      decoding="async"
    />
  );
}