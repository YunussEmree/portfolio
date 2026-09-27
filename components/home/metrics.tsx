import { METRICS } from "@/data/profile";
import Reveal from "../reveal";

export default function Metrics() {
  return (
    <section aria-label="Highlights" className="border-y border-line bg-surface/40">
      <ul className="container-page grid grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m, i) => (
          <li
            key={m.label}
            className={`border-line py-8 sm:py-10 ${i % 2 === 1 ? "pl-5 sm:pl-8" : "pr-5 sm:pr-8"} ${
              i % 2 === 1 ? "border-l" : ""
            } ${i >= 2 ? "border-t lg:border-t-0" : ""} lg:px-8 lg:first:pl-0 ${i > 0 ? "lg:border-l" : ""}`}
          >
            <Reveal delay={i * 0.06}>
              <p className="display text-[clamp(2.4rem,4.4vw,3.5rem)] text-fg">{m.value}</p>
              <p className="mt-2 text-sm font-medium text-fg">{m.label}</p>
              <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted">{m.context}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
