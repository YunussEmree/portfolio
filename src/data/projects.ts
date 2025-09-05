import type { Project } from "../types";

export const projects: Project[] = [
  {
    title: "Buyer",
    desc: "Spring Boot e-commerce web app with authentication, cart, and ordering.",
    stack: ["spring-boot","spring-security","jwt","postgresql"],
    links: { live: "#", repo: "https://github.com/YunussEmree/buyer" },
  },
  {
    title: "Fungify",
    desc: "Flutter mobile app calling a Spring Boot API to classify images via an AI model.",
    stack: ["flutter","spring-boot","sqlite","python"],
    links: { live: "#", repo: "https://github.com/YunussEmree/Fungify" },
  }
];
