"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Role = "seeker" | "employer";

type Fields = {
  name: string;
  company: string;
  email: string;
  password: string;
  confirm: string;
};

type Errors = Partial<Record<keyof Fields, string>>;
type Touched = Partial<Record<keyof Fields, boolean>>;

// ── Validators ──────────────────────────────────────────────────────────────

function validateName(v: string) {
  if (!v.trim()) return "Full name is required";
  if (v.trim().length < 2) return "Name must be at least 2 characters";
  return "";
}

function validateCompany(v: string) {
  if (!v.trim()) return "Company name is required";
  if (v.trim().length < 2) return "Company name must be at least 2 characters";
  return "";
}

function validateEmail(v: string) {
  if (!v.trim()) return "Email address is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address";
  return "";
}

function validatePassword(v: string) {
  if (!v) return "Password is required";
  if (v.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(v)) return "Must include at least one uppercase letter";
  if (!/[a-z]/.test(v)) return "Must include at least one lowercase letter";
  if (!/[0-9]/.test(v)) return "Must include at least one number";
  return "";
}

function validateConfirm(v: string, password: string) {
  if (!v) return "Please confirm your password";
  if (v !== password) return "Passwords do not match";
  return "";
}

function validate(fields: Fields, role: Role): Errors {
  const errs: Errors = {};
  const name = validateName(fields.name);
  if (name) errs.name = name;
  if (role === "employer") {
    const company = validateCompany(fields.company);
    if (company) errs.company = company;
  }
  const email = validateEmail(fields.email);
  if (email) errs.email = email;
  const password = validatePassword(fields.password);
  if (password) errs.password = password;
  const confirm = validateConfirm(fields.confirm, fields.password);
  if (confirm) errs.confirm = confirm;
  return errs;
}

// ── Character filters (strip invalid chars on input) ──────────────────────

const filterName = (v: string) => v.replace(/[^a-zA-Z\s'\-]/g, "");
const filterCompany = (v: string) => v.replace(/[^a-zA-Z0-9\s&.,'\-()+]/g, "");
const filterEmail = (v: string) => v.replace(/[^\w@.\-+%]/g, "");

// ── Shared field styles ───────────────────────────────────────────────────

function inputClass(error?: string) {
  const base =
    "w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-[#080e1c] text-[#0f172a] dark:text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 transition";
  return error
    ? `${base} border-red-400 dark:border-red-500 focus:ring-red-400`
    : `${base} border-slate-200 dark:border-[#1e3356] focus:ring-[#2563eb] dark:focus:ring-[#3b82f6]`;
}

// ── Component ────────────────────────────────────────────────────────────

export default function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole: Role = searchParams.get("role") === "employer" ? "employer" : "seeker";
  const [role, setRole] = useState<Role>(initialRole);
  const [submitting, setSubmitting] = useState(false);

  const [fields, setFields] = useState<Fields>({
    name: "", company: "", email: "", password: "", confirm: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(key: keyof Fields, raw: string, filter?: (v: string) => string) {
    const value = filter ? filter(raw) : raw;
    const next = { ...fields, [key]: value };
    setFields(next);
    setServerError(null);
    if (touched[key]) {
      const all = validate(next, role);
      setErrors((e) => ({ ...e, [key]: all[key] }));
    }
  }

  function handleBlur(key: keyof Fields) {
    setTouched((t) => ({ ...t, [key]: true }));
    const all = validate(fields, role);
    setErrors((e) => ({ ...e, [key]: all[key] }));
  }

  function switchRole(r: Role) {
    setRole(r);
    setServerError(null);
    if (r === "seeker") {
      setErrors((e) => ({ ...e, company: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allTouched: Touched = { name: true, email: true, password: true, confirm: true };
    if (role === "employer") allTouched.company = true;
    setTouched(allTouched);

    const errs = validate(fields, role);
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setSubmitting(true);
      const result = await signup({
        name: fields.name,
        email: fields.email,
        password: fields.password,
        role,
        company: role === "employer" ? fields.company : undefined,
      });
      setSubmitting(false);
      if (result.error) {
        setServerError(result.error);
      } else {
        // Store email so verify-email page can resend without an active session
        sessionStorage.setItem("pending_verify_email", fields.email);
        router.push("/verify-email");
      }
    }
  }

  return (
    <div
      className="relative z-10 w-full max-w-md bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none p-8"
      style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}
    >

      {/* Heading */}
      <h1 className="text-2xl font-bold text-[#0f172a] dark:text-[#f1f5f9] tracking-tight mb-1">
        Create your account
      </h1>
      <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-6">
        Join OnPoint Talent and find your next opportunity.
      </p>

      {/* Role Toggle — sliding pill indicator */}
      <div className="relative flex bg-[#eff6ff] dark:bg-[#080e1c] rounded-full p-1 mb-6 border border-blue-100 dark:border-[#1e3356]">
        {/* Sliding background pill */}
        <div
          className="absolute top-1 bottom-1 w-[calc(50%-2px)] bg-[#2563eb] rounded-full shadow-sm transition-transform duration-300 ease-in-out"
          style={{ transform: role === "seeker" ? "translateX(0%)" : "translateX(calc(100% + 4px))" }}
        />
        {(["seeker", "employer"] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => switchRole(r)}
            className={`relative z-10 flex-1 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
              role === r
                ? "text-white"
                : "text-[#64748b] dark:text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-white"
            }`}
          >
            {r === "seeker" ? "Job Seeker" : "Employer"}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
            Full Name
          </label>
          <input
            type="text"
            value={fields.name}
            placeholder="Jane Smith"
            autoComplete="name"
            onChange={(e) => handleChange("name", e.target.value, filterName)}
            onBlur={() => handleBlur("name")}
            className={inputClass(touched.name ? errors.name : undefined)}
          />
          {touched.name && errors.name && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Company Name — Employer only */}
        {role === "employer" && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
              Company Name
            </label>
            <input
              type="text"
              value={fields.company}
              placeholder="Acme Corp"
              autoComplete="organization"
              onChange={(e) => handleChange("company", e.target.value, filterCompany)}
              onBlur={() => handleBlur("company")}
              className={inputClass(touched.company ? errors.company : undefined)}
            />
            {touched.company && errors.company && (
              <p className="text-xs text-red-500 dark:text-red-400">{errors.company}</p>
            )}
          </div>
        )}

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
          <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
            Password
          </label>
          <input
            type="password"
            value={fields.password}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={() => handleBlur("password")}
            className={inputClass(touched.password ? errors.password : undefined)}
          />
          {touched.password && errors.password && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
            Confirm Password
          </label>
          <input
            type="password"
            value={fields.confirm}
            placeholder="Repeat your password"
            autoComplete="new-password"
            onChange={(e) => handleChange("confirm", e.target.value)}
            onBlur={() => handleBlur("confirm")}
            className={inputClass(touched.confirm ? errors.confirm : undefined)}
          />
          {touched.confirm && errors.confirm && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors.confirm}</p>
          )}
        </div>

        {/* Server error */}
        {serverError && (
          <p className="text-xs text-red-500 dark:text-red-400 text-center">{serverError}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Creating account…" : "Create Account"}
        </button>
      </form>

      {/* Login Link */}
      <p className="mt-6 text-center text-sm text-[#64748b] dark:text-[#94a3b8]">
        Already have an account?{" "}
        <a href="/login" className="font-semibold text-[#2563eb] dark:text-[#60a5fa] hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
}
