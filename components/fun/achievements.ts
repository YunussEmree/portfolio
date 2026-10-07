"use client";

import { useEffect, useState } from "react";
import { ACHIEVEMENTS, type AchievementId } from "@/data/fun";

export const ACHIEVEMENT_EVENT = "fun:achievement";
export const BUGS_EVENT = "fun:bugs";
export const OPEN_SNAKE = "fun:open-snake";
export const HINT_EVENT = "fun:hint";
export const THEME_EVENT = "fun:theme";

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
  if (next >= 5) unlock("bugs");
  return next;
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
