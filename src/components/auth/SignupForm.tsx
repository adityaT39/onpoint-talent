"use client";
import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { SeekerProfile } from "@/types";

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
  const { signup, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole: Role = searchParams.get("role") === "employer" ? "employer" : "seeker";
  const [role, setRole] = useState<Role>(initialRole);

  // Step 1 state
  const [step, setStep] = useState<1 | 2>(1);
  const [fields, setFields] = useState<Fields>({
    name: "", company: "", email: "", password: "", confirm: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Step 2 state (seeker profile)
  const [profileDraft, setProfileDraft] = useState({
    phone: "", location: "", summary: "", skills: [] as string[],
    resumeName: "", resumeData: "",
  });
  const [scanError, setScanError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  // ── Step 1 handlers ─────────────────────────────────────────────────────

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allTouched: Touched = { name: true, email: true, password: true, confirm: true };
    if (role === "employer") allTouched.company = true;
    setTouched(allTouched);

    const errs = validate(fields, role);
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      const result = signup({
        name: fields.name,
        email: fields.email,
        password: fields.password,
        role,
        company: role === "employer" ? fields.company : undefined,
      });
      if (result.error) {
        setServerError(result.error);
      } else if (result.role === "employer") {
        router.push("/employer");
      } else {
        // seeker → step 2
        setStep(2);
      }
    }
  }

  // ── Step 2 handlers ─────────────────────────────────────────────────────

  function handleResumeFile(file: File | null) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setScanError("Please upload a PDF file");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setScanError("File must be smaller than 4 MB");
      return;
    }
    setScanError(null);
    setResumeFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setProfileDraft((d) => ({
        ...d,
        resumeName: file.name,
        resumeData: reader.result as string,
      }));
    };
    reader.onerror = () => {
      setScanError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  }

  function addSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed || profileDraft.skills.includes(trimmed)) return;
    setProfileDraft((d) => ({ ...d, skills: [...d.skills, trimmed] }));
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setProfileDraft((d) => ({ ...d, skills: d.skills.filter((s) => s !== skill) }));
  }

  function saveProfile() {
    const currentUser = user;
    if (!currentUser) return;
    const profile: SeekerProfile = {
      userId: currentUser.id,
      ...profileDraft,
      updatedAt: new Date().toISOString(),
    };
    try {
      const existing: SeekerProfile[] = JSON.parse(localStorage.getItem("onpoint_profiles") ?? "[]");
      const others = existing.filter((p) => p.userId !== currentUser.id);
      localStorage.setItem("onpoint_profiles", JSON.stringify([profile, ...others]));
    } catch {
      // storage error — proceed anyway
    }
    router.push("/profile");
  }

  // ── Render ───────────────────────────────────────────────────────────────

  if (step === 2) {
    return (
      <div
        className="relative z-10 w-full max-w-md bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none p-8"
        style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}
      >
        <h1 className="text-2xl font-bold text-[#0f172a] dark:text-[#f1f5f9] tracking-tight mb-1">
          One last step
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-6">
          Upload your resume so employers can download it, and fill in your profile details below.
        </p>

        {/* Resume drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleResumeFile(e.dataTransfer.files?.[0] ?? null);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition mb-4 ${
            dragging
              ? "border-[#2563eb] bg-[#eff6ff] dark:bg-[#152237]"
              : "border-slate-200 dark:border-[#1e3356] hover:border-[#2563eb] dark:hover:border-[#3b82f6] hover:bg-slate-50 dark:hover:bg-[#0a1628]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleResumeFile(e.target.files?.[0] ?? null)}
          />
          {resumeFile ? (
            <>
              <p className="text-sm font-semibold text-emerald-500 dark:text-emerald-400">
                {resumeFile.name}
              </p>
              <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">Click to replace</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
                Drop your resume here
              </p>
              <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                PDF only · max 4 MB · click to browse
              </p>
            </>
          )}
        </div>

        {scanError && (
          <p className="text-xs text-red-500 dark:text-red-400 mb-4">{scanError}</p>
        )}

        {/* Profile fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">Phone</label>
            <input
              type="tel"
              value={profileDraft.phone}
              onChange={(e) => setProfileDraft((d) => ({ ...d, phone: e.target.value }))}
              placeholder="e.g. +64 21 123 4567"
              className={inputClass()}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">Location</label>
            <input
              type="text"
              value={profileDraft.location}
              onChange={(e) => setProfileDraft((d) => ({ ...d, location: e.target.value }))}
              placeholder="e.g. Auckland, Wellington"
              className={inputClass()}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">Professional Summary</label>
            <textarea
              value={profileDraft.summary}
              onChange={(e) => setProfileDraft((d) => ({ ...d, summary: e.target.value }))}
              placeholder="Brief overview of your background and what you bring…"
              rows={3}
              className={`${inputClass()} resize-y`}
            />
          </div>

          {/* Skills tag input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">Skills</label>
            {profileDraft.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-1">
                {profileDraft.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-[#eff6ff] dark:bg-[#152237] text-[#2563eb] dark:text-[#60a5fa]"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-[#2563eb] dark:text-[#60a5fa] hover:text-[#1d4ed8] dark:hover:text-white"
                      aria-label={`Remove ${skill}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addSkill(); }
                }}
                placeholder="Type a skill and press Enter or Add"
                className={inputClass()}
              />
              <button
                type="button"
                onClick={addSkill}
                className="shrink-0 px-4 py-2.5 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-xl hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={saveProfile}
            className="flex-1 py-3 text-sm font-semibold text-[#64748b] dark:text-[#94a3b8] border border-slate-200 dark:border-[#1e3356] rounded-full hover:bg-slate-50 dark:hover:bg-[#152237] transition-colors"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={saveProfile}
            className="flex-1 py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
          >
            Save Profile
          </button>
        </div>
      </div>
    );
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
          className="mt-2 w-full py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
        >
          Create Account
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
