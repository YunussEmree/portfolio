"use client";

import { Command, Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PROFILE } from "@/data/profile";
import { OPEN_COMMAND_MENU } from "./command-menu";
import { useTheme } from "./providers";

export const NAV_ITEMS = [
  { label: "Work", id: "work" },
  { label: "Experience", id: "experience" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      className="grid size-9 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-fg"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section in the middle of the screen.
  useEffect(() => {
    if (!home) return setActive(null);
    const sections = NAV_ITEMS.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [home]);

  useEffect(() => setOpen(false), [pathname]);

  const href = (id: string) => (home ? `#${id}` : `/#${id}`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open
          ? "border-b border-line bg-bg/80 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent"
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Link href="/" className="group flex items-center gap-2.5" aria-label={`${PROFILE.name}, home`}>
          <span className="grid size-8 place-items-center rounded-lg bg-fg font-mono text-[0.7rem] font-semibold tracking-tight text-bg transition group-hover:bg-accent-fill group-hover:text-accent-ink">
            YE
          </span>
          <span className="hidden text-sm font-medium tracking-tight text-fg sm:block">{PROFILE.name}</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={href(item.id)}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300 ${
                  active === item.id ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"
                }`}
                aria-current={active === item.id ? "true" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_MENU))}
            className="hidden h-9 items-center gap-2 rounded-full border border-line px-3 text-xs text-muted transition hover:border-line-strong hover:text-fg md:flex"
            aria-label="Open command menu"
          >
            <Command className="size-3.5" />
            <span className="font-mono">K</span>
          </button>
          <ThemeToggle />
          <a
            href={PROFILE.cv}
            className="ml-1 hidden h-9 items-center rounded-full bg-fg px-4 text-sm font-medium text-bg transition hover:opacity-85 sm:flex"
          >
            Résumé
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid size-9 place-items-center rounded-full text-fg md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows,opacity] duration-300 md:hidden ${
          open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
        inert={!open}
      >
        <div className="overflow-hidden">
            <ul className="container-page flex flex-col pb-6 pt-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={href(item.id)}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-line py-4 text-2xl font-medium tracking-tight"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="pt-5">
                <a
                  href={PROFILE.cv}
                  className="flex h-12 items-center justify-center rounded-full bg-fg font-medium text-bg"
                >
                  Download résumé
                </a>
              </li>
            </ul>
        </div>
      </div>
    </header>
  );
}
