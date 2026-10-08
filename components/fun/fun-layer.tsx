"use client";

import { Lightbulb, Terminal, Trophy } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS, FUN, type GameId } from "@/data/fun";
import { PROFILE } from "@/data/profile";
import { ACHIEVEMENT_EVENT, HINT_EVENT, OPEN_ARCADE, THEME_EVENT, unlock, unlockedAchievements } from "./achievements";
import { barrelRoll, confetti, emojiRain } from "./effects";
import ScreenBug from "./screen-bug";

// The arcade and its games only download when someone opens it.
const Arcade = dynamic(() => import("./arcade"), { ssr: false });

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const TOTAL = ACHIEVEMENTS.length;

type Toast = { kind: "achievement" | "complete" | "hint" | "terminal"; label: string; title?: string; detail: string; key: number };

const ICONS = { achievement: Trophy, complete: Trophy, hint: Lightbulb, terminal: Terminal };

/**
 * Easter eggs shared by every page: the Konami code, secret words, the console, tab title, theme spam,
 * hints, achievement toasts and the arcade.
 */
export default function FunLayer() {
  const [toast, setToast] = useState<Toast | null>(null);
  // undefined: closed; null: the game picker; otherwise the game being played.
  const [arcade, setArcade] = useState<GameId | null | undefined>(undefined);
  const arcadeOpen = useRef(false);
  arcadeOpen.current = arcade !== undefined;
  const timer = useRef(0);

  const show = (t: Omit<Toast, "key">, ms = 3800) => {
    window.clearTimeout(timer.current);
    setToast({ ...t, key: Date.now() });
    timer.current = window.setTimeout(() => setToast(null), ms);
  };

  // Achievement toasts, then the finale once everything is found.
  useEffect(() => {
    const onUnlock = (e: Event) => {
      const { id, count } = (e as CustomEvent<{ id: string; count: number }>).detail;
      const a = ACHIEVEMENTS.find((x) => x.id === id);
      if (!a) return;
      show({ kind: "achievement", label: `${FUN.achievementLabel} · ${count}/${TOTAL}`, title: a.title, detail: a.detail });
      if (count < TOTAL) return;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        show({ kind: "complete", label: `${TOTAL}/${TOTAL}`, title: FUN.complete.title, detail: FUN.complete.detail }, 7000);
        confetti({ count: 180, power: 1.4 });
      }, 3800);
    };
    const onHint = () => {
      const found = unlockedAchievements();
      const left = ACHIEVEMENTS.filter((a) => !found.includes(a.id));
      const pick = left[Math.floor(Math.random() * left.length)];
      show({ kind: "hint", label: `${FUN.hint.label} · ${found.length}/${TOTAL}`, detail: pick ? pick.hint : FUN.hint.none }, 5000);
    };
    window.addEventListener(ACHIEVEMENT_EVENT, onUnlock);
    window.addEventListener(HINT_EVENT, onHint);
    return () => {
      window.clearTimeout(timer.current);
      window.removeEventListener(ACHIEVEMENT_EVENT, onUnlock);
      window.removeEventListener(HINT_EVENT, onHint);
    };
  }, []);

  // Keys: the Konami code and secret words typed anywhere outside a text field.
  useEffect(() => {
    let pos = 0;
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      if (arcadeOpen.current || e.metaKey || e.ctrlKey || el?.closest("input, textarea, [contenteditable='true']")) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      // A third "up" keeps the last two as the start of the code.
      pos = key === KONAMI[pos] ? pos + 1 : key === "ArrowUp" ? (pos === 2 ? 2 : 1) : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        barrelRoll();
        confetti({ count: 140 });
        unlock("konami");
      }

      if (!/^[a-z]$/.test(key)) return;
      typed = (typed + key).slice(-12);
      if (typed.endsWith("sudo")) {
        typed = "";
        if (unlockedAchievements().includes("sudo")) show({ kind: "terminal", label: "$ sudo", detail: FUN.sudoAgain });
        else unlock("sudo");
      } else if (typed.endsWith("coffee")) {
        typed = "";
        emojiRain("☕");
      }
    };
    const onOpen = (e: Event) => setArcade((e as CustomEvent<{ game: GameId | null }>).detail?.game ?? null);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_ARCADE, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_ARCADE, onOpen);
    };
  }, []);

  // Eight theme switches within a short while.
  useEffect(() => {
    let switches: number[] = [];
    const onTheme = () => {
      const now = Date.now();
      switches = [...switches.filter((t) => now - t < 15000), now];
      if (switches.length >= 8) {
        switches = [];
        unlock("indecisive");
      }
    };
    window.addEventListener(THEME_EVENT, onTheme);
    return () => window.removeEventListener(THEME_EVENT, onTheme);
  }, []);

  // A note for whoever opens the console, and hire() for them to call.
  useEffect(() => {
    const w = window as Window & { hire?: () => string };
    if (w.hire) return;
    w.hire = () => {
      unlock("inspector");
      confetti({ count: 120 });
      return `${FUN.console.reply} ${PROFILE.email}`;
    };
    console.log(
      `%c${FUN.console.banner}%c\n${FUN.console.body}\n${FUN.console.call}`,
      "font: 600 16px system-ui; color: #c6f36a; background: #09090b; padding: 6px 10px; border-radius: 6px;",
      "font: 13px system-ui; line-height: 1.6;",
    );
  }, []);

  // The tab calls you back while you're away.
  useEffect(() => {
    let saved = "";
    const onVisibility = () => {
      if (document.hidden) {
        // Never save our own message, or a second "hidden" event would make it permanent.
        if (document.title !== FUN.away) saved = document.title;
        document.title = FUN.away;
      } else if (saved && document.title === FUN.away) {
        document.title = saved;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const Icon = toast ? ICONS[toast.kind] : Trophy;
  const trophy = toast?.kind === "achievement" || toast?.kind === "complete";

  return (
    <>
      <ScreenBug />
      {arcade !== undefined && <Arcade initial={arcade} onClose={() => setArcade(undefined)} />}
      <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-6 right-4 z-[120] sm:right-6">
        {toast && (
          <div
            key={toast.key}
            className="toast-in pointer-events-auto flex w-[min(22rem,calc(100vw-2rem))] items-start gap-3 rounded-2xl border border-line-strong bg-surface p-4 shadow-2xl shadow-black/30"
          >
            <span
              className={`trophy-pop grid size-10 shrink-0 place-items-center rounded-xl ${
                trophy ? "bg-accent-fill text-accent-ink" : "bg-surface-2 text-accent"
              }`}
            >
              <Icon className="size-5" />
            </span>
            <span className="min-w-0 text-sm">
              <span className="block font-mono text-[0.68rem] uppercase tracking-wider text-faint">{toast.label}</span>
              {toast.title && <span className="mt-0.5 block font-semibold text-fg">{toast.title}</span>}
              <span className={`mt-0.5 block ${toast.kind === "terminal" ? "font-mono text-xs text-fg" : "text-muted"}`}>
                {toast.detail}
              </span>
              {toast.kind === "complete" && (
                <a href="/#contact" className="mt-2 inline-block font-medium text-accent hover:underline">
                  {FUN.complete.cta} →
                </a>
              )}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
