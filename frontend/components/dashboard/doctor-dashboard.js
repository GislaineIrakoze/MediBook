"use client";

import { useEffect, useState } from "react";
import { FaCalendarCheck, FaCircle, FaFileMedical, FaUsers } from "react-icons/fa6";
import { apiRequest, readSession } from "@/lib/api";

export function DoctorDashboard() {
  const [session, setSession] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [availabilityForm, setAvailabilityForm] = useState({
    availableDate: "",
    slots: "09:00-10:00, 10:00-11:00, 14:00-15:00"
  });
  const [status, setStatus] = useState({ error: "", message: "" });

  useEffect(() => {
    const stored = readSession();
    setSession(stored);
  }, []);

  const loadAppointments = async (token) => {
    try {
      const result = await apiRequest("/api/appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(result);
    } catch (error) {
      setStatus({ error: error.message, message: "" });
    }
  };

  useEffect(() => {
    if (session?.token) {
      loadAppointments(session.token);
    }
  }, [session]);

  const createAvailability = async (event) => {
    event.preventDefault();
    if (!session?.token || !session?.user?.id) {
      setStatus({ error: "Please login as a doctor first.", message: "" });
      return;
    }

    try {
      await apiRequest("/api/doctor-availability", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({
          doctorId: session.user.id,
          availableDate: availabilityForm.availableDate,
          availableTimeSlots: availabilityForm.slots
            .split(",")
            .map((slot) => slot.trim())
            .filter(Boolean)
        })
      });
      setStatus({ error: "", message: "Availability published successfully." });
    } catch (error) {
      setStatus({ error: error.message, message: "" });
    }
  };

  const approveAppointment = async (appointmentId) => {
    try {
      await apiRequest(`/api/appointments/${appointmentId}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${session.token}` }
      });
      setStatus({ error: "", message: "Appointment approved and patient notified." });
      loadAppointments(session.token);
    } catch (error) {
      setStatus({ error: error.message, message: "" });
    }
  };

  const pendingCount = appointments.filter((item) => item.status === "pending").length;

  return (
    <div className="space-y-8">
      <div className="grid gap-5 xl:grid-cols-4">
        {[
          { label: "Today's appointments", value: String(appointments.length).padStart(2, "0"), icon: FaCalendarCheck },
          { label: "Pending approvals", value: String(pendingCount).padStart(2, "0"), icon: FaCircle },
          { label: "Patient list", value: String(new Set(appointments.map((item) => item.patientId)).size).padStart(2, "0"), icon: FaUsers },
          { label: "Prescription notes", value: "14", icon: FaFileMedical }
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-[28px] border border-white/60 bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{card.label}</p>
                <div className="rounded-2xl bg-mint p-3 text-emerald">
                  <Icon />
                </div>
              </div>
              <p className="mt-6 font-display text-4xl font-bold text-pine">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[32px] border border-white/60 bg-white p-6 shadow-card sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald">
            Schedule management
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-pine">
            Publish doctor availability
          </h2>
          <form onSubmit={createAvailability} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Available date</label>
              <input
                type="date"
                value={availabilityForm.availableDate}
                onChange={(event) =>
                  setAvailabilityForm((current) => ({
                    ...current,
                    availableDate: event.target.value
                  }))
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Time slots</label>
              <input
                value={availabilityForm.slots}
                onChange={(event) =>
                  setAvailabilityForm((current) => ({
                    ...current,
                    slots: event.target.value
                  }))
                }
                className="input-field"
              />
            </div>
            <button type="submit" className="primary-button w-full">
              Save schedule
            </button>
          </form>

          {status.error ? (
            <div className="mt-5 rounded-[24px] bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {status.error}
            </div>
          ) : null}
          {status.message ? (
            <div className="mt-5 rounded-[24px] bg-mint px-4 py-3 text-sm text-forest">
              {status.message}
            </div>
          ) : null}
        </section>

        <section className="rounded-[32px] border border-white/60 bg-white p-6 shadow-card sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald">
                Patient queue
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-pine">
                Today&apos;s appointments
              </h2>
            </div>
            <button
              type="button"
              onClick={() => session?.token && loadAppointments(session.token)}
              className="secondary-button"
            >
              Refresh
            </button>
          </div>

          <div className="mt-8 space-y-4">
            {appointments.length ? (
              appointments.map((appointment) => (
                <article key={appointment.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-semibold text-pine">
                        {appointment.appointmentDate} at {appointment.appointmentTime}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">Patient ID: {appointment.patientId}</p>
                      <p className="mt-2 text-sm text-slate-500">{appointment.reason}</p>
                    </div>
                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
                        {appointment.status}
                      </span>
                      {appointment.status === "pending" ? (
                        <button
                          type="button"
                          onClick={() => approveAppointment(appointment.id)}
                          className="primary-button px-5 py-2.5"
                        >
                          Approve
                        </button>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                No appointments available yet. Once patients book, they will appear here.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
