"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaArrowRightFromBracket,
  FaBell,
  FaCalendarDays,
  FaChartLine,
  FaClock,
  FaHospitalUser,
  FaUserDoctor,
  FaUsers
} from "react-icons/fa6";
import { clearSession, readSession } from "@/lib/api";

const iconMap = {
  patient: FaHospitalUser,
  doctor: FaUserDoctor,
  admin: FaChartLine
};

const sidebarLinks = {
  patient: [
    { label: "Overview", icon: FaCalendarDays },
    { label: "Appointments", icon: FaClock },
    { label: "Notifications", icon: FaBell },
    { label: "Profile", icon: FaUsers }
  ],
  doctor: [
    { label: "Today", icon: FaCalendarDays },
    { label: "Patients", icon: FaUsers },
    { label: "Schedule", icon: FaClock },
    { label: "Updates", icon: FaBell }
  ],
  admin: [
    { label: "Analytics", icon: FaChartLine },
    { label: "Doctors", icon: FaUserDoctor },
    { label: "Patients", icon: FaUsers },
    { label: "Appointments", icon: FaCalendarDays }
  ]
};

export function DashboardShell({ role, title, subtitle, children }) {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const stored = readSession();
    setSession(stored);
  }, []);

  const links = useMemo(() => sidebarLinks[role] || [], [role]);
  const Icon = iconMap[role] || FaHospitalUser;

  const logout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sage via-white to-mint p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="glass-panel flex flex-col justify-between p-6">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald to-forest text-lg font-bold text-white">
                M
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-pine">MediBook</p>
                <p className="text-xs text-slate-500">{role} workspace</p>
              </div>
            </Link>

            <div className="mt-8 rounded-[28px] bg-gradient-to-br from-forest to-emerald p-5 text-white shadow-glow">
              <div className="inline-flex rounded-2xl bg-white/15 p-3">
                <Icon />
              </div>
              <p className="mt-4 text-sm text-emerald-50/80">Signed in as</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                {session?.user?.fullname || `MediBook ${role}`}
              </h2>
              <p className="mt-2 text-sm text-emerald-50/80">
                {session?.user?.email || "Connect your hospital workflow."}
              </p>
            </div>

            <nav className="mt-8 space-y-2">
              {links.map((link, index) => {
                const LinkIcon = link.icon;
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-mint hover:text-forest"
                  >
                    <LinkIcon className="text-emerald" />
                    {link.label}
                  </motion.div>
                );
              })}
            </nav>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald/30 hover:bg-mint"
          >
            <FaArrowRightFromBracket />
            Logout
          </button>
        </aside>

        <section className="glass-panel overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald">
                  {role} dashboard
                </p>
                <h1 className="mt-2 font-display text-3xl font-bold text-pine">{title}</h1>
                <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
              </div>
              <div className="inline-flex items-center gap-3 rounded-full border border-emerald/10 bg-mint px-4 py-2 text-sm text-forest">
                <FaBell />
                Live system updates enabled
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
