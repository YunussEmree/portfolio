"use client";

import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { skillCategories } from "@/data/skills";
import { fadeUp, stagger, staggerFast } from "@/lib/animations";
import type { SkillCategory } from "@/types";

const accentMap: Record<
  SkillCategory["accent"],
  { pill: string; label: string; dot: string; divider: string }
> = {
  blue: {
    pill: "border-blue-500/25 bg-blue-500/8 text-blue-700 dark:text-blue-200 hover:border-blue-400/50 hover:bg-blue-500/15",
    label: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
    divider: "from-blue-500/0 via-blue-500/30 to-blue-500/0",
  },
  violet: {
    pill: "border-violet-500/25 bg-violet-500/8 text-violet-700 dark:text-violet-200 hover:border-violet-400/50 hover:bg-violet-500/15",
    label: "text-violet-600 dark:text-violet-400",
    dot: "bg-violet-500",
    divider: "from-violet-500/0 via-violet-500/30 to-violet-500/0",
  },
  emerald: {
    pill: "border-emerald-500/25 bg-emerald-500/8 text-emerald-700 dark:text-emerald-200 hover:border-emerald-400/50 hover:bg-emerald-500/15",
    label: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
    divider: "from-emerald-500/0 via-emerald-500/30 to-emerald-500/0",
  },
  orange: {
    pill: "border-orange-500/25 bg-orange-500/8 text-orange-700 dark:text-orange-200 hover:border-orange-400/50 hover:bg-orange-500/15",
    label: "text-orange-600 dark:text-orange-400",
    dot: "bg-orange-500",
    divider: "from-orange-500/0 via-orange-500/30 to-orange-500/0",
  },
  cyan: {
    pill: "border-cyan-500/25 bg-cyan-500/8 text-cyan-700 dark:text-cyan-200 hover:border-cyan-400/50 hover:bg-cyan-500/15",
    label: "text-cyan-600 dark:text-cyan-400",
    dot: "bg-cyan-500",
    divider: "from-cyan-500/0 via-cyan-500/30 to-cyan-500/0",
  },
  rose: {
    pill: "border-rose-500/25 bg-rose-500/8 text-rose-700 dark:text-rose-200 hover:border-rose-400/50 hover:bg-rose-500/15",
    label: "text-rose-600 dark:text-rose-400",
    dot: "bg-rose-500",
    divider: "from-rose-500/0 via-rose-500/30 to-rose-500/0",
  },
};

export default function Skills() {
  return (
    <section id="skills" className="relative bg-zinc-50 dark:bg-zinc-950 py-28">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700/60 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle kicker="Toolkit" title="Skills" />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="space-y-12"
        >
          {skillCategories.map((category) => {
            const colors = accentMap[category.accent];
            return (
              <motion.div key={category.name} variants={fadeUp}>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <span className={`size-2 rounded-full ${colors.dot} shadow-lg`} />
                  <h3 className={`text-xs font-bold uppercase tracking-[0.2em] ${colors.label}`}>
                    {category.name}
                  </h3>
                  <div className={`flex-1 h-px bg-gradient-to-r ${colors.divider}`} />
                </div>

                {/* Skill pills */}
                <motion.div
                  variants={staggerFast}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-wrap gap-2.5"
                >
                  {category.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      variants={fadeUp}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 cursor-default ${colors.pill}`}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
