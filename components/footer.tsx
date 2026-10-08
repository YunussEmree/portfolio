import { FUN } from "@/data/fun";
import { PROFILE } from "@/data/profile";
import { FooterBug, FunStats } from "./fun/footer-bug";
import ArcadeButton from "./fun/arcade-button";
import { GitHubIcon, LinkedInIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="relative border-t border-line">
      <FooterBug />
      <div className="container-page flex flex-col gap-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <p>
            © {new Date().getFullYear()} {PROFILE.name}. Designed and built by me with Next.js.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <FunStats />
            <ArcadeButton label={FUN.arcade.title} className="font-mono text-[0.7rem] text-faint transition hover:text-accent" />
          </div>
        </div>
        <div className="flex items-center gap-5">
          <a href={PROFILE.github} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-fg">
            <GitHubIcon /> GitHub
          </a>
          <a href={PROFILE.linkedin} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-fg">
            <LinkedInIcon /> LinkedIn
          </a>
          <a href="/cv" className="hover:text-fg">
            Résumé
          </a>
        </div>
      </div>
    </footer>
  );
}
