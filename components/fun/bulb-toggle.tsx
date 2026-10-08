"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "../providers";
import { unlock } from "./achievements";

type Mode = "on" | "off" | "broken";
type Phase = "ok" | "exploding" | "broken";

const GLASS = "M12 2a6.5 6.5 0 0 0-3.9 11.7c.6.5.9 1.1.9 1.8V17h6v-1.5c0-.7.3-1.3.9-1.8A6.5 6.5 0 0 0 12 2z";
const JAGGED = "M9 17v-1.5c0-.7-.3-1.3-.9-1.8l1.5-1.6.9 1.5 1.3-2.1 1.1 1.9 1.3-1.6 1.2 1.9c-.6.5-.9 1.1-.9 1.8V17z";
const BASE = "M9 18.6h6M9.4 20.8h5.2M10.8 23h2.4";

/** Light theme: the bulb is lit. Dark theme: it is off. After five quick switches it blows. */
function Bulb({ mode, screwed }: { mode: Mode; screwed: number }) {
  const lit = mode === "on";
  return (
    <svg viewBox="-4 -4 32 32" className={`size-[1.4rem] overflow-visible ${lit ? "bulb-glow" : ""}`} aria-hidden="true">
      {lit && (
        <g className="bulb-rays" stroke="#f5b400" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12-2.6v2.1M2.6 1.4l1.5 1.5M21.4 1.4l-1.5 1.5M-1.4 9.5h2.1M23.3 9.5h2.1" />
        </g>
      )}
      {mode === "broken" ? (
        <path d={JAGGED} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      ) : (
        <g key={screwed} className={screwed ? "bulb-screw" : ""}>
          <path d={GLASS} fill={lit ? "#ffd54a" : "none"} stroke={lit ? "#c99700" : "currentColor"} strokeWidth="1.6" />
          <path d="M10 12.6l1-2 1 2 1-2 1 2" fill="none" stroke={lit ? "#a87400" : "currentColor"} strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round" />
        </g>
      )}
      <path d={BASE} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const SHARDS: [number, number, number][] = [
  [-20, -14, -140],
  [18, -18, 160],
  [-22, 6, -220],
  [22, 8, 240],
  [-6, -24, 100],
  [8, -26, -90],
  [-15, 20, 180],
  [15, 19, -170],
];

function Explosion() {
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden="true">
      <span className="bulb-flash absolute left-1/2 top-1/2 size-10 rounded-full bg-[#ffe27a]" />
      {SHARDS.map(([dx, dy, r], i) => (
        <span
          key={i}
          className="bulb-shard absolute left-1/2 top-[38%] h-2.5 w-1.5 bg-[#d8ecff]"
          style={{ "--dx": `${dx}px`, "--dy": `${dy}px`, "--r": `${r}deg`, clipPath: "polygon(50% 0, 100% 100%, 0 100%)" } as React.CSSProperties}
        />
      ))}
      <span className="bulb-smoke absolute left-[40%] top-[30%] size-3 rounded-full" />
      <span className="bulb-smoke bulb-smoke-late absolute left-[55%] top-[28%] size-2.5 rounded-full" />
    </span>
  );
}

type Pose = {
  x: number;
  y: number;
  ms: number;
  mood: "calm" | "angry";
  walk: boolean;
  arm: "down" | "up";
  carry: "new" | "old" | "none";
  shake: boolean;
  /** Fades him in and out at the cover, for covers that are not opaque. */
  seen: boolean;
};

/**
 * The janitor: peeks out from behind the button next to the bulb (Résumé, or the menu button on phones), glares at
 * you, walks under the bulb, screws in a new one and carries the broken one away.
 */
function Janitor({ bulb, onSwap, onDone }: { bulb: HTMLElement; onSwap: () => void; onDone: () => void }) {
  const [pose, setPose] = useState<Pose | null>(null);
  const cb = useRef({ onSwap, onDone });
  cb.current = { onSwap, onDone };

  useEffect(() => {
    const box = bulb.parentElement;
    const cover = [...(box?.querySelectorAll<HTMLElement>("[data-janitor-cover]") ?? [])].find((el) => el.offsetParent !== null);
    if (!box || !cover) {
      cb.current.onSwap();
      cb.current.onDone();
      return;
    }
    const W = 30; // drawn at 1.25× the 24 × 34 artwork
    const behind = cover.offsetLeft + 8; // hidden behind the cover
    const peek = cover.offsetLeft - 19; // head and eyes past its edge
    const under = bulb.offsetLeft + bulb.offsetWidth / 2 - W / 2;
    const base: Pose = { x: behind, y: -2, ms: 0, mood: "calm", walk: false, arm: "down", carry: "none", shake: false, seen: false };

    const steps: [number, Partial<Pose> | (() => void)][] = [
      [0, base],
      [60, { x: peek, ms: 450, seen: true }], // peek out…
      [900, { mood: "angry" }], // …look at you, get angry
      [1050, { shake: true }],
      [1750, { shake: false }],
      [2150, { x: under, y: 22, ms: 850, walk: true, carry: "new" }], // walk under the bulb with a new one
      [3050, { walk: false, arm: "up" }],
      [3450, () => cb.current.onSwap()], // screw it in…
      [3450, { carry: "old" }], // …and take the broken one
      [4250, { arm: "down", mood: "calm" }], // job done, he calms down
      [4500, { x: behind, y: -2, ms: 950, walk: true }], // back behind the cover
      [5250, { seen: false }],
      [5550, () => cb.current.onDone()],
    ];
    const timers = steps.map(([at, step]) =>
      window.setTimeout(() => (typeof step === "function" ? step() : setPose((p) => ({ ...(p ?? base), ...step }))), at),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [bulb]);

  if (!pose) return null;
  const angry = pose.mood === "angry";
  return (
    <span
      className="pointer-events-none absolute left-0 top-0 z-10"
      style={{
        transform: `translate(${pose.x}px, ${pose.y}px)`,
        opacity: pose.seen ? 1 : 0,
        transition: `transform ${pose.ms}ms cubic-bezier(0.45, 0, 0.25, 1), opacity 0.3s`,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 34" width="30" height="42.5" className={`overflow-visible ${pose.shake ? "janitor-shake" : ""} ${pose.walk ? "janitor-walk" : ""}`}>
        {/* Anger mark */}
        {angry && (
          <path className="best-pop" d="M19 0.5v2.4M20.7 2.1h-2.4M22.5 3.6l-1.6 1M17.4 4.9l1.2.9" stroke="#ff4d4d" strokeWidth="1.3" strokeLinecap="round" />
        )}
        {/* Legs and shoes */}
        <g className="janitor-leg-l">
          <rect x="8" y="25" width="3.2" height="7" rx="1.2" fill="#2c3e66" />
          <rect x="7" y="31" width="4.6" height="2.2" rx="1" fill="#1d1d22" />
        </g>
        <g className="janitor-leg-r">
          <rect x="12.8" y="25" width="3.2" height="7" rx="1.2" fill="#2c3e66" />
          <rect x="12.4" y="31" width="4.6" height="2.2" rx="1" fill="#1d1d22" />
        </g>
        {/* Overalls */}
        <rect x="6" y="15.5" width="12" height="11.5" rx="3.2" fill="#3a6fd8" />
        <rect x="9" y="18" width="6" height="4.5" rx="1" fill="#2f5cb8" />
        <path d="M8 15.8l2 3M16 15.8l-2 3" stroke="#2f5cb8" strokeWidth="1.2" strokeLinecap="round" />
        {/* Left arm, with the broken bulb once he has it */}
        <g>
          <rect x="3.6" y="16.5" width="2.8" height="8" rx="1.4" fill="#3a6fd8" />
          <circle cx="5" cy="25" r="1.6" fill="#f2c6a0" />
          {pose.carry === "old" && <path d="M3.6 27.6l.6-1 .5.8.6-1 .5.9.6-.8v2.6h-2.8z" fill="#c9ced6" stroke="#7b818c" strokeWidth="0.5" />}
        </g>
        {/* Right arm swings up to the socket, holding the new bulb */}
        <g className="janitor-arm" style={{ transform: pose.arm === "up" ? "rotate(-160deg)" : "rotate(0deg)" }}>
          <rect x="17.6" y="16.5" width="2.8" height="8" rx="1.4" fill="#3a6fd8" />
          <circle cx="19" cy="25" r="1.6" fill="#f2c6a0" />
          {pose.carry === "new" && (
            <g>
              <circle cx="19" cy="28.4" r="2.2" fill="#ffd54a" stroke="#c99700" strokeWidth="0.5" />
              <rect x="18" y="26.2" width="2" height="1.2" fill="#9aa0aa" />
            </g>
          )}
        </g>
        {/* Head: hard hat, brows, eyes, mouth. The face reddens when he is angry. */}
        <circle cx="12" cy="10" r="5.6" fill={angry ? "#ff8a74" : "#f2c6a0"} style={{ transition: "fill 0.3s" }} />
        <path d="M6 9.2a6 6 0 0 1 12 0z" fill="#ffc21a" />
        <rect x="5" y="8.6" width="14" height="1.6" rx="0.8" fill="#e0a800" />
        <path d="M12 3.4v3" stroke="#e0a800" strokeWidth="1.2" />
        <path
          d={angry ? "M8.7 11l2.3.9M15.3 11l-2.3.9" : "M8.8 11.2h2.2M13 11.2h2.2"}
          stroke="#2a1d16"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <circle cx="10" cy="12.6" r="0.85" fill="#1d1d1f" />
        <circle cx="14" cy="12.6" r="0.85" fill="#1d1d1f" />
        <path d={angry ? "M10.4 15.1q1.6-1.3 3.2 0" : "M10.6 14.6q1.4.7 2.8 0"} fill="none" stroke="#2a1d16" strokeWidth="0.9" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/** The theme switch, drawn as a light bulb, with its easter egg. */
export default function BulbToggle() {
  const { theme, toggle } = useTheme();
  const [phase, setPhase] = useState<Phase>("ok");
  const [screwed, setScrewed] = useState(0);
  const [janitor, setJanitor] = useState(false);
  const switches = useRef<number[]>([]);
  const button = useRef<HTMLButtonElement>(null);

  const press = (r: DOMRect) => {
    if (phase !== "ok") return; // a blown bulb waits for the janitor
    const origin = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    toggle(origin);
    const now = Date.now();
    switches.current = [...switches.current.filter((t) => now - t < 3500), now];
    if (switches.current.length < 3) return;

    // Three switches in a hurry: the bulb blows and, a moment later, the lights go out.
    switches.current = [];
    setPhase("exploding");
    unlock("bulb");
    window.setTimeout(() => {
      if (!document.documentElement.classList.contains("dark")) toggle(origin);
    }, 350);
    window.setTimeout(() => setPhase("broken"), 800);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.setTimeout(() => {
        setPhase("ok");
        setScrewed((n) => n + 1);
      }, 2500);
    } else window.setTimeout(() => setJanitor(true), 1600);
  };

  const mode: Mode = phase === "ok" ? (theme === "light" ? "on" : "off") : "broken";

  return (
    <>
      <button
        ref={button}
        type="button"
        onClick={(e) => press(e.currentTarget.getBoundingClientRect())}
        aria-disabled={phase !== "ok"}
        className="group relative grid size-9 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-fg aria-disabled:cursor-not-allowed"
        aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      >
        <span className="transition-transform duration-300 group-hover:scale-110 group-active:scale-90">
          <Bulb mode={mode} screwed={screwed} />
        </span>
        {phase === "exploding" && <Explosion />}
      </button>
      {janitor && button.current && (
        <Janitor
          bulb={button.current}
          onSwap={() => {
            setPhase("ok");
            setScrewed((n) => n + 1);
          }}
          onDone={() => setJanitor(false)}
        />
      )}
    </>
  );
}
