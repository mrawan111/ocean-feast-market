import { useEffect, useRef, useState } from "react";

export function MarqueeText({
  children,
  className = "",
  speed = 25,
}: {
  children: string;
  className?: string;
  speed?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;
    setShouldScroll(text.scrollWidth > container.clientWidth + 2);
  }, [children]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden whitespace-nowrap ${className}`}
      aria-label={children}
    >
      <span
        ref={textRef}
        className={`inline-block ${shouldScroll ? "animate-marquee-rtl" : ""}`}
        style={
          shouldScroll
            ? {
                animationDuration: `${Math.max(8, children.length / speed)}s`,
              }
            : undefined
        }
      >
        {children}
        {shouldScroll && (
          <>
            {" "}
            — {" "}
            {children}
          </>
        )}
      </span>
    </div>
  );
}
