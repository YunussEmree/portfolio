"use client";

import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { API_COPY, type ApiResponse, type Method, respond, SUGGESTED } from "@/data/api";
import { SUMMON_BUG, unlock } from "./achievements";
import { confetti } from "./effects";

type Exchange = { method: Method; path: string; res: ApiResponse; ms: number; lines: string[] };

const METHOD_COLOR: Record<Method, string> = { GET: "#5ee6c8", POST: "#ffb547", DELETE: "#ff6b8b" };
const statusColor = (s: number) => (s < 300 ? "#28c840" : s < 400 ? "#ffb547" : s === 418 ? "#c6f36a" : "#ff6b8b");

/** One JSON line with keys, strings, numbers and booleans coloured. */
function JsonLine({ line }: { line: string }) {
  const parts = line.split(/("(?:[^"\\]|\\.)*"(?=\s*:)|"(?:[^"\\]|\\.)*"|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (!p) return null;
        const isKey = /^".*"$/.test(p) && line.slice(line.indexOf(p) + p.length).trimStart().startsWith(":");
        const color = isKey ? "#7aa2ff" : /^"/.test(p) ? "#c6f36a" : /^(true|false|null)$/.test(p) ? "#ffb547" : /^-?\d/.test(p) ? "#ff8f5e" : undefined;
        return (
          <span key={i} style={color ? { color } : undefined}>
            {p}
          </span>
        );
      })}
    </>
  );
}

/** "Try my API": pick or type a request, get a status line and a JSON body that streams in. */
export default function ApiConsole() {
  const [method, setMethod] = useState<Method>("GET");
  const [path, setPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [ex, setEx] = useState<Exchange | null>(null);
  const [shown, setShown] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const send = (m: Method, p: string) => {
    const target = p.trim() || API_COPY.placeholder;
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setMethod(m);
    setPath(target);
    setLoading(true);
    setShown(0);
    const res = respond(m, target);
    const ms = 18 + Math.round(Math.random() * 70);
    const lines = res.body === undefined ? [] : JSON.stringify(res.body, null, 2).split("\n");
    timers.current.push(
      window.setTimeout(() => {
        setLoading(false);
        setEx({ method: m, path: target, res, ms, lines });
        // The body streams in, a few lines at a time.
        lines.forEach((_, i) => timers.current.push(window.setTimeout(() => setShown(i + 1), i * 22)));
        const r = box.current?.getBoundingClientRect();
        if (res.effect === "confetti" && r) confetti({ x: r.left + r.width / 2, y: r.top + 60, count: 100 });
        if (res.effect === "teapot") unlock("teapot");
        if (res.effect === "bug") window.dispatchEvent(new Event(SUMMON_BUG));
      }, ms + 250),
    );
  };

  return (
    <div ref={box}>
      <h3 className="eyebrow mb-2">{API_COPY.title}</h3>
      <p className="mb-5 max-w-2xl text-sm text-muted">{API_COPY.intro}</p>

      <div className="overflow-hidden rounded-[1.25rem] border border-line bg-[#0b0b0e] font-mono text-[0.8rem] text-[#ededef] shadow-2xl shadow-black/20">
        {/* Request bar */}
        <form
          className="flex flex-wrap items-center gap-2 border-b border-white/10 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            send(method, path);
          }}
        >
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as Method)}
            aria-label="Method"
            className="h-9 rounded-lg border border-white/10 bg-white/5 px-2 font-semibold outline-none"
            style={{ color: METHOD_COLOR[method] }}
          >
            {(["GET", "POST", "DELETE"] as Method[]).map((m) => (
              <option key={m} value={m} className="bg-[#0b0b0e]">
                {m}
              </option>
            ))}
          </select>
          <div className="flex h-9 min-w-0 flex-1 items-center rounded-lg border border-white/10 bg-white/5 px-3 focus-within:border-[#c6f36a]/60">
            <span className="hidden shrink-0 text-[#83848c] sm:inline">{API_COPY.base}</span>
            <input
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder={API_COPY.placeholder}
              aria-label="Path"
              autoComplete="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#5d5f66]"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#c6f36a] px-3.5 font-sans text-sm font-medium text-[#0d1006] transition hover:brightness-105"
          >
            <Send className="size-3.5" /> {API_COPY.send}
          </button>
        </form>

        {/* Suggested requests */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-white/10 px-3 py-2.5">
          <span className="mr-1 text-[0.7rem] text-[#83848c]">{API_COPY.try}</span>
          {SUGGESTED.map((s) => (
            <button
              key={`${s.method} ${s.path}`}
              type="button"
              onClick={() => send(s.method, s.path)}
              className="rounded-md border border-white/10 px-2 py-1 text-[0.7rem] transition hover:border-white/25 hover:bg-white/5"
            >
              <span style={{ color: METHOD_COLOR[s.method] }}>{s.method}</span> {s.path}
            </button>
          ))}
        </div>

        {/* Response */}
        <div className="min-h-[13rem] p-4" aria-live="polite">
          {loading && (
            <div className="flex items-center gap-2 text-[#83848c]">
              <span className="inline-block size-3 animate-spin rounded-full border-2 border-[#83848c] border-t-transparent" />
              {method} {path}
            </div>
          )}
          {!loading && !ex && <p className="text-[#5d5f66]">{API_COPY.waiting}</p>}
          {!loading && ex && (
            <div key={`${ex.method}${ex.path}${ex.ms}`} className="fade-in">
              <p className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="rounded px-1.5 py-0.5 font-semibold" style={{ color: "#0b0b0e", background: statusColor(ex.res.status) }}>
                  {ex.res.status} {ex.res.text}
                </span>
                <span className="text-[#83848c]">
                  {ex.method} {ex.path} · {ex.ms} ms · application/json
                </span>
              </p>
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words leading-relaxed" data-lenis-prevent>
                {ex.lines.slice(0, shown).map((l, i) => (
                  <div key={i}>
                    <JsonLine line={l} />
                  </div>
                ))}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
