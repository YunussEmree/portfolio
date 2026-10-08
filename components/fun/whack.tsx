"use client";

import { useEffect, useRef, useState } from "react";
import { FUN, GAMES } from "@/data/fun";
import { unlock } from "./achievements";
import { confetti } from "./effects";
import { BugIcon, HammerIcon } from "./icons";
import { readBest, saveBest } from "./scores";

type Hole = { kind: "bug" | "critical" | "hit"; id: number; until: number; points?: number } | null;
type Phase = "ready" | "playing" | "over";

const META = GAMES.find((g) => g.id === "whack")!;
const DURATION = 30_000;
const CRITICAL = "#ff6b8b";
const empty = (): Hole[] => Array(9).fill(null);

/** Whack-a-Bug: bugs pop out of nine holes for 30 seconds; faster and more of them as time runs out. */
export default function Whack() {
  const [holes, setHoles] = useState<Hole[]>(empty);
  const [phase, setPhaseState] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(DURATION);
  const [best, setBest] = useState<number | null>(null);
  const holesRef = useRef<Hole[]>(empty());
  const phaseRef = useRef<Phase>("ready");
  const scoreRef = useRef(0);
  const ids = useRef(0);
  const board = useRef<HTMLDivElement>(null);

  const setPhase = (p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  };
  const commit = (hs: Hole[]) => {
    holesRef.current = hs;
    setHoles(hs);
  };

  useEffect(() => setBest(readBest(META.bestKey)), []);

  const start = () => {
    commit(empty());
    scoreRef.current = 0;
    setScore(0);
    setLeft(DURATION);
    setPhase("playing");
  };

  // The game clock: expire bugs, spawn new ones, end the round.
  useEffect(() => {
    if (phase !== "playing") return;
    const began = performance.now();
    let nextSpawn = began + 350;
    const timer = window.setInterval(() => {
      const now = performance.now();
      const elapsed = now - began;
      const progress = Math.min(1, elapsed / DURATION);
      setLeft(Math.max(0, DURATION - elapsed));

      if (elapsed >= DURATION) {
        window.clearInterval(timer);
        commit(empty());
        setPhase("over");
        setBest(saveBest(META.bestKey, scoreRef.current));
        if (scoreRef.current >= 20) {
          unlock("whack");
          const r = board.current?.getBoundingClientRect();
          if (r) confetti({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 80 });
        }
        return;
      }

      const hs = holesRef.current.map((h) => (h && h.until <= now ? null : h));
      const active = hs.filter((h) => h && h.kind !== "hit").length;
      const maxActive = progress < 0.35 ? 1 : progress < 0.7 ? 2 : 3;
      if (now >= nextSpawn && active < maxActive) {
        const free = hs.flatMap((h, i) => (h ? [] : [i]));
        if (free.length) {
          const i = free[Math.floor(Math.random() * free.length)];
          hs[i] = { kind: Math.random() < 0.12 ? "critical" : "bug", id: ++ids.current, until: now + 1150 - progress * 550 };
          nextSpawn = now + 420 - progress * 220 + Math.random() * 280;
        }
      }
      commit(hs);
    }, 50);
    return () => window.clearInterval(timer);
  }, [phase]);

  const whack = (i: number) => {
    if (phaseRef.current !== "playing") return;
    const h = holesRef.current[i];
    if (!h || h.kind === "hit") return;
    const points = h.kind === "critical" ? 3 : 1;
    scoreRef.current += points;
    setScore(scoreRef.current);
    const hs = [...holesRef.current];
    hs[i] = { kind: "hit", id: h.id, until: performance.now() + 500, points };
    commit(hs);
  };
  const whackRef = useRef(whack);
  whackRef.current = whack;

  // Keys 1–9 hit the holes in reading order; Space or Enter starts a round.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[1-9]$/.test(e.key)) {
        e.preventDefault();
        whackRef.current(Number(e.key) - 1);
      } else if ((e.key === " " || e.key === "Enter") && phaseRef.current !== "playing") {
        if (e.target instanceof Element && e.target.closest("button")) return;
        e.preventDefault();
        start();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between font-mono text-xs text-muted" aria-live="polite">
        <span>
          {FUN.score} <span className="text-fg tabular-nums">{score}</span>
        </span>
        <span>
          {FUN.time} <span className="text-fg tabular-nums">{Math.ceil(left / 1000)}s</span>
        </span>
        <span>
          {FUN.best} <span className="text-fg tabular-nums">{Math.max(best ?? 0, phase === "over" ? 0 : score)}</span>
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
        <div className="h-full rounded-full bg-accent-fill transition-[width] duration-100 ease-linear" style={{ width: `${(left / DURATION) * 100}%` }} />
      </div>

      <div ref={board} className="relative mt-3">
        <div className="grid grid-cols-3 gap-2">
          {holes.map((h, i) => (
            <button
              key={i}
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                whack(i);
              }}
              aria-label={`${FUN.whack.hole} ${i + 1}`}
              className="relative aspect-square cursor-crosshair overflow-hidden rounded-2xl border border-line bg-surface-2 touch-manipulation"
            >
              <span className="absolute left-2 top-1.5 font-mono text-[0.6rem] text-faint [@media(pointer:coarse)]:hidden">{i + 1}</span>
              {/* The hole the bugs climb out of. */}
              <span className="absolute inset-x-[16%] bottom-[12%] h-[16%] rounded-[50%] bg-black/25 dark:bg-black/50" />
              {h && h.kind !== "hit" && (
                <span key={h.id} className="whack-pop absolute inset-0 grid place-items-center pb-[10%]" style={h.kind === "critical" ? { color: CRITICAL } : undefined}>
                  <BugIcon size={44} className={h.kind === "critical" ? "" : "text-fg"} />
                </span>
              )}
              {h?.kind === "hit" && (
                <span key={`hit-${h.id}`} className="absolute inset-0">
                  <span className="bug-squash absolute inset-0 grid place-items-center pb-[10%] text-fg">
                    <BugIcon size={44} />
                  </span>
                  <HammerIcon width={52} className="hammer-swing absolute left-[calc(50%-10px)] top-[4%] text-fg" />
                  <span className="score-pop absolute left-1/2 top-[18%] font-mono text-sm font-bold text-accent">+{h.points}</span>
                </span>
              )}
            </button>
          ))}
        </div>

        {phase !== "playing" && (
          <div className="fade-in absolute inset-0 grid place-items-center rounded-2xl bg-surface/80 p-6 text-center backdrop-blur-sm">
            <div>
              {phase === "over" ? (
                <>
                  <p className="font-semibold text-fg">{FUN.whack.over}</p>
                  <p className="mt-1 font-mono text-sm text-muted">
                    {FUN.score} <span className="text-fg">{score}</span> · {FUN.best} <span className="text-fg">{best ?? score}</span>
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted">{FUN.whack.intro}</p>
              )}
              <button
                type="button"
                onClick={start}
                className="mt-4 inline-flex h-10 items-center rounded-full bg-accent-fill px-5 text-sm font-medium text-accent-ink transition hover:brightness-105"
              >
                {phase === "over" ? FUN.whack.again : FUN.whack.start}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
