import React from "react";
import { Star } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { testimonials } from "../data/testimonials";
import { cardStyle } from "../ui";

const Testimonials: React.FC = () => (
  <section className="bg-slate-50">
    <div className="mx-auto max-w-6xl px-4 py-16">
      <SectionTitle kicker="What others say" title="Testimonials" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className={`${cardStyle} rounded-2xl p-6`}>
            <Star className="h-6 w-6 text-blue-500" />
            <p className="mt-3 text-slate-700">“{t.quote}”</p>
            <p className="mt-4 text-sm font-semibold text-slate-900">@ {t.name}</p>
            <p className="text-xs text-slate-500">{t.title}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
