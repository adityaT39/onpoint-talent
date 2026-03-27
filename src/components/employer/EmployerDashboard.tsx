"use client";
import { useState, useEffect } from "react";
import { Briefcase, Pencil, Trash2, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase";
import AvatarUpload from "@/components/shared/AvatarUpload";
import type { Job } from "@/types";
import { extractSkills } from "@/lib/extractSkills";

// ── Supabase helpers ───────────────────────────────────────────────────────

function mapJob(row: Record<string, unknown>): Job {
  return {
    id: row.id as string,
    employerId: row.employer_id as string | null,
    title: row.title as string,
    company: row.company as string,
    location: row.location as string,
    type: row.type as string,
    salary: (row.salary as string) ?? "",
    description: (row.description as string) ?? "",
    requirements: (row.requirements as string) ?? "",
    requiredSkills: (row.required_skills as string[]) ?? [],
    postedAt: row.posted_at as string,
  };
}

// ── Shared input style ────────────────────────────────────────────────────

const baseInput =
  "w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-[#080e1c] text-[#0f172a] dark:text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 transition border-slate-200 dark:border-[#1e3356] focus:ring-[#2563eb] dark:focus:ring-[#3b82f6]";

const errorInput =
  "w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-[#080e1c] text-[#0f172a] dark:text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 transition border-red-400 dark:border-red-500 focus:ring-red-400";

// ── EditJobForm ───────────────────────────────────────────────────────────

type EditFields = {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string;
};

function EditJobForm({
  job,
  onSave,
  onCancel,
}: {
  job: Job;
  onSave: (updated: Job) => void;
  onCancel: () => void;
}) {
  const [fields, setFields] = useState<EditFields>({
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type,
    salary: job.salary,
    description: job.description,
    requirements: job.requirements,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EditFields, string>>>({});
  const [skillTags, setSkillTags] = useState<string[]>(job.requiredSkills ?? []);
  const [skillInput, setSkillInput] = useState("");

  function set(key: keyof EditFields, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function addSkillTag(skill: string) {
    if (!skill) return;
    if (!skillTags.some((t) => t.toLowerCase() === skill.toLowerCase())) {
      setSkillTags((prev) => [...prev, skill]);
    }
    setSkillInput("");
  }

  function handleRedetect() {
    const detected = extractSkills(fields.description + " " + fields.requirements);
    setSkillTags(detected.length > 0 ? detected : skillTags);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Partial<Record<keyof EditFields, string>> = {};
    if (!fields.title.trim()) errs.title = "Required";
    if (!fields.company.trim()) errs.company = "Required";
    if (!fields.location.trim()) errs.location = "Required";
    if (!fields.type) errs.type = "Required";
    if (!fields.description.trim()) errs.description = "Required";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const updated: Job = {
      ...job,
      ...fields,
      title: fields.title.trim(),
      company: fields.company.trim(),
      location: fields.location.trim(),
      description: fields.description.trim(),
      requirements: fields.requirements.trim(),
      requiredSkills: skillTags,
    };

    const supabase = createClient();
    await supabase.from("jobs").update({
      title: updated.title,
      company: updated.company,
      location: updated.location,
      type: updated.type,
      salary: updated.salary,
      description: updated.description,
      requirements: updated.requirements,
      required_skills: updated.requiredSkills,
    }).eq("id", updated.id);

    onSave(updated);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">
        Edit Listing
      </p>

      {/* Title + Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
            Job Title <span className="text-red-400">*</span>
          </label>
          <input value={fields.title} onChange={(e) => set("title", e.target.value)}
            className={errors.title ? errorInput : baseInput} />
          {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
            Company <span className="text-red-400">*</span>
          </label>
          <input value={fields.company} onChange={(e) => set("company", e.target.value)}
            className={errors.company ? errorInput : baseInput} />
          {errors.company && <p className="text-xs text-red-500">{errors.company}</p>}
        </div>
      </div>

      {/* Location + Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
            Location <span className="text-red-400">*</span>
          </label>
          <input value={fields.location} onChange={(e) => set("location", e.target.value)}
            className={errors.location ? errorInput : baseInput} />
          {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
            Job Type <span className="text-red-400">*</span>
          </label>
          <select value={fields.type} onChange={(e) => set("type", e.target.value)}
            className={errors.type ? errorInput : baseInput}>
            <option value="">Select type…</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
          {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
        </div>
      </div>

      {/* Salary */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
          Salary <span className="text-[#94a3b8] font-normal">(optional)</span>
        </label>
        <input value={fields.salary} onChange={(e) => set("salary", e.target.value)}
          placeholder="e.g. $60k – $80k"
          className={baseInput} />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
          Job Description <span className="text-red-400">*</span>
        </label>
        <textarea value={fields.description} onChange={(e) => set("description", e.target.value)}
          rows={4} className={`${errors.description ? errorInput : baseInput} resize-y`} />
        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
      </div>

      {/* Requirements */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
          Requirements <span className="text-[#94a3b8] font-normal">(optional)</span>
        </label>
        <textarea value={fields.requirements} onChange={(e) => set("requirements", e.target.value)}
          rows={3} className={`${baseInput} resize-y`} />
      </div>

      {/* Required Skills */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
            Required Skills <span className="text-[#94a3b8] font-normal">(optional)</span>
          </label>
          <button
            type="button"
            onClick={handleRedetect}
            className="text-xs font-medium text-[#2563eb] dark:text-[#60a5fa] hover:underline transition-opacity"
          >
            ↻ Detect from description
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
                  onClick={() => setSkillTags((t) => t.filter((_, j) => j !== i))}
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
            placeholder={skillTags.length === 0 ? "e.g. JavaScript, Figma" : "Add another skill…"}
            className={`${baseInput} flex-1`}
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
        <p className="text-xs text-[#94a3b8]">Add or remove skills · click "Detect from description" to auto-fill</p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 text-sm font-medium text-[#64748b] dark:text-[#94a3b8] border border-slate-200 dark:border-[#1e3356] rounded-full hover:bg-slate-50 dark:hover:bg-[#152237] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

// ── EmployerDashboard ─────────────────────────────────────────────────────

export default function EmployerDashboard() {
  const { user, mounted, updateAvatar } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appCounts, setAppCounts] = useState<Record<string, number>>({});
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => {
    if (!mounted || !user) return;
    const supabase = createClient();

    // Check Pro subscription
    supabase
      .from("employer_subscriptions")
      .select("status")
      .eq("employer_id", user.id)
      .single()
      .then(({ data }) => {
        setIsPro(data?.status === "active" || data?.status === "trialing");
      });

    supabase
      .from("jobs")
      .select("*")
      .eq("employer_id", user.id)
      .order("posted_at", { ascending: false })
      .then(({ data }) => {
        const employerJobs = (data ?? []).map(mapJob);
        setJobs(employerJobs);
        setLoading(false);

        // Count applications per job
        if (employerJobs.length > 0) {
          const jobIds = employerJobs.map((j) => j.id);
          supabase
            .from("applications")
            .select("job_id")
            .in("job_id", jobIds)
            .then(({ data: appData }) => {
              const counts: Record<string, number> = {};
              jobIds.forEach((id) => { counts[id] = 0; });
              (appData ?? []).forEach((a: { job_id: string }) => {
                counts[a.job_id] = (counts[a.job_id] ?? 0) + 1;
              });
              setAppCounts(counts);
            });
        }
      });
  }, [mounted, user]);

  async function handleManageBilling() {
    setBillingLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setBillingLoading(false);
  }

  if (!mounted || loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="h-9 w-60 bg-slate-200 dark:bg-[#1e3356] rounded-lg mb-2 animate-pulse" />
            <div className="h-4 w-44 bg-slate-100 dark:bg-[#152237] rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-slate-200 dark:bg-[#1e3356] rounded-full animate-pulse" />
        </div>
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] px-6 py-5 flex items-center gap-3">
              <div className="flex-1">
                <div className="h-5 w-2/5 bg-slate-200 dark:bg-[#1e3356] rounded mb-2 animate-pulse" />
                <div className="h-4 w-1/3 bg-slate-100 dark:bg-[#152237] rounded animate-pulse" />
              </div>
              <div className="h-8 w-28 bg-slate-100 dark:bg-[#152237] rounded-full animate-pulse" />
              <div className="h-7 w-7 bg-slate-100 dark:bg-[#152237] rounded-lg animate-pulse" />
              <div className="h-7 w-7 bg-slate-100 dark:bg-[#152237] rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Access guard ───────────────────────────────────────────────────────
  if (!user || user.role !== "employer") {
    return (
      <div
        className="max-w-2xl mx-auto bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none p-10 text-center"
        style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}
      >
        <h2 className="text-2xl font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-2">
          Employer Access Only
        </h2>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-8">
          {user?.role === "seeker"
            ? "This page is for employers. Browse jobs as a seeker instead."
            : "Please log in with an employer account to access this dashboard."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/login" className="px-8 py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm">
            Log In
          </a>
          <a href="/signup" className="px-8 py-3 text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] border border-[#2563eb] dark:border-[#3b82f6] rounded-full hover:bg-[#eff6ff] dark:hover:bg-[#152237] transition-colors">
            Create Employer Account
          </a>
        </div>
      </div>
    );
  }

  // ── Handlers ───────────────────────────────────────────────────────────

  function handleSaveEdit(updated: Job) {
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    setEditingJobId(null);
  }

  async function handleDelete(jobId: string) {
    const supabase = createClient();
    await supabase.from("jobs").delete().eq("id", jobId);
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    setAppCounts((prev) => { const next = { ...prev }; delete next[jobId]; return next; });
    setDeletingJobId(null);
    if (editingJobId === jobId) setEditingJobId(null);
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto" style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <AvatarUpload
            userId={user.id}
            name={user.name}
            currentUrl={user.avatarUrl}
            onUpdate={updateAvatar}
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-[#0f172a] dark:text-[#f1f5f9] tracking-tight">
                Employer Dashboard
              </h1>
              {isPro && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white shadow-sm">
                  <Sparkles className="w-3 h-3" /> Pro
                </span>
              )}
            </div>
            <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
              {user.company ?? user.name} · {jobs.length}{" "}
              {jobs.length === 1 ? "listing" : "listings"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isPro ? (
            <button
              onClick={handleManageBilling}
              disabled={billingLoading}
              className="px-4 py-2.5 text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] border border-[#2563eb] dark:border-[#3b82f6] rounded-full hover:bg-[#eff6ff] dark:hover:bg-[#152237] transition-colors disabled:opacity-60"
            >
              {billingLoading ? "Loading…" : "Manage Billing"}
            </button>
          ) : (
            <a
              href="/pricing"
              className="px-4 py-2.5 text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] border border-[#2563eb] dark:border-[#3b82f6] rounded-full hover:bg-[#eff6ff] dark:hover:bg-[#152237] transition-colors"
            >
              Upgrade to Pro
            </a>
          )}
          <a
            href="/post-job"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
          >
            + Post a Job
          </a>
        </div>
      </div>

      {/* Pro upgrade banner */}
      {!isPro && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-blue-100 dark:border-[#1e3356] bg-[#eff6ff] dark:bg-[#0e1a2e] px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9]">
              Unlock full applicant profiles
            </p>
            <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mt-0.5">
              Upgrade to Pro for $79/mo — see resumes, contact info &amp; more across all listings.
            </p>
          </div>
          <a
            href="/pricing"
            className="shrink-0 px-4 py-2 text-xs font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
          >
            See Plans
          </a>
        </div>
      )}

      {/* Empty state */}
      {jobs.length === 0 ? (
        <div className="bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] p-12 text-center">
          <Briefcase className="mx-auto mb-4 w-10 h-10 text-[#2563eb] dark:text-[#60a5fa] opacity-40" />
          <p className="text-[#64748b] dark:text-[#94a3b8] text-sm mb-6">
            You haven&apos;t posted any jobs yet.
          </p>
          <a href="/post-job" className="px-8 py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm">
            Post Your First Job
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.map((job) => {
            const appCount = appCounts[job.id] ?? 0;
            const isEditing = editingJobId === job.id;
            const isDeleting = deletingJobId === job.id;

            return (
              <div
                key={job.id}
                className="bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none overflow-hidden"
              >
                {/* Job row header */}
                <div className="px-6 py-5 flex items-center gap-3">
                  {/* Title area */}
                  <div className="flex-1 min-w-0">
                    <span className="block text-base font-semibold text-[#0f172a] dark:text-[#f1f5f9] truncate">
                      {job.title}
                    </span>
                    <span className="block text-sm text-[#64748b] dark:text-[#94a3b8]">
                      {job.location} · {job.type}{job.salary ? ` · ${job.salary}` : ""}
                    </span>
                  </div>

                  {/* Action area */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Review Applications link */}
                    <a
                      href={`/employer/jobs/${job.id}`}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#eff6ff] dark:bg-[#152237] text-[#2563eb] dark:text-[#60a5fa] hover:bg-blue-100 dark:hover:bg-[#1e3356] transition-colors"
                    >
                      {appCount} {appCount === 1 ? "applicant" : "applicants"} →
                    </a>

                    {/* Edit button */}
                    <button
                      onClick={() => {
                        setDeletingJobId(null);
                        setEditingJobId(isEditing ? null : job.id);
                      }}
                      title="Edit listing"
                      className={`p-1.5 rounded-lg transition-colors ${
                        isEditing
                          ? "bg-[#eff6ff] dark:bg-[#152237] text-[#2563eb] dark:text-[#60a5fa]"
                          : "text-[#64748b] dark:text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-[#60a5fa] hover:bg-[#eff6ff] dark:hover:bg-[#152237]"
                      }`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => {
                        setEditingJobId(null);
                        setDeletingJobId(isDeleting ? null : job.id);
                      }}
                      title="Delete listing"
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDeleting
                          ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                          : "text-[#64748b] dark:text-[#94a3b8] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Delete confirmation strip */}
                {isDeleting && (
                  <div className="border-t border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
                    <p className="text-sm text-red-700 dark:text-red-400">
                      Delete <span className="font-semibold">{job.title}</span>? This will also remove all {appCount} {appCount === 1 ? "application" : "applications"}.
                    </p>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setDeletingJobId(null)}
                        className="px-4 py-1.5 text-xs font-medium text-[#64748b] dark:text-[#94a3b8] border border-slate-200 dark:border-[#1e3356] rounded-full hover:bg-white dark:hover:bg-[#152237] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 dark:bg-red-500 rounded-full hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
                      >
                        Yes, Delete
                      </button>
                    </div>
                  </div>
                )}

                {/* Edit form panel */}
                {isEditing && (
                  <div className="border-t border-slate-100 dark:border-[#1e3356] px-6 py-6">
                    <EditJobForm
                      job={job}
                      onSave={handleSaveEdit}
                      onCancel={() => setEditingJobId(null)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
