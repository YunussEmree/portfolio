import { Github, Linkedin, Mail } from "lucide-react";
import { PROFILE } from "@/data/profile";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800/60">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          © {year}{" "}
          <span className="text-zinc-700 dark:text-zinc-300 font-medium">{PROFILE.name}</span>
          {" · "}
          Built with Next.js &amp; Tailwind CSS
        </p>

        <div className="flex items-center gap-1">
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-all duration-200"
          >
            <Github className="size-4" />
          </a>
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-all duration-200"
          >
            <Linkedin className="size-4" />
          </a>
          <a
            href={`mailto:${PROFILE.email}`}
            aria-label="Email"
            className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-all duration-200"
          >
            <Mail className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
