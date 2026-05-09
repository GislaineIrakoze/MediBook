"use client";

import { motion } from "framer-motion";
import { processSteps } from "@/lib/mock-data";

export function ProcessSection() {
  return (
    <section id="process" className="py-16 sm:py-20">
      <div className="container-shell">
        <div className="glass-panel overflow-hidden p-8 sm:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald">
              Appointment Process
            </p>
            <h2 className="section-title">A booking journey that feels guided, not busy</h2>
            <p className="section-copy">
              Every step is designed to mirror a real healthcare platform: calm, structured,
              and trustworthy from doctor selection to hospital visit.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <motion.article
                key={step.step}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[26px] border border-slate-100 bg-white p-6 shadow-card"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald">
                  {step.step}
                </p>
                <h3 className="mt-4 font-display text-2xl font-semibold text-pine">
                  {step.title}
                </h3>
                <p className="mt-4 leading-7 text-slate-600">{step.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
