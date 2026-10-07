import Reveal from "./reveal";

type Props = {
  index: string;
  label: string;
  title: React.ReactNode;
  intro?: string;
  id?: string;
};

/** "01 — Selected work" label, a large title and an optional intro, left-aligned. */
export default function SectionHeading({ index, label, title, intro, id }: Props) {
  return (
    <Reveal className="mb-12 grid gap-6 md:mb-16 md:grid-cols-12">
      <p className="eyebrow flex items-center gap-3 md:col-span-3 md:pt-3">
        <span className="text-accent">{index}</span>
        <span className="draw-line h-px w-6 bg-line-strong" aria-hidden="true" />
        {label}
      </p>
      <div className="md:col-span-9">
        <h2 id={id} className="display text-balance text-[clamp(2.1rem,4.6vw,3.6rem)] text-fg">
          {title}
        </h2>
        {intro && <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-muted">{intro}</p>}
      </div>
    </Reveal>
  );
}
