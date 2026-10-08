export type Link = { label: string; href: string };

export type Profile = {
  name: string;
  shortName: string;
  role: string;
  /** The hero title: "|" starts a new line, the part between asterisks is set in the accent serif. */
  headline: string;
  /** Hero paragraph and meta description. */
  bio: string;
  location: string;
  timezone: string;
  email: string;
  phone?: string;
  site: string;
  github: string;
  linkedin: string;
  /** Shows the "open to roles" badge and wording. */
  available: boolean;
  availability: string;
  photo: string;
  cv: string;
};

export type Metric = { value: string; label: string; context: string };

export type Role = {
  title: string;
  period: string;
  points: string[];
};

export type Experience = {
  company: string;
  logo?: string;
  url?: string;
  location: string;
  /** Short line about the company for readers who don't know it. */
  about: string;
  roles: Role[];
};

export type Shot = { src: string; alt: string; width: number; height: number };

export type CaseSection = { title: string; paragraphs?: string[]; bullets?: string[] };

export type FlowStep = { label: string; detail: string };

export type Project = {
  slug: string;
  title: string;
  /** Short promise, shown under the title. */
  tagline: string;
  summary: string;
  year: string;
  role: string;
  status: string;
  stack: string[];
  links: Link[];
  icon?: string;
  /** A playable demo opened from the project card (components/demos). */
  demo?: "kpss" | "kelime" | "engerek";
  /** Background of the screenshot panel, taken from the product's own colors. */
  tint: { from: string; to: string };
  /** "phone" shows portrait screenshots, "browser" a desktop screenshot. */
  shotKind: "phone" | "browser";
  shots: Shot[];
  highlights: string[];
  caseStudy: {
    context: string;
    flowTitle: string;
    flow: FlowStep[];
    sections: CaseSection[];
    lessons: string[];
  };
};

export type SideProject = {
  title: string;
  context: string;
  year: string;
  desc: string;
  stack: string[];
  href?: string;
};

export type SkillGroup = { name: string; skills: string[] };

export type Recognition = { title: string; detail: string; year: string };

export type Education = {
  school: string;
  degree: string;
  period: string;
  detail: string;
};
