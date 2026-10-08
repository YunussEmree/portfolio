import { useId } from "react";

/** Drawings shared by the screen bug and Whack-a-Bug. */

export function BugIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true" className={className}>
      <path className="bug-legs" d="M7.5 10 4 8M7 14H3.5M7.5 18 4 20M16.5 10 20 8M17 14h3.5M16.5 18l3.5 2" />
      <path d="M10 5.5 8.5 3M14 5.5 15.5 3" />
      <ellipse cx="12" cy="14.5" rx="5" ry="6" fill="currentColor" fillOpacity="0.18" />
      <circle cx="12" cy="7" r="2.6" fill="var(--bg)" />
      <path d="M12 9v11.5" />
    </svg>
  );
}

/**
 * A claw hammer lying flat, head on the left with its striking face down. `.hammer-swing` pivots it around the
 * grip (97% 43%); the face sits at ~18% of the width and ~77% of the height, where callers aim it at the bug.
 * Wood and steel are drawn in their own colours so it reads on both themes.
 */
export function HammerIcon({ width = 36, className = "" }: { width?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 72 44" width={width} height={(width * 44) / 72} aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2a868" />
          <stop offset="0.55" stopColor="#b97a3d" />
          <stop offset="1" stopColor="#8a5424" />
        </linearGradient>
        <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f4f6fa" />
          <stop offset="0.45" stopColor="#b9bec8" />
          <stop offset="1" stopColor="#6d737e" />
        </linearGradient>
        <linearGradient id={`${id}-face`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8b919c" />
          <stop offset="1" stopColor="#4d525b" />
        </linearGradient>
      </defs>

      {/* Handle: wood with a little grain, a rubber grip and an end cap. */}
      <rect x="21" y="14" width="49" height="8.5" rx="4.2" fill={`url(#${id}-wood)`} stroke="rgb(0 0 0 / 0.25)" strokeWidth="0.8" />
      <path d="M27 17.2h14M33 19.6h12" stroke="#7a4a1f" strokeOpacity="0.45" strokeWidth="0.8" strokeLinecap="round" />
      <rect x="52" y="13.2" width="18.5" height="10" rx="5" fill="#2b2d33" />
      <path d="M56 13.6v9.2M60 13.6v9.2M64 13.6v9.2" stroke="#45484f" strokeWidth="1.4" />
      <rect x="52.6" y="14.2" width="17.4" height="2" rx="1" fill="#ffffff" opacity="0.12" />

      {/* Collar where the handle enters the head. */}
      <rect x="20.5" y="12.5" width="4.5" height="11.5" rx="1.5" fill="#4a4e57" />

      {/* Head: claw on top, steel body, flat striking face at the bottom. */}
      <path d="M8 9.5 5.2 3.4c-.5-1.1.7-2.1 1.7-1.4L11 5l4.1-3c1-.7 2.2.3 1.7 1.4L14 9.5z" fill={`url(#${id}-steel)`} stroke="rgb(0 0 0 / 0.3)" strokeWidth="0.8" strokeLinejoin="round" />
      <rect x="4.5" y="8.5" width="17" height="21" rx="2.5" fill={`url(#${id}-steel)`} stroke="rgb(0 0 0 / 0.3)" strokeWidth="0.8" />
      <rect x="6.5" y="10.5" width="2.2" height="16" rx="1.1" fill="#ffffff" opacity="0.55" />
      <rect x="2.5" y="28" width="21" height="7" rx="2" fill={`url(#${id}-face)`} stroke="rgb(0 0 0 / 0.35)" strokeWidth="0.8" />
      <rect x="4" y="29" width="18" height="1.4" rx="0.7" fill="#ffffff" opacity="0.3" />
    </svg>
  );
}
