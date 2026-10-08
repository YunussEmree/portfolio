"use client";

import { Check, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { KELIME_DEMO as T } from "@/data/demos";
import { unlock } from "../fun/achievements";
import { confetti } from "../fun/effects";

type Card = { i: number; jar: boolean; hits: number };

const fresh = (): Card[] => T.words.map((_, i) => ({ i, jar: false, hits: 0 }));

/** The sentence first, then the meaning; a missed word drops into the review jar until it is right three times. */
function Sentence({ text, word }: { text: string; word: string }) {
  const at = text.toLowerCase().indexOf(word.toLowerCase());
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="rounded bg-[#c6f36a]/25 px-1 font-semibold text-fg">{text.slice(at, at + word.length)}</span>
      {text.slice(at + word.length)}
    </>
  );
}

export default function KelimeDemo() {
  const [queue, setQueue] = useState<Card[]>(fresh);
  const [learned, setLearned] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [drag, setDrag] = useState(0);
  const [leaving, setLeaving] = useState<"left" | "right" | null>(null);
  const [dropped, setDropped] = useState<number | null>(null); // word that just fell into the jar
  const start = useRef<number | null>(null);
  const board = useRef<HTMLDivElement>(null);

  const card = queue[0];
  const word = card ? T.words[card.i] : null;
  const jar = queue.filter((c) => c.jar);
  const done = queue.length === 0;

  useEffect(() => {
    if (!done) return;
    unlock("collector");
    const r = board.current?.getBoundingClientRect();
    if (r) confetti({ x: r.left + r.width / 2, y: r.top + 80, count: 90 });
  }, [done]);

  const decide = (knew: boolean) => {
    if (!card || leaving) return;
    setLeaving(knew ? "right" : "left");
    // Nothing else can change the queue while the card flies off (`leaving` blocks input), so this one is current.
    const [c, ...rest] = queue;
    window.setTimeout(() => {
      if (knew && (!c.jar || c.hits + 1 >= 3)) {
        setLearned((n) => n + 1);
        setQueue(rest);
      } else if (knew) {
        setQueue([...rest, { ...c, hits: c.hits + 1 }]);
      } else {
        setDropped(c.i);
        window.setTimeout(() => setDropped(null), 700);
        // Back in the jar with a fresh count, and it comes round again soon.
        setQueue([...rest.slice(0, 2), { ...c, jar: true, hits: 0 }, ...rest.slice(2)]);
      }
      setFlipped(false);
      setDrag(0);
      setLeaving(null);
    }, 260);
  };

  // Keys: ← review, → known, Space turns the card.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") decideRef.current(false);
      else if (e.key === "ArrowRight") decideRef.current(true);
      else if (e.key === " ") {
        if (e.target instanceof Element && e.target.closest("button")) return;
        e.preventDefault();
        setFlipped((f) => !f);
      } else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const decideRef = useRef(decide);
  decideRef.current = decide;

  const restart = () => {
    setQueue(fresh());
    setLearned(0);
    setFlipped(false);
    setDrag(0);
  };

  const offset = leaving === "right" ? 420 : leaving === "left" ? -420 : drag;
  const swipeHint = Math.min(1, Math.abs(drag) / 90);

  return (
    <div ref={board} className="overflow-hidden rounded-2xl border border-line">
      {/* The app's own colours for the header. */}
      <div className="flex items-center justify-between bg-[linear-gradient(135deg,#27513f,#0f1f18)] px-4 py-3 text-white">
        <span className="text-sm font-medium">{T.deck}</span>
        <span className="font-mono text-xs text-white/75">
          {learned}/{T.words.length} {T.learned}
        </span>
      </div>
      <div className="h-1 bg-surface-2">
        <div className="h-full bg-[#c6f36a] transition-[width] duration-500" style={{ width: `${(learned / T.words.length) * 100}%` }} />
      </div>

      <div className="bg-surface p-4">
        {done ? (
          <div className="py-8 text-center">
            <p className="display text-3xl text-fg">{T.done}</p>
            <p className="mt-2 text-sm text-muted">{T.doneDetail}</p>
            <button type="button" onClick={restart} className="mt-5 inline-flex h-10 items-center rounded-full bg-accent-fill px-5 text-sm font-medium text-accent-ink transition hover:brightness-105">
              {T.again}
            </button>
          </div>
        ) : (
          word && (
            <>
              <div className="relative h-52 select-none" style={{ perspective: 900 }}>
                <button
                  key={`${card.i}-${queue.length}-${card.hits}`}
                  type="button"
                  onClick={() => Math.abs(drag) < 6 && setFlipped((f) => !f)}
                  onPointerDown={(e) => {
                    start.current = e.clientX;
                    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e) => start.current !== null && setDrag(e.clientX - start.current)}
                  onPointerUp={() => {
                    start.current = null;
                    if (drag > 90) decide(true);
                    else if (drag < -90) decide(false);
                    else setDrag(0);
                  }}
                  aria-label={flipped ? `${word.word}: ${word.meaning}` : word.sentence}
                  className="tile-new absolute inset-0 touch-pan-y"
                  style={{
                    transform: `translateX(${offset}px) rotate(${offset / 18}deg)`,
                    transition: start.current === null ? "transform 0.26s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
                  }}
                >
                  <span className={`flip-inner ${flipped ? "is-flipped" : ""}`}>
                    <span className="flip-face border border-line-strong bg-surface-2 p-5 text-center">
                      <span>
                        {card.jar && (
                          <span className="mb-2 flex justify-center gap-1" aria-label={`${card.hits}/3`}>
                            {[0, 1, 2].map((d) => (
                              <span key={d} className={`size-1.5 rounded-full ${d < card.hits ? "bg-[#c6f36a]" : "bg-line-strong"}`} />
                            ))}
                          </span>
                        )}
                        <span className="block text-[1.05rem] leading-relaxed text-muted">
                          <Sentence text={word.sentence} word={word.word} />
                        </span>
                        <span className="mt-4 block font-mono text-[0.65rem] text-faint">{T.tap}</span>
                      </span>
                    </span>
                    <span className="flip-face flip-front border border-line-strong bg-surface-2 p-5 text-center">
                      <span>
                        <span className="display block text-3xl text-fg">{word.word}</span>
                        <span className="mt-2 block text-muted">{word.meaning}</span>
                      </span>
                    </span>
                  </span>
                  {/* What letting go would do. */}
                  <span
                    className="pointer-events-none absolute left-4 top-4 rounded-lg border-2 border-[#28c840] px-2 py-0.5 text-xs font-bold uppercase text-[#28c840]"
                    style={{ opacity: drag > 0 ? swipeHint : 0, transform: "rotate(-12deg)" }}
                  >
                    {T.known}
                  </span>
                  <span
                    className="pointer-events-none absolute right-4 top-4 rounded-lg border-2 border-[#ffb547] px-2 py-0.5 text-xs font-bold uppercase text-[#ffb547]"
                    style={{ opacity: drag < 0 ? swipeHint : 0, transform: "rotate(12deg)" }}
                  >
                    {T.review}
                  </span>
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => decide(false)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface-2 text-sm font-medium text-fg transition hover:border-[#ffb547]"
                >
                  <RotateCcw className="size-4 text-[#ffb547]" /> {T.review}
                </button>
                <button
                  type="button"
                  onClick={() => decide(true)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent-fill text-sm font-medium text-accent-ink transition hover:brightness-105"
                >
                  <Check className="size-4" /> {T.known}
                </button>
              </div>
              <p className="mt-2 text-center font-mono text-[0.65rem] text-faint [@media(pointer:coarse)]:hidden">{T.keys}</p>
            </>
          )
        )}

        {/* The review jar: missed words sit here with their progress towards leaving. */}
        <div className="mt-4 flex items-end gap-3 rounded-xl border border-line bg-surface-2/60 p-3">
          <svg viewBox="0 0 40 48" className="h-14 w-12 shrink-0" aria-hidden="true">
            <rect x="9" y="2" width="22" height="6" rx="2" fill="#b97a3d" />
            <path d="M8 10h24c3 0 5 3 5 6v24c0 4-3 6-6 6H9c-3 0-6-2-6-6V16c0-3 2-6 5-6z" fill="currentColor" className="text-accent" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" />
            {jar.slice(0, 6).map((c, k) => (
              <rect
                key={c.i}
                x={8 + (k % 3) * 9}
                y={36 - Math.floor(k / 3) * 9}
                width="7"
                height="7"
                rx="2"
                fill="#c6f36a"
                className={dropped === c.i ? "jar-drop" : ""}
              />
            ))}
          </svg>
          <div className="min-w-0 text-xs">
            <p className="font-medium text-fg">
              {T.jar} · <span className="font-mono">{jar.length}</span>
            </p>
            <p className="mt-0.5 text-muted">{T.jarRule}</p>
            {jar.length > 0 && (
              <p className="mt-1 truncate font-mono text-[0.65rem] text-faint">{jar.map((c) => `${T.words[c.i].word} ${c.hits}/3`).join(" · ")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
