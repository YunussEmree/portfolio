import { ArrowUpRight, FileText } from "lucide-react";
import { PROFILE } from "@/data/profile";
import CopyEmail from "../copy-email";
import { GitHubIcon, LinkedInIcon } from "../icons";
import Reveal from "../reveal";

export default function Contact() {
  const links = [
    { label: "LinkedIn", href: PROFILE.linkedin, icon: <LinkedInIcon className="size-5" />, external: true },
    { label: "GitHub", href: PROFILE.github, icon: <GitHubIcon className="size-5" />, external: true },
    { label: "Résumé (PDF)", href: PROFILE.cv, icon: <FileText className="size-5" />, external: false },
  ];

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line py-24 sm:py-36" aria-labelledby="contact-title">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[32rem]"
        style={{ background: "radial-gradient(50% 60% at 50% 100%, var(--glow), transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="container-page">
        <Reveal>
          <p className="eyebrow flex items-center gap-3">
            <span className="text-accent">04</span>
            <span className="h-px w-6 bg-line-strong" aria-hidden="true" />
            Contact
          </p>
          <h2 id="contact-title" className="display mt-8 max-w-4xl text-balance text-[clamp(2.6rem,7vw,6rem)] text-fg">
            Let&apos;s build something that <span className="serif-accent text-accent">holds up.</span>
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
            I&apos;m open to backend and full-stack roles, in Antalya or remote. The fastest way to reach me is email;
            I read everything.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 grid gap-4 lg:grid-cols-12">
          <div className="card flex flex-col justify-between gap-8 p-6 sm:p-8 lg:col-span-7">
            <p className="eyebrow">Email</p>
            <div>
              <CopyEmail
                email={PROFILE.email}
                className="text-[clamp(1.1rem,3vw,1.75rem)] font-medium tracking-tight text-fg [overflow-wrap:anywhere]"
              />
              <br />
              <a
                href={`mailto:${PROFILE.email}?subject=${encodeURIComponent("Hello Yunus Emre")}`}
                className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-accent-fill px-6 font-medium text-accent-ink transition hover:brightness-105"
              >
                Write to me <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener" } : {})}
                  className="card group flex h-full items-center justify-between gap-4 p-5 transition hover:border-line-strong hover:bg-surface-2"
                >
                  <span className="flex items-center gap-3 font-medium text-fg">
                    <span className="text-muted transition group-hover:text-accent">{l.icon}</span>
                    {l.label}
                  </span>
                  <ArrowUpRight className="size-4 text-faint transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
