"use client";

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FUN, GAMES } from "@/data/fun";
import { unlock } from "./achievements";
import { confetti } from "./effects";
import { readBest, saveBest } from "./scores";

type P = { x: number; y: number };
type Phase = "ready" | "playing" | "paused" | "over";

const META = GAMES.find((g) => g.id === "snake")!;
const N = 18; // cells per side
const CELL = 18; // CSS pixels per cell at full size
const SIZE = N * CELL;
const DIRS: Record<string, P> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

const fresh = () => ({
  snake: [
    { x: 6, y: 9 },
    { x: 5, y: 9 },
    { x: 4, y: 9 },
  ],
  dir: { x: 1, y: 0 },
  queue: [] as P[],
  food: { x: 12, y: 9 },
  score: 0,
});

/** Packet Snake: the snake eats API requests and gets faster. Rendered inside the arcade dialog. */
export default function Snake() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const game = useRef(fresh());
  const phaseRef = useRef<Phase>("ready");
  const [phase, setPhaseState] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const setPhase = (p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  };

  useEffect(() => setBest(readBest(META.bestKey) ?? 0), []);

  const placeFood = () => {
    const g = game.current;
    let f: P;
    do f = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
    while (g.snake.some((s) => s.x === f.x && s.y === f.y));
    g.food = f;
  };

  const steer = useCallback((d: P) => {
    const g = game.current;
    const last = g.queue[g.queue.length - 1] ?? g.dir;
    if ((d.x === -last.x && d.y === -last.y) || (d.x === last.x && d.y === last.y) || g.queue.length > 2) return;
    g.queue.push(d);
    if (phaseRef.current === "ready") setPhase("playing");
  }, []);

  const primary = useCallback(() => {
    const p = phaseRef.current;
    if (p === "over") {
      game.current = fresh();
      setScore(0);
      setPhase("playing");
    } else setPhase(p === "playing" ? "paused" : "playing");
  }, []);

  // Draw every frame (the food pulses); move the snake on its own, speeding-up clock.
  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = SIZE * dpr;
    c.height = SIZE * dpr;
    ctx.scale(dpr, dpr);

    let raf = 0;
    let acc = 0;
    let last = performance.now();

    const step = () => {
      const g = game.current;
      g.dir = g.queue.shift() ?? g.dir;
      const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };
      const hitWall = head.x < 0 || head.y < 0 || head.x >= N || head.y >= N;
      const hitSelf = g.snake.slice(0, -1).some((s) => s.x === head.x && s.y === head.y);
      if (hitWall || hitSelf) {
        setPhase("over");
        setBest(saveBest(META.bestKey, g.score));
        return;
      }
      g.snake.unshift(head);
      if (head.x === g.food.x && head.y === g.food.y) {
        g.score += 1;
        setScore(g.score);
        placeFood();
        if (g.score === 10) {
          unlock("snake");
          const r = c.getBoundingClientRect();
          confetti({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 70 });
        }
      } else g.snake.pop();
    };

    const draw = (now: number) => {
      const css = getComputedStyle(document.documentElement);
      const v = (name: string) => css.getPropertyValue(name).trim();
      const g = game.current;
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.fillStyle = v("--surface-2");
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.fillStyle = v("--line-strong");
      for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) ctx.fillRect(x * CELL + CELL / 2 - 0.75, y * CELL + CELL / 2 - 0.75, 1.5, 1.5);

      // Food: a pulsing request packet.
      const pulse = 1 + Math.sin(now / 180) * 0.12;
      const fs = (CELL - 6) * pulse;
      ctx.fillStyle = v("--accent-fill");
      ctx.beginPath();
      ctx.roundRect(g.food.x * CELL + (CELL - fs) / 2, g.food.y * CELL + (CELL - fs) / 2, fs, fs, 4);
      ctx.fill();

      g.snake.forEach((s, i) => {
        ctx.globalAlpha = i === 0 ? 1 : Math.max(0.35, 1 - i / (g.snake.length + 4));
        ctx.fillStyle = i === 0 ? v("--accent-fill") : v("--fg");
        ctx.beginPath();
        ctx.roundRect(s.x * CELL + 1.5, s.y * CELL + 1.5, CELL - 3, CELL - 3, i === 0 ? 6 : 4);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      // Eyes on the head, looking where it goes.
      const h = g.snake[0];
      ctx.fillStyle = v("--accent-ink");
      const ex = h.x * CELL + CELL / 2 + g.dir.x * 3;
      const ey = h.y * CELL + CELL / 2 + g.dir.y * 3;
      ctx.fillRect(ex - 1.5 + g.dir.y * 3, ey - 1.5 + g.dir.x * 3, 3, 3);
      ctx.fillRect(ex - 1.5 - g.dir.y * 3, ey - 1.5 - g.dir.x * 3, 3, 3);
    };

    const loop = (now: number) => {
      // Capped, so a stalled frame (another tab, a busy main thread) never fast-forwards the snake into a wall.
      const dt = Math.min(now - last, 100);
      last = now;
      if (phaseRef.current === "playing") {
        acc += dt;
        const interval = Math.max(65, 140 - game.current.score * 4);
        while (acc >= interval && phaseRef.current === "playing") {
          acc -= interval;
          step();
        }
      } else acc = 0;
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onHide = () => document.hidden && phaseRef.current === "playing" && setPhase("paused");
    document.addEventListener("visibilitychange", onHide);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  // Keyboard: arrows/WASD steer, Space pauses (the arcade handles Esc). The page must not scroll underneath.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (DIRS[key]) {
        e.preventDefault();
        steer(DIRS[key]);
      } else if (key === " " || key === "Enter") {
        if (e.target instanceof Element && e.target.closest("button")) return;
        e.preventDefault();
        primary();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [primary, steer]);

  // Swipe on touch screens; a tap starts or restarts.
  const touch = useRef<P | null>(null);
  const onPointerDown = (e: React.PointerEvent) => (touch.current = { x: e.clientX, y: e.clientY });
  const onPointerUp = (e: React.PointerEvent) => {
    const t = touch.current;
    touch.current = null;
    if (!t) return;
    const dx = e.clientX - t.x;
    const dy = e.clientY - t.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) {
      if (phaseRef.current !== "playing") primary();
      return;
    }
    steer(Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) });
  };

  const overlay =
    phase === "ready" ? FUN.snake.start : phase === "paused" ? FUN.snake.paused : phase === "over" ? `${FUN.snake.over} ${FUN.snake.retry}` : null;
  const pad = "grid size-12 place-items-center rounded-xl border border-line bg-surface-2 text-fg active:bg-line";

  return (
    <div>
      <div className="flex items-center justify-between font-mono text-xs text-muted" aria-live="polite">
        <span>
          {FUN.score} <span className="text-fg tabular-nums">{score}</span>
        </span>
        <span>
          {FUN.best} <span className="text-fg tabular-nums">{Math.max(best, score)}</span>
        </span>
      </div>

      <div className="relative mt-2 overflow-hidden rounded-xl border border-line">
        <canvas
          ref={canvas}
          className="block aspect-square w-full touch-none select-none"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          aria-label={`${META.title} board`}
        />
        {overlay && (
          <p className="pointer-events-none absolute inset-x-0 bottom-0 bg-surface/85 px-4 py-3 text-center text-sm font-medium text-fg backdrop-blur">
            {phase === "over" && (
              <span className="block font-mono text-xs text-muted">
                {FUN.score} {score}
              </span>
            )}
            {overlay}
          </p>
        )}
      </div>

      <div className="mx-auto mt-4 hidden w-fit grid-cols-3 gap-2 [@media(pointer:coarse)]:grid">
        <span />
        <button type="button" className={pad} onClick={() => steer(DIRS.ArrowUp)} aria-label="Up">
          <ArrowUp className="size-5" />
        </button>
        <span />
        <button type="button" className={pad} onClick={() => steer(DIRS.ArrowLeft)} aria-label="Left">
          <ArrowLeft className="size-5" />
        </button>
        <button type="button" className={pad} onClick={() => steer(DIRS.ArrowDown)} aria-label="Down">
          <ArrowDown className="size-5" />
        </button>
        <button type="button" className={pad} onClick={() => steer(DIRS.ArrowRight)} aria-label="Right">
          <ArrowRight className="size-5" />
        </button>
      </div>
      <p className="mt-3 text-center font-mono text-[0.68rem] text-faint [@media(pointer:coarse)]:hidden">{FUN.snake.keys}</p>
    </div>
  );
}
