"use client";

import { useEffect, useState } from "react";
import { ACHIEVEMENTS, type AchievementId, type GameId } from "@/data/fun";

export const ACHIEVEMENT_EVENT = "fun:achievement";
export const BUGS_EVENT = "fun:bugs";
export const OPEN_ARCADE = "fun:open-arcade";
export const HINT_EVENT = "fun:hint";
export const THEME_EVENT = "fun:theme";
export const GLOBAL_BUGS_EVENT = "fun:global-bugs";

const KEY = "achievements";
const BUGS_KEY = "bugs-fixed";

// Kept in memory too, so a blocked localStorage still unlocks each achievement only once per visit.
const memory = new Set<AchievementId>();
let memoryBugs = 0;

export function unlockedAchievements(): AchievementId[] {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
    saved.forEach((id) => ACHIEVEMENTS.some((a) => a.id === id) && memory.add(id as AchievementId));
  } catch {
    /* private mode or corrupt value: fall back to this visit */
  }
  return [...memory];
}

export function unlock(id: AchievementId) {
  const have = unlockedAchievements();
  if (have.includes(id)) return;
  memory.add(id);
  try {
    localStorage.setItem(KEY, JSON.stringify([...memory]));
  } catch {
    /* the achievement lasts for this visit */
  }
  window.dispatchEvent(new CustomEvent(ACHIEVEMENT_EVENT, { detail: { id, count: memory.size } }));
}

export function bugsFixed(): number {
  try {
    memoryBugs = Math.max(memoryBugs, Number(localStorage.getItem(BUGS_KEY)) || 0);
  } catch {
    /* use the in-memory count */
  }
  return memoryBugs;
}

export function fixBug(): number {
  const next = bugsFixed() + 1;
  memoryBugs = next;
  try {
    localStorage.setItem(BUGS_KEY, String(next));
  } catch {
    /* the count lasts for this visit */
  }
  window.dispatchEvent(new Event(BUGS_EVENT));
  unlock("bugs");
  reportBug();
  return next;
}

/* The shared counter (app/api/bugs): every visitor's squashed bugs added up. null until known or when unavailable. */
let globalBugs: number | null = null;
const announce = (total: number | null) => {
  globalBugs = total;
  window.dispatchEvent(new CustomEvent(GLOBAL_BUGS_EVENT, { detail: total }));
};

async function reportBug() {
  if (globalBugs !== null) announce(globalBugs + 1); // show it at once, then take the server's number
  try {
    const res = await fetch("/api/bugs", { method: "POST" });
    const { total } = (await res.json()) as { total: number | null };
    if (typeof total === "number") announce(Math.max(total, globalBugs ?? 0));
  } catch {
    /* offline: keep the optimistic number */
  }
}

/** The shared total, or null when the counter is not available (then show the visitor's own count). */
export function useGlobalBugs() {
  const [total, setTotal] = useState<number | null>(globalBugs);
  useEffect(() => {
    const on = (e: Event) => setTotal((e as CustomEvent<number | null>).detail);
    window.addEventListener(GLOBAL_BUGS_EVENT, on);
    if (globalBugs === null)
      fetch("/api/bugs")
        .then((r) => r.json())
        .then(({ total: t }: { total: number | null }) => typeof t === "number" && announce(t))
        .catch(() => {});
    return () => window.removeEventListener(GLOBAL_BUGS_EVENT, on);
  }, []);
  return total;
}

/** What the arcade dialog shows: a game, the trophy case, or (null) the picker. */
export type ArcadeView = GameId | "trophies";

/** Opens the arcade dialog, on the picker or straight into a game or the trophy case. */
export function openArcade(view?: ArcadeView) {
  window.dispatchEvent(new CustomEvent(OPEN_ARCADE, { detail: { view: view ?? null } }));
}

/** Live counts for the footer: bugs fixed and secrets found. */
export function useFunStats() {
  const [stats, setStats] = useState({ bugs: 0, found: 0 });
  useEffect(() => {
    const read = () => setStats({ bugs: bugsFixed(), found: unlockedAchievements().length });
    read();
    window.addEventListener(ACHIEVEMENT_EVENT, read);
    window.addEventListener(BUGS_EVENT, read);
    return () => {
      window.removeEventListener(ACHIEVEMENT_EVENT, read);
      window.removeEventListener(BUGS_EVENT, read);
    };
  }, []);
  return stats;
}
