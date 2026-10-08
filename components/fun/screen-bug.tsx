"use client";

import { useEffect, useRef, useState } from "react";
import { FUN } from "@/data/fun";
import { fixBug, SUMMON_BUG } from "./achievements";
import { BugIcon, HammerIcon } from "./icons";

type Point = { x: number; y: number };
type Walker = Point & { heading: number; speed: number; target: Point; stops: number; pause: number; exiting: boolean };

const SIZE = 40; // the clickable box, px
const FIRST_VISIT: [number, number] = [6000, 12000];
const NEXT_VISIT: [number, number] = [25000, 45000];
const between = ([a, b]: [number, number]) => a + Math.random() * (b - a);

/**
 * Every now and then a bug crawls in from an edge of the screen, wanders around the middle, stops to look around
 * and leaves through another edge. Click it and a hammer debugs it.
 */
export default function ScreenBug() {
  const [active, setActive] = useState(false);
  const [hit, setHit] = useState<(Point & { n: number }) | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const walker = useRef<Walker | null>(null);
  const squashed = useRef(false);
  const visitTimer = useRef(0);

  // The next visit; postponed while the tab is in the background so nobody misses it.
  const scheduleVisit = (range: [number, number]) => {
    window.clearTimeout(visitTimer.current);
    const tryVisit = () => {
      if (document.hidden) visitTimer.current = window.setTimeout(tryVisit, 3000);
      else setActive(true);
    };
    visitTimer.current = window.setTimeout(tryVisit, between(range));
  };

  useEffect(() => {
    scheduleVisit(FIRST_VISIT);
    // Summoned: come now, unless one is already on screen.
    const summon = () => {
      window.clearTimeout(visitTimer.current);
      setActive(true);
    };
    window.addEventListener(SUMMON_BUG, summon);
    return () => {
      window.clearTimeout(visitTimer.current);
      window.removeEventListener(SUMMON_BUG, summon);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const b = button.current;
    if (!b) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nearCenter = (): Point => ({ x: w / 2 + (Math.random() - 0.5) * w * 0.45, y: h / 2 + (Math.random() - 0.5) * h * 0.4 });
    const offEdge = (margin: number): Point => {
      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) return { x: -margin, y: h * (0.15 + Math.random() * 0.7) };
      if (edge === 1) return { x: w + margin, y: h * (0.15 + Math.random() * 0.7) };
      if (edge === 2) return { x: w * (0.15 + Math.random() * 0.7), y: -margin };
      return { x: w * (0.15 + Math.random() * 0.7), y: h + margin };
    };

    const start = still ? nearCenter() : offEdge(SIZE);
    const target = nearCenter();
    walker.current = {
      ...start,
      heading: Math.atan2(target.y - start.y, target.x - start.x),
      speed: 1.6 + Math.random() * 0.6,
      target,
      stops: 2 + Math.floor(Math.random() * 2),
      pause: 0,
      exiting: false,
    };
    squashed.current = false;

    const place = () => {
      const p = walker.current!;
      // The drawing faces up, so it turns a quarter more than its heading.
      b.style.transform = `translate(${p.x - SIZE / 2}px, ${p.y - SIZE / 2}px) rotate(${p.heading + Math.PI / 2}rad)`;
      b.dataset.walking = p.pause > 0 || still || squashed.current ? "false" : "true";
    };
    place();

    const leave = () => {
      setActive(false);
      scheduleVisit(NEXT_VISIT);
    };

    // Less motion: the bug simply sits near the middle for a while.
    if (still) {
      const t = window.setTimeout(() => !squashed.current && leave(), 9000);
      return () => window.clearTimeout(t);
    }

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const k = Math.min((now - last) / 16.7, 3);
      last = now;
      const p = walker.current!;
      if (!squashed.current) {
        if (p.pause > 0) p.pause -= k;
        else {
          const dx = p.target.x - p.x;
          const dy = p.target.y - p.y;
          if (!p.exiting && Math.hypot(dx, dy) < 30) {
            p.stops -= 1;
            if (p.stops <= 0) {
              p.exiting = true;
              p.target = offEdge(SIZE * 3);
            } else {
              p.target = nearCenter();
              if (Math.random() < 0.6) p.pause = 30 + Math.random() * 60; // stop and look around
            }
          }
          // Turn smoothly towards the target, with a little wobble so it never looks robotic.
          const want = Math.atan2(dy, dx);
          const diff = Math.atan2(Math.sin(want - p.heading), Math.cos(want - p.heading));
          p.heading += Math.max(-0.07, Math.min(0.07, diff)) * k + (Math.random() - 0.5) * 0.06 * k;
          p.x += Math.cos(p.heading) * p.speed * k;
          p.y += Math.sin(p.heading) * p.speed * k;
          const gone = p.x < -SIZE * 1.5 || p.x > w + SIZE * 1.5 || p.y < -SIZE * 1.5 || p.y > h + SIZE * 1.5;
          if (p.exiting && gone) return leave();
        }
        place();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const squash = () => {
    const p = walker.current;
    if (squashed.current || !p) return;
    squashed.current = true;
    if (button.current) button.current.dataset.walking = "false";
    setHit({ x: p.x, y: p.y, n: Date.now() });
    fixBug();
    window.setTimeout(() => {
      setHit(null);
      setActive(false);
      scheduleVisit(NEXT_VISIT);
    }, 1400);
  };

  if (!active && !hit) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      {active && (
        <button
          ref={button}
          type="button"
          onClick={squash}
          aria-label={FUN.bug}
          className="screen-bug pointer-events-auto absolute left-0 top-0 grid place-items-center text-fg hover:text-accent"
          style={{ width: SIZE, height: SIZE }}
        >
          <span className={hit ? "bug-squash" : undefined}>
            <BugIcon size={30} />
          </span>
        </button>
      )}

      {hit && (
        <span key={hit.n} aria-hidden="true" className="absolute" style={{ left: hit.x, top: hit.y }}>
          {/* Hammer: winds up around the hand, slams onto the bug, bounces and fades. */}
          <HammerIcon width={48} className="hammer-swing absolute -left-[9px] -top-[27px] text-fg" />
          {/* Impact lines around the bug. */}
          <svg viewBox="0 0 28 28" width="40" height="40" className="hammer-impact absolute -left-5 -top-5 text-accent">
            <path d="M2 14h4M22 14h4M5 5l3 3M23 5l-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="debugged-pop absolute left-0 -top-7 whitespace-nowrap font-mono text-xs font-semibold text-accent">{FUN.debugged}</span>
        </span>
      )}
      <span className="sr-only" aria-live="polite">
        {hit ? FUN.debugged : ""}
      </span>
    </div>
  );
}
