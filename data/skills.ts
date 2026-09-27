import type { SkillGroup } from "../types";

/** Only what I have used in shipped or production work. */
export const skillGroups: SkillGroup[] = [
  { name: "Languages", skills: ["Java", "TypeScript", "Dart", "Python", "SQL"] },
  {
    name: "Backend",
    skills: ["Spring Boot", "Spring Security", "NestJS", "Node.js", "REST", "GraphQL", "Django"],
  },
  { name: "Web & mobile", skills: ["Angular", "React", "Next.js", "Flutter"] },
  {
    name: "Data",
    skills: ["PostgreSQL", "MongoDB", "Firestore", "Firebase Realtime DB", "Flyway"],
  },
  {
    name: "Infrastructure",
    skills: ["Docker", "Kubernetes", "GitHub Actions", "GitLab CI", "nginx", "Linux", "Sentry"],
  },
  { name: "AI", skills: ["LLM integration", "Claude API", "RAG", "MCP", "Agent tooling"] },
];
