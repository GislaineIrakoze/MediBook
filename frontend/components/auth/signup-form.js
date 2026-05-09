"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaEye, FaEyeSlash } from "react-icons/fa6";
import { apiRequest, saveSession } from "@/lib/api";

const defaultsByRole = {
  patient: {
    dob: "",
    gender: "male",
    PhoneNumber: "",
    emergencyContact: ""
  },
  doctor: {
    dob: "1985-03-12",
    gender: "male",
    PhoneNumber: "1112223333",
    emergencyContact: "4445556666"
  },
  admin: {
    dob: "",
    gender: "other",
    PhoneNumber: "",
    emergencyContact: ""
  }
};

const redirectByRole = {
  patient: "/patient-dashboard",
  doctor: "/doctor-dashboard",
  admin: "/admin-dashboard"
};

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "patient",
    dob: "",
    gender: "male",
    PhoneNumber: "",
    emergencyContact: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const roleDefaults = useMemo(() => defaultsByRole[form.role], [form.role]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "role") {
      setForm((current) => ({
        ...current,
        role: value,
        ...defaultsByRole[value]
      }));
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.fullname || !form.email || !form.password) {
      setError("Full name, email, and password are required.");
      return;
    }

    setLoading(true);
    try {
      const result = await apiRequest("/api/register", {
        method: "POST",
        body: JSON.stringify(form)
      });

      saveSession({
        token: result.token,
        user: result.user
      });

      setSuccess("Account created successfully. Redirecting...");
      router.push(redirectByRole[result.user.role] || "/");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel space-y-5 p-7 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
          <input
            className="input-field"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            placeholder="Patient or doctor name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
          <input
            className="input-field"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Role</label>
          <div className="relative">
            <select className="input-field appearance-none" name="role" value={form.role} onChange={handleChange}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
          <div className="relative">
            <input
              className="input-field pr-12"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Create a secure password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Date of birth</label>
          <input className="input-field" type="date" name="dob" value={form.dob} onChange={handleChange} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Gender</label>
          <div className="relative">
            <select className="input-field appearance-none" name="gender" value={form.gender} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Phone number</label>
          <input
            className="input-field"
            name="PhoneNumber"
            value={form.PhoneNumber}
            onChange={handleChange}
            placeholder={roleDefaults.PhoneNumber}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Emergency contact</label>
          <input
            className="input-field"
            name="emergencyContact"
            value={form.emergencyContact}
            onChange={handleChange}
            placeholder={roleDefaults.emergencyContact}
          />
        </div>
      </div>

      {error ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </motion.p>
      ) : null}

      {success ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-mint px-4 py-3 text-sm text-forest">
          {success}
        </motion.p>
      ) : null}

      <button type="submit" disabled={loading} className="primary-button w-full">
        {loading ? "Creating account..." : "Create account"}
      </button>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Already registered?</span>
        <Link href="/login" className="font-semibold text-emerald">
          Login
        </Link>
      </div>
    </form>
  );
}
