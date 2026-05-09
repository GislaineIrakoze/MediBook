"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Doctors", value: "120+" },
  { label: "Patients", value: "18k+" },
  { label: "Departments", value: "24" },
  { label: "Appointments completed", value: "32k+" }
];

export function StatsSection() {
  return (
    <section className="py-16">
      <div className="container-shell">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="glass-panel p-6"
            >
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-4 font-display text-4xl font-bold text-pine">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
