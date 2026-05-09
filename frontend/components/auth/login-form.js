"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { apiRequest, saveSession } from "@/lib/api";

const redirectByRole = {
  patient: "/patient-dashboard",
  doctor: "/doctor-dashboard",
  admin: "/admin-dashboard"
};

export function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const onChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const result = await apiRequest("/api/login", {
        method: "POST",
        body: JSON.stringify(form)
      });

      saveSession({
        token: result.token,
        user: result.user
      });

      setSuccess("Login successful. Redirecting to your dashboard...");
      router.push(redirectByRole[result.user.role] || "/");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel space-y-5 p-7 sm:p-8">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
        <input
          className="input-field"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={onChange}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
        <div className="relative">
          <input
            className="input-field pr-12"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={form.password}
            onChange={onChange}
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
        {loading ? "Signing in..." : "Login"}
      </button>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>No account yet?</span>
        <Link href="/signup" className="font-semibold text-emerald">
          Create one
        </Link>
      </div>
    </form>
  );
}
