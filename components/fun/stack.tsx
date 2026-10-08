"use client";

import { useEffect, useRef, useState } from "react";
import { FUN, GAMES } from "@/data/fun";
import { unlock } from "./achievements";
import { confetti } from "./effects";
import { readBest, saveBest } from "./scores";
import { NewBest, Stats } from "./ui";

type Block = { x: number; w: number; hue: number };
type Falling = Block & { y: number; vy: number; spin: number; angle: number };
type Phase = "ready" | "playing" | "over";

const META = GAMES.find((g) => g.id === "stack")!;
const W = 320;
const H = 400;
const BH = 22; // container height
const BASE_W = 180;
const GROUND = 26;
const hueFor = (i: number) => 190 + ((i * 11) % 120); // cyan → blue → violet → magenta
const topY = (i: number) => H - GROUND - (i + 1) * BH;

const fresh = () => ({
  blocks: [{ x: (W - BASE_W) / 2, w: BASE_W, hue: hueFor(0) }] as Block[],
  cur: null as (Block & { dir: number; speed: number }) | null,
  falling: [] as Falling[],
  cam: 0,
  perfect: 0,
  flash: null as { text: string; at: number; y: number } | null,
});

/** Container Stack: drop sliding containers; whatever hangs over the one below is cut off. */
export default function Stack() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const game = useRef(fresh());
  const phaseRef = useRef<Phase>("ready");
  const overAt = useRef(0);
  const prevBest = useRef(0);
  const [phase, setPhaseState] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [isBest, setIsBest] = useState(false);

  const setPhase = (p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  };

  useEffect(() => setBest(readBest(META.bestKey) ?? 0), []);

  const spawn = () => {
    const g = game.current;
    const level = g.blocks.length;
    const prev = g.blocks[level - 1];
    const dir = level % 2 ? 1 : -1;
    g.cur = { x: dir > 0 ? 0 : W - prev.w, w: prev.w, hue: hueFor(level), dir, speed: Math.min(1.7 + level * 0.12, 5.4) };
  };

  const start = () => {
    game.current = fresh();
    spawn();
    setScore(0);
    setIsBest(false);
    prevBest.current = readBest(META.bestKey) ?? 0;
    setPhase("playing");
  };

  const drop = () => {
    const g = game.current;
    const cur = g.cur;
    if (!cur) return;
    const level = g.blocks.length;
    const prev = g.blocks[level - 1];

    if (Math.abs(cur.x - prev.x) <= 3) {
      // Perfect drop: snaps into place; every third in a row grows the container back a little.
      g.perfect += 1;
      let { x, w } = prev;
      if (g.perfect >= 3) {
        const grow = Math.min(14, BASE_W - w);
        w += grow;
        x = Math.min(Math.max(0, x - grow / 2), W - w);
        g.perfect = 0;
      }
      g.blocks.push({ x, w, hue: cur.hue });
      g.flash = { text: FUN.stack.perfect, at: performance.now(), y: topY(level) };
    } else {
      const left = Math.max(cur.x, prev.x);
      const right = Math.min(cur.x + cur.w, prev.x + prev.w);
      const overlap = right - left;
      if (overlap <= 0) {
        g.falling.push({ ...cur, y: topY(level), vy: 0, spin: cur.dir * 0.04, angle: 0 });
        g.cur = null;
        overAt.current = performance.now();
        const final = g.blocks.length - 1;
        setBest(saveBest(META.bestKey, final));
        setIsBest(final > prevBest.current);
        setPhase("over");
        return;
      }
      const cutX = cur.x < prev.x ? cur.x : right;
      g.falling.push({ x: cutX, w: cur.w - overlap, hue: cur.hue, y: topY(level), vy: 0, spin: (cur.x < prev.x ? -1 : 1) * 0.05, angle: 0 });
      g.blocks.push({ x: left, w: overlap, hue: cur.hue });
      g.perfect = 0;
    }

    const height = g.blocks.length - 1;
    setScore(height);
    if (height === 15) {
      unlock("stack");
      const r = canvas.current?.getBoundingClientRect();
      if (r) confetti({ x: r.left + r.width / 2, y: r.top + r.height / 3, count: 80 });
    }
    spawn();
  };

  const press = () => {
    const p = phaseRef.current;
    if (p === "ready") start();
    else if (p === "playing") drop();
    else if (performance.now() - overAt.current > 450) start(); // no accidental restart right after falling
  };
  const pressRef = useRef(press);
  pressRef.current = press;

  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = W * dpr;
    c.height = H * dpr;
    ctx.scale(dpr, dpr);

    const container = (x: number, y: number, w: number, hue: number, alpha = 1) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `hsl(${hue} 70% 60%)`;
      ctx.beginPath();
      ctx.roundRect(x, y, w, BH - 2, 3);
      ctx.fill();
      ctx.fillStyle = `hsl(${hue} 60% 40% / 0.35)`; // corrugated sides
      for (let rx = x + 6; rx < x + w - 4; rx += 7) ctx.fillRect(rx, y + 4, 2, BH - 10);
      ctx.fillStyle = `hsl(${hue} 90% 80% / 0.6)`;
      ctx.fillRect(x + 2, y + 1, Math.max(0, w - 4), 2);
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const k = Math.min((now - last) / 16.7, 3);
      last = now;
      const g = game.current;
      const css = getComputedStyle(document.documentElement);

      if (phaseRef.current === "playing" && g.cur) {
        const cur = g.cur;
        cur.x += cur.dir * cur.speed * k;
        if (cur.x <= 0 || cur.x >= W - cur.w) {
          cur.x = Math.min(Math.max(cur.x, 0), W - cur.w);
          cur.dir *= -1;
        }
      }
      const target = Math.max(0, (g.blocks.length - 10) * BH);
      g.cam += (target - g.cam) * Math.min(1, 0.12 * k);
      g.falling.forEach((f) => {
        f.vy += 0.45 * k;
        f.y += f.vy * k;
        f.angle += f.spin * k;
      });
      g.falling = g.falling.filter((f) => f.y + g.cam < H + 60);

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = css.getPropertyValue("--surface-2").trim();
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = css.getPropertyValue("--line-strong").trim();
      ctx.fillRect(0, H - GROUND + g.cam, W, 2);

      g.blocks.forEach((b, i) => {
        const y = topY(i) + g.cam;
        if (y < H && y > -BH) container(b.x, y, b.w, b.hue);
      });
      if (g.cur) container(g.cur.x, topY(g.blocks.length) + g.cam, g.cur.w, g.cur.hue);
      g.falling.forEach((f) => {
        ctx.save();
        ctx.translate(f.x + f.w / 2, f.y + g.cam + BH / 2);
        ctx.rotate(f.angle);
        container(-f.w / 2, -BH / 2, f.w, f.hue, 0.9);
        ctx.restore();
      });

      if (g.flash) {
        const t = (now - g.flash.at) / 700;
        if (t >= 1) g.flash = null;
        else {
          ctx.globalAlpha = 1 - t;
          ctx.fillStyle = css.getPropertyValue("--accent").trim();
          ctx.font = "600 15px ui-monospace, monospace";
          ctx.textAlign = "center";
          ctx.fillText(g.flash.text, W / 2, g.flash.y + g.cam - 8 - t * 18);
          ctx.globalAlpha = 1;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== " " && e.key !== "Enter") return;
      if (e.target instanceof Element && e.target.closest("button")) return;
      e.preventDefault();
      if (!e.repeat) pressRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div>
      <Stats
        items={[
          { label: FUN.stack.height, value: score },
          { label: FUN.best, value: Math.max(best, score) },
        ]}
      />
      <div className={`relative mt-2 overflow-hidden rounded-xl border border-line ${phase === "over" ? "shake" : ""}`}>
        <canvas
          ref={canvas}
          className="block aspect-[4/5] w-full touch-none select-none"
          onPointerDown={(e) => {
            e.preventDefault();
            press();
          }}
          aria-label={`${META.title} board`}
        />
        {phase !== "playing" && (
          <p className="pointer-events-none absolute inset-x-0 bottom-0 bg-surface/85 px-4 py-3 text-center text-sm font-medium text-fg backdrop-blur">
            {phase === "over" && (
              <span className="mb-1 flex items-center justify-center gap-2 font-mono text-xs text-muted">
                {FUN.stack.over} {FUN.stack.height} {score}
                {isBest && <NewBest />}
              </span>
            )}
            {phase === "over" ? FUN.stack.retry : FUN.stack.start}
          </p>
        )}
      </div>
    </div>
  );
}
