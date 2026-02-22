"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Menu, X } from "lucide-react";
import { PROFILE } from "@/data/profile";
import { scrollToId } from "@/lib/scroll";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.4, rootMargin: "-80px 0px -40% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id: string) => {
    scrollToId(id);
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/[0.06] shadow-sm dark:shadow-2xl shadow-black/5 dark:shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#top"
          className="flex items-center gap-2.5 select-none group"
          onClick={(e) => {
            e.preventDefault();
            scrollToId("top");
          }}
        >
          <div className="size-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 grid place-items-center text-white font-black text-sm shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/50 transition-shadow duration-300">
            YE
          </div>
          <span className="text-zinc-900 dark:text-white font-bold hidden sm:block tracking-tight">
            {PROFILE.name}
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
                active === id
                  ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/[0.07] border border-zinc-200 dark:border-white/[0.08]"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Social links + theme toggle + mobile toggle */}
        <div className="flex items-center gap-1">
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.07] transition-all duration-200"
          >
            <Github className="size-4" />
          </a>
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.07] transition-all duration-200"
          >
            <Linkedin className="size-4" />
          </a>
          <ThemeToggle />
          <button
            className="md:hidden p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.07] transition-all duration-200 ml-1 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-zinc-200 dark:border-white/[0.06] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navItems.map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-200 cursor-pointer ${
                    active === id
                      ? "bg-zinc-100 dark:bg-white/[0.07] text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/[0.08]"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
