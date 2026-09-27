"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

/** The address as a mailto link, with a button that copies it (many people use webmail). */
export default function CopyEmail({ email, className = "" }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <a href={`mailto:${email}`} className="underline-offset-4 hover:underline">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="relative grid size-8 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-fg"
        aria-label={copied ? "Email address copied" : "Copy email address"}
      >
        {copied ? <Check className="size-3.5 text-accent" /> : <Copy className="size-3.5" />}
        <span className="sr-only" aria-live="polite">
          {copied ? "Copied" : ""}
        </span>
      </button>
    </span>
  );
}
