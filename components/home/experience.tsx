import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { experiences } from "@/data/experiences";
import Reveal from "../reveal";
import SectionHeading from "../section-heading";

export default function Experience() {
  return (
    <section id="experience" className="border-t border-line py-24 sm:py-32" aria-labelledby="experience-title">
      <div className="container-page">
        <SectionHeading
          id="experience-title"
          index="02"
          label="Experience"
          title={
            <>
              Where I&apos;ve <span className="serif-accent text-muted">been</span> shipping.
            </>
          }
        />

        <ol className="border-t border-line">
          {experiences.map((e) => (
            <li key={e.company} className="border-b border-line">
              <Reveal className="group/exp grid gap-6 py-10 md:grid-cols-12 md:gap-10 md:py-12">
                <div className="md:col-span-4">
                  <div className="flex items-center gap-4 md:sticky md:top-24">
                    {e.logo && (
                      <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-white">
                        <Image src={e.logo} alt="" width={48} height={48} className="size-full object-contain p-1.5" />
                      </span>
                    )}
                    <div>
                      <h3 className="font-semibold tracking-tight text-fg">
                        {e.url ? (
                          <a href={e.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 hover:text-accent">
                            {e.company}
                            <ArrowUpRight className="size-3.5 text-faint" />
                          </a>
                        ) : (
                          e.company
                        )}
                      </h3>
                      <p className="text-sm text-muted">{e.about}</p>
                      <p className="mt-0.5 font-mono text-[0.7rem] text-faint">{e.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-10 md:col-span-8">
                  {e.roles.map((r) => (
                    <div key={r.title}>
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                        <h4 className="text-lg font-medium tracking-tight text-fg">{r.title}</h4>
                        <p className="shrink-0 font-mono text-xs text-muted">{r.period}</p>
                      </div>
                      <ul className="mt-4 space-y-2.5">
                        {r.points.map((pt) => (
                          <li key={pt} className="flex gap-3 text-[0.95rem] leading-relaxed text-muted">
                            <span className="mt-[0.65rem] size-1 shrink-0 rounded-full bg-faint transition-colors duration-500 group-hover/exp:bg-accent" aria-hidden="true" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
