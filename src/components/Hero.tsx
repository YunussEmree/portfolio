import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { PROFILE } from "../data/profile";

const Hero: React.FC = () => (
  <section id="top" className="relative overflow-hidden bg-slate-900 text-white">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_80%_-20%,rgba(59,130,246,0.35),transparent)]" />

    <div className="mx-auto max-w-6xl px-4 py-24 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <p className="text-blue-300 font-semibold mb-3">Hi, I'm</p>

        <h1 className="text-4xl md:text-6xl font-black leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-white">
            {PROFILE.name}
          </span>
        </h1>

        <p className="mt-4 text-lg text-blue-100">{PROFILE.role}</p>

        <div className="mt-2 w-full flex">
          <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-sm text-blue-100/90 shadow-sm backdrop-blur mt-2">
            <MapPin className="h-4 w-4" />
            {PROFILE.location}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-72 md:h-96"
      >
        <div className="absolute inset-0 grid place-items-center">
          <div className="size-72 md:size-[26rem] rounded-full bg-gradient-to-b from-blue-400/40 to-blue-800/60 blur-2xl opacity-40" />
        </div>

        <div className="relative h-full w-full grid place-items-center">
          <div className="relative size-44 md:size-60 rounded-full overflow-hidden ring-4 ring-white/70 ring-offset-2 ring-offset-slate-900 shadow-2xl">
            <img
              src="/profile.jpg"
              alt={PROFILE.name}
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_60px_15px_rgba(59,130,246,0.35)]" />
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
