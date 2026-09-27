"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
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

  const toggle = useCallback(() => {
    const next: Theme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode: the choice lasts for this visit */
    }
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
