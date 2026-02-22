"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Send, MapPin, CheckCircle2 } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { PROFILE } from "@/data/profile";
import { fadeUp, stagger, slideInLeft, slideInRight } from "@/lib/animations";

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all duration-200";

export default function Contact() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = nameRef.current?.value?.trim() ?? "";
    const email = emailRef.current?.value?.trim() ?? "";
    const message = messageRef.current?.value?.trim() ?? "";
    const subject = encodeURIComponent(`Portfolio Contact from ${name || "Visitor"}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="relative bg-white dark:bg-zinc-950 py-28">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700/60 to-transparent" />

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionTitle kicker="Get in Touch" title="Contact" />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-2 gap-10 items-start"
        >
          {/* Form */}
          <motion.div
            variants={slideInLeft}
            className="p-6 md:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40"
          >
            <h3 className="text-zinc-900 dark:text-white font-bold text-xl mb-6">Send a message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Your Name
                </label>
                <input
                  ref={nameRef}
                  className={inputCls}
                  placeholder="What's your name?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Email Address
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  className={inputCls}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Message
                </label>
                <textarea
                  ref={messageRef}
                  rows={5}
                  className={inputCls}
                  placeholder="Tell me about your project or just say hi!"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 cursor-pointer"
              >
                {sent ? (
                  <>
                    <CheckCircle2 className="size-4" />
                    Opening mail client…
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div variants={slideInRight} className="space-y-6">
            <motion.p variants={fadeUp} className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Have a project in mind, want to collaborate, or just want to chat about tech? I&apos;m
              always happy to connect. Reach out through any of these channels:
            </motion.p>

            <motion.div variants={stagger} className="space-y-3">
              {[
                {
                  href: `mailto:${PROFILE.email}`,
                  icon: Mail,
                  label: "Email",
                  value: PROFILE.email,
                  color: "text-blue-600 dark:text-blue-400",
                  bg: "bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20",
                },
                {
                  href: PROFILE.linkedin,
                  icon: Linkedin,
                  label: "LinkedIn",
                  value: "yunus-emre-senyigit",
                  color: "text-blue-600 dark:text-blue-400",
                  bg: "bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20",
                  external: true,
                },
                {
                  href: PROFILE.github,
                  icon: Github,
                  label: "GitHub",
                  value: "YunussEmree",
                  color: "text-zinc-700 dark:text-zinc-300",
                  bg: "bg-zinc-200/60 dark:bg-zinc-700/40 border-zinc-300 dark:border-zinc-600/50 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700/70",
                  external: true,
                },
                {
                  href: undefined,
                  icon: MapPin,
                  label: "Location",
                  value: PROFILE.location,
                  color: "text-emerald-600 dark:text-emerald-400",
                  bg: "bg-emerald-500/10 border-emerald-500/20",
                },
              ].map(({ href, icon: Icon, label, value, color, bg, external }) => {
                const Wrapper = href ? motion.a : motion.div;
                const props = href
                  ? {
                      href,
                      ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
                    }
                  : {};
                return (
                  <Wrapper
                    key={label}
                    {...props}
                    variants={fadeUp}
                    className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900/70 transition-all duration-200 group"
                  >
                    <div
                      className={`size-10 rounded-lg border grid place-items-center flex-shrink-0 transition-all duration-200 ${bg}`}
                    >
                      <Icon className={`size-5 ${color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
                      <p className="text-sm text-zinc-800 dark:text-zinc-200 font-medium truncate">{value}</p>
                    </div>
                  </Wrapper>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
