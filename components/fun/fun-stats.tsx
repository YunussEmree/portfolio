"use client";

import { ACHIEVEMENTS, FUN } from "@/data/fun";
import { HINT_EVENT, useFunStats } from "./achievements";

/** "3 bugs fixed · 1/11 secrets found" next to the copyright; the secrets count asks for a hint. */
export default function FunStats() {
  const { bugs, found } = useFunStats();
  return (
    <p className="font-mono text-[0.7rem] text-faint">
      <span className="tabular-nums">{bugs}</span> {bugs === 1 ? FUN.stats.bug : FUN.stats.bugs} ·{" "}
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(HINT_EVENT))}
        title={FUN.stats.hint}
        className="underline decoration-dotted underline-offset-2 transition hover:text-accent"
      >
        <span className="tabular-nums">
          {found}/{ACHIEVEMENTS.length}
        </span>{" "}
        {FUN.stats.secrets}
      </button>
    </p>
  );
}
