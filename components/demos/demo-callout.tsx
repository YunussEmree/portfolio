"use client";

import { Amphora, Swords } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { DEMO_CALLOUT, type DemoId } from "@/data/demos";

// The demo only downloads when someone opens it.
const DemoDialog = dynamic(() => import("./demo-dialog"), { ssr: false });

const ICONS: Record<DemoId, React.ComponentType<{ className?: string }>> = { kpss: Swords, kelime: Amphora };

/**
 * A pulsing button on a project's screenshots, with a hand-drawn arrow and note pointing at it and little
 * ticks around it. It sits on the dark product tint, so it uses light ink in both themes.
 */
export default function DemoCallout({ demo }: { demo: DemoId }) {
  const [open, setOpen] = useState(false);
  const Icon = ICONS[demo];
  const copy = DEMO_CALLOUT[demo];

  return (
    <>
      <div className="pointer-events-none absolute bottom-4 right-4 z-10 flex items-end gap-1 sm:bottom-5 sm:right-5">
        {/* Note + arrow curving down into the button. */}
        <div className="callout-bob relative mb-9 mr-[-6px] text-right" aria-hidden="true">
          <span className="serif-accent block whitespace-nowrap text-xl text-white drop-shadow-[0_2px_6px_rgb(0_0_0/0.5)] sm:text-2xl">{copy.label}</span>
          <svg viewBox="0 0 70 46" className="ml-auto h-10 w-16 text-white/90" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path className="callout-draw" d="M6 4c10 22 30 34 56 36" />
            <path className="callout-draw callout-draw-late" d="M52 32l11 8-12 4" />
          </svg>
        </div>

        <span className="relative grid size-16 place-items-center">
          {/* Attention ticks pointing in from three sides. */}
          <svg viewBox="0 0 64 64" className="callout-ticks absolute -inset-4 size-24 text-white/85" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M32 2v7M2 32h7M10 10l5 5M54 10l-5 5M62 32h-7" />
          </svg>
          <span className="absolute inset-0 animate-ping rounded-full bg-accent-fill/40 motion-reduce:hidden" aria-hidden="true" />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={copy.button}
            className="pointer-events-auto relative grid size-14 place-items-center rounded-full bg-accent-fill text-accent-ink shadow-xl shadow-black/40 ring-4 ring-white/15 transition hover:scale-110 hover:-rotate-6 active:scale-95"
          >
            <Icon className="size-6" />
          </button>
        </span>
      </div>
      {open && <DemoDialog demo={demo} onClose={() => setOpen(false)} />}
    </>
  );
}
