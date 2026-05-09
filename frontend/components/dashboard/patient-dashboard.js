"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaBell, FaCalendarCheck, FaClock, FaMagnifyingGlass, FaUserDoctor } from "react-icons/fa6";
import { apiRequest, readSession } from "@/lib/api";

const departmentOrder = [
  "General Medicine",
  "Cardiology",
  "Dentistry",
  "Pediatrics",
  "Neurology",
  "Orthopedics",
  "Primary Care"
];

export function PatientDashboard() {
  const [session, setSession] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState({ loading: false, message: "", error: "" });

  useEffect(() => {
    const stored = readSession();
    setSession(stored);
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const result = await apiRequest("/api/doctors");
        setDoctors(result);
      } catch (error) {
        setStatus((current) => ({ ...current, error: error.message }));
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (!session?.token) return;

    const loadPatientData = async () => {
      try {
        const [appointmentData, notificationData] = await Promise.all([
          apiRequest("/api/appointments", {
            headers: { Authorization: `Bearer ${session.token}` }
          }),
          apiRequest("/api/notifications", {
            headers: { Authorization: `Bearer ${session.token}` }
          })
        ]);
        setAppointments(appointmentData);
        setNotifications(notificationData);
      } catch (error) {
        setStatus((current) => ({ ...current, error: error.message }));
      }
    };

    loadPatientData();
  }, [session]);

  useEffect(() => {
    if (!session?.token || !selectedDoctor) return;

    const loadAvailability = async () => {
      try {
        const result = await apiRequest(
          `/api/doctor-availability?doctorId=${selectedDoctor.id}`,
          {
            headers: { Authorization: `Bearer ${session.token}` }
          }
        );
        setAvailabilities(result);
      } catch (error) {
        setStatus((current) => ({ ...current, error: error.message }));
      }
    };

    loadAvailability();
  }, [selectedDoctor, session]);

  const departments = useMemo(() => {
    return ["All", ...departmentOrder.filter((item) => doctors.some((doctor) => doctor.department === item))];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    if (selectedDepartment === "All") return doctors;
    return doctors.filter((doctor) => doctor.department === selectedDepartment);
  }, [doctors, selectedDepartment]);

  const upcomingAppointments = appointments.filter((item) => item.status !== "cancelled");

  const bookAppointment = async () => {
    if (!session?.token || !selectedAvailability || !selectedSlot || !reason) {
      setStatus({ loading: false, message: "", error: "Pick a doctor, slot, and reason first." });
      return;
    }

    setStatus({ loading: true, message: "", error: "" });
    try {
      const appointment = await apiRequest("/api/appointments", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({
          availabilityId: selectedAvailability.id,
          availabilityDate: selectedAvailability.availableDate,
          appointmentTime: selectedSlot,
          reason
        })
      });

      setAppointments((current) => [appointment, ...current]);
      setReason("");
      setSelectedSlot("");
      setStatus({
        loading: false,
        message: "Appointment saved. The doctor will receive a confirmation request.",
        error: ""
      });
    } catch (error) {
      setStatus({ loading: false, message: "", error: error.message });
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-5 xl:grid-cols-4">
        {[
          { label: "Upcoming appointments", value: String(upcomingAppointments.length).padStart(2, "0"), icon: FaCalendarCheck },
          { label: "Unread notifications", value: String(notifications.filter((item) => !item.isRead).length).padStart(2, "0"), icon: FaBell },
          { label: "Available doctors", value: String(doctors.length).padStart(2, "0"), icon: FaUserDoctor },
          { label: "Average response", value: "12m", icon: FaClock }
        ].map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-[28px] border border-white/60 bg-white p-6 shadow-card"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{card.label}</p>
                <div className="rounded-2xl bg-mint p-3 text-emerald">
                  <Icon />
                </div>
              </div>
              <p className="mt-6 font-display text-4xl font-bold text-pine">{card.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[32px] border border-white/60 bg-white p-6 shadow-card sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald">
                Appointment flow
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-pine">
                Book your next visit
              </h2>
            </div>
            <div className="hidden rounded-full border border-emerald/10 bg-mint px-4 py-2 text-sm text-forest md:flex md:items-center md:gap-2">
              <FaMagnifyingGlass />
              Clean patient journey
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <div>
              <p className="text-sm font-semibold text-slate-700">Choose Department</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {departments.map((department) => (
                  <button
                    key={department}
                    type="button"
                    onClick={() => setSelectedDepartment(department)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      selectedDepartment === department
                        ? "bg-gradient-to-r from-emerald to-forest text-white"
                        : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-mint"
                    }`}
                  >
                    {department}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">Select Doctor</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {filteredDoctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    type="button"
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setSelectedAvailability(null);
                      setSelectedSlot("");
                    }}
                    className={`rounded-[24px] border p-5 text-left transition ${
                      selectedDoctor?.id === doctor.id
                        ? "border-emerald bg-mint"
                        : "border-slate-200 bg-slate-50 hover:-translate-y-1 hover:border-emerald/30"
                    }`}
                  >
                    <p className="text-sm text-emerald">{doctor.department}</p>
                    <p className="mt-3 font-display text-xl font-semibold text-pine">
                      {doctor.fullname}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{doctor.email}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">View Available Time</p>
              <div className="mt-4 grid gap-4">
                {availabilities.length ? (
                  availabilities.map((availability) => (
                    <div key={availability.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-pine">{availability.availableDate}</p>
                          <p className="text-sm text-slate-500">Published schedule</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {availability.availableTimeSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => {
                                setSelectedAvailability(availability);
                                setSelectedSlot(slot);
                              }}
                              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                selectedAvailability?.id === availability.id && selectedSlot === slot
                                  ? "bg-gradient-to-r from-emerald to-forest text-white"
                                  : "border border-slate-200 bg-white text-slate-600 hover:bg-mint"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                    Select a doctor to load available slots.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-700">Book Appointment</p>
              <textarea
                rows={4}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Describe the reason for your visit"
                className="input-field mt-4 min-h-[110px] resize-none bg-white"
              />
              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-500">
                  The system will check availability before saving the appointment.
                </div>
                <button type="button" onClick={bookAppointment} className="primary-button">
                  {status.loading ? "Booking..." : "Confirm booking"}
                </button>
              </div>
            </div>

            {status.error ? (
              <div className="rounded-[24px] bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {status.error}
              </div>
            ) : null}

            {status.message ? (
              <div className="rounded-[24px] bg-mint px-4 py-3 text-sm text-forest">
                {status.message}
              </div>
            ) : null}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[32px] border border-white/60 bg-white p-6 shadow-card">
            <h3 className="font-display text-2xl font-semibold text-pine">Upcoming appointments</h3>
            <div className="mt-5 space-y-4">
              {upcomingAppointments.length ? (
                upcomingAppointments.map((appointment) => (
                  <article key={appointment.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-pine">
                          {appointment.appointmentDate} at {appointment.appointmentTime}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">{appointment.reason}</p>
                      </div>
                      <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
                        {appointment.status}
                      </span>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                  No appointments yet. Book one from the left panel.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[32px] border border-white/60 bg-white p-6 shadow-card">
            <h3 className="font-display text-2xl font-semibold text-pine">Notifications</h3>
            <div className="mt-5 space-y-4">
              {notifications.length ? (
                notifications.map((notification) => (
                  <article key={notification.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-mint p-3 text-emerald">
                        <FaBell />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-pine">
                          {notification.isRead ? "Read update" : "New update"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{notification.message}</p>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                  Notifications will appear after booking or doctor confirmation.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
