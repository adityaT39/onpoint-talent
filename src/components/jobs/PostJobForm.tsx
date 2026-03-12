"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { extractSkills } from "@/lib/extractSkills";

type JobType = "Full-time" | "Part-time" | "Contract" | "Remote";

type Fields = {
  title: string;
  company: string;
  location: string;
  type: JobType | "";
  salaryMin: string;
  salaryMax: string;
  description: string;
  requirements: string;
};

type Errors = Partial<Record<keyof Fields, string>>;
type Touched = Partial<Record<keyof Fields, boolean>>;

// ── Validators ──────────────────────────────────────────────────────────────

function validateTitle(v: string) {
  if (!v.trim()) return "Job title is required";
  if (v.trim().length < 2) return "Job title must be at least 2 characters";
  return "";
}

function validateCompany(v: string) {
  if (!v.trim()) return "Company name is required";
  if (v.trim().length < 2) return "Company name must be at least 2 characters";
  return "";
}

function validateLocation(v: string) {
  if (!v.trim()) return "Location is required";
  return "";
}

function validateType(v: string) {
  if (!v) return "Job type is required";
  return "";
}

function validateSalary(min: string, max: string): { salaryMin?: string; salaryMax?: string } {
  const errs: { salaryMin?: string; salaryMax?: string } = {};
  const minNum = min ? parseInt(min.replace(/,/g, ""), 10) : null;
  const maxNum = max ? parseInt(max.replace(/,/g, ""), 10) : null;
  if (min && isNaN(minNum!)) errs.salaryMin = "Enter a valid number";
  if (max && isNaN(maxNum!)) errs.salaryMax = "Enter a valid number";
  if (minNum !== null && maxNum !== null && !isNaN(minNum) && !isNaN(maxNum) && maxNum <= minNum) {
    errs.salaryMax = "Max salary must be greater than min";
  }
  return errs;
}

function validateDescription(v: string) {
  if (!v.trim()) return "Job description is required";
  if (v.trim().length < 50) return `Description must be at least 50 characters (${v.trim().length}/50)`;
  return "";
}

function validateRequirements(v: string) {
  if (!v.trim()) return "Requirements are required";
  if (v.trim().length < 20) return `Requirements must be at least 20 characters (${v.trim().length}/20)`;
  return "";
}

function validate(fields: Fields): Errors {
  const errs: Errors = {};
  const title = validateTitle(fields.title);
  if (title) errs.title = title;
  const company = validateCompany(fields.company);
  if (company) errs.company = company;
  const location = validateLocation(fields.location);
  if (location) errs.location = location;
  const type = validateType(fields.type);
  if (type) errs.type = type;
  const salary = validateSalary(fields.salaryMin, fields.salaryMax);
  if (salary.salaryMin) errs.salaryMin = salary.salaryMin;
  if (salary.salaryMax) errs.salaryMax = salary.salaryMax;
  const description = validateDescription(fields.description);
  if (description) errs.description = description;
  const requirements = validateRequirements(fields.requirements);
  if (requirements) errs.requirements = requirements;
  return errs;
}

// ── Salary formatter — "$60,000" → "$60k" ──────────────────────────────────

function formatSalary(raw: string): string {
  const n = parseInt(raw.replace(/,/g, ""), 10);
  if (isNaN(n)) return raw;
  return n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;
}

function buildSalaryDisplay(min: string, max: string): string {
  if (!min && !max) return "Not specified";
  if (min && max) return `${formatSalary(min)} – ${formatSalary(max)}`;
  if (min) return `From ${formatSalary(min)}`;
  return `Up to ${formatSalary(max)}`;
}

// ── Character filters ────────────────────────────────────────────────────────

const filterSalary = (v: string) => v.replace(/[^\d,]/g, "");

// ── Shared styles ─────────────────────────────────────────────────────────────

const baseInput =
  "w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-[#080e1c] text-[#0f172a] dark:text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 transition";

function inputClass(error?: string) {
  return error
    ? `${baseInput} border-red-400 dark:border-red-500 focus:ring-red-400`
    : `${baseInput} border-slate-200 dark:border-[#1e3356] focus:ring-[#2563eb] dark:focus:ring-[#3b82f6]`;
}

const emptyFields: Fields = {
  title: "", company: "", location: "", type: "",
  salaryMin: "", salaryMax: "", description: "", requirements: "",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function PostJobForm() {
  const { user, mounted } = useAuth();
  const router = useRouter();
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [skillsError, setSkillsError] = useState("");

  // Access guard — only employers may post jobs
  if (mounted && (!user || user.role !== "employer")) {
    const isSeeker = !!user && user.role === "seeker";
    return (
      <div
        className="relative z-10 w-full max-w-2xl bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none p-10 text-center"
        style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}
      >
        <h2 className="text-2xl font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-2">
          Access Restricted
        </h2>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-8">
          {isSeeker
            ? "Job seekers cannot post listings."
            : "You need to be logged in as an employer."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/login"
            className="px-8 py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
          >
            Log In
          </a>
          <a
            href="/signup"
            className="px-8 py-3 text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] border border-[#2563eb] dark:border-[#3b82f6] rounded-full hover:bg-[#eff6ff] dark:hover:bg-[#152237] transition-colors"
          >
            Create Employer Account
          </a>
        </div>
      </div>
    );
  }

  function handleChange(key: keyof Fields, raw: string, filter?: (v: string) => string) {
    const value = filter ? filter(raw) : raw;
    const next = { ...fields, [key]: value };
    setFields(next);
    if (touched[key]) {
      const all = validate(next);
      setErrors((e) => ({ ...e, [key]: all[key] }));
    }
  }

  function handleBlur(key: keyof Fields) {
    setTouched((t) => ({ ...t, [key]: true }));
    const all = validate(fields);
    setErrors((e) => ({ ...e, [key]: all[key] }));
    if (key === "description" && fields.description.trim().length >= 50 && skillTags.length === 0) {
      const detected = extractSkills(fields.description + " " + fields.requirements);
      if (detected.length > 0) setSkillTags(detected);
    }
    if (key === "requirements" && fields.description.trim().length >= 50) {
      const detected = extractSkills(fields.description + " " + fields.requirements);
      if (detected.length > 0) setSkillTags(detected);
    }
  }

  function handleRedetect() {
    const detected = extractSkills(fields.description + " " + fields.requirements);
    setSkillTags(detected.length > 0 ? detected : skillTags);
  }

  function addSkillTag(skill: string) {
    if (!skill) return;
    if (!skillTags.some((t) => t.toLowerCase() === skill.toLowerCase())) {
      setSkillTags((prev) => [...prev, skill]);
    }
    setSkillInput("");
    setSkillsError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allTouched: Touched = {
      title: true, company: true, location: true, type: true,
      salaryMin: true, salaryMax: true, description: true, requirements: true,
    };
    setTouched(allTouched);
    const errs = validate(fields);
    setErrors(errs);
    if (skillTags.length === 0) {
      setSkillsError("At least one required skill must be added");
    }
    if (Object.keys(errs).length === 0 && skillTags.length > 0) {
      const job = {
        id: Date.now().toString(),
        employerId: user?.id ?? "",
        title: fields.title.trim(),
        company: fields.company.trim(),
        location: fields.location.trim(),
        type: fields.type,
        salary: buildSalaryDisplay(fields.salaryMin, fields.salaryMax),
        description: fields.description.trim(),
        requirements: fields.requirements.trim(),
        requiredSkills: skillTags,
        postedAt: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem("onpoint_jobs") ?? "[]");
      localStorage.setItem("onpoint_jobs", JSON.stringify([job, ...existing]));
      router.push("/employer");
    }
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <div
      className="relative z-10 w-full max-w-2xl bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none p-8"
      style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}
    >
      {/* Heading */}
      <h1 className="text-2xl font-bold text-[#0f172a] dark:text-[#f1f5f9] tracking-tight mb-1">
        Post a Job
      </h1>
      <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-6">
        Fill in the details below and your listing will be saved for job seekers to find.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* Job Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
            Job Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={fields.title}
            placeholder="e.g. Frontend Developer"
            onChange={(e) => handleChange("title", e.target.value)}
            onBlur={() => handleBlur("title")}
            className={inputClass(touched.title ? errors.title : undefined)}
          />
          {touched.title && errors.title && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors.title}</p>
          )}
        </div>

        {/* Company Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
            Company Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={fields.company}
            placeholder="e.g. Acme Corp"
            onChange={(e) => handleChange("company", e.target.value)}
            onBlur={() => handleBlur("company")}
            className={inputClass(touched.company ? errors.company : undefined)}
          />
          {touched.company && errors.company && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors.company}</p>
          )}
        </div>

        {/* Location + Job Type — two columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
              Location <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={fields.location}
              placeholder="e.g. Auckland, NZ"
              onChange={(e) => handleChange("location", e.target.value)}
              onBlur={() => handleBlur("location")}
              className={inputClass(touched.location ? errors.location : undefined)}
            />
            {touched.location && errors.location && (
              <p className="text-xs text-red-500 dark:text-red-400">{errors.location}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
              Job Type <span className="text-red-400">*</span>
            </label>
            <select
              value={fields.type}
              onChange={(e) => handleChange("type", e.target.value)}
              onBlur={() => handleBlur("type")}
              className={inputClass(touched.type ? errors.type : undefined)}
            >
              <option value="">Select type…</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
            {touched.type && errors.type && (
              <p className="text-xs text-red-500 dark:text-red-400">{errors.type}</p>
            )}
          </div>
        </div>

        {/* Salary — two columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
              Min Salary <span className="text-[#94a3b8] font-normal">(optional)</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={fields.salaryMin}
              placeholder="e.g. 60,000"
              onChange={(e) => handleChange("salaryMin", e.target.value, filterSalary)}
              onBlur={() => handleBlur("salaryMin")}
              className={inputClass(touched.salaryMin ? errors.salaryMin : undefined)}
            />
            {touched.salaryMin && errors.salaryMin && (
              <p className="text-xs text-red-500 dark:text-red-400">{errors.salaryMin}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
              Max Salary <span className="text-[#94a3b8] font-normal">(optional)</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={fields.salaryMax}
              placeholder="e.g. 80,000"
              onChange={(e) => handleChange("salaryMax", e.target.value, filterSalary)}
              onBlur={() => handleBlur("salaryMax")}
              className={inputClass(touched.salaryMax ? errors.salaryMax : undefined)}
            />
            {touched.salaryMax && errors.salaryMax && (
              <p className="text-xs text-red-500 dark:text-red-400">{errors.salaryMax}</p>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
            Job Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={fields.description}
            placeholder="Describe the role, responsibilities, and what makes it a great opportunity… (min. 50 characters)"
            rows={5}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            className={`${inputClass(touched.description ? errors.description : undefined)} resize-y`}
          />
          {touched.description && errors.description && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors.description}</p>
          )}
        </div>

        {/* Requirements */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
            Requirements <span className="text-red-400">*</span>
          </label>
          <textarea
            value={fields.requirements}
            placeholder="List key skills, experience, or qualifications…"
            rows={3}
            onChange={(e) => handleChange("requirements", e.target.value)}
            onBlur={() => handleBlur("requirements")}
            className={`${inputClass(touched.requirements ? errors.requirements : undefined)} resize-y`}
          />
          {touched.requirements && errors.requirements && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors.requirements}</p>
          )}
        </div>

        {/* Required Skills */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
              Required Skills <span className="text-red-400">*</span>
            </label>
            <button
              type="button"
              onClick={handleRedetect}
              disabled={fields.description.trim().length < 50}
              className="text-xs font-medium text-[#2563eb] dark:text-[#60a5fa] hover:underline disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              ↻ Re-detect
            </button>
          </div>

          {skillTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border bg-white dark:bg-[#080e1c] border-slate-200 dark:border-[#1e3356] min-h-[44px]">
              {skillTags.map((skill, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#eff6ff] dark:bg-[#152237] text-[#2563eb] dark:text-[#60a5fa] border border-blue-100 dark:border-[#1e3356]"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => { setSkillTags((t) => t.filter((_, j) => j !== i)); setSkillsError(""); }}
                    className="ml-0.5 hover:text-red-500 transition-colors"
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
                if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
                  e.preventDefault();
                  addSkillTag(skillInput.trim().replace(/,$/, ""));
                }
              }}
              placeholder={
                skillTags.length === 0
                  ? "e.g. JavaScript, Figma (or fill description to auto-detect)"
                  : "Add another skill…"
              }
              className={`${baseInput} flex-1 border-slate-200 dark:border-[#1e3356] focus:ring-[#2563eb] dark:focus:ring-[#3b82f6]`}
            />
            <button
              type="button"
              onClick={() => addSkillTag(skillInput.trim())}
              disabled={!skillInput.trim()}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-[#1e3356] text-[#2563eb] dark:text-[#60a5fa] hover:bg-[#eff6ff] dark:hover:bg-[#152237] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              + Add
            </button>
          </div>
          {skillsError && (
            <p className="text-xs text-red-500 dark:text-red-400">{skillsError}</p>
          )}
          <p className="text-xs text-[#94a3b8]">
            Auto-detected from your description &amp; requirements · add or remove any
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-2 w-full py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
        >
          Post Job Listing
        </button>
      </form>
    </div>
  );
}
