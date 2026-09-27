import Image from "next/image";
import type { Project, Shot } from "@/types";

export function PhoneFrame({ shot, className = "", priority = false, sizes = "240px" }: { shot: Shot; className?: string; priority?: boolean; sizes?: string }) {
  return (
    <div
      className={`aspect-[9/16] overflow-hidden rounded-[1.6rem] border-[5px] border-black/85 bg-black shadow-2xl shadow-black/40 ring-1 ring-white/10 ${className}`}
    >
      <Image src={shot.src} alt={shot.alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
    </div>
  );
}

export function BrowserFrame({ shot, url, className = "", priority = false, sizes = "(min-width: 1024px) 640px, 100vw" }: { shot: Shot; url?: string; className?: string; priority?: boolean; sizes?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-white/15 bg-[#f4f5f7] shadow-2xl shadow-black/40 ${className}`}>
      <div className="flex h-7 items-center gap-1.5 border-b border-black/5 bg-white px-3" aria-hidden="true">
        <span className="size-2 rounded-full bg-black/15" />
        <span className="size-2 rounded-full bg-black/15" />
        <span className="size-2 rounded-full bg-black/15" />
        {url && (
          <span className="mx-auto rounded-md bg-black/5 px-3 py-0.5 font-mono text-[0.6rem] text-black/50">{url}</span>
        )}
      </div>
      <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes={sizes} priority={priority} className="block h-auto w-full" />
    </div>
  );
}

/** The product's screenshots on a panel in its own colors: three fanned phones or two stacked browser windows. */
export function ProjectVisual({
  project,
  priority = false,
  aspect = "aspect-[5/4] sm:aspect-[4/3]",
}: {
  project: Project;
  priority?: boolean;
  aspect?: string;
}) {
  const { tint, shots } = project;
  return (
    <div
      className={`relative isolate overflow-hidden rounded-[1.5rem] ${aspect}`}
      style={{ background: `radial-gradient(120% 90% at 20% 0%, ${tint.from}, ${tint.to} 70%)` }}
    >
      <div
        className="absolute inset-0 -z-10 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(255 255 255 / .25) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / .25) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent 80%)",
        }}
        aria-hidden="true"
      />
      {project.shotKind === "phone" ? (
        <div className="absolute inset-0 flex items-center justify-center">
          {shots[1] && (
            <PhoneFrame
              shot={shots[1]}
              className="absolute left-[8%] top-[16%] w-[27%] -rotate-[8deg] opacity-95 transition duration-700 group-hover:-translate-x-2 group-hover:-rotate-[10deg]"
            />
          )}
          {shots[2] && (
            <PhoneFrame
              shot={shots[2]}
              className="absolute right-[8%] top-[16%] w-[27%] rotate-[8deg] opacity-95 transition duration-700 group-hover:translate-x-2 group-hover:rotate-[10deg]"
            />
          )}
          <PhoneFrame
            shot={shots[0]}
            priority={priority}
            className="relative z-10 w-[33%] translate-y-[6%] transition duration-700 group-hover:translate-y-[3%]"
          />
        </div>
      ) : (
        <div className="absolute inset-0">
          {shots[1] && (
            <BrowserFrame
              shot={shots[1]}
              className="absolute left-[18%] top-[8%] w-[76%] opacity-70 transition duration-700 group-hover:-translate-y-1"
            />
          )}
          <BrowserFrame
            shot={shots[0]}
            url={project.links[0]?.label}
            priority={priority}
            className="absolute bottom-[-6%] left-[6%] w-[80%] transition duration-700 group-hover:-translate-y-2"
          />
        </div>
      )}
    </div>
  );
}
