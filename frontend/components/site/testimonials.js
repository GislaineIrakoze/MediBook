"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/lib/mock-data";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 sm:py-20">
      <div className="container-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald">
            Testimonials
          </p>
          <h2 className="section-title">Patients describe the platform as calm and reliable</h2>
          <p className="section-copy">
            Reviews are presented in a sliding, spacious layout to keep the experience premium
            and readable.
          </p>
        </div>
        <div className="mt-10 overflow-hidden">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            className="flex w-[200%] gap-6"
          >
            {[...testimonials, ...testimonials].map((item, index) => (
              <article
                key={`${item.name}-${index}`}
                className="glass-panel min-h-[220px] w-full flex-1 p-8"
              >
                <p className="text-lg leading-8 text-slate-700">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-8">
                  <p className="font-display text-xl font-semibold text-pine">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.title}</p>
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
