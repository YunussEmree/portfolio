import type { Project } from "../types";

export const projects: Project[] = [
  {
    title: "Real-Time Gause Tracking",
    desc: "TÜBİTAK 2209-B: Real-time detection and tracking system to improve surgical safety and reduce manual counting errors during operations.",
    stack: ["Python", "PyTorch", "Django", "React"],
    links: { live: "#", repo: "#" },
  },
  {
    title: "Code Kiddo",
    desc: "TEKNOFEST 2025 semi-finalist: AI-assisted interactive coding education platform for children with personalized learning, gamification, and adaptive content.",
    stack: ["Spring Boot", "MongoDB", "Flutter", "Next.js"],
    links: { live: "#", repo: "#" },
  },
  {
    title: "Mentor AI",
    desc: "TEKNOFEST 2025: AI-driven digital mentorship platform with mentor recommendations, personalized matching, real-time messaging, and video sessions.",
    stack: ["Spring Boot", "MongoDB", "JWT", "OAuth2", "WebSocket"],
    links: { live: "#", repo: "#" },
  },
  {
    title: "SosyalizBiz",
    desc: "Gençlik Hackathonu: Event discovery and social platform for exploring activities, creating events, and community engagement with OAuth login.",
    stack: ["React", "Spring Boot", "PostgreSQL", "Docker", "Google OAuth2"],
    links: { live: "#", repo: "https://github.com/YunussEmree/sosyalizbiz" },
  },
  {
    title: "Fungify",
    desc: "TÜBİTAK 2209-B: Flutter mobile app calling a Spring Boot API to classify images via an AI model with end-to-end backend integration.",
    stack: ["Flutter", "Spring Boot", "Python", "SQLite"],
    links: { live: "#", repo: "https://github.com/YunussEmree/Fungify" },
  },
  {
    title: "Buyer",
    desc: "Maintainable e-commerce backend with domain-oriented structure, secure JWT auth, Spring Security, and consistent API response standards.",
    stack: ["Spring Boot", "Spring Security", "JWT", "PostgreSQL", "Docker"],
    links: { live: "#", repo: "https://github.com/YunussEmree/buyer" },
  },
];
