import React from "react";
import SectionTitle from "./SectionTitle";
import { services } from "../data/services";
import { cardStyle } from "../ui";

const Services: React.FC = () => (
  <section className="bg-gradient-to-b from-slate-50 to-white" id="about">
    <div className="mx-auto max-w-6xl px-4 py-20">
      <SectionTitle kicker="Introduction" title="Overview" />
      <p className="max-w-3xl text-slate-600">
        I’m a quick learner and collaborate closely with clients to create efficient,
        scalable, and user-friendly solutions. Let’s work together to bring your ideas to life!
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map(({ title, icon: Icon, desc }) => (
          <div key={title} className={`${cardStyle} rounded-2xl p-6 hover:-translate-y-1 transition-transform`}>
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 grid place-items-center mb-4">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
            <p className="text-slate-600 mt-2 text-sm">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
