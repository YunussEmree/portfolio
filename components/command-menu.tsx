"use client";

import {
  ArrowRight,
  Briefcase,
  CornerDownLeft,
  FileText,
  FolderGit2,
  Gamepad2,
  Lightbulb,
  Trophy,
  Mail,
  RotateCw,
  Search,
  SunMoon,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { PROFILE } from "@/data/profile";
import { FUN, GAMES } from "@/data/fun";
import { HINT_EVENT, openArcade } from "./fun/achievements";
import { barrelRoll } from "./fun/effects";
import { GitHubIcon, LinkedInIcon } from "./icons";
import { useTheme } from "./providers";

export const OPEN_COMMAND_MENU = "open-command-menu";

type Item = {
  id: string;
  group: "Go to" | "Case studies" | "Actions" | "Fun";
  label: string;
  hint?: string;
  icon: React.ReactNode;
  run: () => void;
};

/** ⌘K / Ctrl+K: jump anywhere, copy the email, get the résumé. */
export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { toggle } = useTheme();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
  }, []);

  const goToSection = useCallback(
    (id: string) => {
      close();
      if (pathname === "/") document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      else router.push(`/#${id}`);
    },
    [close, pathname, router],
  );

  const items: Item[] = useMemo(
    () => [
      { id: "work", group: "Go to", label: "Selected work", icon: <FolderGit2 />, run: () => goToSection("work") },
      { id: "experience", group: "Go to", label: "Experience", icon: <Briefcase />, run: () => goToSection("experience") },
      { id: "about", group: "Go to", label: "About", icon: <User />, run: () => goToSection("about") },
      { id: "contact", group: "Go to", label: "Contact", icon: <Mail />, run: () => goToSection("contact") },
      ...projects.map<Item>((p) => ({
        id: `case-${p.slug}`,
        group: "Case studies",
        label: p.title,
        hint: p.tagline,
        icon: <ArrowRight />,
        run: () => {
          close();
          router.push(`/work/${p.slug}`);
        },
      })),
      {
        id: "copy-email",
        group: "Actions",
        label: "Copy email address",
        hint: PROFILE.email,
        icon: <Mail />,
        run: async () => {
          try {
            await navigator.clipboard.writeText(PROFILE.email);
            setNotice("Email copied");
            setTimeout(() => setNotice(null), 1600);
          } catch {
            window.location.href = `mailto:${PROFILE.email}`;
          }
          close();
        },
      },
      {
        id: "cv",
        group: "Actions",
        label: "Download résumé (PDF)",
        icon: <FileText />,
        run: () => {
          close();
          window.location.href = PROFILE.cv;
        },
      },
      {
        id: "github",
        group: "Actions",
        label: "Open GitHub",
        icon: <GitHubIcon />,
        run: () => {
          close();
          window.open(PROFILE.github, "_blank", "noopener");
        },
      },
      {
        id: "linkedin",
        group: "Actions",
        label: "Open LinkedIn",
        icon: <LinkedInIcon />,
        run: () => {
          close();
          window.open(PROFILE.linkedin, "_blank", "noopener");
        },
      },
      {
        id: "theme",
        group: "Actions",
        label: "Toggle light / dark theme",
        icon: <SunMoon />,
        run: () => {
          // Close first so the menu is not part of the snapshot the theme transition animates.
          close();
          requestAnimationFrame(() => toggle());
        },
      },
      {
        id: "arcade",
        group: "Fun",
        label: FUN.arcade.open,
        hint: `${GAMES.length} small games`,
        icon: <Gamepad2 />,
        run: () => {
          close();
          openArcade();
        },
      },
      ...GAMES.map<Item>((g) => ({
        id: `game-${g.id}`,
        group: "Fun",
        label: `Play ${g.title}`,
        icon: <Gamepad2 />,
        run: () => {
          close();
          openArcade(g.id);
        },
      })),
      {
        id: "trophies",
        group: "Fun",
        label: FUN.trophies.title,
        hint: "hidden achievements",
        icon: <Trophy />,
        run: () => {
          close();
          openArcade("trophies");
        },
      },
      {
        id: "hint",
        group: "Fun",
        label: "Give me a hint",
        hint: "secrets on this site",
        icon: <Lightbulb />,
        run: () => {
          close();
          window.dispatchEvent(new Event(HINT_EVENT));
        },
      },
      {
        id: "barrel-roll",
        group: "Fun",
        label: "Do a barrel roll",
        icon: <RotateCw />,
        run: () => {
          close();
          requestAnimationFrame(barrelRoll);
        },
      },
    ],
    [close, goToSection, router, toggle],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("en");
    if (!q) return items;
    return items.filter((i) => `${i.label} ${i.hint ?? ""} ${i.group}`.toLocaleLowerCase("en").includes(q));
  }, [items, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_MENU, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_MENU, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => input.current?.focus());
  }, [open]);

  useEffect(() => setIndex(0), [query]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[index]?.run();
    }
  };

  const groups = ["Go to", "Case studies", "Actions", "Fun"] as const;

  return (
    <>
      {open && (
          <div
            className="fade-in fixed inset-0 z-[100] flex items-start justify-center bg-black/50 px-4 pt-[14vh] backdrop-blur-sm"
            onMouseDown={(e) => e.target === e.currentTarget && close()}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Command menu"
              className="pop-in w-full max-w-xl overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl shadow-black/40"
              onKeyDown={onKeyDown}
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <Search className="size-4 shrink-0 text-muted" />
                <input
                  ref={input}
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search…"
                  className="h-14 w-full bg-transparent text-[0.95rem] text-fg outline-none placeholder:text-faint"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="command-list"
                  aria-activedescendant={filtered[index] ? `cmd-${filtered[index].id}` : undefined}
                />
                <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[0.65rem] text-muted">
                  ESC
                </kbd>
              </div>
              <ul id="command-list" role="listbox" className="max-h-[55vh] overflow-y-auto p-2" data-lenis-prevent>
                {filtered.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">No results.</li>}
                {groups.map((g) => {
                  const inGroup = filtered.filter((i) => i.group === g);
                  if (inGroup.length === 0) return null;
                  return (
                    <li key={g} role="presentation">
                      <p className="px-3 pb-1 pt-3 font-mono text-[0.68rem] uppercase tracking-wider text-faint">{g}</p>
                      <ul role="presentation">
                        {inGroup.map((item) => {
                          const i = filtered.indexOf(item);
                          const selected = i === index;
                          return (
                            <li
                              key={item.id}
                              id={`cmd-${item.id}`}
                              role="option"
                              aria-selected={selected}
                              onMouseMove={() => setIndex(i)}
                              onClick={() => item.run()}
                              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm [&_svg]:size-4 ${
                                selected ? "bg-surface-2 text-fg" : "text-muted"
                              }`}
                            >
                              <span className={selected ? "text-accent" : "text-faint"}>{item.icon}</span>
                              <span className="truncate text-fg">{item.label}</span>
                              {item.hint && <span className="truncate text-xs text-faint">{item.hint}</span>}
                              {selected && <CornerDownLeft className="ml-auto shrink-0 text-faint" />}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
      )}
      <p
        role="status"
        className={`fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg transition duration-300 ${
          notice ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        {notice}
      </p>
    </>
  );
}
