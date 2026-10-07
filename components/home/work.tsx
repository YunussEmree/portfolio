import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { projects, sideProjects } from "@/data/projects";
import { ProjectVisual } from "../media";
import Reveal from "../reveal";
import SectionHeading from "../section-heading";

export function StatusBadge({ status }: { status: string }) {
  const live = status.toLowerCase() === "live";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[0.68rem] text-muted">
      <span className={`size-1.5 rounded-full ${live ? "bg-accent-fill" : "bg-amber-400"}`} aria-hidden="true" />
      {status}
    </span>
  );
}

export function Chips({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label="Technologies">
      {items.map((s) => (
        <li key={s} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted">
          {s}
        </li>
      ))}
    </ul>
  );
}

function FeaturedProject({ index }: { index: number }) {
  const p = projects[index];
  const flip = index % 2 === 1;
  return (
    <Reveal>
      <article className="group grid items-center gap-8 lg:grid-cols-12 lg:gap-14" aria-labelledby={`p-${p.slug}`}>
        <Link
          href={`/work/${p.slug}`}
          className={`block lg:col-span-7 ${flip ? "lg:order-2" : ""}`}
          aria-label={`${p.title} case study`}
          tabIndex={-1}
        >
          <ProjectVisual project={p} priority={index === 0} />
        </Link>

        <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
            <StatusBadge status={p.status} />
            <span className="font-mono text-xs text-faint">{p.year}</span>
          </div>
          <h3 id={`p-${p.slug}`} className="mt-5 text-3xl font-semibold tracking-tight text-fg sm:text-[2.1rem]">
            <Link href={`/work/${p.slug}`} className="transition hover:text-accent">
              {p.title}
            </Link>
          </h3>
          <p className="mt-2 text-lg text-muted">{p.tagline}</p>

          <ul className="mt-6 space-y-3">
            {p.highlights.slice(0, 3).map((h) => (
              <li key={h} className="flex gap-3 text-[0.94rem] leading-relaxed text-muted">
                <span className="mt-[0.6rem] h-px w-3 shrink-0 origin-left bg-accent transition-transform duration-500 ease-out group-hover:scale-x-150" aria-hidden="true" />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <Chips items={p.stack.slice(0, 6)} className="mt-6" />

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href={`/work/${p.slug}`}
              className="group/cta inline-flex items-center gap-2 text-[0.95rem] font-medium text-fg"
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover/cta:bg-[length:100%_1px]">
                Read the case study
              </span>
              <ArrowUpRight className="size-4 text-accent transition group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
            </Link>
            {p.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg"
              >
                {l.label}
                <ArrowUpRight className="size-3.5" />
              </a>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Work() {
  return (
    <section id="work" className="py-24 sm:py-32" aria-labelledby="work-title">
      <div className="container-page">
        <SectionHeading
          id="work-title"
          index="01"
          label="Selected work"
          title={
            <>
              Products I designed, built <span className="serif-accent text-muted">and</span> run.
            </>
          }
          intro="Each one started as an idea and is now in people's hands, live or in testing on Google Play. I owned the backend, the clients and the path to production."
        />

        <div className="space-y-24 sm:space-y-32">
          {projects.map((p, i) => (
            <FeaturedProject key={p.slug} index={i} />
          ))}
        </div>

        <Reveal className="mt-28 sm:mt-36">
          <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
            <h3 className="text-xl font-semibold tracking-tight text-fg sm:text-2xl">Research, competitions and more</h3>
            <a
              href="https://github.com/YunussEmree"
              target="_blank"
              rel="noopener"
              className="hidden shrink-0 items-center gap-1.5 text-sm text-muted hover:text-fg sm:inline-flex"
            >
              All repositories <ArrowUpRight className="size-3.5" />
            </a>
          </div>
          <ul>
            {sideProjects.map((s) => {
              const body = (
                <>
                  <span className="font-mono text-xs text-faint sm:col-span-1 sm:pt-1">{s.year}</span>
                  <span className="sm:col-span-4">
                    <span className="flex items-center gap-2 font-medium text-fg">
                      {s.title}
                      {s.href && (
                        <ArrowUpRight className="size-3.5 text-faint transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                      )}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">{s.context}</span>
                  </span>
                  <span className="text-sm leading-relaxed text-muted sm:col-span-5">{s.desc}</span>
                  <span className="font-mono text-[0.7rem] leading-relaxed text-faint sm:col-span-2 sm:text-right">
                    {s.stack.slice(0, 3).join(" · ")}
                  </span>
                </>
              );
              const cls =
                "group grid gap-2 border-b border-line py-6 transition sm:grid-cols-12 sm:gap-6 sm:px-3 sm:-mx-3 rounded-lg";
              return (
                <li key={s.title}>
                  {s.href ? (
                    <a href={s.href} target="_blank" rel="noopener" className={`${cls} hover:bg-surface/70`}>
                      {body}
                    </a>
                  ) : (
                    <div className={cls}>{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
