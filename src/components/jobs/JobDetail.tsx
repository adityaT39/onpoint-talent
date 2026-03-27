"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Building2, MapPin, DollarSign, Briefcase, CheckCircle, Check, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase";
import type { Job, Application, WorkExperience, Education } from "@/types";

// ── Shared input style ────────────────────────────────────────────────────

const baseInput =
  "w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-[#080e1c] text-[#0f172a] dark:text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 transition";

function inputClass(error?: string) {
  return error
    ? `${baseInput} border-red-400 dark:border-red-500 focus:ring-red-400`
    : `${baseInput} border-slate-200 dark:border-[#1e3356] focus:ring-[#2563eb] dark:focus:ring-[#3b82f6]`;
}

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
    applyUrl: (row.apply_url as string) ?? undefined,
    postedAt: row.posted_at as string,
  };
}

// ── Step indicator ────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const steps = [1, 2, 3, 4];
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          {s < current ? (
            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#2563eb] dark:bg-[#3b82f6] text-white">
              <Check className="w-3.5 h-3.5" />
            </div>
          ) : s === current ? (
            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#2563eb] dark:bg-[#3b82f6] text-white text-xs font-bold">
              {s}
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full flex items-center justify-center border-2 border-slate-300 dark:border-[#1e3356] text-slate-400 dark:text-slate-500 text-xs font-bold">
              {s}
            </div>
          )}
          {i < steps.length - 1 && (
            <div className={`w-6 h-0.5 ${s < current ? "bg-[#2563eb] dark:bg-[#3b82f6]" : "bg-slate-200 dark:bg-[#1e3356]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

const STEP_LABELS = ["About You", "Experience", "Education & Skills", "Cover Letter"];

// ── JobDetail ─────────────────────────────────────────────────────────────

export default function JobDetail({ jobId }: { jobId: string }) {
  const { user, mounted } = useAuth();
  const [job, setJob] = useState<Job | null | "not-found">(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [profileExists, setProfileExists] = useState<boolean | null>(null);

  const [step, setStep] = useState(1);

  // Step 1
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [summary, setSummary] = useState("");

  // Saved profile resume
  const [savedResumeUrl, setSavedResumeUrl] = useState<string | null>(null);
  const [savedResumeName, setSavedResumeName] = useState<string | null>(null);

  // Step 2
  const [experience, setExperience] = useState<WorkExperience[]>([
    { role: "", company: "", duration: "", description: "" },
  ]);
  const [noExperience, setNoExperience] = useState(false);

  // Step 3
  const [education, setEducation] = useState<Education[]>([
    { degree: "", institution: "", year: "" },
  ]);
  const [skillsInput, setSkillsInput] = useState<string>("");

  // Step 4
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    const supabase = createClient();

    supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single()
      .then(({ data }) => {
        setJob(data ? mapJob(data) : "not-found");
      });

    if (user?.role === "seeker") {
      supabase
        .from("applications")
        .select("id")
        .eq("job_id", jobId)
        .eq("seeker_id", user.id)
        .single()
        .then(({ data }) => {
          if (data) { setHasApplied(true); setSubmitted(true); }
        });

      // Pre-fill from seeker profile
      supabase
        .from("seeker_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          setProfileExists(!!data);
          if (data) {
            if (data.phone) setPhone(data.phone);
            if (data.location) setLocation(data.location);
            if (data.summary) setSummary(data.summary);
            if (data.skills?.length > 0) setSkillsInput(data.skills.join(", "));
            if (data.education?.length > 0) setEducation(data.education as Education[]);
            if (data.experience?.length > 0) setExperience(data.experience as WorkExperience[]);
            if (data.resume_url && data.resume_name) {
              setSavedResumeUrl(data.resume_url);
              setSavedResumeName(data.resume_name);
            }
          }
        });
    }
  }, [mounted, user, jobId]);

  // ── File handler ────────────────────────────────────────────────────────

  function handleFile(file: File | null) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setErrors((e) => ({ ...e, resume: "Please upload a PDF file" }));
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setErrors((e) => ({ ...e, resume: "File must be smaller than 4 MB" }));
      return;
    }
    setErrors((e) => { const n = { ...e }; delete n.resume; return n; });
    setResume(file);
  }

  // ── Step validation ──────────────────────────────────────────────────────

  function validateStep1(): boolean {
    const errs: Record<string, string> = {};
    if (!phone.trim()) errs.phone = "Phone is required";
    if (!location.trim()) errs.location = "City / Region is required";
    if (summary.trim().length < 20) errs.summary = "Summary must be at least 20 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep2(): boolean {
    if (noExperience) return true;
    const errs: Record<string, string> = {};
    if (!experience[0]?.role.trim() || !experience[0]?.company.trim()) {
      errs.exp0 = "At least one role with Job Title and Company is required (or check \"No experience yet\")";
    }
    experience.forEach((exp, i) => {
      if (i === 0) return;
      if (exp.role.trim() || exp.company.trim()) {
        if (!exp.role.trim()) errs[`exp${i}role`] = "Job Title is required";
        if (!exp.company.trim()) errs[`exp${i}company`] = "Company is required";
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep3(): boolean {
    const errs: Record<string, string> = {};
    if (!education[0]?.degree.trim()) errs.degree = "Degree / Qualification is required";
    if (!education[0]?.institution.trim()) errs.institution = "Institution is required";
    if (!skillsInput.trim()) errs.skills = "Skills are required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep4(): boolean {
    const errs: Record<string, string> = {};
    if (coverLetter.trim().length < 20) errs.coverLetter = "Cover letter must be at least 20 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Navigation ───────────────────────────────────────────────────────────

  function handleNext() {
    const valid =
      step === 1 ? validateStep1() :
      step === 2 ? validateStep2() :
      step === 3 ? validateStep3() : true;
    if (valid) setStep((s) => s + 1);
  }

  function handleBack() {
    setErrors({});
    setStep((s) => s - 1);
  }

  // ── Submit ───────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep4()) return;
    if (!user || job === null || job === "not-found") return;

    setSubmitting(true);
    const supabase = createClient();

    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const filteredExperience = noExperience
      ? []
      : experience.filter((e) => e.role.trim() && e.company.trim());

    let resumeUrl: string | undefined;
    let resumeName: string | undefined;

    // Upload new resume or use saved one
    if (resume) {
      const path = `${user.id}/${Date.now()}_${resume.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(path, resume, { upsert: true });
      if (uploadError) {
        setErrors({ resume: "Failed to upload resume: " + uploadError.message });
        setSubmitting(false);
        return;
      }
      resumeUrl = uploadData.path;
      resumeName = resume.name;
    } else if (savedResumeUrl && savedResumeName) {
      resumeUrl = savedResumeUrl;
      resumeName = savedResumeName;
    }

    const application: Omit<Application, "id"> & { id: string } = {
      id: crypto.randomUUID(),
      jobId: (job as Job).id,
      employerId: (job as Job).employerId,
      seekerId: user.id,
      seekerName: user.name,
      seekerEmail: user.email,
      phone: phone.trim(),
      location: location.trim(),
      summary: summary.trim(),
      experience: filteredExperience,
      education: education.filter((e) => e.degree.trim() && e.institution.trim()),
      skills,
      coverLetter: coverLetter.trim(),
      resumeName,
      resumeUrl,
      appliedAt: new Date().toISOString(),
      status: "pending",
    };

    const { error } = await supabase.from("applications").insert({
      id: application.id,
      job_id: application.jobId,
      employer_id: application.employerId,
      seeker_id: application.seekerId,
      seeker_name: application.seekerName,
      seeker_email: application.seekerEmail,
      phone: application.phone,
      location: application.location,
      summary: application.summary,
      experience: application.experience,
      education: application.education,
      skills: application.skills,
      cover_letter: application.coverLetter,
      resume_name: application.resumeName,
      resume_url: application.resumeUrl,
      applied_at: application.appliedAt,
      status: application.status,
    });

    setSubmitting(false);
    if (!error) {
      setSubmitted(true);
      setHasApplied(true);
    }
  }

  // ── Guards ──────────────────────────────────────────────────────────────

  if (!mounted || job === null) {
    return (
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div className="bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] p-8 flex flex-col gap-5">
          <div className="h-7 w-2/3 bg-slate-200 dark:bg-[#1e3356] rounded animate-pulse" />
          <div className="flex gap-3">
            <div className="h-5 w-24 bg-slate-100 dark:bg-[#152237] rounded-full animate-pulse" />
            <div className="h-5 w-20 bg-slate-100 dark:bg-[#152237] rounded-full animate-pulse" />
            <div className="h-5 w-28 bg-slate-100 dark:bg-[#152237] rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-slate-100 dark:bg-[#152237] rounded animate-pulse" style={{ width: `${85 - i * 5}%` }} />
            ))}
          </div>
          <div className="h-4 w-full bg-slate-100 dark:bg-[#152237] rounded animate-pulse mt-2" />
          <div className="h-4 w-5/6 bg-slate-100 dark:bg-[#152237] rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-slate-100 dark:bg-[#152237] rounded animate-pulse" />
        </div>
        <div className="bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] p-8 flex flex-col gap-4">
          <div className="h-6 w-1/2 bg-slate-200 dark:bg-[#1e3356] rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-slate-100 dark:bg-[#152237] rounded animate-pulse" />
          <div className="h-10 bg-slate-100 dark:bg-[#152237] rounded-xl animate-pulse mt-2" />
          <div className="h-10 bg-slate-100 dark:bg-[#152237] rounded-xl animate-pulse" />
          <div className="h-12 bg-slate-200 dark:bg-[#1e3356] rounded-full animate-pulse mt-2" />
        </div>
      </div>
    );
  }

  if (job === "not-found") {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div
          className="bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none p-12"
          style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}
        >
          <Briefcase className="mx-auto mb-4 w-10 h-10 text-[#2563eb] dark:text-[#60a5fa] opacity-40" />
          <h2 className="text-xl font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-2">
            Job Not Found
          </h2>
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-6">
            This listing may have been removed or the link is incorrect.
          </p>
          <a
            href="/jobs"
            className="inline-block px-8 py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
          >
            Browse All Jobs
          </a>
        </div>
      </div>
    );
  }

  // job is now guaranteed to be a Job (not null/"not-found")

  // ── Right panel content ─────────────────────────────────────────────────

  function RightPanel() {
    const j = job as Job;
    // Employer view — show listing status + external link if set
    if (user?.role === "employer") {
      return (
        <div className="text-center py-6">
          <Briefcase className="mx-auto mb-3 w-8 h-8 text-[#2563eb] dark:text-[#60a5fa] opacity-60" />
          <p className="text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-1">
            This listing is live
          </p>
          <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
            Job seekers can view and apply to this posting.
          </p>
          {j.applyUrl && (
            <a
              href={j.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#2563eb] dark:text-[#60a5fa] hover:underline"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View external apply link
            </a>
          )}
        </div>
      );
    }

    // External apply link — anyone (logged in or not) goes directly to the external URL
    if (j.applyUrl) {
      return (
        <div className="text-center py-6">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-blue-50 dark:bg-[#152237] flex items-center justify-center">
            <svg className="w-6 h-6 text-[#2563eb] dark:text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-1">
            Apply via external portal
          </p>
          <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mb-5 leading-relaxed">
            This employer manages applications through their own platform.
          </p>
          <a
            href={j.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 text-sm font-semibold text-center text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
          >
            Apply Now →
          </a>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="text-center py-6">
          <p className="text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-1">
            Ready to apply?
          </p>
          <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mb-5">
            Log in or create an account to submit your application.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="/login"
              className="block w-full py-2.5 text-sm font-semibold text-center text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors"
            >
              Log In
            </a>
            <a
              href="/signup"
              className="block w-full py-2.5 text-sm font-semibold text-center text-[#2563eb] dark:text-[#60a5fa] border border-[#2563eb] dark:border-[#3b82f6] rounded-full hover:bg-[#eff6ff] dark:hover:bg-[#152237] transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>
      );
    }

    if (user.role === "seeker" && profileExists === false) {
      return (
        <div className="text-center py-6">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-2">
            Create your profile first
          </p>
          <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mb-5 leading-relaxed">
            Set up your profile once and it will autofill every application you submit.
          </p>
          <a
            href="/profile"
            className="block w-full py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
          >
            Create Profile →
          </a>
        </div>
      );
    }

    if (submitted || hasApplied) {
      return (
        <div className="text-center py-6">
          <CheckCircle className="mx-auto mb-3 w-10 h-10 text-emerald-500" />
          <h3 className="text-base font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-1">
            Application Submitted!
          </h3>
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-5">
            The employer will be in touch if your profile is a good fit.
          </p>
          <a
            href="/dashboard"
            className="block w-full py-2.5 text-sm font-semibold text-center text-[#2563eb] dark:text-[#60a5fa] border border-[#2563eb] dark:border-[#3b82f6] rounded-full hover:bg-[#eff6ff] dark:hover:bg-[#152237] transition-colors"
          >
            View My Applications →
          </a>
        </div>
      );
    }

    const label = "text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]";
    const errMsg = "text-xs text-red-500 dark:text-red-400";

    return (
      <div>
        <h3 className="text-base font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-0.5">
          Apply for this role
        </h3>
        <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mb-4">
          Step {step} of 4 — {STEP_LABELS[step - 1]}
        </p>

        <StepIndicator current={step} />

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

          {/* ── Step 1: About You ── */}
          {step === 1 && (
            <>
              <div className="flex flex-col gap-1">
                <span className={label}>Applying as</span>
                <span className="text-sm text-[#64748b] dark:text-[#94a3b8] px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0a1628] border border-slate-200 dark:border-[#1e3356]">
                  {user.name}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={label}>Phone <span className="text-red-400">*</span></label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrors((err) => { const n = { ...err }; delete n.phone; return n; }); }}
                  placeholder="e.g. +64 21 123 4567"
                  className={inputClass(errors.phone)}
                />
                {errors.phone && <p className={errMsg}>{errors.phone}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={label}>City / Region <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setErrors((err) => { const n = { ...err }; delete n.location; return n; }); }}
                  placeholder="e.g. Auckland, Wellington"
                  className={inputClass(errors.location)}
                />
                {errors.location && <p className={errMsg}>{errors.location}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={label}>Professional Summary <span className="text-red-400">*</span></label>
                <textarea
                  value={summary}
                  onChange={(e) => { setSummary(e.target.value); setErrors((err) => { const n = { ...err }; delete n.summary; return n; }); }}
                  placeholder="Brief overview of your background and what you bring…"
                  rows={3}
                  className={`${inputClass(errors.summary)} resize-y`}
                />
                {errors.summary && <p className={errMsg}>{errors.summary}</p>}
              </div>
            </>
          )}

          {/* ── Step 2: Experience ── */}
          {step === 2 && (
            <>
              <label className="flex items-center gap-2 text-sm text-[#0f172a] dark:text-[#f1f5f9] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={noExperience}
                  onChange={(e) => { setNoExperience(e.target.checked); setErrors({}); }}
                  className="rounded accent-[#2563eb]"
                />
                No experience yet
              </label>

              {!noExperience && (
                <>
                  {experience.map((exp, i) => (
                    <div key={i} className="flex flex-col gap-2 p-3 rounded-xl border border-slate-200 dark:border-[#1e3356] bg-slate-50 dark:bg-[#0a1628]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">
                          Role {i + 1}
                        </span>
                        {i > 0 && (
                          <button
                            type="button"
                            onClick={() => setExperience((prev) => prev.filter((_, idx) => idx !== i))}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className={label}>Job Title <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[i] = { ...updated[i], role: e.target.value };
                            setExperience(updated);
                            setErrors((err) => { const n = { ...err }; delete n[`exp${i}role`]; delete n.exp0; return n; });
                          }}
                          placeholder="e.g. Marketing Manager"
                          className={inputClass(errors[`exp${i}role`] || (i === 0 ? errors.exp0 : undefined))}
                        />
                        {i === 0 && errors.exp0 && <p className={errMsg}>{errors.exp0}</p>}
                        {i > 0 && errors[`exp${i}role`] && <p className={errMsg}>{errors[`exp${i}role`]}</p>}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className={label}>Company <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[i] = { ...updated[i], company: e.target.value };
                            setExperience(updated);
                            setErrors((err) => { const n = { ...err }; delete n[`exp${i}company`]; delete n.exp0; return n; });
                          }}
                          placeholder="e.g. Acme Corp"
                          className={inputClass(errors[`exp${i}company`])}
                        />
                        {i > 0 && errors[`exp${i}company`] && <p className={errMsg}>{errors[`exp${i}company`]}</p>}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className={label}>Duration</label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[i] = { ...updated[i], duration: e.target.value };
                            setExperience(updated);
                          }}
                          placeholder="e.g. Jan 2021 – Mar 2023"
                          className={inputClass()}
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className={label}>Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[i] = { ...updated[i], description: e.target.value };
                            setExperience(updated);
                          }}
                          placeholder="Key responsibilities and achievements…"
                          rows={2}
                          className={`${inputClass()} resize-y`}
                        />
                      </div>
                    </div>
                  ))}

                  {experience.length < 3 && (
                    <button
                      type="button"
                      onClick={() =>
                        setExperience((prev) => [
                          ...prev,
                          { role: "", company: "", duration: "", description: "" },
                        ])
                      }
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#2563eb] dark:text-[#60a5fa] hover:underline self-start"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add another role
                    </button>
                  )}
                </>
              )}
            </>
          )}

          {/* ── Step 3: Education & Skills ── */}
          {step === 3 && (
            <>
              <div className="flex flex-col gap-2 p-3 rounded-xl border border-slate-200 dark:border-[#1e3356] bg-slate-50 dark:bg-[#0a1628]">
                <div className="flex flex-col gap-1.5">
                  <label className={label}>Degree / Qualification <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={education[0]?.degree ?? ""}
                    onChange={(e) => {
                      setEducation([{ ...education[0], degree: e.target.value }]);
                      setErrors((err) => { const n = { ...err }; delete n.degree; return n; });
                    }}
                    placeholder="e.g. Bachelor of Commerce"
                    className={inputClass(errors.degree)}
                  />
                  {errors.degree && <p className={errMsg}>{errors.degree}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={label}>Institution <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={education[0]?.institution ?? ""}
                    onChange={(e) => {
                      setEducation([{ ...education[0], institution: e.target.value }]);
                      setErrors((err) => { const n = { ...err }; delete n.institution; return n; });
                    }}
                    placeholder="e.g. University of Auckland"
                    className={inputClass(errors.institution)}
                  />
                  {errors.institution && <p className={errMsg}>{errors.institution}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={label}>Year Completed</label>
                  <input
                    type="text"
                    value={education[0]?.year ?? ""}
                    onChange={(e) => setEducation([{ ...education[0], year: e.target.value }])}
                    placeholder="e.g. 2022"
                    className={inputClass()}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={label}>Skills <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => {
                    setSkillsInput(e.target.value);
                    setErrors((err) => { const n = { ...err }; delete n.skills; return n; });
                  }}
                  placeholder="e.g. JavaScript, Project Management, Adobe XD"
                  className={inputClass(errors.skills)}
                />
                {errors.skills && <p className={errMsg}>{errors.skills}</p>}
                <p className="text-xs text-[#94a3b8]">Separate skills with commas</p>
              </div>
            </>
          )}

          {/* ── Step 4: Cover Letter ── */}
          {step === 4 && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className={label}>Cover Letter <span className="text-red-400">*</span></label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => {
                    setCoverLetter(e.target.value);
                    setErrors((err) => { const n = { ...err }; delete n.coverLetter; return n; });
                  }}
                  placeholder="Tell the employer why you're a great fit for this role…"
                  rows={6}
                  className={`${inputClass(errors.coverLetter)} resize-y`}
                />
                {errors.coverLetter && <p className={errMsg}>{errors.coverLetter}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={label}>Attach CV <span className="text-xs text-[#94a3b8] font-normal">(optional, PDF)</span></label>
                {savedResumeName && !resume && (
                  <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mb-1">
                    Previously uploaded: <span className="font-medium text-[#0f172a] dark:text-[#f1f5f9]">{savedResumeName}</span>
                  </p>
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  className="text-sm text-[#64748b] dark:text-[#94a3b8] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#eff6ff] dark:file:bg-[#152237] file:text-[#2563eb] dark:file:text-[#60a5fa] hover:file:bg-blue-100 dark:hover:file:bg-[#1e3356] transition"
                />
                {resume && !errors.resume && (
                  <p className="text-xs text-emerald-500 dark:text-emerald-400">{resume.name} ready to upload</p>
                )}
                {errors.resume && <p className={errMsg}>{errors.resume}</p>}
              </div>
            </>
          )}

          {/* ── Navigation buttons ── */}
          <div className="flex gap-3 mt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-2.5 text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9] border border-slate-200 dark:border-[#1e3356] rounded-full hover:bg-slate-50 dark:hover:bg-[#152237] transition-colors"
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting…" : "Submit Application"}
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto" style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}>
      {/* Back link */}
      <a
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#64748b] dark:text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Browse Jobs
      </a>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

        {/* ── Left: Job details ── */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Header card */}
          <div className="bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none p-8">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h1 className="text-2xl font-bold text-[#0f172a] dark:text-[#f1f5f9] tracking-tight">
                {job.title}
              </h1>
              <span className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#eff6ff] dark:bg-[#152237] text-[#2563eb] dark:text-[#60a5fa]">
                {job.type}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#64748b] dark:text-[#94a3b8]">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa] shrink-0" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa] shrink-0" />
                <span>{job.location}</span>
              </div>
              {job.salary && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa] shrink-0" />
                  <span>{job.salary}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description card */}
          <div className="bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none p-8">
            <h2 className="text-base font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-4">
              About This Role
            </h2>
            <p className="text-sm text-[#0f172a] dark:text-[#cbd5e1] leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>

            {job.requirements && (
              <>
                <h2 className="text-base font-semibold text-[#0f172a] dark:text-[#f1f5f9] mt-8 mb-4">
                  Requirements
                </h2>
                <p className="text-sm text-[#0f172a] dark:text-[#cbd5e1] leading-relaxed whitespace-pre-wrap">
                  {job.requirements}
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── Right: Application panel ── */}
        <div className="lg:col-span-2 lg:sticky lg:top-24">
          <div className="bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none p-8">
            {RightPanel()}
          </div>
        </div>

      </div>
    </div>
  );
}
