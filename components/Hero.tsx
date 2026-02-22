"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, ArrowDown, Mail, Github, Linkedin } from "lucide-react";
import { PROFILE } from "@/data/profile";
import { scrollToId } from "@/lib/scroll";
import { fadeUp, stagger } from "@/lib/animations";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-zinc-950"
    >
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-blue-600/6 dark:bg-blue-600/8 blur-[140px]" />
        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full bg-violet-600/6 dark:bg-violet-600/8 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-blue-500/3 dark:bg-blue-500/4 blur-[120px]" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none dark:block hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-24 grid md:grid-cols-2 gap-16 items-center w-full">
        {/* Left: Text */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col order-2 md:order-1"
        >
          {/* Available badge */}
          {PROFILE.available && (
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-7 uppercase tracking-widest"
            >
              <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              Open to opportunities
            </motion.div>
          )}

          {/* Greeting */}
          <motion.p variants={fadeUp} className="text-zinc-500 dark:text-zinc-400 font-medium text-lg mb-1">
            Hi there, I&apos;m
          </motion.p>

          {/* Name */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-[4.5rem] font-black leading-[1.04] tracking-tight mb-5"
          >
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-zinc-800 dark:from-blue-400 dark:via-cyan-300 dark:to-white bg-clip-text text-transparent">
              {PROFILE.name}
            </span>
          </motion.h1>

          {/* Role */}
          <motion.p variants={fadeUp} className="text-xl md:text-2xl text-zinc-700 dark:text-zinc-300 font-semibold mb-3">
            {PROFILE.role}
          </motion.p>

          {/* Location */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-2 text-zinc-500 text-sm mb-9"
          >
            <MapPin className="size-4 text-blue-500 flex-shrink-0" />
            {PROFILE.location}
          </motion.div>

          {/* CTA buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => scrollToId("contact")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/35 hover:-translate-y-0.5 cursor-pointer"
            >
              <Mail className="size-4" />
              Get in Touch
            </button>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 bg-zinc-50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-semibold transition-all duration-200 hover:-translate-y-0.5"
            >
              <Github className="size-4" />
              GitHub
            </a>
          </motion.div>

          {/* Social icons */}
          <motion.div variants={fadeUp} className="flex items-center gap-2">
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 bg-zinc-50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-900/70 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all duration-200 hover:-translate-y-0.5"
            >
              <Linkedin className="size-4" />
            </a>
            <a
              href={`mailto:${PROFILE.email}`}
              aria-label="Email"
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 bg-zinc-50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-900/70 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all duration-200 hover:-translate-y-0.5"
            >
              <Mail className="size-4" />
            </a>
          </motion.div>
        </motion.div>

        {/* Right: Profile photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative flex items-center justify-center order-1 md:order-2"
        >
          {/* Dashed ring */}
          <div className="absolute size-72 md:size-[22rem] rounded-full border border-blue-500/15 border-dashed" />
          {/* Static ring */}
          <div className="absolute size-64 md:size-80 rounded-full border border-blue-500/25" />
          {/* Glow blob */}
          <div className="absolute size-56 md:size-72 rounded-full bg-blue-600/8 dark:bg-blue-600/10 blur-3xl" />

          {/* Photo */}
          <div className="relative size-52 md:size-64 rounded-full overflow-hidden ring-2 ring-blue-500/40 ring-offset-4 ring-offset-white dark:ring-offset-zinc-950 shadow-2xl shadow-blue-500/20">
            <Image
              src="/profile.jpg"
              alt={`${PROFILE.name} – ${PROFILE.role}`}
              fill
              sizes="(max-width: 768px) 208px, 256px"
              className="object-cover"
              priority
            />
          </div>

          {/* Floating badge: Role */}
          <motion.div
            initial={{ opacity: 0, x: 24, y: -8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 md:-right-4 top-12 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/90 backdrop-blur-md shadow-xl text-sm font-semibold text-zinc-700 dark:text-zinc-200 whitespace-nowrap"
          >
            <span className="text-blue-600 dark:text-blue-400">Spring Boot</span> Expert
          </motion.div>

          {/* Floating badge: Experience */}
          <motion.div
            initial={{ opacity: 0, x: -24, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 md:-left-4 bottom-12 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/90 backdrop-blur-md shadow-xl text-sm font-semibold text-zinc-700 dark:text-zinc-200 whitespace-nowrap"
          >
            💼 <span className="text-violet-600 dark:text-violet-400">1+</span> Year Experience
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollToId("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-300 cursor-pointer group"
        aria-label="Scroll to about"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-medium">Scroll</span>
        <div className="p-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 group-hover:border-zinc-400 dark:group-hover:border-zinc-500 transition-colors duration-300">
          <ArrowDown className="size-3.5" />
        </div>
      </button>
    </section>
  );
}
