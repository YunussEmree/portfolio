import Image from "next/image";
import { EDUCATION, LANGUAGES, PROFILE } from "@/data/profile";

/** Portrait and the facts a recruiter looks for first: where, what, which languages. */
export default function ProfileCard() {
  const facts = [
    { label: "Based in", value: `${PROFILE.location} · ${PROFILE.timezone}` },
    { label: "Studying", value: `${EDUCATION.degree}, ${EDUCATION.school}` },
    { label: "Speaks", value: LANGUAGES.map((l) => l.name).join(", ") },
  ];

  return (
    <figure className="card group overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/40">
      <div className="relative aspect-square overflow-hidden bg-surface-2">
        <Image
          src={PROFILE.photo}
          alt={`Portrait of ${PROFILE.name}`}
          fill
          sizes="(min-width: 1280px) 380px, (min-width: 1024px) 45vw, 100vw"
          className="object-cover object-[50%_8%] grayscale contrast-[1.05] transition duration-700 group-hover:grayscale-0"
        />
      </div>
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
