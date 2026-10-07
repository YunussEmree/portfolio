import type { Education, Metric, Profile, Recognition } from "../types";

export const PROFILE: Profile = {
  name: "Yunus Emre Şenyiğit",
  shortName: "Yunus Emre",
  role: "Backend Software Engineer",
  headline: "I build the backend,|then ship the *whole product*.",
  bio: "I design APIs, realtime systems and the infrastructure under them with Spring Boot, NestJS and Node, build the clients in Angular and Flutter, and take them to production with Docker and CI/CD. Part-time at Sarıtay Bilişim, where I cut AI-agent latency by up to 70%; founder of EngerekTech, where I build and run products end to end.",
  location: "Antalya, Türkiye",
  timezone: "UTC+3",
  email: "senyigityunusemre@gmail.com",
  site: "https://yunusemresenyigit.dev",
  github: "https://github.com/YunussEmree",
  linkedin: "https://www.linkedin.com/in/yunus-emre-senyigit",
  available: true,
  availability: "Open to backend and full-stack roles · on-site in Antalya or remote",
  photo: "/profile.webp",
  cv: "/Yunus_Emre_Senyigit_CV.pdf",
};

/** The numbers in the proof strip under the hero. Keep every one of them verifiable. */
export const METRICS: Metric[] = [
  {
    value: "70%",
    label: "lower latency and compute",
    context: "on AI-agent services at Sarıtay, through profiling and targeted refactoring",
  },
  {
    value: "13",
    label: "engineers led",
    context: "as team captain of ENGEREK, an autonomous air-defense system for TEKNOFEST 2026",
  },
  {
    value: "6",
    label: "systems built and run",
    context: "at EngerekTech: two mobile apps, the web platform, two automations and company email",
  },
  {
    value: "7",
    label: "interns mentored",
    context: "through a 1.5-month internship program at Sarıtay",
  },
];

export const EDUCATION: Education = {
  school: "Burdur Mehmet Akif Ersoy University",
  degree: "B.Sc. Software Engineering",
  period: "2023 – present",
  detail: "GPA 3.06 / 4.00",
};

export const LANGUAGES = [
  { name: "Turkish", level: "Native" },
  { name: "English", level: "B1 · working proficiency" },
];

export const RECOGNITION: Recognition[] = [
  {
    title: "TEKNOFEST 2026 — Team Captain, ENGEREK",
    detail: "Led a 13-person software, electronics and mechanics team building an autonomous air-defense system.",
    year: "2026",
  },
  {
    title: "TÜBİTAK 2209-B — Fungify",
    detail: "Research project on AI-assisted image classification.",
    year: "2024",
  },
  {
    title: "Gençlik Hackathonu — SosyalizBiz",
    detail: "Shipped a working event platform MVP within the hackathon.",
    year: "2025",
  },
];

/** The "About" story, first person. */
export const ABOUT: string[] = [
  "I'm a software engineering student at Burdur Mehmet Akif Ersoy University, and I learn fastest by shipping. Over the last two years that has meant freelance client work, leading the backend of a university platform, research and competition projects from TÜBİTAK to TEKNOFEST, and a part-time role on AI-agent services at Sarıtay.",
  "In 2026 I started EngerekTech to build products end to end. Running my own apps taught me what coursework doesn't: where to put the trust boundary, how to keep a small server healthy, and how to release often without breaking anyone's day.",
  "I'm looking for a team where I can own backend systems — APIs, data, realtime features and the infrastructure under them — and keep shipping.",
];
