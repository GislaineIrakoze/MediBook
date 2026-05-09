"use client";

import { motion } from "framer-motion";
import { departments } from "@/lib/mock-data";

export function DepartmentsSection() {
  return (
    <section id="departments" className="py-16 sm:py-20">
      <div className="container-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald">
            Departments
          </p>
          <h2 className="section-title">Trusted specialties for every stage of care</h2>
          <p className="section-copy">
            Explore elegantly organized departments, each designed to help patients move
            from searching to booking with clarity and confidence.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {departments.map((department, index) => {
            const Icon = department.icon;
            return (
              <motion.article
                key={department.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="glass-panel group p-6 transition"
              >
                <div className="inline-flex rounded-2xl bg-mint p-4 text-2xl text-emerald transition group-hover:bg-gradient-to-br group-hover:from-emerald group-hover:to-forest group-hover:text-white">
                  <Icon />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-pine">
                  {department.name}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">{department.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
