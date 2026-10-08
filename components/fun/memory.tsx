"use client";

import { useEffect, useRef, useState } from "react";
import { FUN, GAMES } from "@/data/fun";
import { unlock } from "./achievements";
import { confetti } from "./effects";
import { readBest, saveBest } from "./scores";
import { Panel, Stats } from "./ui";

type Card = { id: number; label: string; color: string; matched: boolean };

const META = GAMES.find((g) => g.id === "memory")!;
const PALETTE = ["#c6f36a", "#7aa2ff", "#ffb547", "#ff6b8b", "#5ee6c8", "#b48cff", "#ff8f5e", "#4fd1ff"];

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const deal = (): Card[] =>
  shuffle(
    shuffle(FUN.memory.stack)
      .slice(0, 8)
      .flatMap((label, i) => [
        { label, color: PALETTE[i] },
        { label, color: PALETTE[i] },
      ]),
  ).map((c, id) => ({ ...c, id, matched: false }));

/** Stack Match: a 4×4 memory game with the technologies I work with. Fewer moves is better. */
export default function Memory() {
  const [cards, setCards] = useState<Card[]>(deal);
  const [open, setOpen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState<number | null>(null);
  const [isBest, setIsBest] = useState(false);
  const [wrong, setWrong] = useState<number[]>([]);
  const prevBest = useRef<number | null>(null);
  const board = useRef<HTMLDivElement>(null);

  useEffect(() => setBest(readBest(META.bestKey)), []);

  // The clock runs from the first flip to the last pair.
  useEffect(() => {
    if (startedAt === null || done) return;
    const t = window.setInterval(() => setElapsed(Date.now() - startedAt), 250);
    return () => window.clearInterval(t);
  }, [startedAt, done]);

  const flip = (i: number) => {
    if (done || open.length === 2 || cards[i].matched || open.includes(i)) return;
    if (startedAt === null) {
      setStartedAt(Date.now());
      prevBest.current = readBest(META.bestKey);
    }
    const next = [...open, i];
    setOpen(next);
    if (next.length < 2) return;

    const [a, b] = next;
    const made = moves + 1;
    setMoves(made);
    if (cards[a].label === cards[b].label) {
      window.setTimeout(() => {
        const updated = cards.map((c, k) => (k === a || k === b ? { ...c, matched: true } : c));
        setCards(updated);
        setOpen([]);
        if (updated.every((c) => c.matched)) {
          setDone(true);
          setBest(saveBest(META.bestKey, made, true));
          setIsBest(prevBest.current === null || made < prevBest.current);
          if (made <= 14) {
            unlock("memory");
            const r = board.current?.getBoundingClientRect();
            if (r) confetti({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 80 });
          }
        }
      }, 350);
    } else {
      // A wrong pair shakes its head before turning back.
      window.setTimeout(() => setWrong([a, b]), 420);
      window.setTimeout(() => {
        setOpen([]);
        setWrong([]);
      }, 900);
    }
  };

  const restart = () => {
    setCards(deal());
    setOpen([]);
    setMoves(0);
    setStartedAt(null);
    setElapsed(0);
    setDone(false);
    setIsBest(false);
    setWrong([]);
  };

  const seconds = Math.floor(elapsed / 1000);

  return (
    <div>
      <Stats
        items={[
          { label: FUN.memory.moves, value: moves },
          { label: FUN.time, value: `${seconds}s` },
          { label: FUN.best, value: best ?? "–" },
        ]}
      />

      <div ref={board} className="relative mt-3">
        <div className="grid grid-cols-4 gap-2">
          {cards.map((c, i) => {
            const faceUp = c.matched || open.includes(i);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => flip(i)}
                aria-label={faceUp ? c.label : FUN.memory.hidden}
                className={`flip-card aspect-square ${wrong.includes(i) ? "wiggle" : ""}`}
              >
                <span className={`flip-inner ${faceUp ? "is-flipped" : ""} ${c.matched ? "is-matched" : ""}`}>
                  <span className="flip-face border border-line bg-surface-2 font-mono text-sm text-faint">{"</>"}</span>
                  <span
                    className="flip-face flip-front border-2 bg-surface px-1 text-center font-mono text-[0.68rem] font-semibold leading-tight text-fg sm:text-xs"
                    style={{ borderColor: c.color }}
                  >
                    <span>
                      <span className="mx-auto mb-1 block size-2 rounded-full" style={{ background: c.color }} />
                      {c.label}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {done && (
          <Panel title={FUN.memory.done} action={FUN.memory.again} onAction={restart} best={isBest}>
            <span className="font-mono">
              {moves} {FUN.memory.moves.toLowerCase()} · {seconds}s · {FUN.best} {best}
            </span>
          </Panel>
        )}
      </div>
      {!done && moves === 0 && <p className="mt-3 text-center text-sm text-muted">{FUN.memory.intro}</p>}
    </div>
  );
}
