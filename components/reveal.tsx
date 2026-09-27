"use client";

import { useEffect, useRef } from "react";

type RevealProps = React.HTMLAttributes<HTMLDivElement> & { delay?: number; y?: number };

/**
 * Fades and lifts its content in once, the first time it scrolls into view. Plain CSS transitions driven by an
 * IntersectionObserver (see [data-reveal] in globals.css), so no animation library ships to the browser.
 */
export default function Reveal({ delay = 0, y = 18, style, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.shown = "";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      style={{ "--reveal-delay": `${delay}s`, "--reveal-y": `${y}px`, ...style } as React.CSSProperties}
      {...rest}
    >
      {children}
    </div>
  );
}
