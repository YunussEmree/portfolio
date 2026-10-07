import Image from "next/image";
import { EDUCATION, LANGUAGES, PROFILE } from "@/data/profile";
import PhotoGreeter from "../fun/photo-greeter";

/** Portrait and the facts a recruiter looks for first: where, what, which languages. */
export default function ProfileCard() {
  const facts = [
    { label: "Based in", value: `${PROFILE.location} · ${PROFILE.timezone}` },
    { label: "Studying", value: `${EDUCATION.degree}, ${EDUCATION.school}` },
    { label: "Speaks", value: LANGUAGES.map((l) => l.name).join(", ") },
  ];

  return (
    <figure className="group card overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/40">
      <PhotoGreeter className="relative block aspect-square w-full overflow-hidden bg-surface-2">
        <Image
          src={PROFILE.photo}
          alt={`Portrait of ${PROFILE.name}`}
          fill
          sizes="(min-width: 1280px) 380px, (min-width: 1024px) 45vw, 100vw"
          className="object-cover object-[50%_8%] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
      </PhotoGreeter>
      <figcaption className="p-5 sm:p-6">
        <p className="font-medium tracking-tight text-fg">{PROFILE.name}</p>
        <p className="text-sm text-muted">{PROFILE.role}</p>
        <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
          {facts.map((f) => (
            <div key={f.label} className="grid grid-cols-[5.5rem_1fr] gap-3">
              <dt className="font-mono text-xs leading-5 text-faint">{f.label}</dt>
              <dd className="text-fg">{f.value}</dd>
            </div>
          ))}
        </dl>
      </figcaption>
    </figure>
  );
}
