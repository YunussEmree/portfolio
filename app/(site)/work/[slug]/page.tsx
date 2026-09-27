import { ArrowLeft, ArrowRight, ArrowUpRight, Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Chips, StatusBadge } from "@/components/home/work";
import { PhoneFrame, ProjectVisual } from "@/components/media";
import Reveal from "@/components/reveal";
import { projectBySlug, projects } from "@/data/projects";
import { PROFILE } from "@/data/profile";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = projectBySlug((await params).slug);
  if (!p) return {};
  return {
    title: `${p.title} — case study`,
    description: `${p.tagline}. ${p.summary}`,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: `${p.title} — ${p.tagline}`, description: p.summary, type: "article" },
  };
}

export default async function CaseStudy({ params }: { params: Promise<Params> }) {
  const p = projectBySlug((await params).slug);
  if (!p) notFound();
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];
  const cs = p.caseStudy;

  return (
    <article className="pb-24 pt-28 sm:pt-36">
      <div className="container-page">
        <Reveal y={8}>
          <Link href="/#work" className="group inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
            <ArrowLeft className="size-4 transition group-hover:-translate-x-0.5" /> All work
          </Link>
        </Reveal>

        <header className="mt-10 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-8" delay={0.05}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs text-accent">Case study {String(i + 1).padStart(2, "0")}</span>
              <StatusBadge status={p.status} />
            </div>
            <h1 className="display mt-6 text-[clamp(2.8rem,7vw,5.5rem)] text-fg">{p.title}</h1>
            <p className="mt-5 max-w-3xl text-balance text-[clamp(1.25rem,2.4vw,1.75rem)] leading-snug tracking-tight text-muted">
              {p.tagline}.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-4 lg:pt-4" delay={0.12}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-5 text-sm lg:grid-cols-1">
              <div>
                <dt className="eyebrow">Role</dt>
                <dd className="mt-1 text-fg">{p.role}</dd>
              </div>
              <div>
                <dt className="eyebrow">Year</dt>
                <dd className="mt-1 text-fg">{p.year}</dd>
              </div>
              {p.links.length > 0 && (
                <div className="col-span-2 lg:col-span-1">
                  <dt className="eyebrow">Links</dt>
                  <dd className="mt-1 flex flex-wrap gap-x-4">
                    {p.links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-fg hover:text-accent">
                        {l.label} <ArrowUpRight className="size-3.5" />
                      </a>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </Reveal>
        </header>

        <Reveal className="mt-14" delay={0.15}>
          {p.shotKind === "phone" ? (
            <div
              className="rounded-[1.5rem] px-4 py-8 sm:px-16 sm:py-16"
              style={{ background: `radial-gradient(120% 100% at 20% 0%, ${p.tint.from}, ${p.tint.to} 75%)` }}
            >
            <ul className="mx-auto grid max-w-3xl grid-cols-3 gap-3 sm:gap-10">
              {p.shots.map((s, n) => (
                <li key={s.src} className={n === 1 ? "sm:-translate-y-6" : "sm:translate-y-4"}>
                  <PhoneFrame shot={s} priority={n === 0} sizes="(min-width: 1024px) 300px, 30vw" className="relative w-full" />
                </li>
              ))}
            </ul>
            </div>
          ) : (
            <ProjectVisual project={p} priority aspect="aspect-[4/3] sm:aspect-[16/9]" />
          )}
        </Reveal>

        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">Overview</p>
            <Chips items={p.stack} className="mt-5" />
          </Reveal>
          <Reveal className="space-y-5 text-[1.12rem] leading-relaxed lg:col-span-8" delay={0.05}>
            <p className="text-fg">{p.summary}</p>
            <p className="text-muted">{cs.context}</p>
          </Reveal>
        </div>

        <Reveal className="mt-20">
          <div className="card p-6 sm:p-10">
            <p className="eyebrow">{cs.flowTitle}</p>
            <ol className="mt-8 grid gap-0 lg:grid-flow-col lg:auto-cols-fr">
              {cs.flow.map((step, n) => (
                <li key={step.label} className="relative flex gap-4 pb-8 last:pb-0 lg:flex-col lg:gap-5 lg:pb-0 lg:pr-6">
                  {/* connector */}
                  {n < cs.flow.length - 1 && (
                    <span
                      className="absolute left-[0.95rem] top-9 h-[calc(100%-2.25rem)] w-px bg-line-strong lg:left-10 lg:right-0 lg:top-[0.95rem] lg:h-px lg:w-auto"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full border border-line-strong bg-surface font-mono text-xs text-accent">
                    {n + 1}
                  </span>
                  <span>
                    <span className="block font-medium text-fg">{step.label}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{step.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <div className="mt-20 space-y-16">
          {cs.sections.map((s) => (
            <Reveal key={s.title} className="grid gap-6 border-t border-line pt-10 lg:grid-cols-12 lg:gap-10">
              <h2 className="text-2xl font-semibold tracking-tight text-fg lg:col-span-4">{s.title}</h2>
              <div className="lg:col-span-8">
                {s.paragraphs && (
                  <div className="prose-case text-[1.05rem] leading-relaxed text-muted">
                    {s.paragraphs.map((t) => (
                      <p key={t}>{t}</p>
                    ))}
                  </div>
                )}
                {s.bullets && (
                  <ul className={`space-y-3 ${s.paragraphs ? "mt-6" : ""}`}>
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-[1.02rem] leading-relaxed text-muted">
                        <span className="mt-[0.7rem] h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20">
          <div className="card flex gap-4 p-6 sm:p-8">
            <Lightbulb className="mt-0.5 size-5 shrink-0 text-accent" />
            <div>
              <p className="font-medium text-fg">What I took away</p>
              <ul className="mt-3 space-y-2">
                {cs.lessons.map((l) => (
                  <li key={l} className="leading-relaxed text-muted">
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <nav className="mt-24 grid gap-4 border-t border-line pt-10 sm:grid-cols-2" aria-label="More">
          <Link href={`/work/${next.slug}`} className="card group flex items-center justify-between gap-4 p-6 transition hover:border-line-strong">
            <span>
              <span className="eyebrow">Next case study</span>
              <span className="mt-1 block text-xl font-semibold tracking-tight text-fg">{next.title}</span>
              <span className="text-sm text-muted">{next.tagline}</span>
            </span>
            <ArrowRight className="size-5 shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-accent" />
          </Link>
          <a href={`mailto:${PROFILE.email}`} className="card group flex items-center justify-between gap-4 p-6 transition hover:border-line-strong">
            <span>
              <span className="eyebrow">Hiring?</span>
              <span className="mt-1 block text-xl font-semibold tracking-tight text-fg">Let&apos;s talk</span>
              <span className="text-sm text-muted">{PROFILE.email}</span>
            </span>
            <ArrowUpRight className="size-5 shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
          </a>
        </nav>
      </div>
    </article>
  );
}
