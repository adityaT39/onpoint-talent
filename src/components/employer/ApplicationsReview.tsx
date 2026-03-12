"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Building2, MapPin, DollarSign, Download, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Job, Application } from "@/types";

// ── Skill matching helper ─────────────────────────────────────────────────

function matchSkills(appSkills: string[], requiredSkills: string[]): number {
  if (!requiredSkills.length) return 0;
  const req = new Set(requiredSkills.map((s) => s.toLowerCase().trim()));
  return appSkills.filter((s) => req.has(s.toLowerCase().trim())).length;
}

// ── LockedSection ─────────────────────────────────────────────────────────

function LockedSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-lg overflow-hidden mt-3">
      <div className="blur-sm select-none pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <a
          href="/pricing"
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-[#0e1a2e] border border-[#2563eb] dark:border-[#3b82f6] text-[#2563eb] dark:text-[#60a5fa] shadow-sm hover:bg-[#eff6ff] dark:hover:bg-[#152237] transition-colors"
        >
          <Lock className="w-3 h-3" /> Unlock to view
        </a>
      </div>
    </div>
  );
}

// ── ApplicantCard ─────────────────────────────────────────────────────────

type ApplicantCardProps = {
  app: Application;
  isUnlocked: boolean;
  requiredSkills: string[];
  onStatusChange(appId: string, status: Application["status"]): void;
  onDownload(resumeData: string, resumeName: string): void;
};

function ApplicantCard({ app, isUnlocked, requiredSkills, onStatusChange, onDownload }: ApplicantCardProps) {
  const [showCoverLetter, setShowCoverLetter] = useState(false);

  return (
    <div className="bg-white dark:bg-[#0e1a2e] rounded-xl border border-blue-100 dark:border-[#1e3356] p-4">
      {/* Header — always visible */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9] truncate">
            {app.seekerName}
          </p>
          {app.location && (
            <p className="text-xs text-[#64748b] dark:text-[#94a3b8] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 shrink-0" />
              {app.location}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <p className="text-xs text-[#94a3b8]">
            {new Date(app.appliedAt).toLocaleDateString("en-NZ", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          {requiredSkills.length > 0 && (() => {
            const matched = matchSkills(app.skills ?? [], requiredSkills);
            const total = requiredSkills.length;
            const badgeClass = matched / total >= 0.5
              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
              : matched > 0
              ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
              : "bg-slate-100 dark:bg-[#152237] text-[#64748b] dark:text-[#94a3b8] border-slate-200 dark:border-[#1e3356]";
            return (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                {matched} / {total} skills
              </span>
            );
          })()}
        </div>
      </div>

      {/* Contact — locked */}
      {isUnlocked ? (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#64748b] dark:text-[#94a3b8]">
          <span>{app.seekerEmail}</span>
          {app.phone && <span>{app.phone}</span>}
        </div>
      ) : (
        <LockedSection>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#64748b] dark:text-[#94a3b8] py-1">
            <span>{app.seekerEmail}</span>
            {app.phone && <span>{app.phone}</span>}
          </div>
        </LockedSection>
      )}

      {/* Summary — locked */}
      {app.summary && (
        isUnlocked ? (
          <p className="mt-3 text-sm text-[#0f172a] dark:text-[#cbd5e1] leading-relaxed line-clamp-2">
            {app.summary}
          </p>
        ) : (
          <LockedSection>
            <p className="text-sm text-[#0f172a] dark:text-[#cbd5e1] leading-relaxed line-clamp-2">
              {app.summary}
            </p>
          </LockedSection>
        )
      )}

      {/* Experience — locked */}
      {app.experience && app.experience.length > 0 && (
        isUnlocked ? (
          <div className="mt-3">
            <p className="text-xs font-semibold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider mb-1.5">
              Experience
            </p>
            <ul className="flex flex-col gap-1">
              {app.experience.map((exp, i) => (
                <li key={i} className="text-xs text-[#0f172a] dark:text-[#cbd5e1]">
                  <span className="font-medium">{exp.role}</span>
                  {exp.company && <span className="text-[#64748b] dark:text-[#94a3b8]"> · {exp.company}</span>}
                  {exp.duration && <span className="text-[#94a3b8]"> · {exp.duration}</span>}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <LockedSection>
            <div>
              <p className="text-xs font-semibold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider mb-1.5">
                Experience
              </p>
              <ul className="flex flex-col gap-1">
                {app.experience.map((exp, i) => (
                  <li key={i} className="text-xs text-[#0f172a] dark:text-[#cbd5e1]">
                    <span className="font-medium">{exp.role}</span>
                    {exp.company && <span className="text-[#64748b] dark:text-[#94a3b8]"> · {exp.company}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </LockedSection>
        )
      )}

      {/* Education — locked */}
      {app.education && app.education.length > 0 && (
        isUnlocked ? (
          <div className="mt-3">
            <p className="text-xs font-semibold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider mb-1.5">
              Education
            </p>
            <ul className="flex flex-col gap-1">
              {app.education.map((edu, i) => (
                <li key={i} className="text-xs text-[#0f172a] dark:text-[#cbd5e1]">
                  <span className="font-medium">{edu.degree}</span>
                  {edu.institution && <span className="text-[#64748b] dark:text-[#94a3b8]"> · {edu.institution}</span>}
                  {edu.year && <span className="text-[#94a3b8]"> · {edu.year}</span>}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <LockedSection>
            <div>
              <p className="text-xs font-semibold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider mb-1.5">
                Education
              </p>
              <ul className="flex flex-col gap-1">
                {app.education.map((edu, i) => (
                  <li key={i} className="text-xs text-[#0f172a] dark:text-[#cbd5e1]">
                    <span className="font-medium">{edu.degree}</span>
                    {edu.institution && <span className="text-[#64748b] dark:text-[#94a3b8]"> · {edu.institution}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </LockedSection>
        )
      )}

      {/* Skills — always visible, matched skills highlighted */}
      {app.skills && app.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {app.skills.map((skill, i) => {
            const matched = requiredSkills.length
              ? requiredSkills.map((s) => s.toLowerCase().trim()).includes(skill.toLowerCase().trim())
              : false;
            return (
              <span
                key={i}
                className={matched
                  ? "text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                  : "text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#152237] text-[#64748b] dark:text-[#94a3b8] border border-slate-200 dark:border-[#1e3356]"
                }
              >
                {skill}
              </span>
            );
          })}
        </div>
      )}

      {/* Cover Letter — locked */}
      {app.coverLetter && (
        isUnlocked ? (
          <>
            <button
              onClick={() => setShowCoverLetter((v) => !v)}
              className="mt-3 text-xs font-medium text-[#2563eb] dark:text-[#60a5fa] hover:underline"
            >
              {showCoverLetter ? "Hide cover letter ▲" : "View cover letter ▼"}
            </button>
            {showCoverLetter && (
              <div className="mt-2 text-sm text-[#0f172a] dark:text-[#f1f5f9] leading-relaxed whitespace-pre-wrap bg-[#eff6ff] dark:bg-[#0a1628] rounded-lg p-3 border border-blue-100 dark:border-[#1e3356]">
                {app.coverLetter}
              </div>
            )}
          </>
        ) : (
          <LockedSection>
            <div className="text-sm leading-relaxed whitespace-pre-wrap bg-[#eff6ff] dark:bg-[#0a1628] rounded-lg p-3 border border-blue-100 dark:border-[#1e3356] line-clamp-3">
              {app.coverLetter}
            </div>
          </LockedSection>
        )
      )}

      {/* Resume — locked */}
      {(app.resumeName || app.resumeData) && (
        <div className="mt-3">
          {isUnlocked ? (
            <button
              onClick={() => onDownload(app.resumeData!, app.resumeName!)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#eff6ff] dark:bg-[#152237] border border-blue-100 dark:border-[#1e3356] text-[#0f172a] dark:text-[#f1f5f9] hover:bg-blue-100 dark:hover:bg-[#1e3356] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              {app.resumeName}
            </button>
          ) : (
            <a
              href="/pricing"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#152237] border border-slate-200 dark:border-[#1e3356] text-slate-400 dark:text-slate-500 hover:bg-[#eff6ff] dark:hover:bg-[#1e3356] hover:text-[#2563eb] dark:hover:text-[#60a5fa] hover:border-[#2563eb] dark:hover:border-[#3b82f6] transition-colors w-fit"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="blur-[3px] select-none">{app.resumeName ?? "resume.pdf"}</span>
            </a>
          )}
        </div>
      )}

      {/* Status actions */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {app.status !== "interview" && (
          <button
            onClick={() => onStatusChange(app.id, "interview")}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            Move to Interview
          </button>
        )}
        {app.status !== "rejected" && (
          <button
            onClick={() => onStatusChange(app.id, "rejected")}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            Reject
          </button>
        )}
        {app.status !== "pending" && (
          <button
            onClick={() => onStatusChange(app.id, "pending")}
            className="text-xs font-medium px-3 py-1.5 rounded-full text-[#64748b] dark:text-[#94a3b8] border border-slate-200 dark:border-[#1e3356] hover:bg-slate-50 dark:hover:bg-[#152237] transition-colors"
          >
            Move back to Pending
          </button>
        )}
      </div>
    </div>
  );
}

// ── Column ────────────────────────────────────────────────────────────────

type ColumnColor = "amber" | "blue" | "red";

type ColumnProps = {
  title: string;
  count: number;
  color: ColumnColor;
  apps: Application[];
  isUnlocked: boolean;
  requiredSkills: string[];
  onStatusChange(appId: string, status: Application["status"]): void;
  onDownload(resumeData: string, resumeName: string): void;
};

const headerColors: Record<ColumnColor, string> = {
  amber:
    "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  red: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
};

function Column({ title, count, color, apps, isUnlocked, requiredSkills, onStatusChange, onDownload }: ColumnProps) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className={`flex items-center justify-between px-4 py-3 rounded-xl border font-semibold text-sm ${headerColors[color]}`}
      >
        <span>{title}</span>
        <span className="text-xs font-bold">{count}</span>
      </div>

      {apps.length === 0 ? (
        <div className="bg-white dark:bg-[#0e1a2e] rounded-xl border border-blue-100 dark:border-[#1e3356] px-4 py-8 text-center">
          <p className="text-xs text-[#94a3b8]">No applicants here</p>
        </div>
      ) : (
        apps.map((app) => (
          <ApplicantCard
            key={app.id}
            app={app}
            isUnlocked={isUnlocked}
            requiredSkills={requiredSkills}
            onStatusChange={onStatusChange}
            onDownload={onDownload}
          />
        ))
      )}
    </div>
  );
}

// ── ApplicationsReview ────────────────────────────────────────────────────

type FilterMode = "all" | "any" | "strong" | "none";

export default function ApplicationsReview({ jobId }: { jobId: string }) {
  const { user, mounted } = useAuth();
  const [job, setJob] = useState<Job | null | "not-found">(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  useEffect(() => {
    if (!mounted || !user) return;
    const jobs: Job[] = JSON.parse(localStorage.getItem("onpoint_jobs") ?? "[]");
    const found = jobs.find((j) => j.id === jobId);
    setJob(found ?? "not-found");

    const allApps: Application[] = JSON.parse(
      localStorage.getItem("onpoint_applications") ?? "[]"
    );
    setApplications(allApps.filter((a) => a.jobId === jobId));
  }, [mounted, user, jobId]);

  if (!mounted) return null;

  // ── Access guard ─────────────────────────────────────────────────────
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
            : "Please log in with an employer account to access this page."}
        </p>
        <a
          href="/login"
          className="px-8 py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
        >
          Log In
        </a>
      </div>
    );
  }

  // ── Not-found guard ──────────────────────────────────────────────────
  if (job === "not-found") {
    return (
      <div
        className="max-w-2xl mx-auto bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none p-10 text-center"
        style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}
      >
        <h2 className="text-2xl font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-2">
          Job Not Found
        </h2>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-8">
          This job listing does not exist or has been removed.
        </p>
        <a
          href="/employer"
          className="px-8 py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
        >
          Back to Dashboard
        </a>
      </div>
    );
  }

  // ── Loading state ────────────────────────────────────────────────────
  if (job === null) return null;

  // ── Derived lists ────────────────────────────────────────────────────
  const requiredSkills = job.requiredSkills ?? [];

  const filtered = applications.filter((app) => {
    if (filterMode === "all" || !requiredSkills.length) return true;
    const matched = matchSkills(app.skills ?? [], requiredSkills);
    const total = requiredSkills.length;
    if (filterMode === "any") return matched > 0;
    if (filterMode === "strong") return matched / total >= 0.5;
    if (filterMode === "none") return matched === 0;
    return true;
  });

  const pending = filtered.filter((a) => a.status === "pending");
  const interview = filtered.filter((a) => a.status === "interview");
  const rejected = filtered.filter((a) => a.status === "rejected");

  // ── Handlers ─────────────────────────────────────────────────────────
  function handleStatusChange(appId: string, status: Application["status"]) {
    const all: Application[] = JSON.parse(
      localStorage.getItem("onpoint_applications") ?? "[]"
    );
    const updated = all.map((a) => (a.id === appId ? { ...a, status } : a));
    localStorage.setItem("onpoint_applications", JSON.stringify(updated));
    setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)));
  }

  function handleDownload(resumeData: string, resumeName: string) {
    const a = document.createElement("a");
    a.href = resumeData;
    a.download = resumeName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div
      className="max-w-6xl mx-auto"
      style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}
    >
      {/* Back link */}
      <a
        href="/employer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2563eb] dark:text-[#60a5fa] hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </a>

      {/* Job header */}
      <div className="bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none px-6 py-5 mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-[#0f172a] dark:text-[#f1f5f9] tracking-tight">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-sm text-[#64748b] dark:text-[#94a3b8]">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {job.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
              {job.salary && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {job.salary}
                </span>
              )}
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#eff6ff] dark:bg-[#152237] text-[#2563eb] dark:text-[#60a5fa]">
            {job.type}
          </span>
        </div>
      </div>

      {/* Locked-tier banner */}
      {applications.length > 0 && (
        <div className="mb-6 flex items-center justify-between gap-4 px-5 py-3.5 rounded-xl bg-[#eff6ff] dark:bg-[#0e1a2e] border border-blue-100 dark:border-[#1e3356]">
          <div className="flex items-center gap-2.5 min-w-0">
            <Lock className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa] shrink-0" />
            <p className="text-sm text-[#0f172a] dark:text-[#f1f5f9] truncate">
              <span className="font-semibold">Starter plan</span> — contact details, profile &amp; documents are locked.
            </p>
          </div>
          <a
            href="/pricing"
            className="shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full bg-[#2563eb] dark:bg-[#3b82f6] text-white hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors"
          >
            Unlock
          </a>
        </div>
      )}

      {/* Filter bar — only shown when job has required skills */}
      {requiredSkills.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[#64748b] dark:text-[#94a3b8] mr-1">
            Filter by skill match:
          </span>
          {(["all", "any", "strong", "none"] as FilterMode[]).map((mode) => {
            const labels: Record<FilterMode, string> = {
              all: "All",
              any: "Any match",
              strong: "50%+ match",
              none: "No match",
            };
            return (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  filterMode === mode
                    ? "bg-[#2563eb] dark:bg-[#3b82f6] text-white border-[#2563eb] dark:border-[#3b82f6]"
                    : "bg-white dark:bg-[#0e1a2e] text-[#64748b] dark:text-[#94a3b8] border-slate-200 dark:border-[#1e3356] hover:bg-[#eff6ff] dark:hover:bg-[#152237]"
                }`}
              >
                {labels[mode]}
              </button>
            );
          })}
        </div>
      )}

      {/* Three-column kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Column
          title="Pending"
          count={pending.length}
          color="amber"
          apps={pending}
          isUnlocked={false}
          requiredSkills={requiredSkills}
          onStatusChange={handleStatusChange}
          onDownload={handleDownload}
        />
        <Column
          title="Interview"
          count={interview.length}
          color="blue"
          apps={interview}
          isUnlocked={false}
          requiredSkills={requiredSkills}
          onStatusChange={handleStatusChange}
          onDownload={handleDownload}
        />
        <Column
          title="Rejected"
          count={rejected.length}
          color="red"
          apps={rejected}
          isUnlocked={false}
          requiredSkills={requiredSkills}
          onStatusChange={handleStatusChange}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}
