import React, { useRef } from "react";
import { ArrowRight, Briefcase } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { cardStyle } from "../ui";
import { PROFILE } from "../data/profile";


const Contact: React.FC = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleMailto = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = nameRef.current?.value?.trim() || "";
    const email = emailRef.current?.value?.trim() || "";
    const message = messageRef.current?.value?.trim() || "";
    const subject = encodeURIComponent(`Portfolio Contact from ${name || "Visitor"}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="bg-white" id="contact">
      <div className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-8 items-stretch">
        <div className={`${cardStyle} rounded-2xl p-6 md:p-8`}>
          <SectionTitle kicker="Get in touch" title="Contact" />
          <form onSubmit={handleMailto} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Your Name</label>
              <input ref={nameRef} className="mt-1 w-full rounded-lg border border-blue-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400" placeholder="What's your good name?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Your email</label>
              <input ref={emailRef} type="email" className="mt-1 w-full rounded-lg border border-blue-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400" placeholder="What's your email address?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Your Message</label>
              <textarea ref={messageRef} rows={5} className="mt-1 w-full rounded-lg border border-blue-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400" placeholder="What do you want to say?" />
            </div>
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 cursor-pointer">
              Send <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-200 via-blue-400 to-blue-600 grid place-items-center">
          <div className="relative size-64 md:size-80 rounded-full border-8 border-white/60 shadow-2xl grid place-items-center">
            <Briefcase className="h-16 w-16 md:h-24 md:w-24 text-white/95 drop-shadow-[0_6px_28px_rgba(0,0,0,0.25)]" />
            <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/40" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
