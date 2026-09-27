import type { Metadata } from "next";
import Link from "next/link";
import { experiences } from "@/data/experiences";
import { EDUCATION, LANGUAGES, PROFILE } from "@/data/profile";
import { projects, sideProjects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import PrintButton from "./print-button";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${PROFILE.name}, ${PROFILE.role}.`,
  alternates: { canonical: "/cv" },
};

const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 mt-5 border-b border-zinc-300 pb-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-zinc-500">
      {children}
    </h2>
  );
}

/**
 * The résumé as a printable A4 page, built from the same data as the site. `npm run cv` prints it to
 * public/Yunus_Emre_Senyigit_CV.pdf.
 */
export default function CvPage() {
  return (
    <div className="min-h-dvh bg-zinc-200 py-6 text-zinc-900 print:bg-white print:py-0">
      <style>{`@page { size: A4; margin: 14mm 14mm 12mm; } @media print { .dark { color-scheme: light; } }`}</style>
      <div className="mx-auto mb-4 flex max-w-[210mm] items-center justify-between px-4 text-sm print:hidden">
        <Link href="/" className="text-zinc-600 hover:text-zinc-900">
          ← Back to the site
        </Link>
        <PrintButton />
      </div>

      <main className="mx-auto max-w-[210mm] bg-white px-[14mm] py-[12mm] text-[9.6pt] leading-[1.45] shadow-xl print:max-w-none print:p-0 print:shadow-none">
        <header className="flex items-end justify-between gap-6 border-b-2 border-zinc-900 pb-3">
          <div>
            <h1 className="text-[22pt] font-semibold leading-none tracking-tight">{PROFILE.name}</h1>
            <p className="mt-1.5 text-[11pt] text-zinc-600">{PROFILE.role}</p>
          </div>
          <ul className="text-right text-[8.6pt] leading-[1.55] text-zinc-600">
            <li>{PROFILE.location}</li>
            <li>
              <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            </li>
            <li>
              <a href={PROFILE.site}>{host(PROFILE.site)}</a> · <a href={PROFILE.github}>{host(PROFILE.github)}</a>
            </li>
            <li>
              <a href={PROFILE.linkedin}>{host(PROFILE.linkedin)}</a>
            </li>
          </ul>
        </header>

        <p className="mt-3 text-zinc-700">{PROFILE.bio}</p>

        <Heading>Experience</Heading>
        <div className="space-y-3">
          {experiences.map((e) =>
            e.roles.map((r) => (
              <section key={`${e.company}-${r.title}`} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold">
                    {r.title} <span className="font-normal text-zinc-500">· {e.company}</span>
                  </h3>
                  <p className="shrink-0 text-[8.6pt] text-zinc-500">
                    {r.period} · {e.location}
                  </p>
                </div>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 marker:text-zinc-400">
                  {r.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </section>
            )),
          )}
        </div>

        <Heading>Selected projects</Heading>
        <div className="space-y-2.5">
          {projects.map((p) => (
            <section key={p.slug} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-semibold">
                  {p.title} <span className="font-normal text-zinc-500">· {p.tagline}</span>
                </h3>
                <p className="shrink-0 text-[8.6pt] text-zinc-500">
                  {p.year} · {p.status}
                </p>
              </div>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 marker:text-zinc-400">
                {p.highlights.slice(0, 2).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <p className="mt-0.5 text-[8.4pt] text-zinc-500">
                {p.stack.join(" · ")} — {host(PROFILE.site)}/work/{p.slug}
              </p>
            </section>
          ))}
          <ul className="space-y-1 pt-0.5">
            {sideProjects
              .filter((s) => s.title !== "Instagram content automation")
              .map((s) => (
                <li key={s.title} className="break-inside-avoid">
                  <span className="font-semibold">{s.title}</span>{" "}
                  <span className="text-zinc-500">({s.context}, {s.year})</span> — {s.desc}
                </li>
              ))}
          </ul>
        </div>

        <div className="grid grid-cols-[1.35fr_1fr] gap-x-8">
          <div>
            <Heading>Skills</Heading>
            <dl className="space-y-0.5">
              {skillGroups.map((g) => (
                <div key={g.name} className="flex gap-2">
                  <dt className="w-[5.6rem] shrink-0 font-semibold">{g.name}</dt>
                  <dd className="text-zinc-700">{g.skills.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <Heading>Education</Heading>
            <p className="font-semibold">{EDUCATION.degree}</p>
            <p className="text-zinc-700">{EDUCATION.school}</p>
            <p className="text-[8.6pt] text-zinc-500">
              {EDUCATION.period} · {EDUCATION.detail}
            </p>
            <Heading>Languages</Heading>
            <p className="text-zinc-700">{LANGUAGES.map((l) => `${l.name} (${l.level.split(" · ")[0]})`).join(", ")}</p>
          </div>
        </div>

      </main>
    </div>
  );
}
