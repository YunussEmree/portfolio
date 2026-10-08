"use client";

import { Check, Database, GitCommitHorizontal, Globe, LoaderCircle, Package, Rocket, Server, Workflow, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DEPLOY } from "@/data/demos";
import { unlock } from "../fun/achievements";
import { confetti } from "../fun/effects";

type State = "idle" | "running" | "failed" | "done";
const ICONS = [GitCommitHorizontal, Workflow, Package, Server, Database, Globe];

/**
 * "Ship it!" on the EngerekTech platform card: a glass panel slides up over the screenshots and runs the platform's
 * real pipeline (push, Actions build, GHCR, SSH + Compose, Flyway, live), sped up, with a terminal log. Now and then
 * a flaky test fails the build and is re-run, as in life.
 */
export default function DeployCallout() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState(-1); // index of the running stage; stages.length when finished
  const [state, setState] = useState<State>("idle");
  const [log, setLog] = useState<string[]>([]);
  const [took, setTook] = useState(0);
  const timers = useRef<number[]>([]);
  const wrap = useRef<HTMLDivElement>(null);
  const stages = DEPLOY.stages;

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const run = () => {
    if (state === "running" || state === "failed") return;
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    const started = performance.now();
    const flaky = Math.random() < 0.3;
    setOpen(true);
    setState("running");
    setStage(0);
    setLog([stages[0].log]);

    let t = 650;
    stages.forEach((s, i) => {
      if (i === 0) return;
      if (s.fail && flaky) {
        // The build fails once, then the failed jobs are re-run and pass.
        at(t, () => {
          setStage(i);
          setLog((l) => [...l, s.log]);
        });
        t += 900;
        at(t, () => {
          setState("failed");
          setLog((l) => [...l, s.fail!]);
        });
        t += 800;
        at(t, () => {
          setState("running");
          setLog((l) => [...l, s.retry!]);
        });
        t += 900;
        return;
      }
      at(t, () => {
        setStage(i);
        setLog((l) => [...l, s.log]);
      });
      t += s.id === "build" ? 1100 : 650;
    });
    at(t, () => {
      setStage(stages.length);
      setState("done");
      setTook((performance.now() - started) / 1000);
      unlock("shipit");
      const r = wrap.current?.getBoundingClientRect();
      if (r) confetti({ x: r.left + r.width / 2, y: r.top + r.height * 0.55, count: 110 });
    });
    at(t + 3200, () => {
      setOpen(false);
      setState("idle");
    });
  };

  return (
    <div ref={wrap} className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[1.5rem]">
      {/* The pipeline panel */}
      <div
        className={`absolute inset-x-3 bottom-3 rounded-2xl border border-white/15 bg-[#0b0f1c]/95 p-4 font-mono text-white shadow-2xl transition-[transform,opacity] duration-500 ease-out sm:inset-x-5 sm:bottom-5 ${
          open ? "translate-y-0 opacity-100" : "translate-y-[110%] opacity-0"
        }`}
        aria-live="polite"
      >
        <div className="flex items-center justify-between text-[0.68rem] text-white/60">
          <span className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${state === "failed" ? "bg-[#ff6b8b]" : state === "done" ? "bg-[#28c840]" : "bg-[#ffb547] animate-pulse"}`} />
            {DEPLOY.title}
          </span>
          <span>{state === "done" ? `${DEPLOY.done} ${took.toFixed(1)} s (${DEPLOY.spedUp})` : DEPLOY.spedUp}</span>
        </div>

        {/* Stages */}
        <div className="relative mt-3 flex items-start justify-between">
          <div className="absolute left-4 right-4 top-4 h-0.5 bg-white/15" />
          <div
            className="absolute left-4 top-4 h-0.5 bg-[#c6f36a] transition-[width] duration-500 ease-out"
            style={{ width: `calc((100% - 2rem) * ${Math.max(0, Math.min(stage, stages.length - 1)) / (stages.length - 1)})` }}
          />
          {stages.map((s, i) => {
            const Icon = ICONS[i];
            const passed = i < stage || state === "done";
            const current = i === stage && state !== "done";
            const failed = current && state === "failed";
            return (
              <div key={s.id} className="relative z-10 flex w-12 flex-col items-center gap-1 text-center">
                <span
                  className={`grid size-8 place-items-center rounded-full border transition-colors duration-300 ${
                    failed
                      ? "shake border-[#ff6b8b] bg-[#ff6b8b]/20 text-[#ff6b8b]"
                      : passed
                        ? "border-[#c6f36a] bg-[#c6f36a] text-[#0d1006]"
                        : current
                          ? "border-[#ffb547] bg-[#ffb547]/15 text-[#ffb547]"
                          : "border-white/20 bg-[#0b0f1c] text-white/50"
                  }`}
                >
                  {failed ? (
                    <X className="size-4" />
                  ) : passed ? (
                    <Check className="best-pop size-4" />
                  ) : current ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                </span>
                <span className={`text-[0.6rem] ${passed || current ? "text-white" : "text-white/45"}`}>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Log: the last few lines */}
        <div className="mt-3 h-[4.6rem] overflow-hidden rounded-lg bg-black/40 px-3 py-2 text-[0.68rem] leading-[1.15rem]">
          {log.slice(-4).map((l, i) => (
            <p
              key={`${log.length}-${i}`}
              className={`truncate ${l.startsWith("✗") ? "text-[#ff6b8b]" : l.startsWith("✓") || l.startsWith("🚀") ? "text-[#c6f36a]" : l.startsWith("↻") ? "text-[#ffb547]" : "text-white/85"}`}
            >
              {l}
            </p>
          ))}
        </div>
      </div>

      {/* The button, with the same note and arrow as the other cards */}
      <div className={`absolute bottom-4 right-4 flex items-end gap-1 transition-opacity duration-300 sm:bottom-5 sm:right-5 ${open ? "opacity-0" : "opacity-100"}`}>
        <div className="callout-bob relative mb-9 mr-[-6px] text-right" aria-hidden="true">
          <span className="serif-accent block whitespace-nowrap text-xl text-white drop-shadow-[0_2px_6px_rgb(0_0_0/0.5)] sm:text-2xl">{DEPLOY.label}</span>
          <svg viewBox="0 0 70 46" className="ml-auto h-10 w-16 text-white/90" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path className="callout-draw" d="M6 4c10 22 30 34 56 36" />
            <path className="callout-draw callout-draw-late" d="M52 32l11 8-12 4" />
          </svg>
        </div>
        <span className="relative grid size-16 place-items-center">
          <svg viewBox="0 0 64 64" className="callout-ticks absolute -inset-4 size-24 text-white/85" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M32 2v7M2 32h7M10 10l5 5M54 10l-5 5M62 32h-7" />
          </svg>
          <span className="absolute inset-0 animate-ping rounded-full bg-accent-fill/40 motion-reduce:hidden" aria-hidden="true" />
          <button
            type="button"
            onClick={run}
            disabled={open}
            aria-label={DEPLOY.button}
            className={`relative grid size-14 place-items-center rounded-full bg-accent-fill text-accent-ink shadow-xl shadow-black/40 ring-4 ring-white/15 transition hover:scale-110 hover:-rotate-12 active:scale-95 ${open ? "" : "pointer-events-auto"}`}
          >
            <Rocket className="size-6" />
          </button>
        </span>
      </div>
    </div>
  );
}
