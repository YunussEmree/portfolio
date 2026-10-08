"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { THEME_EVENT } from "./fun/achievements";

type Theme = "dark" | "light";
type Point = { x: number; y: number };

/** `toggle` returns whether the theme changed (always, now that it is instant; the bulb relies on it). */
const ThemeContext = createContext<{ theme: Theme; toggle: (origin?: Point) => boolean }>({
  theme: "dark",
  toggle: () => false,
});

export const useTheme = () => useContext(ThemeContext);

/** Theme state (the class on <html> is the source of truth) and smooth scrolling. */
export default function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  /**
   * Switches the theme instantly. Animated switches (a View Transition, then a colour wipe) crashed or glitched in
   * some Chromium-based browsers, so there is no animation; `origin` is kept for callers that pass the click point.
   */
  const toggle = useCallback((_origin?: Point) => {
    const root = document.documentElement;
    const next: Theme = root.classList.contains("dark") ? "light" : "dark";
    window.dispatchEvent(new Event(THEME_EVENT));
    // Elements with their own color transitions would otherwise change at different speeds.
    root.classList.add("theme-switching");
    root.classList.toggle("dark", next === "dark");
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode: the choice lasts for this visit */
    }
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
    return true;
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
