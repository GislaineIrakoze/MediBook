"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";

const links = [
  { href: "#departments", label: "Departments" },
  { href: "#doctors", label: "Doctors" },
  { href: "#process", label: "Process" },
  { href: "#testimonials", label: "Reviews" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-white/70 backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald to-forest text-lg font-bold text-white">
            M
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-pine">MediBook</p>
            <p className="text-xs text-slate-500">Hospital Appointment System</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-emerald"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="secondary-button">
            Login
          </Link>
          <Link href="/signup" className="primary-button">
            Book Appointment
          </Link>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <FaXmark /> : <FaBarsStaggered />}
        </button>
      </div>

      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-slate-100 bg-white md:hidden"
        >
          <div className="container-shell flex flex-col gap-4 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="secondary-button w-full">
                Login
              </Link>
              <Link href="/signup" className="primary-button w-full">
                Start
              </Link>
            </div>
          </div>
        </motion.div>
      ) : null}
    </header>
  );
}
