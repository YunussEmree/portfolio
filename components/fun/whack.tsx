"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FUN, GAMES } from "@/data/fun";
import { unlock } from "./achievements";
import { confetti } from "./effects";
import { BugIcon, HammerIcon } from "./icons";
import { readBest, saveBest } from "./scores";
import { Panel, Stats } from "./ui";

type Kind = "bug" | "critical" | "feature";
type Hole = { kind: Kind | "hit" | "oops"; id: number; until: number; points?: number } | null;
type Phase = "ready" | "playing" | "over";

const META = GAMES.find((g) => g.id === "whack")!;
const DURATION = 30_000;
const CRITICAL = "#ff6b8b";
const empty = (): Hole[] => Array(9).fill(null);
const multiplier = (combo: number) => (combo >= 10 ? 3 : combo >= 5 ? 2 : 1);

/**
 * Whack-a-Bug: bugs pop out of nine holes for 30 seconds, faster and more of them as time runs out.
 * Hits in a row build a combo (×2 from 5, ×3 from 10); a miss, an escaped bug or a squashed feature resets it.
 */
export default function Whack() {
  const [holes, setHoles] = useState<Hole[]>(empty);
  const [phase, setPhaseState] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [left, setLeft] = useState(DURATION);
  const [best, setBest] = useState<number | null>(null);
  const [isBest, setIsBest] = useState(false);
  const holesRef = useRef<Hole[]>(empty());
  const phaseRef = useRef<Phase>("ready");
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const prevBest = useRef(0);
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
  const setComboTo = (n: number) => {
    comboRef.current = n;
    setCombo(n);
  };

  useEffect(() => setBest(readBest(META.bestKey)), []);

  const start = () => {
    commit(empty());
    scoreRef.current = 0;
    setScore(0);
    setComboTo(0);
    setLeft(DURATION);
    setIsBest(false);
    prevBest.current = readBest(META.bestKey) ?? 0;
    setPhase("playing");
  };

  // The game clock: expire what's up, spawn new things, end the round.
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
        const final = scoreRef.current;
        setBest(saveBest(META.bestKey, final));
        setIsBest(final > prevBest.current);
        if (final >= 20) {
          unlock("whack");
          const r = board.current?.getBoundingClientRect();
          if (r) confetti({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 80 });
        }
        return;
      }

      let escaped = false;
      const hs = holesRef.current.map((h) => {
        if (!h || h.until > now) return h;
        if (h.kind === "bug" || h.kind === "critical") escaped = true;
        return null;
      });
      if (escaped && comboRef.current) setComboTo(0);

      const active = hs.filter((h) => h && h.kind !== "hit" && h.kind !== "oops").length;
      const maxActive = progress < 0.35 ? 1 : progress < 0.7 ? 2 : 3;
      if (now >= nextSpawn && active < maxActive) {
        const free = hs.flatMap((h, i) => (h ? [] : [i]));
        if (free.length) {
          const i = free[Math.floor(Math.random() * free.length)];
          const roll = Math.random();
          const kind: Kind = progress > 0.15 && roll < 0.16 ? "feature" : roll > 0.88 ? "critical" : "bug";
          hs[i] = { kind, id: ++ids.current, until: now + 1150 - progress * 550 };
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
    const hs = [...holesRef.current];
    if (!h || h.kind === "hit" || h.kind === "oops") {
      if (!h) setComboTo(0); // a miss breaks the combo
      return;
    }
    if (h.kind === "feature") {
      scoreRef.current = Math.max(0, scoreRef.current - 2);
      setComboTo(0);
      hs[i] = { kind: "oops", id: h.id, until: performance.now() + 650, points: -2 };
    } else {
      const next = comboRef.current + 1;
      setComboTo(next);
      const points = (h.kind === "critical" ? 3 : 1) * multiplier(next);
      scoreRef.current += points;
      hs[i] = { kind: "hit", id: h.id, until: performance.now() + 500, points };
    }
    setScore(scoreRef.current);
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

  const mult = multiplier(combo);

  return (
    <div>
      <Stats
        items={[
          { label: FUN.score, value: score },
          {
            label: FUN.whack.combo,
            value: (
              <span key={mult} className={mult > 1 ? "best-pop inline-block text-accent" : ""}>
                {combo}
                {mult > 1 ? ` ×${mult}` : ""}
              </span>
            ),
          },
          { label: FUN.time, value: `${Math.ceil(left / 1000)}s` },
          { label: FUN.best, value: Math.max(best ?? 0, phase === "over" ? 0 : score) },
        ]}
      />
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
              {/* The hole things climb out of. */}
              <span className="absolute inset-x-[16%] bottom-[12%] h-[16%] rounded-[50%] bg-black/25 dark:bg-black/50" />
              {h && (h.kind === "bug" || h.kind === "critical") && (
                <span key={h.id} className="whack-pop absolute inset-0 grid place-items-center pb-[10%]" style={h.kind === "critical" ? { color: CRITICAL } : undefined}>
                  <BugIcon size={44} className={h.kind === "critical" ? "" : "text-fg"} />
                </span>
              )}
              {h?.kind === "feature" && (
                <span key={h.id} className="whack-pop absolute inset-0 grid place-items-center pb-[10%] text-accent">
                  <Sparkles className="size-10" strokeWidth={1.6} />
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
              {h?.kind === "oops" && (
                <span key={`oops-${h.id}`} className="absolute inset-0">
                  <span className="wiggle absolute inset-0 grid place-items-center pb-[10%] text-accent opacity-50">
                    <Sparkles className="size-10" strokeWidth={1.6} />
                  </span>
                  <span className="score-pop absolute left-1/2 top-[12%] whitespace-nowrap font-mono text-[0.65rem] font-bold" style={{ color: CRITICAL }}>
                    {h.points} {FUN.whack.feature}
                  </span>
                </span>
              )}
            </button>
          ))}
        </div>

        {phase === "ready" && <Panel action={FUN.whack.start} onAction={start}>{FUN.whack.intro}</Panel>}
        {phase === "over" && (
          <Panel title={FUN.whack.over} action={FUN.whack.again} onAction={start} best={isBest}>
            <span className="font-mono">
              {FUN.score} <span className="text-fg">{score}</span> · {FUN.best} <span className="text-fg">{best ?? score}</span>
            </span>
          </Panel>
        )}
      </div>
    </div>
  );
}
