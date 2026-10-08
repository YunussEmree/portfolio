"use client";

import { useEffect, useRef, useState } from "react";
import { FUN, GAMES } from "@/data/fun";
import { unlock } from "./achievements";
import { confetti } from "./effects";
import { readBest, saveBest } from "./scores";

type Phase = "idle" | "waiting" | "go" | "early" | "result" | "done";

const META = GAMES.find((g) => g.id === "ping")!;
const ROUNDS = 5;
const rate = (ms: number) => FUN.ping.ratings.find((r) => ms <= r.max)?.label ?? "";

/** Ping: a reaction test in five rounds, scored like network latency. */
export default function Ping() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [rounds, setRounds] = useState<number[]>([]);
  const [best, setBest] = useState<number | null>(null);
  const goAt = useRef(0);
  const timer = useRef(0);
  const panel = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setBest(readBest(META.bestKey));
    panel.current?.focus();
    return () => window.clearTimeout(timer.current);
  }, []);

  const arm = () => {
    setPhase("waiting");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      goAt.current = performance.now();
      setPhase("go");
    }, 1200 + Math.random() * 2300);
  };

  // Measured on press (pointerdown / keydown), not on release, so the number is the reaction itself.
  const press = () => {
    if (phase === "waiting") {
      window.clearTimeout(timer.current);
      setPhase("early");
    } else if (phase === "go") {
      const ms = Math.round(performance.now() - goAt.current);
      const next = [...rounds, ms];
      setRounds(next);
      if (next.length < ROUNDS) return setPhase("result");
      const avg = Math.round(next.reduce((s, v) => s + v, 0) / ROUNDS);
      setBest(saveBest(META.bestKey, avg, true));
      setPhase("done");
      if (avg < 300) {
        unlock("ping");
        const r = panel.current?.getBoundingClientRect();
        if (r) confetti({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 80 });
      }
    } else if (phase === "done") {
      setRounds([]);
      arm();
    } else arm(); // idle, early (retry the round), result (next round)
  };

  const last = rounds[rounds.length - 1];
  const avg = rounds.length ? Math.round(rounds.reduce((s, v) => s + v, 0) / rounds.length) : 0;
  const look: Record<Phase, string> = {
    idle: "bg-surface-2 text-fg",
    waiting: "bg-surface-2 text-muted",
    go: "bg-accent-fill text-accent-ink",
    early: "bg-[#ff6b8b]/15 text-fg",
    result: "bg-surface-2 text-fg",
    done: "bg-surface-2 text-fg",
  };

  return (
    <div>
      <div className="flex items-center justify-between font-mono text-xs text-muted" aria-live="polite">
        <span className="flex items-center gap-1.5" aria-label={`${FUN.ping.round} ${Math.min(rounds.length + 1, ROUNDS)} / ${ROUNDS}`}>
          {Array.from({ length: ROUNDS }, (_, i) => (
            <span key={i} className={`size-2 rounded-full ${i < rounds.length ? "bg-accent-fill" : "bg-line-strong"}`} />
          ))}
        </span>
        <span>
          {FUN.best} <span className="text-fg tabular-nums">{best === null ? "–" : `${best} ms`}</span>
        </span>
      </div>

      <button
        ref={panel}
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          press();
        }}
        onKeyDown={(e) => {
          if (e.key !== " " && e.key !== "Enter") return;
          e.preventDefault(); // no synthetic click on top of this
          if (!e.repeat) press();
        }}
        onClick={(e) => e.detail === 0 && press()} // assistive tech activation
        className={`mt-3 grid h-64 w-full select-none place-items-center rounded-2xl border border-line px-6 text-center outline-none transition-colors duration-150 touch-manipulation focus-visible:ring-2 focus-visible:ring-accent ${look[phase]}`}
      >
        <span aria-live="assertive">
          {phase === "idle" && <span className="text-sm">{FUN.ping.idle}</span>}
          {phase === "waiting" && <span className="text-lg font-medium">{FUN.ping.wait}</span>}
          {phase === "go" && <span className="display text-5xl">{FUN.ping.go}</span>}
          {phase === "early" && <span className="text-sm font-medium">{FUN.ping.early}</span>}
          {phase === "result" && (
            <span>
              <span className="display block text-5xl tabular-nums">{last} ms</span>
              <span className="mt-1 block font-mono text-xs text-muted">{rate(last)}</span>
              <span className="mt-4 block text-sm text-muted">{FUN.ping.next}</span>
            </span>
          )}
          {phase === "done" && (
            <span>
              <span className="block font-mono text-xs uppercase tracking-wider text-muted">{FUN.ping.average}</span>
              <span className="display block text-5xl tabular-nums">{avg} ms</span>
              <span className="mt-1 block font-mono text-xs text-accent">{rate(avg)}</span>
              <span className="mt-2 block font-mono text-[0.7rem] text-faint">{rounds.join(" · ")} ms</span>
              <span className="mt-4 block text-sm text-muted">{FUN.ping.again}</span>
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
