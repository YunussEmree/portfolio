import type { SkillCategory } from "../types";

// Edit these categories to update your skills section.
// accent options: "blue" | "violet" | "emerald" | "orange" | "cyan" | "rose"
export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    accent: "cyan",
    skills: ["Java", "TypeScript", "JavaScript", "Python", "SQL"],
  },
  {
    name: "Backend",
    accent: "blue",
    skills: ["Spring Boot", "NestJS", "REST API", "GraphQL"],
  },
  {
    name: "Frontend",
    accent: "violet",
    skills: ["Angular", "React"],
  },
  {
    name: "Database",
    accent: "emerald",
    skills: ["PostgreSQL", "MongoDB"],
  },
  {
    name: "DevOps & CI/CD",
    accent: "orange",
    skills: ["Docker", "Kubernetes", "GitHub", "GitLab", "CI/CD"],
  },
  {
    name: "AI / LLM",
    accent: "rose",
    skills: ["LLM Integration", "RAG Workflows", "MCP"],
  },
];

// Flat list (auto-generated from categories, no need to edit)
export const skills: string[] = skillCategories.flatMap((c) => c.skills);
