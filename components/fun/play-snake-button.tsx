"use client";

import { Gamepad2 } from "lucide-react";
import { OPEN_SNAKE } from "./achievements";

/** Opens Packet Snake (the game itself lives in FunLayer). */
export default function PlaySnakeButton({ label, className = "" }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_SNAKE))} className={`group inline-flex items-center gap-2 ${className}`}>
      <Gamepad2 className="size-4 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
      {label}
    </button>
  );
}
