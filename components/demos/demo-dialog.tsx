"use client";

import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { DEMO_FRAME, type DemoId } from "@/data/demos";
import { projects } from "@/data/projects";
import KelimeDemo from "./kelime-demo";
import KpssDemo from "./kpss-demo";

const SLUG: Record<DemoId, string> = { kpss: "kpss-duello", kelime: "kelime-kavanozu" };

/** The demo dialog. Like the arcade, it closes only with its close button or Esc, never from a stray click outside. */
export default function DemoDialog({ demo, onClose }: { demo: DemoId; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  const project = projects.find((p) => p.slug === SLUG[demo])!;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close.current();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, []);

  return (
    <div className="fade-in fixed inset-0 z-[105] flex items-center justify-center overflow-y-auto bg-black/55 px-4 py-6 backdrop-blur-sm" data-lenis-prevent>
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-title"
        tabIndex={-1}
        className="pop-in my-auto w-full max-w-[24rem] rounded-2xl border border-line-strong bg-surface p-4 shadow-2xl shadow-black/40 outline-none sm:p-5"
      >
        <div className="mb-4 flex items-start gap-3">
          {project.icon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.icon} alt="" width={40} height={40} className="size-10 shrink-0 rounded-xl" />
          )}
          <div className="min-w-0 flex-1">
            <h2 id="demo-title" className="font-semibold tracking-tight text-fg">
              {project.title}
            </h2>
            <p className="text-xs text-muted">{DEMO_FRAME.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 shrink-0 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-fg"
            aria-label={DEMO_FRAME.close}
          >
            <X className="size-4" />
          </button>
        </div>

        {demo === "kpss" ? <KpssDemo /> : <KelimeDemo />}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
          <Link href={`/work/${project.slug}`} onClick={onClose} className="inline-flex items-center gap-1 text-muted transition hover:text-fg">
            {DEMO_FRAME.caseStudy} <ArrowUpRight className="size-3.5" />
          </Link>
          {project.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-muted transition hover:text-fg">
              {l.label} <ArrowUpRight className="size-3.5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
