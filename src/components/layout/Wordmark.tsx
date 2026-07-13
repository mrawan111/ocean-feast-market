import wordmark from "@/assets/brand-watermark.png";

export function Wordmark({ className = "h-12 md:h-16" }: { className?: string }) {
  return (
    <img
      src={wordmark}
      alt="أسماك أبو ناجي"
      className={`w-auto object-contain ${className}`}
      loading="eager"
      decoding="async"
    />
  );
}
