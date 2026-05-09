"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="container-shell">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Book Hospital Appointments Easily
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50/90">
              MediBook gives patients, doctors, and hospital teams a refined space to
              schedule visits, manage availability, and keep confirmations flowing without
              friction.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/signup" className="secondary-button bg-white text-forest">
                Book Appointment
              </Link>
              <Link
                href="#doctors"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Find Doctors
                <FaArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-forest via-emerald to-[#3db07d]" />
    </section>
  );
}
