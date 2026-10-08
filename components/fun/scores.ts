/** Best scores per game in localStorage; every access is guarded (private mode, blocked storage). */

export function readBest(key: string): number | null {
  try {
    const v = localStorage.getItem(key);
    return v === null || Number.isNaN(Number(v)) ? null : Number(v);
  } catch {
    return null;
  }
}

/** Saves `value` if it beats the stored best and returns the best after this game. */
export function saveBest(key: string, value: number, lowerIsBetter = false): number {
  const prev = readBest(key);
  const better = prev === null || (lowerIsBetter ? value < prev : value > prev);
  if (!better) return prev;
  try {
    localStorage.setItem(key, String(value));
  } catch {
    /* the best lasts for this game */
  }
  return value;
}
