import React from "react";
import { Calendar } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { experiences } from "../data/experiences";
import { cardStyle } from "../ui";

const Experience: React.FC = () => (
  <section className="bg-slate-50" id="experience">
    <div className="mx-auto max-w-6xl px-4 py-20">
      <SectionTitle kicker="What I have done so far" title="Work Experience"/>
      <div className="relative">
        <div className="absolute left-10 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-200 to-blue-500/80" />
        <div className="space-y-10">
          {experiences.map((exp, i) => (
            <div key={i} className="relative">
              <div className="absolute left-10 -translate-x-1/2 top-1/2 -translate-y-1/2">
                <div className="h-12 w-12 rounded-full border-2 border-blue-400 bg-white shadow-xl overflow-hidden grid place-items-center z-20">
                  {exp.logo ? (
                    <img src={exp.logo} alt={`${exp.company} logo`} className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-slate-700 font-bold">{exp.company?.[0]}</span>
                  )}
                </div>
              </div>
              <div className="hidden md:block absolute left-16 -translate-x-1 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-l-[14px] border-l-blue-400 z-10" />
              <div className={`${cardStyle} rounded-2xl p-6 md:p-7 ml-20 max-w-[720px] relative`}>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <Calendar className="h-4 w-4 text-blue-500" /> {exp.period}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {exp.role}
                  <span className="text-slate-500 font-medium"> @ {exp.company}</span>
                </h3>
                <ul className="mt-3 list-disc list-inside space-y-1.5 leading-relaxed text-slate-700 marker:text-blue-400">
                  {exp.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Experience;
