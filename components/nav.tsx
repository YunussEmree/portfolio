"use client";

import { Command, Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/data/profile";
import { OPEN_COMMAND_MENU } from "./command-menu";
import { unlock } from "./fun/achievements";
import { confetti } from "./fun/effects";
import { useTheme } from "./providers";

export const NAV_ITEMS = [
  { label: "Work", id: "work" },
  { label: "Experience", id: "experience" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  // Bumped on every click so only a real toggle (not the first render) spins the new icon in.
  const [swaps, setSwaps] = useState(0);
  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setSwaps((n) => n + 1);
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      className="group grid size-9 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-fg"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span key={swaps} className={swaps ? "icon-swap" : undefined}>
        {theme === "dark" ? (
          <Sun className="size-4 transition-transform duration-500 ease-out group-hover:rotate-90" />
        ) : (
          <Moon className="size-4 transition-transform duration-500 ease-out group-hover:-rotate-12" />
        )}
      </span>
    </button>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false });
  // Easter egg: five quick clicks on the logo.
  const logoClicks = useRef<number[]>([]);
  const [boops, setBoops] = useState(0);
  const onLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const now = Date.now();
    logoClicks.current = [...logoClicks.current.filter((t) => now - t < 1600), now];
    setBoops((n) => n + 1);
    if (logoClicks.current.length >= 5) {
      logoClicks.current = [];
      const r = e.currentTarget.getBoundingClientRect();
      confetti({ x: r.left + 16, y: r.top + r.height / 2, count: 70, power: 0.8 });
      unlock("logo");
    }
  };

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

  // One pill slides between the links instead of each link fading its own background.
  useEffect(() => {
    const update = () => {
      const el = active ? listRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
      setPill((p) => (el ? { left: el.offsetLeft, width: el.offsetWidth, visible: true } : { ...p, visible: false }));
    };
    update();
    document.fonts?.ready.then(update);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [active]);

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
      <span
        aria-hidden="true"
        className="scroll-progress pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-left bg-accent-fill"
      />
      <nav className="container-page flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Link href="/" onClick={onLogoClick} className="group flex items-center gap-2.5" aria-label={`${PROFILE.name}, home`}>
          <span key={boops} className={`${boops ? "logo-boop " : ""}grid size-8 place-items-center rounded-lg bg-fg font-mono text-[0.7rem] font-semibold tracking-tight text-bg transition group-hover:bg-accent-fill group-hover:text-accent-ink`}>
            YE
          </span>
          <span className="hidden text-sm font-medium tracking-tight text-fg sm:block">{PROFILE.name}</span>
        </Link>

        <ul ref={listRef} className="relative hidden items-center gap-1 md:flex">
          <li
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 rounded-full bg-surface-2 transition-[left,width,opacity] duration-300 ease-out"
            style={{ left: pill.left, width: pill.width, opacity: pill.visible ? 1 : 0 }}
          />
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={href(item.id)}
                data-id={item.id}
                className={`relative block rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300 ${
                  active === item.id ? "text-fg" : "text-muted hover:text-fg"
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
