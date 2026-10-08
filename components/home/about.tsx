import { Award, GraduationCap, Languages } from "lucide-react";
import { ABOUT, EDUCATION, LANGUAGES, RECOGNITION } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import ApiConsole from "../fun/api-console";
import Reveal from "../reveal";
import SectionHeading from "../section-heading";

export default function About() {
  return (
    <section id="about" className="border-t border-line py-24 sm:py-32" aria-labelledby="about-title">
      <div className="container-page">
        <SectionHeading
          id="about-title"
          index="03"
          label="About"
          title={
            <>
              Student by schedule, <span className="serif-accent text-muted">engineer</span> by habit.
            </>
          }
        />

        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-9 md:col-start-4">
            <Reveal className="space-y-5 text-[1.1rem] leading-relaxed text-muted sm:text-[1.2rem]">
              {ABOUT.map((p, i) => (
                <p key={i} className={i === 0 ? "text-fg" : undefined}>
                  {p}
                </p>
              ))}
            </Reveal>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <Reveal className="card p-6">
                <p className="eyebrow flex items-center gap-2">
                  <GraduationCap className="size-4 text-accent" /> Education
                </p>
                <p className="mt-4 font-medium text-fg">{EDUCATION.degree}</p>
                <p className="text-sm text-muted">{EDUCATION.school}</p>
                <p className="mt-2 font-mono text-xs text-faint">
                  {EDUCATION.period} · {EDUCATION.detail}
                </p>
              </Reveal>
              <Reveal className="card p-6" delay={0.06}>
                <p className="eyebrow flex items-center gap-2">
                  <Languages className="size-4 text-accent" /> Languages
                </p>
                <ul className="mt-4 space-y-2">
                  {LANGUAGES.map((l) => (
                    <li key={l.name} className="flex items-baseline justify-between gap-4 text-sm">
                      <span className="font-medium text-fg">{l.name}</span>
                      <span className="text-muted">{l.level}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className="card p-6 sm:col-span-2" delay={0.1}>
                <p className="eyebrow flex items-center gap-2">
                  <Award className="size-4 text-accent" /> Recognition
                </p>
                <ul className="mt-4 divide-y divide-line">
                  {RECOGNITION.map((r) => (
                    <li key={r.title} className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:gap-6">
                      <div>
                        <p className="text-[0.95rem] font-medium text-fg">{r.title}</p>
                        <p className="text-sm text-muted">{r.detail}</p>
                      </div>
                      <p className="font-mono text-xs text-faint sm:pt-1">{r.year}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>

        <Reveal className="mt-24">
          <h3 className="eyebrow mb-6">Toolbox — what I have used in shipped work</h3>
          <div className="grid gap-px overflow-hidden rounded-[1.25rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((g) => (
              <div key={g.name} className="bg-bg p-6">
                <p className="text-sm font-medium text-fg">{g.name}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {g.skills.map((s) => (
                    <li key={s} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-16">
          <ApiConsole />
        </Reveal>
      </div>
    </section>
  );
}
