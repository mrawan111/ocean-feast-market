import wordmark from "@/assets/brand-wordmark.png.asset.json";

export function Wordmark({ className = "h-10 md:h-12" }: { className?: string }) {
  return (
    <img
      src={wordmark.url}
      alt="أسماك أبو ناجي"
      style={{ mixBlendMode: "screen" }}
      className={`w-auto object-contain ${className}`}
      loading="eager"
      decoding="async"
    />
  );
}