import type { SkillCategory } from "../types";

// Edit these categories to update your skills section.
// accent options: "blue" | "violet" | "emerald" | "orange" | "cyan" | "rose"
export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    accent: "cyan",
    skills: ["Java", "TypeScript", "JavaScript", "Python", "SQL", "HTML/CSS"],
  },
  {
    name: "Backend",
    accent: "blue",
    skills: ["Spring Boot", "Spring Security", "Spring Data JPA", "NestJS", "Django", "REST API", "JWT", "OAuth2"],
  },
  {
    name: "Frontend",
    accent: "violet",
    skills: ["Angular", "React", "Next.js"],
  },
  {
    name: "Database",
    accent: "emerald",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Prisma"],
  },
  {
    name: "DevOps & Tools",
    accent: "orange",
    skills: ["Docker", "Kubernetes", "Git", "GitLab CI", "Azure", "Swagger", "Postman", "CI/CD"],
  },
  {
    name: "AI / LLM",
    accent: "rose",
    skills: ["LangChain", "RAG Workflows", "MCP", "Tool Agents"],
  },
];

// Flat list (auto-generated from categories, no need to edit)
export const skills: string[] = skillCategories.flatMap((c) => c.skills);
