"use client";

import { Gamepad2 } from "lucide-react";
import type { GameId } from "@/data/fun";
import { openArcade } from "./achievements";

/** Opens the arcade (the dialog itself lives in FunLayer), on the picker or straight into a game. */
export default function ArcadeButton({ label, game, className = "" }: { label: string; game?: GameId; className?: string }) {
  return (
    <button type="button" onClick={() => openArcade(game)} className={`group inline-flex items-center gap-2 ${className}`}>
      <Gamepad2 className="size-4 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
      {label}
    </button>
  );
}
