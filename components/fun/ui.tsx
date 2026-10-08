"use client";

import { FUN } from "@/data/fun";

/** The mono stats row above every game board. */
export function Stats({ items }: { items: { label: string; value: React.ReactNode }[] }) {
  return (
    <div className="flex items-center justify-between gap-3 font-mono text-xs text-muted" aria-live="polite">
      {items.map((i) => (
        <span key={i.label}>
          {i.label} <span className="text-fg tabular-nums">{i.value}</span>
        </span>
      ))}
    </div>
  );
}

export function NewBest() {
  return (
    <span className="best-pop inline-flex rounded-full bg-accent-fill px-2.5 py-0.5 font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-accent-ink">
      {FUN.newBest}
    </span>
  );
}

export const primaryButton =
  "inline-flex h-10 items-center rounded-full bg-accent-fill px-5 text-sm font-medium text-accent-ink transition hover:brightness-105";

/** A panel over the board: how to play before a round, the result after it. */
export function Panel({
  title,
  children,
  action,
  onAction,
  best = false,
}: {
  title?: string;
  children?: React.ReactNode;
  action: string;
  onAction: () => void;
  best?: boolean;
}) {
  return (
    <div className="fade-in absolute inset-0 grid place-items-center rounded-2xl bg-surface/85 p-6 text-center backdrop-blur-sm">
      <div>
        {best && (
          <div className="mb-2">
            <NewBest />
          </div>
        )}
        {title && <p className="font-semibold text-fg">{title}</p>}
        {children && <div className="mt-1 text-sm text-muted">{children}</div>}
        <button type="button" onClick={onAction} className={`mt-4 ${primaryButton}`}>
          {action}
        </button>
      </div>
    </div>
  );
}
