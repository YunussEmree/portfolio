"use client";

import { Bot, Check, Swords, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { KPSS_DEMO as T, type DuelQuestion } from "@/data/demos";
import { unlock } from "../fun/achievements";
import { confetti } from "../fun/effects";

type Phase = "intro" | "search" | "question" | "reveal" | "end";
type Result = { me: boolean; bot: boolean };

const ROUNDS = 5;
const MS = T.seconds * 1000;
const LETTERS = ["A", "B", "C", "D"];

function pickQuestions(): DuelQuestion[] {
  const pool = [...T.questions];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, ROUNDS);
}

const points = (correct: boolean, ms: number) => (correct ? 10 + Math.ceil(Math.max(0, MS - ms) / 1000) : 0);

/** A 5-question duel against a bot, played the way KPSS Düello plays: right and fast wins. */
export default function KpssDemo() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [qs, setQs] = useState<DuelQuestion[]>(pickQuestions);
  const [idx, setIdx] = useState(0);
  const [left, setLeft] = useState(MS);
  const [myPick, setMyPick] = useState<number | null>(null);
  const [botPick, setBotPick] = useState<number | null>(null);
  const [score, setScore] = useState({ me: 0, bot: 0 });
  const [gain, setGain] = useState({ me: 0, bot: 0 });
  const [results, setResults] = useState<Result[]>([]);
  const round = useRef({ start: 0, myMs: MS, botMs: MS, botAt: 0, botChoice: 0, done: false });
  const timers = useRef<number[]>([]);
  const board = useRef<HTMLDivElement>(null);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clear, []);

  const begin = () => {
    clear();
    setQs(pickQuestions());
    setIdx(0);
    setScore({ me: 0, bot: 0 });
    setResults([]);
    setPhase("search");
    later(() => ask(0), 1600);
  };

  const ask = (i: number) => {
    const q = qsRef.current[i];
    const botRight = Math.random() < 0.6;
    const wrong = [0, 1, 2, 3].filter((o) => o !== q.answer);
    round.current = {
      start: performance.now(),
      myMs: MS,
      botMs: MS,
      botAt: 2000 + Math.random() * 5500,
      botChoice: botRight ? q.answer : wrong[Math.floor(Math.random() * wrong.length)],
      done: false,
    };
    setIdx(i);
    setMyPick(null);
    setBotPick(null);
    setGain({ me: 0, bot: 0 });
    setLeft(MS);
    setPhase("question");
  };
  const qsRef = useRef(qs);
  qsRef.current = qs;

  // The question clock; the bot answers on its own schedule.
  useEffect(() => {
    if (phase !== "question") return;
    const t = window.setInterval(() => {
      const r = round.current;
      const elapsed = performance.now() - r.start;
      setLeft(Math.max(0, MS - elapsed));
      if (elapsed >= r.botAt && r.botMs === MS) {
        r.botMs = elapsed;
        setBotPick(r.botChoice);
      }
      const meDone = r.myMs < MS;
      const botDone = r.botMs < MS;
      if ((meDone && botDone) || elapsed >= MS) reveal();
    }, 80);
    return () => window.clearInterval(t);
  }, [phase]);

  const answer = (o: number) => {
    if (phase !== "question" || myPick !== null) return;
    const r = round.current;
    r.myMs = performance.now() - r.start;
    setMyPick(o);
    // Nobody likes waiting: once you answer, the bot makes up its mind soon.
    r.botAt = Math.min(r.botAt, r.myMs + 500 + Math.random() * 900);
  };

  const reveal = () => {
    const r = round.current;
    if (r.done) return; // once per question, whichever tick gets here first
    r.done = true;
    const q = qsRef.current[idxRef.current];
    const meRight = myPickRef.current === q.answer;
    const botRight = r.botMs < MS && r.botChoice === q.answer;
    if (r.botMs < MS) setBotPick(r.botChoice);
    const g = { me: points(meRight, r.myMs), bot: points(botRight, r.botMs) };
    setGain(g);
    setScore((s) => ({ me: s.me + g.me, bot: s.bot + g.bot }));
    setResults((rs) => [...rs, { me: meRight, bot: botRight }]);
    setPhase("reveal");
    later(() => {
      if (idxRef.current + 1 < ROUNDS) ask(idxRef.current + 1);
      else setPhase("end");
    }, 1800);
  };
  const idxRef = useRef(idx);
  idxRef.current = idx;
  const myPickRef = useRef(myPick);
  myPickRef.current = myPick;

  useEffect(() => {
    if (phase !== "end" || score.me <= score.bot) return;
    unlock("duelist");
    const rect = board.current?.getBoundingClientRect();
    if (rect) confetti({ x: rect.left + rect.width / 2, y: rect.top + 80, count: 100 });
  }, [phase, score]);

  const q = qs[idx];
  const outcome = score.me > score.bot ? T.win : score.me < score.bot ? T.lose : T.draw;

  const player = (who: "me" | "bot") => (
    <div className={`flex items-center gap-2 ${who === "bot" ? "flex-row-reverse text-right" : ""}`}>
      <span className={`grid size-9 place-items-center rounded-full ${who === "me" ? "bg-[#c6f36a] text-[#0d1006]" : "bg-white/15 text-white"}`}>
        {who === "me" ? <span className="text-sm font-bold">{T.you[0]}</span> : <Bot className="size-4" />}
      </span>
      <span className="leading-tight">
        <span className="block text-[0.7rem] text-white/70">{who === "me" ? T.you : T.bot}</span>
        <span className="relative block font-mono text-lg font-bold tabular-nums text-white">
          {score[who]}
          {phase === "reveal" && gain[who] > 0 && (
            <span className={`score-pop absolute top-0 font-mono text-xs text-[#c6f36a] ${who === "me" ? "left-full ml-1" : "right-full mr-1"}`}>
              +{gain[who]}
            </span>
          )}
        </span>
      </span>
    </div>
  );

  return (
    <div ref={board} className="overflow-hidden rounded-2xl border border-line">
      {/* The app's own colours for the duel header. */}
      <div className="bg-[linear-gradient(135deg,#3b2a8c,#141a3d)] px-4 py-3">
        <div className="flex items-center justify-between">
          {player("me")}
          <span className="text-center font-mono text-[0.7rem] text-white/70">
            {phase === "question" || phase === "reveal" ? `${T.question} ${idx + 1}/${ROUNDS}` : <Swords className="mx-auto size-5 text-white/80" />}
          </span>
          {player("bot")}
        </div>
        {(phase === "question" || phase === "reveal") && (
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div
              className={`h-full rounded-full transition-[width] duration-100 ease-linear ${left < 3000 ? "bg-[#ff6b8b]" : "bg-[#c6f36a]"}`}
              style={{ width: `${(left / MS) * 100}%` }}
            />
          </div>
        )}
      </div>

      <div className="bg-surface p-4">
        {phase === "intro" && (
          <div className="py-6 text-center">
            <Swords className="mx-auto size-10 text-accent" />
            <p className="mt-3 text-sm text-muted">{T.intro}</p>
            <button type="button" onClick={begin} className="mt-5 inline-flex h-10 items-center rounded-full bg-accent-fill px-5 text-sm font-medium text-accent-ink transition hover:brightness-105">
              {T.start}
            </button>
          </div>
        )}

        {phase === "search" && (
          <div className="py-8 text-center">
            <div className="relative mx-auto grid size-16 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent-fill/30" />
              <span className="relative grid size-12 place-items-center rounded-full bg-accent-fill text-accent-ink">
                <Swords className="size-5" />
              </span>
            </div>
            <p className="mt-4 text-sm font-medium text-fg">{T.searching}</p>
          </div>
        )}

        {(phase === "question" || phase === "reveal") && q && (
          <div key={idx} className="fade-in">
            <span className="inline-block rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[0.65rem] text-muted">{q.topic}</span>
            <p className="mt-2 min-h-[3rem] font-medium leading-snug text-fg">{q.q}</p>
            <div className="mt-3 grid gap-2">
              {q.options.map((opt, o) => {
                const shown = phase === "reveal";
                const right = shown && o === q.answer;
                const wrongMine = shown && o === myPick && o !== q.answer;
                return (
                  <button
                    key={o}
                    type="button"
                    disabled={myPick !== null || phase !== "question"}
                    onClick={() => answer(o)}
                    className={`relative flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                      right
                        ? "border-[#28c840] bg-[#28c840]/15 text-fg"
                        : wrongMine
                          ? "shake border-[#ff6b8b] bg-[#ff6b8b]/15 text-fg"
                          : myPick === o
                            ? "border-accent bg-accent-soft text-fg"
                            : "border-line bg-surface-2/60 text-fg hover:border-line-strong enabled:hover:-translate-y-px"
                    }`}
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-md bg-surface font-mono text-xs text-muted">{LETTERS[o]}</span>
                    <span className="flex-1">{opt}</span>
                    {right && <Check className="size-4 text-[#28c840]" />}
                    {wrongMine && <X className="size-4 text-[#ff6b8b]" />}
                    {shown && botPick === o && (
                      <span className="best-pop grid size-6 place-items-center rounded-full bg-[#3b2a8c] text-white" title={T.bot}>
                        <Bot className="size-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {phase === "reveal" && (
              <p className="mt-3 text-center text-sm font-medium text-fg">
                {myPick === null ? T.timeUp : myPick === q.answer ? T.correct : T.wrong}
              </p>
            )}
          </div>
        )}

        {phase === "end" && (
          <div className="py-4 text-center">
            <p className="display text-3xl text-fg">{outcome}</p>
            <p className="mt-2 font-mono text-sm text-muted">
              {T.you} {score.me} · {score.bot} {T.bot}
            </p>
            {/* Question by question, like the result screen in the app. */}
            <div className="mx-auto mt-4 grid w-fit grid-cols-[auto_repeat(5,1.5rem)] items-center gap-1.5 text-left font-mono text-[0.65rem] text-muted">
              {(["me", "bot"] as const).map((who) => (
                <div key={who} className="contents">
                  <span className="pr-2">{who === "me" ? T.you : T.bot}</span>
                  {results.map((r, i) => (
                    <span key={i} className={`grid size-6 place-items-center rounded-md ${r[who] ? "bg-[#28c840]/20 text-[#28c840]" : "bg-[#ff6b8b]/15 text-[#ff6b8b]"}`}>
                      {r[who] ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <button type="button" onClick={begin} className="mt-5 inline-flex h-10 items-center rounded-full bg-accent-fill px-5 text-sm font-medium text-accent-ink transition hover:brightness-105">
              {T.again}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
