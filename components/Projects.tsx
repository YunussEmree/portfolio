"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, FolderGit2 } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { projects } from "@/data/projects";
import { fadeUp, stagger } from "@/lib/animations";

const gradients = [
  "from-blue-600/20 via-blue-500/10 to-cyan-600/15",
  "from-violet-600/20 via-purple-500/10 to-blue-600/15",
  "from-cyan-600/20 via-blue-500/10 to-violet-600/15",
  "from-rose-600/20 via-pink-500/10 to-violet-600/15",
];

export default function Projects() {
  return (
    <section id="projects" className="relative bg-zinc-50 dark:bg-zinc-950 py-28">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700/60 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle kicker="My Work" title="Projects" />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="group flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 overflow-hidden transition-colors duration-300 shadow-sm dark:shadow-lg shadow-black/5 dark:shadow-black/20"
            >
              {/* Gradient header */}
              <div
                className={`relative h-36 bg-gradient-to-br ${gradients[i % gradients.length]} overflow-hidden flex-shrink-0`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <FolderGit2 className="size-14 text-white/20 dark:text-white/15" />
                </div>
                {/* Subtle mesh pattern */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-zinc-900 dark:text-white font-bold text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4 flex-1">{project.desc}</p>

                {/* Stack */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  {project.links.repo !== "#" && (
                    <a
                      href={project.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200 mt-4"
                    >
                      <Github className="size-4" />
                      Source
                    </a>
                  )}
                  {project.links.live !== "#" && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200 mt-4"
                    >
                      <ExternalLink className="size-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
