"use client";

import { FaChartPie, FaHospitalUser, FaUserDoctor, FaUsersGear } from "react-icons/fa6";

const analytics = [
  { label: "Doctor utilization", value: "84%" },
  { label: "Patient growth", value: "+18%" },
  { label: "Appointment completion", value: "91%" },
  { label: "Department capacity", value: "76%" }
];

const managementRows = [
  { title: "Manage doctors", status: "14 active requests", icon: FaUserDoctor },
  { title: "Manage patients", status: "42 new profiles", icon: FaHospitalUser },
  { title: "Manage appointments", status: "128 scheduled", icon: FaChartPie },
  { title: "Department management", status: "6 core specialties", icon: FaUsersGear }
];

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid gap-5 xl:grid-cols-4">
        {analytics.map((item) => (
          <div key={item.label} className="rounded-[28px] border border-white/60 bg-white p-6 shadow-card">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-6 font-display text-4xl font-bold text-pine">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[32px] border border-white/60 bg-white p-6 shadow-card sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald">
            Charts and analytics
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-pine">
            Platform performance overview
          </h2>

          <div className="mt-8 space-y-6">
            {[
              { label: "Appointments per week", value: 88 },
              { label: "Doctor response speed", value: 72 },
              { label: "Notification delivery", value: 94 },
              { label: "Patient return rate", value: 67 }
            ].map((bar) => (
              <div key={bar.label}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>{bar.label}</span>
                  <span>{bar.value}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-emerald to-forest"
                    style={{ width: `${bar.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/60 bg-white p-6 shadow-card sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald">
            Management
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-pine">
            Administrative controls
          </h2>

          <div className="mt-8 space-y-4">
            {managementRows.map((row) => {
              const Icon = row.icon;
              return (
                <article key={row.title} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-mint p-3 text-emerald">
                      <Icon />
                    </div>
                    <div>
                      <p className="font-semibold text-pine">{row.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{row.status}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
