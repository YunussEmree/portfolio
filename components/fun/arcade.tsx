"use client";

import { ArrowLeft, Brain, Bug, Worm, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FUN, GAMES, type GameId } from "@/data/fun";
import Memory from "./memory";
import Ping from "./ping";
import { readBest } from "./scores";
import Snake from "./snake";
import Whack from "./whack";

const ICONS: Record<GameId, React.ComponentType<{ className?: string }>> = { snake: Worm, whack: Bug, memory: Brain, ping: Zap };
const SCREENS: Record<GameId, React.ComponentType> = { snake: Snake, whack: Whack, memory: Memory, ping: Ping };

/** The arcade dialog: a picker with best scores, and the chosen game. Esc closes it from anywhere. */
export default function Arcade({ initial, onClose }: { initial: GameId | null; onClose: () => void }) {
  const [game, setGame] = useState<GameId | null>(initial);
  const [bests, setBests] = useState<Record<string, number | null>>({});
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

  // Fresh best scores whenever the picker shows.
  useEffect(() => {
    if (game === null) setBests(Object.fromEntries(GAMES.map((g) => [g.id, readBest(g.bestKey)])));
  }, [game]);

  const meta = game ? GAMES.find((g) => g.id === game) : undefined;
  const Screen = game ? SCREENS[game] : null;

  return (
    <div
      className="fade-in fixed inset-0 z-[105] flex items-center justify-center overflow-y-auto bg-black/55 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      data-lenis-prevent
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="arcade-title"
        tabIndex={-1}
        className="pop-in my-auto w-full max-w-[24rem] rounded-2xl border border-line-strong bg-surface p-4 shadow-2xl shadow-black/40 outline-none sm:p-5"
      >
        <div className="mb-4 flex items-start gap-3">
          {game && (
            <button
              type="button"
              onClick={() => setGame(null)}
              className="grid size-8 shrink-0 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-fg"
              aria-label={FUN.arcade.back}
            >
              <ArrowLeft className="size-4" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <h2 id="arcade-title" className="font-semibold tracking-tight text-fg">
              {meta?.title ?? FUN.arcade.title}
            </h2>
            <p className="text-sm text-muted">{meta?.tagline ?? FUN.arcade.subtitle}</p>
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

        {Screen ? (
          <Screen key={game} />
        ) : (
          <ul className="grid grid-cols-2 gap-2">
            {GAMES.map((g, i) => {
              const Icon = ICONS[g.id];
              const best = bests[g.id];
              return (
                <li key={g.id} className="rise" style={{ "--d": `${i * 0.05}s` } as React.CSSProperties}>
                  <button
                    type="button"
                    onClick={() => setGame(g.id)}
                    className="group flex h-full w-full flex-col items-start rounded-2xl border border-line bg-surface-2/60 p-4 text-left transition hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-accent-fill text-accent-ink transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                      <Icon className="size-5" />
                    </span>
                    <span className="mt-3 font-medium text-fg">{g.title}</span>
                    <span className="mt-1 font-mono text-[0.68rem] text-faint">
                      {best === null || best === undefined ? FUN.arcade.noBest : `${FUN.arcade.best} ${best}${g.unit}`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
