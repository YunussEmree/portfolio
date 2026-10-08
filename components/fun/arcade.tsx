"use client";

import { ArrowLeft, Boxes, Brain, Bug, GitMerge, Lock, SquareTerminal, Trophy, Worm, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS, FUN, GAMES, type GameId } from "@/data/fun";
import { HINT_EVENT, unlockedAchievements, type ArcadeView } from "./achievements";
import Memory from "./memory";
import Merge from "./merge";
import Ping from "./ping";
import { readBest } from "./scores";
import Snake from "./snake";
import Stack from "./stack";
import Typer from "./typer";
import Whack from "./whack";

const ICONS: Record<GameId, React.ComponentType<{ className?: string }>> = {
  snake: Worm,
  whack: Bug,
  stack: Boxes,
  merge: GitMerge,
  memory: Brain,
  typer: SquareTerminal,
  ping: Zap,
};
const SCREENS: Record<GameId, React.ComponentType> = { snake: Snake, whack: Whack, stack: Stack, merge: Merge, memory: Memory, typer: Typer, ping: Ping };

/** Found achievements with what you did; locked ones as ??? with a hint on demand. */
function Trophies() {
  const [found, setFound] = useState<string[]>([]);
  const [hints, setHints] = useState<string[]>([]);
  useEffect(() => setFound(unlockedAchievements()), []);
  const pct = Math.round((found.length / ACHIEVEMENTS.length) * 100);

  return (
    <div>
      <div className="flex items-center justify-between font-mono text-xs text-muted">
        <span>
          <span className="text-fg tabular-nums">
            {found.length}/{ACHIEVEMENTS.length}
          </span>{" "}
          {FUN.trophies.found}
        </span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-accent-fill transition-[width] duration-700" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-4 max-h-[52vh] space-y-2 overflow-y-auto pr-1" data-lenis-prevent>
        {ACHIEVEMENTS.map((a, i) => {
          const got = found.includes(a.id);
          const hinted = hints.includes(a.id);
          return (
            <li
              key={a.id}
              className={`rise flex items-start gap-3 rounded-xl border p-3 ${got ? "border-line-strong bg-surface-2" : "border-line"}`}
              style={{ "--d": `${Math.min(i, 10) * 0.03}s` } as React.CSSProperties}
            >
              <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${got ? "bg-accent-fill text-accent-ink" : "bg-surface-2 text-faint"}`}>
                {got ? <Trophy className="size-4" /> : <Lock className="size-3.5" />}
              </span>
              <span className="min-w-0 flex-1 text-sm">
                <span className={`block font-medium ${got ? "text-fg" : "text-faint"}`}>{got ? a.title : FUN.trophies.locked}</span>
                <span className="block text-xs text-muted">{got ? a.detail : hinted ? a.hint : ""}</span>
              </span>
              {!got && !hinted && (
                <button
                  type="button"
                  onClick={() => setHints((h) => [...h, a.id])}
                  className="shrink-0 rounded-full border border-line px-2.5 py-1 font-mono text-[0.65rem] text-muted transition hover:border-line-strong hover:text-fg"
                >
                  {FUN.trophies.showHint}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * The arcade dialog: a picker with best scores, the trophy case and the chosen game.
 * It closes only with its close button or Esc, so a stray click outside never ends a game.
 */
export default function Arcade({ initial, onClose }: { initial: ArcadeView | null; onClose: () => void }) {
  const [view, setView] = useState<ArcadeView | null>(initial);
  const [bests, setBests] = useState<Record<string, number | null>>({});
  const [found, setFound] = useState(0);
  const dialog = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;

  // Focus moves into the dialog and back to where it was when the arcade closes.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close.current();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, []);

  // Fresh best scores and trophy count whenever the picker shows.
  useEffect(() => {
    if (view !== null) return;
    setBests(Object.fromEntries(GAMES.map((g) => [g.id, readBest(g.bestKey)])));
    setFound(unlockedAchievements().length);
  }, [view]);

  const game = view && view !== "trophies" ? GAMES.find((g) => g.id === view) : undefined;
  const Screen = game ? SCREENS[game.id] : null;
  const title = view === "trophies" ? FUN.trophies.title : game?.title ?? FUN.arcade.title;
  const subtitle = view === "trophies" ? FUN.trophies.subtitle : game?.tagline ?? FUN.arcade.subtitle;

  return (
    <div className="fade-in fixed inset-0 z-[105] flex items-center justify-center overflow-y-auto bg-black/55 px-4 py-6 backdrop-blur-sm" data-lenis-prevent>
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="arcade-title"
        tabIndex={-1}
        className="pop-in my-auto w-full max-w-[24rem] rounded-2xl border border-line-strong bg-surface p-4 shadow-2xl shadow-black/40 outline-none sm:p-5"
      >
        <div className="mb-4 flex items-start gap-3">
          {view !== null && (
            <button
              type="button"
              onClick={() => setView(null)}
              className="grid size-8 shrink-0 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-fg"
              aria-label={FUN.arcade.back}
            >
              <ArrowLeft className="size-4" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <h2 id="arcade-title" className="font-semibold tracking-tight text-fg">
              {title}
            </h2>
            <p className="text-sm text-muted">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 shrink-0 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-fg"
            aria-label={FUN.arcade.close}
          >
            <X className="size-4" />
          </button>
        </div>

        {view === "trophies" ? (
          <Trophies />
        ) : Screen ? (
          <Screen key={view} />
        ) : (
          <>
            <ul className="grid grid-cols-2 gap-2">
              {GAMES.map((g, i) => {
                const Icon = ICONS[g.id];
                const best = bests[g.id];
                return (
                  <li key={g.id} className="rise" style={{ "--d": `${i * 0.04}s` } as React.CSSProperties}>
                    <button
                      type="button"
                      onClick={() => setView(g.id)}
                      className="group flex h-full w-full flex-col items-start rounded-2xl border border-line bg-surface-2/60 p-3 text-left transition hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2"
                    >
                      <span className="grid size-9 place-items-center rounded-xl bg-accent-fill text-accent-ink transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                        <Icon className="size-[1.1rem]" />
                      </span>
                      <span className="mt-2.5 text-sm font-medium text-fg">{g.title}</span>
                      <span className="mt-0.5 font-mono text-[0.65rem] text-faint">
                        {best === null || best === undefined ? FUN.arcade.noBest : `${FUN.arcade.best} ${best}${g.unit}`}
                      </span>
                    </button>
                  </li>
                );
              })}
              <li className="rise" style={{ "--d": `${GAMES.length * 0.04}s` } as React.CSSProperties}>
                <button
                  type="button"
                  onClick={() => setView("trophies")}
                  className="group flex h-full w-full flex-col items-start rounded-2xl border border-dashed border-line-strong p-3 text-left transition hover:-translate-y-0.5 hover:bg-surface-2"
                >
                  <span className="grid size-9 place-items-center rounded-xl bg-surface-2 text-accent transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <Trophy className="size-[1.1rem]" />
                  </span>
                  <span className="mt-2.5 text-sm font-medium text-fg">{FUN.trophies.title}</span>
                  <span className="mt-0.5 font-mono text-[0.65rem] text-faint">
                    {found}/{ACHIEVEMENTS.length} {FUN.trophies.found}
                  </span>
                </button>
              </li>
            </ul>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(HINT_EVENT))}
              className="mt-3 w-full text-center font-mono text-[0.68rem] text-faint transition hover:text-accent"
            >
              {FUN.hint.label} →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
