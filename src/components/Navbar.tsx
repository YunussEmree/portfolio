import React from "react";
import { Github, Linkedin } from "lucide-react";
import { PROFILE } from "../data/profile";
import { scrollToId } from "../lib/scroll";

const Navbar: React.FC = () => (
  <header className="sticky top-0 z-40 border-b border-white/10 bg-[radial-gradient(1200px_600px_at_10%_-20%,rgba(59,130,246,0.25),transparent)] bg-slate-900/75 backdrop-blur">
    <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
      <a href="#top" className="flex items-center gap-2 select-none">
        <div className="h-7 w-7 rounded-md bg-blue-500 grid place-items-center text-white font-bold">YE</div>
        <span className="text-white/90 font-semibold">{PROFILE.name}</span>
      </a>
      <nav className="hidden md:flex items-center gap-8 text-sm">
        {["about","skills","experience","projects","contact"].map((id) => (
          <button
            key={id}
            onClick={() => scrollToId(id)}
            className="text-white/80 hover:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-md px-1.5 py-1"
          >
            {id[0].toUpperCase() + id.slice(1)}
          </button>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <a href={PROFILE.github} target="_blank" className="p-2 rounded-md bg-white/10 text-white hover:bg-white/20">
          <Github className="h-5 w-5" />
        </a>
        <a href={PROFILE.linkedin} target="_blank" className="p-2 rounded-md bg-white/10 text-white hover:bg-white/20">
          <Linkedin className="h-5 w-5" />
        </a>
      </div>
    </div>
  </header>
);

export default Navbar;
