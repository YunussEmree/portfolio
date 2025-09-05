import type { LucideIcon } from "lucide-react";

export type Profile = {
  name: string;
  role: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
};

export type Service = { title: string; icon: LucideIcon; desc: string };

export type Experience = {
  role: string;
  company: string;
  logo?: string;
  period: string;
  points: string[];
};

export type Project = {
  title: string;
  desc: string;
  stack: string[];
  links: { live: string; repo: string };
};

export type Testimonial = { quote: string; name: string; title: string };
export type FormState = { name: string; email: string; message: string };
export type StatusState = { state: "idle" | "loading" | "success" | "error"; msg: string };
