"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { THEME_EVENT } from "./fun/achievements";

type Theme = "dark" | "light";
type Point = { x: number; y: number };

const ThemeContext = createContext<{ theme: Theme; toggle: (origin?: Point) => void }>({
  theme: "dark",
  toggle: () => {},
});

export const useTheme = () => useContext(ThemeContext);

/** Theme state (the class on <html> is the source of truth) and smooth scrolling. */
export default function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  /** Switches the theme in one step; with View Transitions the new theme grows as a circle from `origin`. */
  const toggle = useCallback((origin?: Point) => {
    const root = document.documentElement;
    const next: Theme = root.classList.contains("dark") ? "light" : "dark";
    window.dispatchEvent(new Event(THEME_EVENT));
    const apply = () => {
      root.classList.toggle("dark", next === "dark");
      setTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* private mode: the choice lasts for this visit */
      }
    };

    // Elements with their own color transitions would otherwise change at different speeds.
    root.classList.add("theme-switching");
    const done = () => requestAnimationFrame(() => root.classList.remove("theme-switching"));

    const doc = document as Document & {
      startViewTransition?: (update: () => void) => { ready: Promise<void>; finished: Promise<void> };
    };
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      done();
      return;
    }

    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? window.innerHeight / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = doc.startViewTransition(() => flushSync(apply));
    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 600, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
    transition.finished.finally(done);
  }, []);

  useEffect(() => {
    // Smooth wheel scrolling on desktop only; touch and reduced-motion users keep native scrolling.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Started once the page is idle so it never competes with the first render.
    let lenis: Lenis | undefined;
    let raf = 0;
    const start = () => {
      lenis = new Lenis({ lerp: 0.11, smoothWheel: true, anchors: { offset: -88 } });
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };
    const idle = window.requestIdleCallback?.(start, { timeout: 1500 }) ?? window.setTimeout(start, 300);
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
