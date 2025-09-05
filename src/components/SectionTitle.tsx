import React from "react";

type Props = { kicker?: string; title: string; id?: string };

const SectionTitle: React.FC<Props> = ({ kicker, title, id }) => (
  <div className="mb-8" id={id}>
    {kicker && (
      <p className="uppercase tracking-widest text-xs md:text-sm text-blue-500 font-semibold mb-2">
        {kicker}
      </p>
    )}
    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">{title}</h2>
  </div>
);

export default SectionTitle;
