"use client";

import { useRef, useState } from "react";
import { FUN } from "@/data/fun";
import { unlock } from "./achievements";

/** Wraps the portrait: every click pops a speech bubble saying hi, first in the visitor's language, then the next one. */
export default function PhotoGreeter({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const [bubble, setBubble] = useState<{ text: string; key: number } | null>(null);
  const count = useRef(0);
  const offset = useRef<number | null>(null);
  const timer = useRef(0);

  const greet = () => {
    if (offset.current === null) {
      const lang = (navigator.language || "en").slice(0, 2).toLowerCase();
      offset.current = Math.max(0, FUN.greetings.findIndex((g) => g.lang === lang));
    }
    const { text } = FUN.greetings[(offset.current + count.current) % FUN.greetings.length];
    count.current += 1;
    setBubble({ text, key: count.current });
    if (count.current >= 5) unlock("polyglot");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setBubble(null), 1800);
  };

  return (
    <button type="button" onClick={greet} aria-label={FUN.sayHi} className={className}>
      {children}
      {bubble && (
        <span
          key={bubble.key}
          className="bubble-pop absolute left-4 top-4 rounded-2xl rounded-bl-sm bg-surface px-3.5 py-2 text-sm font-semibold text-fg shadow-xl shadow-black/20"
        >
          {bubble.text} <span className="wave inline-block">👋</span>
        </span>
      )}
      <span className="sr-only" aria-live="polite">
        {bubble?.text ?? ""}
      </span>
    </button>
  );
}
