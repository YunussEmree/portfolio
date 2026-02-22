import { Code, Server, Brain } from "lucide-react";
import type { Service } from "../types";

export const services: Service[] = [
  {
    title: "Backend Development",
    icon: Server,
    desc: "Scalable REST APIs with Spring Boot, NestJS, and Django — covering auth, database design, Docker, and CI/CD pipelines.",
  },
  {
    title: "Frontend Development",
    icon: Code,
    desc: "Responsive, component-driven interfaces with Angular, React, and Next.js, built for performance and long-term maintainability.",
  },
  {
    title: "AI Integration",
    icon: Brain,
    desc: "LangChain-powered RAG pipelines, MCP-based tool agents, and LLM-assisted feature development for production systems.",
  },
];
