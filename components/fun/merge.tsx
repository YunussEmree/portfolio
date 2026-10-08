"use client";

import { useEffect, useRef, useState } from "react";
import { FUN, GAMES } from "@/data/fun";
import { unlock } from "./achievements";
import { confetti } from "./effects";
import { readBest, saveBest } from "./scores";
import { Panel, Stats } from "./ui";

type Tile = { id: number; value: number; r: number; c: number; merged?: boolean; fresh?: boolean; gone?: boolean };
type Dir = "up" | "down" | "left" | "right";

const META = GAMES.find((g) => g.id === "merge")!;
const N = 4;
const GAP = 8; // px between cells
const KEYS: Record<string, Dir> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};
const VEC: Record<Dir, [number, number]> = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };

let nextId = 1;
function addRandom(tiles: Tile[]): Tile[] {
  const taken = new Set(tiles.map((t) => t.r * N + t.c));
  const free = Array.from({ length: N * N }, (_, i) => i).filter((i) => !taken.has(i));
  if (!free.length) return tiles;
  const cell = free[Math.floor(Math.random() * free.length)];
  return [...tiles, { id: nextId++, value: Math.random() < 0.9 ? 2 : 4, r: Math.floor(cell / N), c: cell % N, fresh: true }];
}
const newBoard = () => addRandom(addRandom([]));

function canMove(tiles: Tile[]) {
  if (tiles.length < N * N) return true;
  const at = (r: number, c: number) => tiles.find((t) => t.r === r && t.c === c)?.value;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (at(r, c) === at(r, c + 1) || at(r, c) === at(r + 1, c)) return true;
  return false;
}

/** Merge Conflict: 2048 with commits. Tiles slide (CSS transforms), merges pop, new tiles grow in. */
export default function Merge() {
  const [tiles, setTiles] = useState<Tile[]>(newBoard);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);
  const [isBest, setIsBest] = useState(false);
  const tilesRef = useRef(tiles);
  tilesRef.current = tiles;
  const scoreRef = useRef(0);
  const busy = useRef(false);
  const prevBest = useRef(0);
  const board = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const b = readBest(META.bestKey) ?? 0;
    setBest(b);
    prevBest.current = b;
  }, []);

  const move = (dir: Dir) => {
    if (busy.current || over) return;
    const [dr, dc] = VEC[dir];
    const work = tilesRef.current.map((t) => ({ ...t, merged: false, fresh: false }));
    const grid: (Tile | null)[][] = Array.from({ length: N }, () => Array(N).fill(null));
    work.forEach((t) => (grid[t.r][t.c] = t));
    const rows = dr === 1 ? [3, 2, 1, 0] : [0, 1, 2, 3];
    const cols = dc === 1 ? [3, 2, 1, 0] : [0, 1, 2, 3];
    let moved = false;
    let gained = 0;

    for (const r of rows)
      for (const c of cols) {
        const t = grid[r][c];
        if (!t) continue;
        let nr = r;
        let nc = c;
        for (;;) {
          const tr = nr + dr;
          const tc = nc + dc;
          if (tr < 0 || tr >= N || tc < 0 || tc >= N) break;
          const other = grid[tr][tc];
          if (!other) {
            grid[nr][nc] = null;
            nr = tr;
            nc = tc;
            grid[nr][nc] = t;
            continue;
          }
          if (other.value === t.value && !other.merged) {
            // t slides onto `other` and disappears; `other` doubles.
            grid[nr][nc] = null;
            nr = tr;
            nc = tc;
            t.gone = true;
            other.value *= 2;
            other.merged = true;
            gained += other.value;
          }
          break;
        }
        if (nr !== t.r || nc !== t.c) moved = true;
        t.r = nr;
        t.c = nc;
      }
    if (!moved) return;

    busy.current = true;
    scoreRef.current += gained;
    setScore(scoreRef.current);
    setTiles(work);
    if (work.some((t) => t.merged && t.value === 256)) {
      unlock("merge");
      const r = board.current?.getBoundingClientRect();
      if (r) confetti({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 80 });
    }
    window.setTimeout(() => {
      const settled = addRandom(work.filter((t) => !t.gone));
      setTiles(settled);
      busy.current = false;
      if (!canMove(settled)) {
        setOver(true);
        setBest(saveBest(META.bestKey, scoreRef.current));
        setIsBest(scoreRef.current > prevBest.current);
      }
    }, 130);
  };
  const moveRef = useRef(move);
  moveRef.current = move;

  const restart = () => {
    prevBest.current = readBest(META.bestKey) ?? 0;
    scoreRef.current = 0;
    setScore(0);
    setOver(false);
    setIsBest(false);
    setTiles(newBoard());
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const dir = KEYS[e.key.length === 1 ? e.key.toLowerCase() : e.key];
      if (!dir) return;
      e.preventDefault();
      moveRef.current(dir);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const touch = useRef<{ x: number; y: number } | null>(null);
  const onPointerUp = (e: React.PointerEvent) => {
    const t = touch.current;
    touch.current = null;
    if (!t) return;
    const dx = e.clientX - t.x;
    const dy = e.clientY - t.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
  };

  const top = tiles.reduce((m, t) => Math.max(m, t.value), 0);
  // The outer box only moves (transform transition); the inner face carries the colour and the pop.
  const place = (t: Tile): React.CSSProperties => ({
    width: `calc((100% - ${GAP * (N + 1)}px) / ${N})`,
    height: `calc((100% - ${GAP * (N + 1)}px) / ${N})`,
    left: GAP,
    top: GAP,
    transform: `translate(calc(${t.c} * (100% + ${GAP}px)), calc(${t.r} * (100% + ${GAP}px)))`,
    zIndex: t.gone ? 1 : 2,
  });
  const face = (t: Tile): React.CSSProperties => {
    const p = Math.min(100, (Math.log2(t.value) / 9) * 100); // 2 → 11%, 512 and up → 100%
    return {
      background: `color-mix(in oklab, var(--accent-fill) ${p}%, var(--surface))`,
      color: p > 55 ? "var(--accent-ink)" : "var(--fg)",
    };
  };

  return (
    <div>
      <Stats
        items={[
          { label: FUN.score, value: score },
          { label: FUN.merge.top, value: top },
          { label: FUN.best, value: Math.max(best, score) },
        ]}
      />
      <div
        ref={board}
        className="relative mt-3 aspect-square touch-none select-none rounded-2xl border border-line bg-surface-2"
        onPointerDown={(e) => (touch.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={onPointerUp}
        aria-label={`${META.title} board`}
      >
        {/* Empty cells */}
        <div className="absolute inset-0 grid grid-cols-4" style={{ gap: GAP, padding: GAP }} aria-hidden="true">
          {Array.from({ length: N * N }, (_, i) => (
            <span key={i} className="rounded-xl bg-line" />
          ))}
        </div>
        {tiles.map((t) => (
          <div key={t.id} className="merge-tile absolute" style={place(t)}>
            <div
              className={`grid size-full place-items-center rounded-xl font-mono font-bold shadow-sm ${t.merged ? "tile-merge" : t.fresh ? "tile-new" : ""} ${
                t.value >= 1024 ? "text-base" : t.value >= 128 ? "text-lg" : "text-xl"
              }`}
              style={face(t)}
            >
              {t.value}
            </div>
          </div>
        ))}
        {over && (
          <Panel title={FUN.merge.over} action={FUN.merge.again} onAction={restart} best={isBest}>
            {FUN.score} {score} · {FUN.merge.top} {top}
          </Panel>
        )}
      </div>
      <p className="mt-3 text-center font-mono text-[0.68rem] text-faint">{FUN.merge.keys}</p>
    </div>
  );
}
