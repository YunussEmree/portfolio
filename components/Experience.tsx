"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, Building2 } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { experiences } from "@/data/experiences";
import { stagger, slideInLeft } from "@/lib/animations";

export default function Experience() {
  return (
    <section id="experience" className="relative bg-white dark:bg-zinc-950 py-28">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700/60 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle kicker="What I've done so far" title="Experience" />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative"
        >
          {/* Timeline line */}
          <div className="absolute left-6 top-6 bottom-0 w-px bg-gradient-to-b from-blue-500/70 via-violet-500/40 to-transparent" />

          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <motion.div key={i} variants={slideInLeft} className="relative pl-16">
                {/* Timeline node */}
                <div className="absolute left-6 top-6 -translate-x-1/2 size-[46px] rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 overflow-hidden grid place-items-center shadow-lg shadow-black/10 dark:shadow-black/40 z-10">
                  {exp.logo ? (
                    <Image
                      src={exp.logo}
                      alt={`${exp.company} logo`}
                      fill
                      sizes="46px"
                      quality={50}
                      className="object-contain p-1.5"
                    />
                  ) : (
                    <Building2 className="size-5 text-zinc-400" />
                  )}
                </div>

                {/* Card */}
                <div className="p-6 md:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/60 transition-colors duration-300">
                  {/* Company name */}
                  <p className="text-blue-600 dark:text-blue-400 font-bold text-2xl mb-1">{exp.company}</p>

                  {/* Role title */}
                  <h3 className="text-zinc-900 dark:text-white font-semibold text-lg mb-3">{exp.role}</h3>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-zinc-500 dark:text-zinc-500 text-xs">
                      <Calendar className="size-3.5 text-blue-500" />
                      {exp.period}
                    </span>
                  </div>

                  {/* Bullet points */}
                  <ul className="space-y-2.5">
                    {exp.points.map((point, j) => (
                      <li key={j} className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                        <span className="mt-[7px] size-1.5 rounded-full bg-blue-500/70 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
