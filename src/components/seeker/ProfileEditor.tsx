"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { SeekerProfile, WorkExperience } from "@/types";

function inputClass(error?: string) {
  const base =
    "w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-[#080e1c] text-[#0f172a] dark:text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 transition";
  return error
    ? `${base} border-red-400 dark:border-red-500 focus:ring-red-400`
    : `${base} border-slate-200 dark:border-[#1e3356] focus:ring-[#2563eb] dark:focus:ring-[#3b82f6]`;
}

export default function ProfileEditor() {
  const { user, mounted } = useAuth();
  const router = useRouter();

  const [profileDraft, setProfileDraft] = useState({
    phone: "",
    location: "",
    summary: "",
    skills: [] as string[],
    experience: [] as WorkExperience[],
    resumeName: "",
    resumeData: "",
  });
  const [scanError, setScanError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [dragging, setDragging] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth guard + load profile
  useEffect(() => {
    if (!mounted) return;
    if (!user || user.role !== "seeker") {
      router.push("/login");
      return;
    }
    try {
      const stored: SeekerProfile[] = JSON.parse(
        localStorage.getItem("onpoint_profiles") ?? "[]"
      );
      const profile = stored.find((p) => p.userId === user.id);
      if (profile) {
        setProfileDraft({
          phone: profile.phone,
          location: profile.location,
          summary: profile.summary,
          skills: profile.skills,
          experience: profile.experience ?? [],
          resumeName: profile.resumeName,
          resumeData: profile.resumeData,
        });
      }
    } catch {
      // storage error — start with empty draft
    }
  }, [mounted, user, router]);

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
    if (!user) return;
    const profile: SeekerProfile = {
      userId: user.id,
      ...profileDraft,
      updatedAt: new Date().toISOString(),
    };
    try {
      const existing: SeekerProfile[] = JSON.parse(
        localStorage.getItem("onpoint_profiles") ?? "[]"
      );
      const others = existing.filter((p) => p.userId !== user.id);
      localStorage.setItem("onpoint_profiles", JSON.stringify([profile, ...others]));
    } catch {
      // storage error — proceed anyway
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  // Avatar initials
  const initials = user?.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") ?? "";

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060d1a] flex flex-col items-center py-12 px-4">
      <div
        className="w-full max-w-md bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none p-8"
        style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#2563eb] dark:bg-[#3b82f6] flex items-center justify-center text-white text-xl font-bold select-none">
            {initials}
          </div>
          <div>
            <p className="text-base font-semibold text-[#0f172a] dark:text-[#f1f5f9]">
              {user?.name}
            </p>
            <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">{user?.email}</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#0f172a] dark:text-[#f1f5f9] tracking-tight mb-1">
          Your Profile
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-6">
          Upload your resume for employers to download, and fill in your details below.
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
          ) : profileDraft.resumeData ? (
            <>
              <p className="text-sm font-semibold text-emerald-500 dark:text-emerald-400">
                {profileDraft.resumeName}
              </p>
              <div className="flex items-center gap-3">
                <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">Click to replace</p>
                <a
                  href={profileDraft.resumeData}
                  download={profileDraft.resumeName}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-medium text-[#2563eb] dark:text-[#60a5fa] hover:underline"
                >
                  Download
                </a>
              </div>
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
              rows={4}
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

        {/* Experience section */}
        <div className="mt-6 flex flex-col gap-3">
          <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">Experience</label>
          {profileDraft.experience.length === 0 ? (
            <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
              No experience entries yet. Upload a resume or add one manually.
            </p>
          ) : (
            profileDraft.experience.map((exp, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 dark:border-[#1e3356] bg-white dark:bg-[#080e1c] p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#2563eb] dark:text-[#60a5fa] uppercase tracking-wide">
                    Experience {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExperience(i)}
                    className="text-sm text-[#64748b] dark:text-[#94a3b8] hover:text-red-500 dark:hover:text-red-400 leading-none"
                    aria-label="Remove experience"
                  >
                    ×
                  </button>
                </div>
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
            ))
          )}
          <button
            type="button"
            onClick={addExperience}
            className="self-start text-sm font-medium text-[#2563eb] dark:text-[#60a5fa] hover:underline"
          >
            + Add Experience
          </button>
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={saveProfile}
          className="mt-6 w-full py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
        >
          {saved ? "Saved!" : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
