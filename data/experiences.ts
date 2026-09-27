import type { Experience } from "../types";

export const experiences: Experience[] = [
  {
    company: "EngerekTech",
    logo: "/logos/engerektech.svg",
    url: "https://engerektech.com",
    location: "Antalya",
    about: "My software studio: web, mobile and enterprise software.",
    roles: [
      {
        title: "Founder & Software Engineer",
        period: "2026 – Present",
        points: [
          "Built and run KPSS Düello, a realtime quiz-duel app with server-verified scoring, matchmaking, leagues and in-app purchases (Flutter, Firebase, Cloud Functions).",
          "Built the company platform: Angular SSR site and blog, Spring Boot API and an internal portal, shipped as containers through GitHub Actions to a self-managed Linux server.",
          "Automated content with the Claude API: sourced blog drafts with an SEO check, automatic English translations and release notes written for testers.",
          "Set up and operate company email (Mailu, Postfix, Rspamd) with SPF, DKIM and DMARC.",
        ],
      },
    ],
  },
  {
    company: "Sarıtay Bilişim A.Ş.",
    logo: "/logos/saritay.png",
    location: "Antalya",
    about: "Enterprise software and AI assistant services.",
    roles: [
      {
        title: "Part-Time Software Developer",
        period: "Oct 2025 – Present",
        points: [
          "Cut latency and compute usage of AI-agent services by up to 70% through profiling and targeted refactoring.",
          "Optimized system-to-system API workflows to reduce platform load and improve real-time responsiveness.",
          "Mentored a 7-person internship team over a 1.5-month program.",
          "Improved error handling, architecture consistency and execution stability across services.",
        ],
      },
      {
        title: "Software Developer Intern",
        period: "Jul 2025 – Aug 2025",
        points: [
          "Worked on backend services in production, improving real-time streaming and service-to-service integration.",
          "Supported containerized deployment and CI/CD with Docker, Kubernetes and GitLab CI.",
          "Implemented authentication with Spring Security and Azure OAuth.",
          "Contributed retrieval, memory and tool-execution features to the AI assistant.",
        ],
      },
    ],
  },
  {
    company: "Burdur Mehmet Akif Ersoy University",
    logo: "/logos/maku.png",
    location: "Burdur",
    about: "Internship automation platform for the university.",
    roles: [
      {
        title: "Backend Developer",
        period: "Mar 2025 – Jun 2025",
        points: [
          "Led backend development of the internship automation platform, coordinating 12 developers.",
          "Designed and implemented the REST APIs behind the application's workflows.",
          "Worked with the frontend team and stakeholders to ship stable releases on time.",
        ],
      },
    ],
  },
  {
    company: "Kritm Bilişim",
    logo: "/logos/kritm.png",
    location: "Antalya",
    about: "Client projects as a freelancer.",
    roles: [
      {
        title: "Freelance Software Developer",
        period: "Jan 2025 – Apr 2025",
        points: [
          "Delivered client projects end to end, from requirements to maintainable software.",
          "Built component-driven interfaces in Angular and backend services with Django REST APIs.",
          "Automated Excel-to-SQL data cleaning and migration with Python for reporting.",
        ],
      },
    ],
  },
];
