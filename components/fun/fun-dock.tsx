"use client";

import { Bug, Gamepad2, Trophy } from "lucide-react";
import { ACHIEVEMENTS, FUN } from "@/data/fun";
import { openArcade, useFunStats, useGlobalBugs } from "./achievements";

/**
 * A small dock pinned under the nav on the right: bugs fixed by every visitor (the site's own visitor counter; the
 * visitor's count until the shared one answers), secrets found (opens the trophy case) and the arcade.
 */
export default function FunDock() {
  const { bugs, found } = useFunStats();
  const everyone = useGlobalBugs();
  const shown = everyone ?? bugs;
  const seg = "inline-flex h-8 items-center gap-1.5 px-2.5 transition hover:bg-surface-2 hover:text-fg";

  return (
    <div className="fade-in fixed right-4 top-[4.6rem] z-40 flex items-center divide-x divide-line overflow-hidden rounded-full border border-line bg-surface/80 font-mono text-[0.7rem] text-muted shadow-lg shadow-black/10 backdrop-blur-xl sm:right-6 lg:right-8">
      <span className="inline-flex h-8 items-center gap-1.5 px-2.5" title={everyone === null ? FUN.stats.mine : FUN.stats.everyone}>
        <Bug className="size-3.5" />
        <span key={shown} className="best-pop inline-block tabular-nums text-fg">
          {shown.toLocaleString("en")}
        </span>
        <span className="hidden sm:inline">{shown === 1 ? FUN.stats.bug : FUN.stats.bugs}</span>
      </span>
      <button type="button" onClick={() => openArcade("trophies")} className={seg} title={FUN.stats.open} aria-label={`${found}/${ACHIEVEMENTS.length} ${FUN.stats.secrets}`}>
        <Trophy className="size-3.5 text-accent" />
        <span className="tabular-nums">
          {found}/{ACHIEVEMENTS.length}
        </span>
        <span className="hidden md:inline">{FUN.stats.secrets}</span>
      </button>
      <button type="button" onClick={() => openArcade()} className={`group ${seg}`} aria-label={FUN.arcade.open}>
        <Gamepad2 className="size-3.5 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
        <span className="hidden sm:inline">{FUN.arcade.title}</span>
      </button>
    </div>
  );
}
