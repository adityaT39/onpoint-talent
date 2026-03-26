"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Fields = { email: string; password: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Touched = Partial<Record<keyof Fields, boolean>>;

// ── Validators ──────────────────────────────────────────────────────────────

function validateEmail(v: string) {
  if (!v.trim()) return "Email address is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address";
  return "";
}

function validatePassword(v: string) {
  if (!v) return "Password is required";
  return "";
}

function validate(fields: Fields): Errors {
  const errs: Errors = {};
  const email = validateEmail(fields.email);
  if (email) errs.email = email;
  const password = validatePassword(fields.password);
  if (password) errs.password = password;
  return errs;
}

// ── Character filters ────────────────────────────────────────────────────────

const filterEmail = (v: string) => v.replace(/[^\w@.\-+%]/g, "");

// ── Shared field styles ───────────────────────────────────────────────────────

function inputClass(error?: string) {
  const base =
    "w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-[#080e1c] text-[#0f172a] dark:text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 transition";
  return error
    ? `${base} border-red-400 dark:border-red-500 focus:ring-red-400`
    : `${base} border-slate-200 dark:border-[#1e3356] focus:ring-[#2563eb] dark:focus:ring-[#3b82f6]`;
}

// ── Component ─────────────────────────────────────────────────────────────────

type Props = { resetSuccess?: boolean; verificationError?: boolean };

export default function LoginForm({ resetSuccess, verificationError }: Props) {
  const { login } = useAuth();
  const router = useRouter();
  const [fields, setFields] = useState<Fields>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(key: keyof Fields, raw: string, filter?: (v: string) => string) {
    const value = filter ? filter(raw) : raw;
    const next = { ...fields, [key]: value };
    setFields(next);
    setServerError(null);
    if (touched[key]) {
      const all = validate(next);
      setErrors((e) => ({ ...e, [key]: all[key] }));
    }
  }

  function handleBlur(key: keyof Fields) {
    setTouched((t) => ({ ...t, [key]: true }));
    const all = validate(fields);
    setErrors((e) => ({ ...e, [key]: all[key] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      const result = await login(fields.email, fields.password);
      if (result.error) setServerError(result.error);
      else router.push(result.role === "employer" ? "/employer" : "/jobs");
    }
  }

  return (
    <div
      className="relative z-10 w-full max-w-md bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none p-8"
      style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}
    >

      {/* Success / error banners */}
      {resetSuccess && (
        <div className="mb-5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          Password updated — log in with your new password.
        </div>
      )}
      {verificationError && (
        <div className="mb-5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          Email verification failed. Please try again or contact support.
        </div>
      )}

      {/* Heading */}
      <h1 className="text-2xl font-bold text-[#0f172a] dark:text-[#f1f5f9] tracking-tight mb-1">
        Welcome back
      </h1>
      <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-6">
        Log in to your OnPoint Talent account.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
            Email Address
          </label>
          <input
            type="email"
            value={fields.email}
            placeholder="jane@example.com"
            autoComplete="email"
            onChange={(e) => handleChange("email", e.target.value, filterEmail)}
            onBlur={() => handleBlur("email")}
            className={inputClass(touched.email ? errors.email : undefined)}
          />
          {touched.email && errors.email && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
              Password
            </label>
            <a
              href="/forgot-password"
              className="text-xs font-medium text-[#2563eb] dark:text-[#60a5fa] hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <input
            type="password"
            value={fields.password}
            placeholder="Your password"
            autoComplete="current-password"
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={() => handleBlur("password")}
            className={inputClass(touched.password ? errors.password : undefined)}
          />
          {touched.password && errors.password && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors.password}</p>
          )}
        </div>

        {/* Server error */}
        {serverError && (
          <p className="text-xs text-red-500 dark:text-red-400 text-center">{serverError}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="mt-2 w-full py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
        >
          Log In
        </button>
      </form>

      {/* Signup Link */}
      <p className="mt-6 text-center text-sm text-[#64748b] dark:text-[#94a3b8]">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="font-semibold text-[#2563eb] dark:text-[#60a5fa] hover:underline">
          Sign up →
        </a>
      </p>
    </div>
  );
}
