"use client";

import { PROFILE } from "@/data/profile";

export default function PrintButton() {
  return (
    <span className="flex items-center gap-2">
      <a href={PROFILE.cv} className="rounded-full px-4 py-2 text-zinc-700 hover:bg-zinc-300/60">
        Download PDF
      </a>
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-full bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700"
      >
        Print
      </button>
    </span>
  );
}
