"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase";
import AvatarUpload from "@/components/shared/AvatarUpload";
// Dynamically imported inside handlers — pdfjs-dist uses browser-only APIs (DOMMatrix)
// and must never be evaluated server-side
import type { WorkExperience, Education } from "@/types";
import type { ParseResumeResult } from "@/app/api/parse-resume/route";

function inputClass(error?: string) {
  const base =
    "w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-[#080e1c] text-[#0f172a] dark:text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 transition";
  return error
    ? `${base} border-red-400 dark:border-red-500 focus:ring-red-400`
    : `${base} border-slate-200 dark:border-[#1e3356] focus:ring-[#2563eb] dark:focus:ring-[#3b82f6]`;
}

export default function ProfileEditor() {
  const { user, mounted, updateAvatar } = useAuth();
  const router = useRouter();

  const [profileDraft, setProfileDraft] = useState({
    phone: "",
    location: "",
    summary: "",
    skills: [] as string[],
    experience: [] as WorkExperience[],
    education: [] as Education[],
    resumeName: "",
    resumeUrl: "",
  });
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanBanner, setScanBanner] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [dragging, setDragging] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth guard + load profile
  useEffect(() => {
    if (!mounted) return;
    if (!user || user.role !== "seeker") {
      router.push("/login");
      return;
    }
    const supabase = createClient();
    supabase
      .from("seeker_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProfileDraft({
            phone: data.phone ?? "",
            location: data.location ?? "",
            summary: data.summary ?? "",
            skills: data.skills ?? [],
            experience: (data.experience as WorkExperience[]) ?? [],
            education: (data.education as Education[]) ?? [],
            resumeName: data.resume_name ?? "",
            resumeUrl: data.resume_url ?? "",
          });
        }
      });
  }, [mounted, user, router]);

  async function handleResumeFile(file: File | null) {
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
    setProfileDraft((d) => ({ ...d, resumeName: file.name }));
  }

  async function handleScanResume() {
    if (!resumeFile) return;
    setScanning(true);
    setScanBanner(null);
    try {
      const { extractPdfText, extractProfileFields } = await import("@/lib/parseResume");
      const text = await extractPdfText(resumeFile);

      let aiFields: ParseResumeResult | null = null;
      try {
        const res = await fetch("/api/parse-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (res.ok) aiFields = (await res.json()) as ParseResumeResult;
      } catch { /* network error — fall through */ }

      const hasUsefulData = aiFields && (
        aiFields.phone || aiFields.location || aiFields.summary ||
        aiFields.skills.length > 0 || aiFields.experience.length > 0
      );
      const fields: ParseResumeResult = hasUsefulData
        ? aiFields!
        : { ...extractProfileFields(text), summary: "", experience: [], education: [] };

      let filled = 0;
      setProfileDraft((d) => {
        const next = { ...d };
        if (fields.phone && !d.phone) { next.phone = fields.phone; filled++; }
        if (fields.location && !d.location) { next.location = fields.location; filled++; }
        if (fields.summary && !d.summary) { next.summary = fields.summary; filled++; }
        const newSkills = fields.skills.filter((s) => !d.skills.includes(s));
        if (newSkills.length) { next.skills = [...d.skills, ...newSkills]; filled += newSkills.length; }
        if (fields.experience.length > 0 && d.experience.length === 0) {
          next.experience = fields.experience;
          filled += fields.experience.length;
        }
        if (fields.education && fields.education.length > 0 && d.education.length === 0) {
          next.education = fields.education;
          filled += fields.education.length;
        }
        return next;
      });

      setScanBanner(filled > 0
        ? `Filled in ${filled} field${filled === 1 ? "" : "s"} from your resume`
        : "No new fields found in resume"
      );
      setTimeout(() => setScanBanner(null), 4000);
    } catch { /* silent fail */ } finally {
      setScanning(false);
    }
  }

  function addExperience() {
    setProfileDraft((d) => ({
      ...d,
      experience: [...d.experience, { role: "", company: "", duration: "", description: "" }],
    }));
  }

  function removeExperience(index: number) {
    setProfileDraft((d) => ({
      ...d,
      experience: d.experience.filter((_, i) => i !== index),
    }));
  }

  function updateExperience(index: number, field: keyof WorkExperience, value: string) {
    setProfileDraft((d) => ({
      ...d,
      experience: d.experience.map((exp, i) => i === index ? { ...exp, [field]: value } : exp),
    }));
  }

  function addEducation() {
    setProfileDraft((d) => ({
      ...d,
      education: [...d.education, { degree: "", institution: "", year: "" }],
    }));
  }

  function removeEducation(index: number) {
    setProfileDraft((d) => ({
      ...d,
      education: d.education.filter((_, i) => i !== index),
    }));
  }

  function updateEducation(index: number, field: keyof Education, value: string) {
    setProfileDraft((d) => ({
      ...d,
      education: d.education.map((edu, i) => i === index ? { ...edu, [field]: value } : edu),
    }));
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

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    setSaveError(null);
    const supabase = createClient();
    let resumeUrl = profileDraft.resumeUrl;

    if (resumeFile) {
      const path = `${user.id}/${Date.now()}_${resumeFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(path, resumeFile, { upsert: true });
      if (uploadError) {
        setSaveError("Failed to upload resume: " + uploadError.message);
        setSaving(false);
        return;
      }
      resumeUrl = uploadData.path;
    }

    const { error } = await supabase.from("seeker_profiles").upsert({
      user_id: user.id,
      phone: profileDraft.phone,
      location: profileDraft.location,
      summary: profileDraft.summary,
      skills: profileDraft.skills,
      experience: profileDraft.experience,
      education: profileDraft.education,
      resume_name: resumeFile ? resumeFile.name : profileDraft.resumeName,
      resume_url: resumeUrl,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);

    if (error) {
      setSaveError("Failed to save profile. Please try again.");
      return;
    }

    if (resumeFile && resumeUrl !== profileDraft.resumeUrl) {
      setProfileDraft((d) => ({ ...d, resumeUrl }));
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function downloadResume() {
    if (!profileDraft.resumeUrl) return;
    const supabase = createClient();
    const { data } = await supabase.storage
      .from("resumes")
      .createSignedUrl(profileDraft.resumeUrl, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  // Profile completeness (out of 6)
  const completenessFields = [
    !!profileDraft.phone,
    !!profileDraft.location,
    !!profileDraft.summary,
    profileDraft.skills.length > 0,
    profileDraft.experience.length > 0,
    profileDraft.education.length > 0,
    !!(profileDraft.resumeUrl || resumeFile),
  ];
  const completeness = completenessFields.filter(Boolean).length;
  const pct = Math.round((completeness / 7) * 100);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto w-full">
        <div className="h-8 w-8 bg-slate-200 dark:bg-[#1e3356] rounded-full mb-6 animate-pulse" />
        <div className="rounded-2xl bg-white dark:bg-[#0e1a2e] border border-blue-100 dark:border-[#1e3356] p-8 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-[#1e3356] animate-pulse shrink-0" />
            <div className="flex-1">
              <div className="h-6 w-40 bg-slate-200 dark:bg-[#1e3356] rounded mb-2 animate-pulse" />
              <div className="h-4 w-32 bg-slate-100 dark:bg-[#152237] rounded animate-pulse" />
            </div>
          </div>
          <div className="mt-5 h-2 rounded-full bg-slate-100 dark:bg-[#152237] animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-white dark:bg-[#0e1a2e] border border-blue-100 dark:border-[#1e3356] p-6 flex flex-col gap-3">
              <div className="h-5 w-24 bg-slate-200 dark:bg-[#1e3356] rounded animate-pulse" />
              <div className="h-10 bg-slate-100 dark:bg-[#152237] rounded-xl animate-pulse" />
              <div className="h-10 bg-slate-100 dark:bg-[#152237] rounded-xl animate-pulse" />
            </div>
            <div className="rounded-2xl bg-white dark:bg-[#0e1a2e] border border-blue-100 dark:border-[#1e3356] p-6 flex flex-col gap-3">
              <div className="h-5 w-16 bg-slate-200 dark:bg-[#1e3356] rounded animate-pulse" />
              <div className="h-24 bg-slate-100 dark:bg-[#152237] rounded-xl animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white dark:bg-[#0e1a2e] border border-blue-100 dark:border-[#1e3356] p-6 flex flex-col gap-3">
                <div className="h-5 w-28 bg-slate-200 dark:bg-[#1e3356] rounded animate-pulse" />
                <div className="h-10 bg-slate-100 dark:bg-[#152237] rounded-xl animate-pulse" />
                <div className="h-10 bg-slate-100 dark:bg-[#152237] rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060d1a] py-10 px-4">
      <div className="w-full max-w-4xl mx-auto" style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}>

        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#64748b] dark:text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* ── Hero card ─────────────────────────────────────────── */}
        <div className="rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#1e40af] p-6 sm:p-8 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">

            {/* Avatar + identity */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex-shrink-0">
                {user && (
                  <AvatarUpload
                    userId={user.id}
                    name={user.name}
                    currentUrl={user.avatarUrl}
                    onUpdate={updateAvatar}
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-white truncate">{user?.name}</p>
                <p className="text-sm text-blue-100 truncate">{user?.email}</p>
                <span className="mt-1 inline-block text-xs font-semibold text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full">
                  Job Seeker
                </span>
              </div>
            </div>

            {/* Completeness + save */}
            <div className="flex flex-col gap-3 sm:items-end sm:min-w-[200px]">
              <div className="w-full sm:w-48">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-blue-100">Profile complete</span>
                  <span className="text-xs font-bold text-white">{pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/20">
                  <div
                    className="h-2 rounded-full bg-white transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {saveError && (
                  <p className="text-xs text-red-400">{saveError}</p>
                )}
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={saving}
                  className={`w-full sm:w-auto px-6 py-2.5 text-sm font-semibold rounded-full transition-colors shadow-sm disabled:opacity-60 ${
                    saved
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-[#1e40af] bg-white hover:bg-blue-50"
                  }`}
                >
                  {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Two-column grid ───────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Contact Info card */}
            <div className="rounded-2xl bg-white dark:bg-[#0e1a2e] border border-blue-100 dark:border-[#1e3356] shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h2 className="text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9] uppercase tracking-wide">
                  Contact Info
                </h2>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#64748b] dark:text-[#94a3b8] flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profileDraft.phone}
                    onChange={(e) => setProfileDraft((d) => ({ ...d, phone: e.target.value }))}
                    placeholder="e.g. +64 21 123 4567"
                    className={inputClass()}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#64748b] dark:text-[#94a3b8] flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileDraft.location}
                    onChange={(e) => setProfileDraft((d) => ({ ...d, location: e.target.value }))}
                    placeholder="e.g. Auckland, Wellington"
                    className={inputClass()}
                  />
                </div>
              </div>
            </div>

            {/* Resume card */}
            <div className="rounded-2xl bg-white dark:bg-[#0e1a2e] border border-blue-100 dark:border-[#1e3356] shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9] uppercase tracking-wide">
                  Resume
                </h2>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  handleResumeFile(e.dataTransfer.files?.[0] ?? null);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed cursor-pointer transition ${
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
                    <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-semibold text-emerald-500 dark:text-emerald-400 text-center break-all">{resumeFile.name}</p>
                    <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">Click to replace</p>
                  </>
                ) : profileDraft.resumeName ? (
                  <>
                    <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-semibold text-emerald-500 dark:text-emerald-400 text-center break-all">{profileDraft.resumeName}</p>
                    <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">Click to replace</p>
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <p className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">Drop your resume here</p>
                    <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">PDF only · max 4 MB · click to browse</p>
                  </>
                )}
              </div>

              {scanError && (
                <p className="mt-3 text-xs text-red-500 dark:text-red-400">{scanError}</p>
              )}

              {resumeFile && (
                <button
                  type="button"
                  onClick={handleScanResume}
                  disabled={scanning}
                  className="mt-3 w-full py-2.5 text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] border border-[#2563eb] dark:border-[#3b82f6] rounded-full hover:bg-[#eff6ff] dark:hover:bg-[#152237] transition-colors disabled:opacity-60"
                >
                  {scanning ? "Scanning…" : "Scan Resume"}
                </button>
              )}

              {scanBanner && (
                <p className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">{scanBanner}</p>
              )}

              {/* Download button — only when resume is saved in storage */}
              {profileDraft.resumeUrl && !resumeFile && (
                <button
                  type="button"
                  onClick={downloadResume}
                  className="mt-3 w-full py-2.5 text-sm font-medium text-[#64748b] dark:text-[#94a3b8] border border-slate-200 dark:border-[#1e3356] rounded-full hover:border-[#2563eb] dark:hover:border-[#3b82f6] hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Resume
                </button>
              )}
            </div>
          </div>

          {/* ── Main content ─────────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Summary card */}
            <div className="rounded-2xl bg-white dark:bg-[#0e1a2e] border border-blue-100 dark:border-[#1e3356] shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <h2 className="text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9] uppercase tracking-wide">
                  Professional Summary
                </h2>
              </div>
              <textarea
                value={profileDraft.summary}
                onChange={(e) => setProfileDraft((d) => ({ ...d, summary: e.target.value }))}
                placeholder="Brief overview of your background and what you bring to the table…"
                rows={5}
                className={`${inputClass()} resize-y`}
              />
            </div>

            {/* Skills card */}
            <div className="rounded-2xl bg-white dark:bg-[#0e1a2e] border border-blue-100 dark:border-[#1e3356] shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h2 className="text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9] uppercase tracking-wide">
                  Skills
                </h2>
              </div>

              {profileDraft.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileDraft.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-[#eff6ff] dark:bg-[#152237] text-[#2563eb] dark:text-[#60a5fa]"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-0.5 text-[#2563eb] dark:text-[#60a5fa] hover:text-[#1d4ed8] dark:hover:text-white leading-none"
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

            {/* Experience card */}
            <div className="rounded-2xl bg-white dark:bg-[#0e1a2e] border border-blue-100 dark:border-[#1e3356] shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h2 className="text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9] uppercase tracking-wide">
                    Experience
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addExperience}
                  className="text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] hover:underline flex items-center gap-1"
                >
                  <span className="text-base leading-none">+</span> Add
                </button>
              </div>

              {profileDraft.experience.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                  <svg className="w-10 h-10 text-slate-200 dark:text-[#1e3356]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">No experience entries yet.</p>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] hover:underline"
                  >
                    + Add your first role
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {profileDraft.experience.map((exp, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-200 dark:border-[#1e3356] bg-[#f8fafc] dark:bg-[#080e1c] p-4 flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2563eb] dark:text-[#60a5fa] uppercase tracking-wide">
                          {exp.role || `Experience ${i + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeExperience(i)}
                          className="text-sm text-[#94a3b8] hover:text-red-500 dark:hover:text-red-400 leading-none transition-colors"
                          aria-label="Remove experience"
                        >
                          ×
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs text-[#64748b] dark:text-[#94a3b8]">Role</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => updateExperience(i, "role", e.target.value)}
                            placeholder="e.g. Software Engineer"
                            className={inputClass()}
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs text-[#64748b] dark:text-[#94a3b8]">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(i, "company", e.target.value)}
                            placeholder="e.g. Acme Corp"
                            className={inputClass()}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-[#64748b] dark:text-[#94a3b8]">Duration</label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => updateExperience(i, "duration", e.target.value)}
                          placeholder="e.g. Jan 2021 – Mar 2023"
                          className={inputClass()}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-[#64748b] dark:text-[#94a3b8]">Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(i, "description", e.target.value)}
                          placeholder="Key responsibilities and achievements…"
                          rows={3}
                          className={`${inputClass()} resize-y`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Education card */}
            <div className="rounded-2xl bg-white dark:bg-[#0e1a2e] border border-blue-100 dark:border-[#1e3356] shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  <h2 className="text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9] uppercase tracking-wide">
                    Education
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addEducation}
                  className="text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] hover:underline flex items-center gap-1"
                >
                  <span className="text-base leading-none">+</span> Add
                </button>
              </div>

              {profileDraft.education.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                  <svg className="w-10 h-10 text-slate-200 dark:text-[#1e3356]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">No education entries yet.</p>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] hover:underline"
                  >
                    + Add your education
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {profileDraft.education.map((edu, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-200 dark:border-[#1e3356] bg-[#f8fafc] dark:bg-[#080e1c] p-4 flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2563eb] dark:text-[#60a5fa] uppercase tracking-wide">
                          {edu.degree || `Education ${i + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeEducation(i)}
                          className="text-sm text-[#94a3b8] hover:text-red-500 dark:hover:text-red-400 leading-none transition-colors"
                          aria-label="Remove education"
                        >
                          ×
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs text-[#64748b] dark:text-[#94a3b8]">Degree / Qualification</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(i, "degree", e.target.value)}
                            placeholder="e.g. Bachelor of Commerce"
                            className={inputClass()}
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs text-[#64748b] dark:text-[#94a3b8]">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => updateEducation(i, "institution", e.target.value)}
                            placeholder="e.g. University of Auckland"
                            className={inputClass()}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-[#64748b] dark:text-[#94a3b8]">Year Completed</label>
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => updateEducation(i, "year", e.target.value)}
                          placeholder="e.g. 2022"
                          className={inputClass()}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
