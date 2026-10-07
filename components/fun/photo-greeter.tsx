"use client";

import { useRef, useState } from "react";
import { FUN } from "@/data/fun";
import { unlock } from "./achievements";

/** Wraps the portrait: every click pops a speech bubble saying hi in the next language. */
export default function PhotoGreeter({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const [bubble, setBubble] = useState<{ text: string; key: number } | null>(null);
  const count = useRef(0);
  const timer = useRef(0);

  const greet = () => {
    const text = FUN.greetings[count.current % FUN.greetings.length];
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
