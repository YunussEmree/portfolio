"use client";

import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { services } from "@/data/services";
import { fadeUp, stagger } from "@/lib/animations";

export default function About() {
  return (
    <section id="about" className="relative bg-white dark:bg-zinc-950 py-28">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700/60 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle kicker="Introduction" title="Overview" />

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-2xl text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed mb-14"
        >
          I&apos;m a quick learner who collaborates closely to create efficient, scalable, and
          user-friendly solutions. Passionate about backend architecture and building systems that{" "}
          <span className="text-zinc-900 dark:text-zinc-200 font-medium">actually work</span> in production. Let&apos;s
          build something great together.
        </motion.p>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map(({ title, icon: Icon, desc }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="group relative p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/70 transition-all duration-300 cursor-default"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/0 to-violet-600/0 group-hover:from-blue-600/5 group-hover:to-violet-600/5 transition-all duration-500 pointer-events-none" />

              <div className="relative">
                <div className="mb-4 size-12 rounded-xl bg-blue-500/10 border border-blue-500/20 grid place-items-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-500/15 group-hover:border-blue-500/30 transition-all duration-300">
                  <Icon className="size-6" />
                </div>
                <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
