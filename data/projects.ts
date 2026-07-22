import type { Project } from "../types";

export const projects: Project[] = [
  {
    title: "ENGEREK",
    desc: "TEKNOFEST 2026: Autonomous air defense system with real-time target detection and tracking (YOLO, OpenCV) on NVIDIA Jetson, integrated with microcontroller-driven actuation. Led a 13-member team as Team Captain.",
    stack: ["Python", "YOLO", "OpenCV", "NVIDIA Jetson"],
    links: { live: "#", repo: "#" },
  },
  {
    title: "Real-Time Gauze Tracking",
    desc: "TÜBİTAK 2209-B: Real-time detection and tracking system to improve surgical safety and reduce manual counting errors during operations.",
    stack: ["Python", "PyTorch", "Django", "React"],
    links: { live: "#", repo: "#" },
  },
  {
    title: "Code Kiddo",
    desc: "TEKNOFEST semi-finalist: AI-assisted coding education platform for children (concept & prototype).",
    stack: ["Spring Boot", "MongoDB", "Flutter", "Next.js"],
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
