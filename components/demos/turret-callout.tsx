"use client";

import { useEffect, useRef, useState } from "react";
import { TURRET } from "@/data/demos";
import { unlock } from "../fun/achievements";
import { confetti } from "../fun/effects";

type Kind = "missile" | "f16" | "heli" | "drone";
type Target = {
  id: number;
  kind: Kind;
  wave: number;
  x: number;
  y: number;
  baseY: number;
  vx: number;
  vy: number;
  born: number;
  seenAt: number; // first moment on screen; it locks a little later
  conf: string;
  hp: number;
  dead: null | { vy: number; spin: number; angle: number };
};
type Bullet = { x: number; y: number; vx: number; vy: number; life: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; color: string };
type Floating = { x: number; y: number; text: string; born: number; color: string };

const BOX = "#22d3ee";
const LOCKED = "#ff4d4d";
const TRACER = "#ffd54a";
const IDLE_AIM = -2; // radians, barrel up and to the left
const BULLET_SPEED = 16;
// Engagement order, like the real system: the most dangerous first.
const PRIORITY: Kind[] = ["missile", "f16", "heli", "drone"];
const SPEC: Record<Kind, { hp: number; speed: number; box: [number, number] }> = {
  missile: { hp: 1, speed: 3.4, box: [50, 16] },
  f16: { hp: 2, speed: 4.2, box: [60, 24] },
  heli: { hp: 3, speed: 1.3, box: [56, 28] },
  drone: { hp: 2, speed: 1.9, box: [48, 32] },
};

/**
 * The ENGEREK card's turret. Each click sends a wave (missile, F-16, helicopter, drone); YOLO-style boxes track them,
 * the turret engages them in priority order, locks, leads and fires, and the wrecks go down in smoke. Clicking during
 * a wave fires an extra burst at the current target. Clearing a whole wave unlocks an achievement.
 */
export default function TurretCallout() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const barrel = useRef<SVGGElement>(null);
  const [kills, setKills] = useState(0);
  const world = useRef({
    targets: [] as Target[],
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    texts: [] as Floating[],
    flashUntil: 0,
    nextShotAt: 0,
    aim: IDLE_AIM,
    w: 0,
    h: 0,
    running: false,
    ids: 0,
    wave: 0,
    waveLeft: new Map<number, { total: number; killed: number; escaped: number }>(),
    kills: 0,
  });

  // The canvas follows the size of the screenshot panel.
  useEffect(() => {
    const el = wrap.current;
    const c = canvas.current;
    if (!el || !c) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      world.current.w = el.clientWidth;
      world.current.h = el.clientHeight;
      c.width = el.clientWidth * dpr;
      c.height = el.clientHeight * dpr;
      c.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pivot = () => {
    const b = button.current?.getBoundingClientRect();
    const r = wrap.current?.getBoundingClientRect();
    if (!b || !r) return { x: 0, y: 0 };
    return { x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height / 2 };
  };
  const muzzle = () => {
    const p = pivot();
    const a = world.current.aim;
    return { x: p.x + Math.cos(a) * 16, y: p.y + Math.sin(a) * 16 };
  };

  /** Where to aim so a tracer meets the target (one refinement step is plenty here). */
  const lead = (t: Target) => {
    const m = muzzle();
    let tx = t.x;
    let ty = t.y;
    for (let i = 0; i < 2; i++) {
      const time = Math.hypot(tx - m.x, ty - m.y) / BULLET_SPEED;
      tx = t.x + t.vx * time;
      ty = t.y + t.vy * time;
    }
    return Math.atan2(ty - m.y, tx - m.x);
  };

  const burst = (t: Target, shots = 3) => {
    const g = world.current;
    for (let i = 0; i < shots; i++)
      window.setTimeout(() => {
        if (t.dead) return;
        const m = muzzle();
        const a = lead(t) + (Math.random() - 0.5) * 0.03;
        g.bullets.push({ x: m.x, y: m.y, vx: Math.cos(a) * BULLET_SPEED, vy: Math.sin(a) * BULLET_SPEED, life: 80 });
        g.flashUntil = performance.now() + 60;
      }, i * 100);
  };

  const current = () => {
    const g = world.current;
    const now = performance.now();
    const ready = g.targets.filter((t) => !t.dead && t.seenAt && now - t.seenAt > 380 && t.x > 0 && t.x < g.w);
    ready.sort((a, b) => PRIORITY.indexOf(a.kind) - PRIORITY.indexOf(b.kind));
    return ready[0];
  };

  const spawnWave = () => {
    const g = world.current;
    const now = performance.now();
    g.wave += 1;
    const kinds = [...PRIORITY].sort(() => Math.random() - 0.5);
    g.waveLeft.set(g.wave, { total: kinds.length, killed: 0, escaped: 0 });
    const lanes = [0.12, 0.22, 0.32, 0.42].sort(() => Math.random() - 0.5);
    kinds.forEach((kind, i) => {
      const fromLeft = Math.random() < 0.5;
      const dir = fromLeft ? 1 : -1;
      const s = SPEC[kind];
      const baseY = g.h * lanes[i];
      g.targets.push({
        id: ++g.ids,
        kind,
        wave: g.wave,
        x: fromLeft ? -60 - i * 70 : g.w + 60 + i * 70,
        y: kind === "missile" ? baseY - g.h * 0.08 : baseY,
        baseY,
        vx: dir * s.speed * (0.9 + Math.random() * 0.2),
        vy: kind === "missile" ? 0.35 : 0,
        born: now,
        seenAt: 0,
        conf: (0.88 + Math.random() * 0.11).toFixed(2),
        hp: s.hp,
        dead: null,
      });
    });
  };

  const start = () => {
    const g = world.current;
    if (g.running) return;
    g.running = true;
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    let last = performance.now();

    const loop = (now: number) => {
      const k = Math.min((now - last) / 16.7, 3);
      last = now;
      const { w, h } = g;

      for (const t of g.targets) {
        if (t.dead) {
          t.dead.vy += 0.3 * k;
          t.y += t.dead.vy * k;
          t.x += t.vx * 0.35 * k;
          t.dead.angle += t.dead.spin * k;
          if (Math.random() < 0.55 * k)
            g.particles.push({ x: t.x, y: t.y, vx: (Math.random() - 0.5) * 0.4, vy: -0.4, life: 0, max: 50, r: 4 + Math.random() * 4, color: "smoke" });
          continue;
        }
        t.x += t.vx * k;
        if (t.kind === "missile") t.y += t.vy * k;
        else if (t.kind === "heli") t.y = t.baseY + Math.sin((now - t.born) / 500) * 4;
        else if (t.kind === "drone") t.y = t.baseY + Math.sin((now - t.born) / 260) * 7;
        if (!t.seenAt && t.x > 0 && t.x < w) t.seenAt = now;
        if (t.kind === "missile" && Math.random() < 0.7 * k)
          g.particles.push({ x: t.x - Math.sign(t.vx) * 22, y: t.y, vx: -t.vx * 0.1, vy: (Math.random() - 0.5) * 0.3, life: 0, max: 26, r: 2.5, color: "smoke" });
      }

      // Targets that left the screen alive escaped.
      for (const t of g.targets)
        if (!t.dead && ((t.vx > 0 && t.x > w + 90) || (t.vx < 0 && t.x < -90) || t.y > h + 40)) {
          const wv = g.waveLeft.get(t.wave);
          if (wv) wv.escaped += 1;
          t.hp = -99;
        }
      g.targets = g.targets.filter((t) => t.hp !== -99 && (t.dead ? t.y < h + 60 : true));

      for (const b of g.bullets) {
        b.x += b.vx * k;
        b.y += b.vy * k;
        b.life -= k;
        const hit = g.targets.find((t) => !t.dead && Math.abs(t.x - b.x) < SPEC[t.kind].box[0] / 2 && Math.abs(t.y - b.y) < SPEC[t.kind].box[1] / 2);
        if (!hit) continue;
        b.life = 0;
        hit.hp -= 1;
        for (let i = 0; i < 6; i++)
          g.particles.push({ x: b.x, y: b.y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, life: 0, max: 14, r: 1.6, color: TRACER });
        if (hit.hp > 0) continue;
        hit.dead = { vy: -1.2, spin: (Math.random() < 0.5 ? -1 : 1) * (hit.kind === "f16" ? 0.06 : 0.12), angle: 0 };
        for (let i = 0; i < 28; i++) {
          const a = Math.random() * Math.PI * 2;
          const v = 1 + Math.random() * 4.5;
          g.particles.push({ x: hit.x, y: hit.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 22 + Math.random() * 14, r: 2 + Math.random() * 3, color: Math.random() < 0.5 ? "#ff8a3d" : "#ffd54a" });
        }
        g.texts.push({ x: hit.x, y: hit.y - 24, text: `${TURRET.down} ${TURRET.labels[hit.kind]}`, born: now, color: "#c6f36a" });
        g.kills += 1;
        setKills(g.kills);
        const wv = g.waveLeft.get(hit.wave);
        if (wv) {
          wv.killed += 1;
          if (wv.killed === wv.total) {
            g.texts.push({ x: w / 2, y: h * 0.55, text: TURRET.cleared, born: now, color: "#ffffff" });
            unlock("airdefense");
            const r = wrap.current?.getBoundingClientRect();
            if (r) confetti({ x: r.left + w / 2, y: r.top + h * 0.5, count: 110 });
          }
        }
      }
      g.bullets = g.bullets.filter((b) => b.life > 0 && b.x > -20 && b.x < w + 20 && b.y > -20 && b.y < h + 20);

      for (const p of g.particles) {
        p.x += p.vx * k;
        p.y += p.vy * k;
        p.vx *= 0.96;
        p.vy = p.color === "smoke" ? p.vy : p.vy * 0.96 + 0.08 * k;
        p.life += k;
      }
      g.particles = g.particles.filter((p) => p.life < p.max);
      g.texts = g.texts.filter((t) => now - t.born < 1500);

      // Fire control: swing to the highest-priority locked target and fire once on target.
      const target = current();
      const want = target ? lead(target) : IDLE_AIM;
      const diff = Math.atan2(Math.sin(want - g.aim), Math.cos(want - g.aim));
      g.aim += diff * Math.min(1, 0.25 * k);
      if (barrel.current) barrel.current.style.transform = `rotate(${g.aim}rad)`;
      if (target && Math.abs(diff) < 0.06 && now >= g.nextShotAt) {
        burst(target);
        g.nextShotAt = now + 420;
      }

      // Draw.
      ctx.clearRect(0, 0, w, h);
      for (const p of g.particles) {
        const t = p.life / p.max;
        const smoke = p.color === "smoke";
        ctx.globalAlpha = smoke ? 0.35 * (1 - t) : 1 - t;
        ctx.fillStyle = smoke ? "#9aa0aa" : p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, smoke ? p.r * (1 + t * 2) : p.r * (1 - t * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (const t of g.targets) drawTarget(ctx, t, now, target?.id === t.id);

      ctx.strokeStyle = TRACER;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.shadowColor = TRACER;
      ctx.shadowBlur = 8;
      for (const b of g.bullets) {
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x - b.vx * 1.3, b.y - b.vy * 1.3);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      if (now < g.flashUntil) {
        const m = muzzle();
        ctx.fillStyle = "#fff3b0";
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const r = i % 2 ? 4 : 11;
          const a = g.aim + (i / 10) * Math.PI * 2;
          ctx.lineTo(m.x + Math.cos(a) * r, m.y + Math.sin(a) * r);
        }
        ctx.fill();
      }

      ctx.textAlign = "center";
      for (const t of g.texts) {
        const a = (now - t.born) / 1500;
        ctx.globalAlpha = 1 - a;
        ctx.fillStyle = t.color;
        ctx.font = t.color === "#ffffff" ? "italic 400 26px Georgia, \"Times New Roman\", serif" : "700 12px ui-monospace, monospace";
        ctx.fillText(t.text, t.x, t.y - a * 22);
      }
      ctx.globalAlpha = 1;

      const busy = g.targets.length || g.bullets.length || g.particles.length || g.texts.length || Math.abs(diff) > 0.01;
      if (busy) requestAnimationFrame(loop);
      else g.running = false;
    };
    requestAnimationFrame(loop);
  };

  const onFire = () => {
    const g = world.current;
    const live = g.targets.some((t) => !t.dead);
    if (!live) spawnWave();
    else {
      const t = current();
      if (t) burst(t, 2); // a manual burst on top of the automatic fire
    }
    start();
  };

  return (
    <div ref={wrap} className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[1.5rem]">
      <canvas ref={canvas} className="absolute inset-0 size-full" aria-hidden="true" />

      <div className="absolute bottom-4 right-4 flex items-end gap-1 sm:bottom-5 sm:right-5">
        <div className="callout-bob relative mb-9 mr-[-6px] text-right" aria-hidden="true">
          <span className="serif-accent block whitespace-nowrap text-xl text-white drop-shadow-[0_2px_6px_rgb(0_0_0/0.5)] sm:text-2xl">{TURRET.label}</span>
          <svg viewBox="0 0 70 46" className="ml-auto h-10 w-16 text-white/90" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path className="callout-draw" d="M6 4c10 22 30 34 56 36" />
            <path className="callout-draw callout-draw-late" d="M52 32l11 8-12 4" />
          </svg>
        </div>
        <span className="relative grid size-16 place-items-center">
          <svg viewBox="0 0 64 64" className="callout-ticks absolute -inset-4 size-24 text-white/85" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M32 2v7M2 32h7M10 10l5 5M54 10l-5 5M62 32h-7" />
          </svg>
          <span className="absolute inset-0 animate-ping rounded-full bg-accent-fill/40 motion-reduce:hidden" aria-hidden="true" />
          <button
            ref={button}
            type="button"
            onClick={onFire}
            aria-label={TURRET.button}
            className="pointer-events-auto relative grid size-14 place-items-center rounded-full bg-accent-fill text-accent-ink shadow-xl shadow-black/40 ring-4 ring-white/15 transition hover:scale-110 active:scale-95"
          >
            {/* A small turret; the barrel group turns towards the current target. */}
            <svg viewBox="0 0 24 24" className="size-7 overflow-visible" aria-hidden="true">
              <g ref={barrel} style={{ transformOrigin: "12px 13px", transform: `rotate(${IDLE_AIM}rad)` }}>
                <rect x="12" y="11.9" width="9.5" height="2.2" rx="1" fill="currentColor" />
                <rect x="19.5" y="11.4" width="2.4" height="3.2" rx="0.8" fill="currentColor" />
              </g>
              <path d="M7.5 15a4.5 4.5 0 0 1 9 0z" fill="currentColor" />
              <path d="M4.5 20.5h15l-1.6-4.6H6.1z" fill="currentColor" opacity="0.85" />
              <circle cx="12" cy="13" r="1.4" fill="var(--accent-fill)" />
            </svg>
          </button>
          {kills > 0 && (
            <span key={kills} className="best-pop absolute -left-2 -top-2 rounded-full bg-[#0b1720] px-1.5 py-0.5 font-mono text-[0.65rem] font-bold text-white ring-1 ring-white/20">
              ×{kills}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

/** Silhouettes, facing the way they fly, inside a detector-style box while alive (red with LOCK when engaged). */
function drawTarget(ctx: CanvasRenderingContext2D, t: Target, now: number, engaged: boolean) {
  const dir = t.vx >= 0 ? 1 : -1;
  ctx.save();
  ctx.translate(t.x, t.y);
  if (t.dead) ctx.rotate(t.dead.angle);
  ctx.scale(dir, 1);

  if (t.kind === "f16") {
    ctx.fillStyle = "#8d97a6";
    ctx.beginPath(); // fuselage, nose to the right
    ctx.moveTo(26, 0);
    ctx.lineTo(14, -3);
    ctx.lineTo(-20, -3);
    ctx.lineTo(-24, 0);
    ctx.lineTo(-20, 3);
    ctx.lineTo(14, 3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#6f7988";
    ctx.beginPath(); // delta wing
    ctx.moveTo(6, 1);
    ctx.lineTo(-12, 10);
    ctx.lineTo(-16, 10);
    ctx.lineTo(-8, 1);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath(); // tail fin
    ctx.moveTo(-14, -3);
    ctx.lineTo(-22, -12);
    ctx.lineTo(-24, -12);
    ctx.lineTo(-21, -3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#9fd3ff";
    ctx.fillRect(8, -4.5, 6, 2); // canopy
    if (!t.dead) {
      ctx.fillStyle = Math.floor(now / 60) % 2 ? "#ffb547" : "#ff6b3d";
      ctx.beginPath();
      ctx.arc(-26, 0, 2.2, 0, Math.PI * 2); // afterburner
      ctx.fill();
    }
  } else if (t.kind === "missile") {
    ctx.fillStyle = "#d9dde4";
    ctx.beginPath();
    ctx.moveTo(22, 0);
    ctx.lineTo(16, -2.6);
    ctx.lineTo(-18, -2.6);
    ctx.lineTo(-18, 2.6);
    ctx.lineTo(16, 2.6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ff4d4d";
    ctx.beginPath(); // red nose band
    ctx.moveTo(22, 0);
    ctx.lineTo(16, -2.6);
    ctx.lineTo(16, 2.6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#8d97a6";
    ctx.beginPath(); // fins
    ctx.moveTo(-12, -2.6);
    ctx.lineTo(-18, -8);
    ctx.lineTo(-18, -2.6);
    ctx.moveTo(-12, 2.6);
    ctx.lineTo(-18, 8);
    ctx.lineTo(-18, 2.6);
    ctx.fill();
    if (!t.dead) {
      ctx.fillStyle = Math.floor(now / 50) % 2 ? "#ffd54a" : "#ff8a3d";
      ctx.beginPath(); // exhaust flame
      ctx.moveTo(-18, -2);
      ctx.lineTo(-27 - Math.random() * 4, 0);
      ctx.lineTo(-18, 2);
      ctx.fill();
    }
  } else if (t.kind === "heli") {
    ctx.fillStyle = "#4f5d4a";
    ctx.beginPath();
    ctx.ellipse(6, 2, 13, 7, 0, 0, Math.PI * 2); // body
    ctx.fill();
    ctx.fillRect(-24, 0, 22, 3); // tail boom
    ctx.fillStyle = "#9fd3ff";
    ctx.beginPath();
    ctx.ellipse(13, 0, 5, 4, 0, 0, Math.PI * 2); // cockpit
    ctx.fill();
    ctx.strokeStyle = "#2f3a2c";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); // skids
    ctx.moveTo(-4, 11);
    ctx.lineTo(16, 11);
    ctx.stroke();
    const blade = Math.abs(Math.cos(now / 40)) * 22 + 4;
    ctx.strokeStyle = "rgb(220 225 235 / 0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath(); // main rotor
    ctx.moveTo(6 - blade, -7);
    ctx.lineTo(6 + blade, -7);
    ctx.stroke();
    ctx.beginPath(); // tail rotor
    const tr = now / 25;
    ctx.moveTo(-24 + Math.cos(tr) * 4, 1.5 + Math.sin(tr) * 4);
    ctx.lineTo(-24 - Math.cos(tr) * 4, 1.5 - Math.sin(tr) * 4);
    ctx.stroke();
  } else {
    const spin = now / 30;
    ctx.strokeStyle = "#1f2733";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-13, -6);
    ctx.lineTo(13, 6);
    ctx.moveTo(13, -6);
    ctx.lineTo(-13, 6);
    ctx.stroke();
    for (const [rx, ry] of [
      [-13, -6],
      [13, -6],
      [-13, 6],
      [13, 6],
    ]) {
      ctx.strokeStyle = "rgb(220 225 235 / 0.9)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      const a = spin + rx;
      ctx.moveTo(rx + Math.cos(a) * 7, ry + Math.sin(a) * 2.2);
      ctx.lineTo(rx - Math.cos(a) * 7, ry - Math.sin(a) * 2.2);
      ctx.stroke();
    }
    ctx.fillStyle = "#2b3442";
    ctx.beginPath();
    ctx.roundRect(-6, -4, 12, 8, 3);
    ctx.fill();
    ctx.fillStyle = Math.floor(now / 250) % 2 ? "#ff4d4d" : "#4a1d1d";
    ctx.beginPath();
    ctx.arc(0, 0, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  if (t.dead || !t.seenAt) return;
  const [bw, bh] = SPEC[t.kind].box;
  const x = t.x - bw / 2;
  const y = t.y - bh / 2;
  const color = engaged ? LOCKED : BOX;
  ctx.strokeStyle = color;
  ctx.lineWidth = engaged ? 2.2 : 1.6;
  const c = 7;
  ctx.beginPath(); // corner brackets, like a detector's box
  ctx.moveTo(x, y + c);
  ctx.lineTo(x, y);
  ctx.lineTo(x + c, y);
  ctx.moveTo(x + bw - c, y);
  ctx.lineTo(x + bw, y);
  ctx.lineTo(x + bw, y + c);
  ctx.moveTo(x + bw, y + bh - c);
  ctx.lineTo(x + bw, y + bh);
  ctx.lineTo(x + bw - c, y + bh);
  ctx.moveTo(x + c, y + bh);
  ctx.lineTo(x, y + bh);
  ctx.lineTo(x, y + bh - c);
  ctx.stroke();
  const label = `${engaged ? `${TURRET.lock} · ` : ""}${TURRET.labels[t.kind]} ${t.conf}`;
  ctx.font = "700 10px ui-monospace, monospace";
  const tw = ctx.measureText(label).width + 8;
  ctx.fillStyle = color;
  ctx.fillRect(x, y - 15, tw, 14);
  ctx.fillStyle = "#0b1720";
  ctx.textAlign = "left";
  ctx.fillText(label, x + 4, y - 4.5);
}
