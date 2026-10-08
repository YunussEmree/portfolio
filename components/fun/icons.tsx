/** Drawings shared by the footer bug and Whack-a-Bug. */

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

/** A hammer lying flat, head on the left; `.hammer-swing` pivots it around the end of the handle. */
export function HammerIcon({ width = 36, className = "" }: { width?: number; className?: string }) {
  return (
    <svg viewBox="0 0 36 22" width={width} height={(width * 22) / 36} aria-hidden="true" className={className}>
      <rect x="12" y="7.5" width="23" height="4" rx="2" fill="var(--muted)" />
      <rect x="1" y="1" width="11" height="16" rx="2.5" fill="currentColor" />
      <rect x="1" y="13" width="11" height="2" fill="var(--bg)" opacity="0.25" />
    </svg>
  );
}
