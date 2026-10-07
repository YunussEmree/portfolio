import { ArrowDown, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { experiences } from "@/data/experiences";
import { PROFILE } from "@/data/profile";
import { GitHubIcon, LinkedInIcon } from "../icons";
import ProfileCard from "./profile-card";

/** "Line one|line *two*" → one block per line, the starred part in the serif accent. */
function Headline({ text }: { text: string }) {
  return (
    <>
      {text.split("|").map((line, l) => (
        <span key={l} className="block">
          {line.split(/(\*[^*]+\*)/).map((part, i) =>
            part.startsWith("*") ? (
              <em key={i} className="serif-accent ink-underline pr-1 text-accent">
                {part.slice(1, -1)}
              </em>
            ) : (
              part
            ),
          )}
        </span>
      ))}
    </>
  );
}

const iconLink =
  "grid size-12 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-fg";

export default function Hero() {
  const current = experiences.filter((e) => e.roles[0]?.period.includes("Present"));

  return (
    <section className="relative overflow-hidden pb-20 pt-28 sm:pt-36 lg:pb-24 lg:pt-40" aria-labelledby="hero-title">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46rem]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[36rem] w-[60rem] -translate-x-1/2"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, var(--glow), transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="container-page">
        {PROFILE.available && (
          <p
            className="rise mb-8 inline-flex max-w-full items-center gap-2.5 rounded-full border border-line bg-surface/60 py-1.5 pl-2.5 pr-3.5 text-xs text-muted backdrop-blur">
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-fill opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-accent-fill" />
              </span>
              <span className="truncate">{PROFILE.availability}</span>
          </p>
        )}

        <h1 id="hero-title">
          <span className="mb-6 block text-[clamp(1rem,1.6vw,1.2rem)] font-medium tracking-tight text-muted">
              {PROFILE.name} <span className="text-faint">—</span> {PROFILE.role}
          </span>
          <span className="display block text-[clamp(2.7rem,6.2vw,5.4rem)] text-fg">
            <Headline text={PROFILE.headline} />
          </span>
        </h1>

        <div className="mt-12 grid items-start gap-14 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="max-w-xl text-[1.075rem] leading-relaxed text-muted text-pretty">{PROFILE.bio}</p>

            <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ "--d": "0.15s" } as React.CSSProperties}>
              <a
                href="#work"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent-fill px-6 text-[0.95rem] font-medium text-accent-ink transition hover:brightness-105"
              >
                See selected work
                <ArrowDown className="size-4 transition group-hover:translate-y-0.5" />
              </a>
              <a
                href={PROFILE.cv}
                className="group inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-[0.95rem] font-medium text-fg transition hover:bg-surface-2"
              >
                Download résumé
                <ArrowUpRight className="size-4 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
              </a>
              <span className="flex items-center">
                <a href={PROFILE.github} target="_blank" rel="noopener" className={iconLink} aria-label="GitHub profile">
                  <GitHubIcon className="size-5" />
                </a>
                <a href={PROFILE.linkedin} target="_blank" rel="noopener" className={iconLink} aria-label="LinkedIn profile">
                  <LinkedInIcon className="size-5" />
                </a>
              </span>
            </div>

            <div className="rise mt-12 border-t border-line pt-6" style={{ "--d": "0.25s" } as React.CSSProperties}>
                <p className="eyebrow mb-4">Currently</p>
                <ul className="flex flex-wrap gap-x-8 gap-y-4">
                  {current.map((e) => (
                    <li key={e.company} className="flex items-center gap-3">
                      {e.logo && (
                        <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-white">
                          <Image src={e.logo} alt="" width={40} height={40} className="size-full object-contain p-1" />
                        </span>
                      )}
                      <span className="text-sm leading-tight">
                        <span className="block font-medium text-fg">{e.company}</span>
                        <span className="text-muted">{e.roles[0].title}</span>
                      </span>
                    </li>
                  ))}
                </ul>
            </div>
          </div>

          <div
            className="rise mx-auto w-full max-w-sm lg:col-span-4 lg:col-start-9 lg:max-w-none"
            style={{ "--d": "0.3s" } as React.CSSProperties}
          >
            <ProfileCard />
          </div>
        </div>
      </div>
    </section>
  );
}
