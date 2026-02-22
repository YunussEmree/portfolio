"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

type Props = { kicker?: string; title: string };

export default function SectionTitle({ kicker, title }: Props) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="mb-12"
    >
      {kicker && (
        <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-widest mb-3">
          {kicker}
        </p>
      )}
      <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white">
        {title}
        <span className="text-blue-500">.</span>
      </h2>
    </motion.div>
  );
}
