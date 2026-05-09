"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaCircle, FaStar } from "react-icons/fa6";
import { topDoctors } from "@/lib/mock-data";

export function TopDoctorsSection() {
  return (
    <section id="doctors" className="py-16 sm:py-20">
      <div className="container-shell">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald">
              Top Doctors
            </p>
            <h2 className="section-title">Meet specialists patients trust most</h2>
            <p className="section-copy">
              Expert-led profiles with transparent ratings, live availability cues, and
              a smooth path to booking.
            </p>
          </div>
          <Link href="/signup" className="primary-button">
            Start Booking
          </Link>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {topDoctors.map((doctor, index) => (
            <motion.article
              key={doctor.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="glass-panel overflow-hidden"
            >
              <div className={`h-56 bg-gradient-to-br ${doctor.imageTone} p-6`}>
                <div className="flex h-full items-end justify-between">
                  <div className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
                    {doctor.specialty}
                  </div>
                  <div className="grid h-24 w-24 place-items-center rounded-[28px] border border-white/15 bg-white/15 text-3xl font-semibold text-white">
                    {doctor.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-pine">
                      {doctor.name}
                    </h3>
                    <p className="mt-2 text-slate-600">{doctor.specialty}</p>
                  </div>
                  <div className="rounded-full bg-mint px-3 py-2 text-sm font-semibold text-forest">
                    {doctor.rating}
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <FaStar className="text-amber-400" />
                    Patient rating
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <FaCircle className="text-emerald" size={10} />
                    {doctor.availability}
                  </span>
                </div>
                <Link href="/patient-dashboard" className="primary-button mt-6 w-full">
                  Book doctor
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
