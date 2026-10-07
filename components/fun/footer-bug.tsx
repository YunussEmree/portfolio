"use client";

import { useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS, FUN } from "@/data/fun";
import { fixBug, HINT_EVENT, useFunStats } from "./achievements";

const BUG = 28; // px

/** A bug that wanders along the footer's top border. Click it and a hammer debugs it; it respawns somewhere else. */
export function FooterBug() {
  const track = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [squashed, setSquashed] = useState(false);
  // Where the hammer lands; the hammer and the label are not inside the (rotated) bug.
  const [hit, setHit] = useState<{ x: number; n: number } | null>(null);
  const squashedRef = useRef(false);
  const pos = useRef({ x: 40, dir: 1, speed: 0.6, pause: 0 });

  useEffect(() => {
    const el = track.current;
    const b = button.current;
    if (!el || !b) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const place = () => {
      const p = pos.current;
      b.style.transform = `translateX(${p.x}px) rotate(${p.dir > 0 ? 90 : -90}deg)`;
      b.dataset.walking = p.pause > 0 || still ? "false" : "true";
    };
    pos.current.x = Math.random() * Math.max(0, el.clientWidth - BUG);
    place();
    if (still) return;

    let raf = 0;
    let last = performance.now();
    let visible = false;
    const loop = (now: number) => {
      const k = Math.min((now - last) / 16.7, 3);
      last = now;
      const p = pos.current;
      const max = Math.max(0, el.clientWidth - BUG);
      if (!squashedRef.current) {
        if (p.pause > 0) p.pause -= k;
        else {
          p.x += p.dir * p.speed * k;
          if (p.x <= 0 || p.x >= max) {
            p.x = Math.min(Math.max(p.x, 0), max);
            p.dir *= -1;
          } else if (Math.random() < 0.004 * k) p.pause = 40 + Math.random() * 80; // stop and look around
          else if (Math.random() < 0.003 * k) p.dir *= -1;
        }
        place();
      }
      if (visible) raf = requestAnimationFrame(loop);
    };
    // Only walks while the footer is on screen.
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const squash = () => {
    if (squashedRef.current) return;
    squashedRef.current = true;
    setSquashed(true);
    setHit({ x: pos.current.x, n: Date.now() });
    if (button.current) button.current.dataset.walking = "false";
    fixBug();
    window.setTimeout(() => {
      const el = track.current;
      const p = pos.current;
      p.dir = Math.random() < 0.5 ? 1 : -1;
      p.x = p.dir > 0 ? 0 : Math.max(0, (el?.clientWidth ?? 0) - BUG);
      p.speed = 0.5 + Math.random() * 0.6;
      p.pause = 0;
      if (button.current) button.current.style.transform = `translateX(${p.x}px) rotate(${p.dir > 0 ? 90 : -90}deg)`;
      squashedRef.current = false;
      setSquashed(false);
      setHit(null);
    }, 1700);
  };

  return (
    <div ref={track} className="pointer-events-none absolute inset-x-4 top-0 h-7 -translate-y-1/2 sm:inset-x-6 lg:inset-x-8">
      <button
        ref={button}
        type="button"
        onClick={squash}
        aria-label={FUN.bug}
        className="footer-bug pointer-events-auto absolute left-0 top-0 grid size-7 place-items-center text-faint hover:text-accent"
      >
        <span className={squashed ? "bug-squash" : "bug-respawn"}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            <path className="bug-legs" d="M7.5 10 4 8M7 14H3.5M7.5 18 4 20M16.5 10 20 8M17 14h3.5M16.5 18l3.5 2" />
            <path d="M10 5.5 8.5 3M14 5.5 15.5 3" />
            <ellipse cx="12" cy="14.5" rx="5" ry="6" fill="currentColor" fillOpacity="0.18" />
            <circle cx="12" cy="7" r="2.6" fill="var(--bg)" />
            <path d="M12 9v11.5" />
          </svg>
        </span>
      </button>

      {hit && (
        <span key={hit.n} aria-hidden="true" className="absolute top-0" style={{ left: hit.x }}>
          {/* Hammer: winds up around the hand, slams onto the bug, bounces and fades. */}
          <svg viewBox="0 0 36 22" width="36" height="22" className="hammer-swing absolute -top-[9px] left-2 text-fg">
            <rect x="12" y="7.5" width="23" height="4" rx="2" fill="var(--muted)" />
            <rect x="1" y="1" width="11" height="16" rx="2.5" fill="currentColor" />
            <rect x="1" y="13" width="11" height="2" fill="var(--bg)" opacity="0.25" />
          </svg>
          {/* Impact lines around the bug. */}
          <svg viewBox="0 0 28 28" width="28" height="28" className="hammer-impact absolute left-0 top-0 text-accent">
            <path d="M2 14h4M22 14h4M5 5l3 3M23 5l-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="debugged-pop absolute left-3.5 top-0 whitespace-nowrap font-mono text-[0.7rem] font-semibold text-accent">
            {FUN.debugged}
          </span>
        </span>
      )}
      <span className="sr-only" aria-live="polite">
        {hit ? FUN.debugged : ""}
      </span>
    </div>
  );
}

/** "3 bugs fixed · 1/4 secrets found" next to the copyright. */
export function FunStats() {
  const { bugs, found } = useFunStats();
  return (
    <p className="font-mono text-[0.7rem] text-faint">
      <span className="tabular-nums">{bugs}</span> {bugs === 1 ? FUN.stats.bug : FUN.stats.bugs} ·{" "}
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(HINT_EVENT))}
        title={FUN.stats.hint}
        className="underline decoration-dotted underline-offset-2 transition hover:text-accent"
      >
        <span className="tabular-nums">
          {found}/{ACHIEVEMENTS.length}
        </span>{" "}
        {FUN.stats.secrets}
      </button>
    </p>
  );
}
