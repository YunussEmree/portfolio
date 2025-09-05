import React from "react";
import SectionTitle from "./SectionTitle";
import { skills } from "../data/skills";
import { cardStyle } from "../ui";

const Skills: React.FC = () => (
  <section className="bg-white" id="skills">
    <div className="mx-auto max-w-6xl px-4 py-16">
      <SectionTitle kicker="Toolkit" title="Skills" />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {skills.map((s) => (
          <div key={s} className={`${cardStyle} rounded-xl px-3 py-2 text-center text-sm font-semibold text-slate-700`}>
            {s}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Skills;
