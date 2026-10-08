"use client";

import { useEffect, useRef, useState } from "react";
import { FUN, GAMES } from "@/data/fun";
import { unlock } from "./achievements";
import { confetti } from "./effects";
import { readBest, saveBest } from "./scores";
import { Panel, Stats } from "./ui";

type Phase = "ready" | "playing" | "over";

const META = GAMES.find((g) => g.id === "typer")!;
const DURATION = 30_000;

function shuffled() {
  const a = [...FUN.typer.list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Terminal Typer: type shell commands for 30 seconds; a command completes the moment it matches. */
export default function Typer() {
  const [queue, setQueue] = useState<string[]>(shuffled);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("ready");
  const [left, setLeft] = useState(DURATION);
  const [done, setDone] = useState(0);
  const [best, setBest] = useState(0);
  const [isBest, setIsBest] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const keys = useRef({ typed: 0, correct: 0, chars: 0 });
  const startedAt = useRef(0);
  const doneRef = useRef(0);
  const prevBest = useRef(0);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBest(readBest(META.bestKey) ?? 0);
    field.current?.focus();
  }, []);

  // The clock starts on the first key and ends the round.
  useEffect(() => {
    if (phase !== "playing") return;
    const t = window.setInterval(() => {
      const remaining = Math.max(0, DURATION - (Date.now() - startedAt.current));
      setLeft(remaining);
      if (remaining > 0) return;
      window.clearInterval(t);
      setPhase("over");
      const final = doneRef.current;
      setBest(saveBest(META.bestKey, final));
      setIsBest(final > prevBest.current);
      if (final >= 6) {
        unlock("typer");
        const r = field.current?.getBoundingClientRect();
        if (r) confetti({ x: r.left + r.width / 2, y: r.top, count: 80 });
      }
    }, 100);
    return () => window.clearInterval(t);
  }, [phase]);

  const target = queue[index % queue.length];

  const onChange = (value: string) => {
    if (phase === "over") return;
    if (phase === "ready") {
      startedAt.current = Date.now();
      prevBest.current = readBest(META.bestKey) ?? 0;
      setPhase("playing");
    }
    if (value.length > input.length) {
      const ch = value[value.length - 1];
      keys.current.typed += 1;
      if (ch === target[value.length - 1]) keys.current.correct += 1;
    }
    if (value === target) {
      keys.current.chars += target.length;
      doneRef.current += 1;
      setDone(doneRef.current);
      setHistory((h) => [...h.slice(-2), target]);
      setIndex((i) => i + 1);
      setInput("");
    } else setInput(value);
  };

  const restart = () => {
    keys.current = { typed: 0, correct: 0, chars: 0 };
    doneRef.current = 0;
    setDone(0);
    setQueue(shuffled());
    setIndex(0);
    setInput("");
    setHistory([]);
    setLeft(DURATION);
    setIsBest(false);
    setPhase("ready");
    requestAnimationFrame(() => field.current?.focus());
  };

  const minutes = (DURATION - left) / 60000;
  const wpm = minutes > 0.05 ? Math.round((keys.current.chars + input.length) / 5 / minutes) : 0;
  const accuracy = keys.current.typed ? Math.round((keys.current.correct / keys.current.typed) * 100) : 100;

  return (
    <div>
      <Stats
        items={[
          { label: FUN.typer.commands, value: done },
          { label: FUN.time, value: `${Math.ceil(left / 1000)}s` },
          { label: FUN.best, value: Math.max(best, done) },
        ]}
      />
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
        <div className="h-full rounded-full bg-accent-fill transition-[width] duration-100 ease-linear" style={{ width: `${(left / DURATION) * 100}%` }} />
      </div>

      <div className="relative mt-3">
        {/* A small terminal: finished commands scroll up, the current one is coloured as you type. */}
        <div className="rounded-2xl border border-line bg-[#0b0b0e] p-4 font-mono text-[0.8rem] leading-relaxed text-[#ededef]" onClick={() => field.current?.focus()}>
          <div className="mb-3 flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          {history.map((h, i) => (
            <p key={`${h}-${i}`} className="text-[#83848c]">
              <span className="text-[#c6f36a]">$</span> {h} <span className="text-[#28c840]">✓</span>
            </p>
          ))}
          <p className="break-all" aria-label={target}>
            <span className="text-[#c6f36a]">$ </span>
            {[...target].map((ch, i) => {
              const typed = input[i];
              const color = typed === undefined ? "text-[#83848c]" : typed === ch ? "text-[#c6f36a]" : "bg-[#ff6b8b]/30 text-[#ff6b8b]";
              return (
                <span key={i} className={`${color} ${i === input.length ? "typer-caret" : ""}`}>
                  {ch}
                </span>
              );
            })}
            {input.length >= target.length && <span className="typer-caret"> </span>}
          </p>
          <input
            ref={field}
            value={input}
            onChange={(e) => onChange(e.target.value)}
            disabled={phase === "over"}
            placeholder={FUN.typer.placeholder}
            aria-label={FUN.typer.placeholder}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[0.8rem] text-[#ededef] outline-none placeholder:text-[#83848c] focus:border-[#c6f36a]/60"
          />
        </div>
        {phase === "over" && (
          <Panel title={FUN.typer.over} action={FUN.typer.again} onAction={restart} best={isBest}>
            {done} {FUN.typer.commands.toLowerCase()} · {wpm} {FUN.typer.wpm} · {accuracy}% {FUN.typer.accuracy.toLowerCase()}
          </Panel>
        )}
      </div>
      {phase === "ready" && <p className="mt-3 text-center text-sm text-muted">{FUN.typer.intro}</p>}
      {phase === "playing" && (
        <p className="mt-3 text-center font-mono text-[0.68rem] text-faint">
          {wpm} {FUN.typer.wpm} · {accuracy}% {FUN.typer.accuracy.toLowerCase()}
        </p>
      )}
    </div>
  );
}
