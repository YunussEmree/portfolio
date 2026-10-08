"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { THEME_EVENT } from "./fun/achievements";

type Theme = "dark" | "light";
type Point = { x: number; y: number };

/** `toggle` returns false when it did nothing because the last switch is still animating (the cooldown). */
const ThemeContext = createContext<{ theme: Theme; toggle: (origin?: Point) => boolean }>({
  theme: "dark",
  toggle: () => false,
});

export const useTheme = () => useContext(ThemeContext);

// Page backgrounds of each theme (--bg in app/globals.css), for the wipe that covers the switch.
const BG: Record<Theme, string> = { dark: "#09090b", light: "#f6f6f3" };

/** Theme state (the class on <html> is the source of truth) and smooth scrolling. */
export default function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  // Cooldown: true while a switch animates; clicks meanwhile do nothing.
  const busy = useRef(false);

  /**
   * Switches the theme. A circle of the new background grows from `origin` over the page, the theme flips
   * underneath it, and the circle fades away. This used to be a View Transition, but those snapshot the whole page
   * on the GPU and repeated switching crashed Chromium-based browsers; one animated element is cheap everywhere.
   */
  const toggle = useCallback((origin?: Point) => {
    if (busy.current) return false;
    const root = document.documentElement;
    const next: Theme = root.classList.contains("dark") ? "light" : "dark";
    window.dispatchEvent(new Event(THEME_EVENT));
    const apply = () => {
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
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("animate" in HTMLElement.prototype)) {
      apply();
      return true;
    }

    busy.current = true;
    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? window.innerHeight / 2;
    const w = Math.max(window.innerWidth, root.clientWidth);
    const h = Math.max(window.innerHeight, root.clientHeight, window.visualViewport?.height ?? 0);
    const radius = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + 40;

    const cover = document.createElement("div");
    cover.setAttribute("aria-hidden", "true");
    Object.assign(cover.style, { position: "fixed", inset: "0", zIndex: "2147483000", pointerEvents: "none", background: BG[next] });
    document.body.appendChild(cover);
    const finish = () => {
      cover.remove();
      busy.current = false;
    };
    // Never stuck: whatever happens, the cover goes and the cooldown ends.
    let applied = false;
    const applyOnce = () => {
      if (applied) return;
      applied = true;
      apply();
    };
    const failsafe = window.setTimeout(() => {
      applyOnce();
      finish();
    }, 1500);

    cover
      .animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] }, { duration: 380, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" })
      .finished.then(() => {
        applyOnce();
        return cover.animate({ opacity: [1, 0] }, { duration: 280, easing: "ease-out", fill: "forwards" }).finished;
      })
      .catch(() => applyOnce())
      .finally(() => {
        window.clearTimeout(failsafe);
        finish();
      });
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
