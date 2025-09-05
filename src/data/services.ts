import { Code, Server, PenTool } from "lucide-react";
import type { Service } from "../types";

export const services: Service[] = [
  { title: "Web Developer",   icon: Code,       desc: "Fast web UIs with React, Tailwind and modern best practices." },
  { title: "Backend Developer", icon: Server,   desc: "Spring Boot, REST, JWT, database design, and cloud deployment." },
  { title: "Content Creator", icon: PenTool,    desc: "Technical writing, demo videos, and documentation." },
];
