import { PROFILE } from "@/data/profile";
import { GitHubIcon, LinkedInIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}. Designed and built by me with Next.js.
        </p>
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
