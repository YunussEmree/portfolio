"use client";

import { useEffect, useRef, useState } from "react";
import { FUN, GAMES } from "@/data/fun";
import { unlock } from "./achievements";
import { confetti } from "./effects";
import { readBest, saveBest } from "./scores";
import { NewBest } from "./ui";

type Phase = "idle" | "waiting" | "fake" | "go" | "early" | "tricked" | "result" | "done";

const META = GAMES.find((g) => g.id === "ping")!;
const ROUNDS = 5;
const rate = (ms: number) => FUN.ping.ratings.find((r) => ms <= r.max)?.label ?? "";

/** Ping: a reaction test in five rounds, scored like network latency. Later rounds may flash a fake signal. */
export default function Ping() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [rounds, setRounds] = useState<number[]>([]);
  const [best, setBest] = useState<number | null>(null);
  const [isBest, setIsBest] = useState(false);
  const goAt = useRef(0);
  const timers = useRef<number[]>([]);
  const prevBest = useRef<number | null>(null);
  const panel = useRef<HTMLButtonElement>(null);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => {
    setBest(readBest(META.bestKey));
    panel.current?.focus();
    return clear;
  }, []);

  const arm = (round: number) => {
    clear();
    setPhase("waiting");
    const delay = 1200 + Math.random() * 2300;
    // From the third round on, sometimes an amber fake signal shows first.
    if (round >= 2 && Math.random() < 0.4) {
      const fakeAt = delay * (0.35 + Math.random() * 0.3);
      timers.current.push(window.setTimeout(() => setPhase("fake"), fakeAt));
      // Always back to waiting well before the real signal.
      timers.current.push(window.setTimeout(() => setPhase("waiting"), Math.min(fakeAt + 450, delay - 150)));
    }
    timers.current.push(
      window.setTimeout(() => {
        goAt.current = performance.now();
        setPhase("go");
      }, delay),
    );
  };

  // Measured on press (pointerdown / keydown), not on release, so the number is the reaction itself.
  const press = () => {
    if (phase === "waiting" || phase === "fake") {
      clear();
      setPhase(phase === "fake" ? "tricked" : "early");
    } else if (phase === "go") {
      const ms = Math.round(performance.now() - goAt.current);
      const next = [...rounds, ms];
      setRounds(next);
      if (next.length < ROUNDS) return setPhase("result");
      const avg = Math.round(next.reduce((s, v) => s + v, 0) / ROUNDS);
      setBest(saveBest(META.bestKey, avg, true));
      setIsBest(prevBest.current === null || avg < prevBest.current);
      setPhase("done");
      if (avg < 300) {
        unlock("ping");
        const r = panel.current?.getBoundingClientRect();
        if (r) confetti({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 80 });
      }
    } else if (phase === "done") {
      setRounds([]);
      setIsBest(false);
      prevBest.current = readBest(META.bestKey);
      arm(0);
    } else {
      if (phase === "idle") prevBest.current = readBest(META.bestKey);
      arm(rounds.length); // idle, early/tricked (retry the round), result (next round)
    }
  };

  const last = rounds[rounds.length - 1];
  const avg = rounds.length ? Math.round(rounds.reduce((s, v) => s + v, 0) / rounds.length) : 0;
  const look: Record<Phase, string> = {
    idle: "bg-surface-2 text-fg",
    waiting: "bg-surface-2 text-muted",
    fake: "bg-[#ffb547] text-[#1a1206]",
    go: "bg-accent-fill text-accent-ink",
    early: "bg-[#ff6b8b]/15 text-fg",
    tricked: "bg-[#ff6b8b]/15 text-fg",
    result: "bg-surface-2 text-fg",
    done: "bg-surface-2 text-fg",
  };

  return (
    <div>
      <div className="flex items-center justify-between font-mono text-xs text-muted" aria-live="polite">
        <span className="flex items-center gap-1.5" aria-label={`${FUN.ping.round} ${Math.min(rounds.length + 1, ROUNDS)} / ${ROUNDS}`}>
          {Array.from({ length: ROUNDS }, (_, i) => (
            <span key={i} className={`size-2 rounded-full transition-colors ${i < rounds.length ? "bg-accent-fill" : "bg-line-strong"}`} />
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
        className={`mt-3 grid h-64 w-full select-none place-items-center rounded-2xl border border-line px-6 text-center outline-none transition-colors duration-150 touch-manipulation focus-visible:ring-2 focus-visible:ring-accent ${look[phase]} ${
          phase === "early" || phase === "tricked" ? "shake" : ""
        }`}
      >
        <span aria-live="assertive">
          {phase === "idle" && <span className="text-sm">{FUN.ping.idle}</span>}
          {phase === "waiting" && <span className="text-lg font-medium">{FUN.ping.wait}</span>}
          {phase === "fake" && <span className="text-lg font-semibold">{FUN.ping.fake}</span>}
          {phase === "go" && <span className="display text-5xl">{FUN.ping.go}</span>}
          {phase === "early" && <span className="text-sm font-medium">{FUN.ping.early}</span>}
          {phase === "tricked" && <span className="text-sm font-medium">{FUN.ping.tricked}</span>}
          {phase === "result" && (
            <span>
              <span className="display block text-5xl tabular-nums">{last} ms</span>
              <span className="mt-1 block font-mono text-xs text-muted">{rate(last)}</span>
              <span className="mt-4 block text-sm text-muted">{FUN.ping.next}</span>
            </span>
          )}
          {phase === "done" && (
            <span>
              {isBest && (
                <span className="mb-2 block">
                  <NewBest />
                </span>
              )}
              <span className="block font-mono text-xs uppercase tracking-wider text-muted">{FUN.ping.average}</span>
              <span className="display block text-5xl tabular-nums">{avg} ms</span>
              <span className="mt-1 block font-mono text-xs text-accent">{rate(avg)}</span>
              <span className="mt-4 block text-sm text-muted">{FUN.ping.again}</span>
            </span>
          )}
        </span>
      </button>

      {/* Round history: one bar per round, longer is slower. */}
      <div className="mt-3 flex h-10 items-end gap-1.5" aria-hidden="true">
        {Array.from({ length: ROUNDS }, (_, i) => {
          const ms = rounds[i];
          return (
            <span key={i} className="flex flex-1 flex-col items-center gap-1">
              <span
                className={`w-full rounded-t-md transition-[height] duration-300 ${ms === undefined ? "bg-line" : ms < 300 ? "bg-accent-fill" : "bg-line-strong"}`}
                style={{ height: ms === undefined ? 3 : Math.max(4, Math.min(28, (ms / 600) * 28)) }}
              />
              <span className="font-mono text-[0.6rem] text-faint tabular-nums">{ms ?? "–"}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
