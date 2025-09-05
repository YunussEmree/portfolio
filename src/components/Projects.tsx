import React from "react";
import { ExternalLink, Github } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { projects } from "../data/projects";
import { cardStyle } from "../ui";

const Projects: React.FC = () => (
  <section className="bg-white" id="projects">
    <div className="mx-auto max-w-6xl px-4 py-20">
      <SectionTitle kicker="My Work" title="Projects" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.title} className={`${cardStyle} rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform`}>
            <div className="h-40 bg-gradient-to-tr from-blue-200 via-blue-300 to-blue-500" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-slate-600 text-sm">{p.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.stack.map((t) => (
                  <span key={t} className="text-xs font-semibold uppercase tracking-wide bg-blue-50 text-blue-700 rounded-full px-2.5 py-1 border border-blue-200">
                    #{t}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-3">
                <a href={p.links.live} className="inline-flex items-center gap-2 text-blue-600 hover:underline">
                  Live <ExternalLink className="h-4 w-4" />
                </a>
                <a href={p.links.repo} className="inline-flex items-center gap-2 text-slate-600 hover:underline">
                  Code <Github className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Projects;
