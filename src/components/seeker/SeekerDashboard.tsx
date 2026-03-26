"use client";
import { useState, useEffect, useCallback } from "react";
import { Inbox, Bookmark, X, FileText, Briefcase, GraduationCap, Wrench, AlignLeft, Download } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase";
import type { Job, Application } from "@/types";

const statusConfig: Record<
  Application["status"],
  { label: string; classes: string }
> = {
  pending: {
    label: "Under Review",
    classes:
      "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
  },
  interview: {
    label: "Under Review",
    classes:
      "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
  },
  rejected: {
    label: "Not Selected",
    classes: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400",
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

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

function mapApplication(row: Record<string, unknown>): Application {
  return {
    id: row.id as string,
    jobId: row.job_id as string,
    employerId: row.employer_id as string | null,
    seekerId: row.seeker_id as string,
    seekerName: (row.seeker_name as string) ?? "",
    seekerEmail: (row.seeker_email as string) ?? "",
    phone: (row.phone as string) ?? "",
    location: (row.location as string) ?? "",
    summary: (row.summary as string) ?? "",
    experience: (row.experience as Application["experience"]) ?? [],
    education: (row.education as Application["education"]) ?? [],
    skills: (row.skills as string[]) ?? [],
    coverLetter: (row.cover_letter as string) ?? "",
    resumeName: row.resume_name as string | undefined,
    resumeUrl: row.resume_url as string | undefined,
    appliedAt: row.applied_at as string,
    status: row.status as Application["status"],
  };
}

// ── ApplicationDrawer ────────────────────────────────────────────────────

function ApplicationDrawer({
  app,
  job,
  onClose,
}: {
  app: Application;
  job: Job | undefined;
  onClose: () => void;
}) {
  const [resumeHref, setResumeHref] = useState<string | null>(null);
  const badge = statusConfig[app.status];

  useEffect(() => {
    if (!app.resumeUrl) return;
    const supabase = createClient();
    supabase.storage
      .from("resumes")
      .createSignedUrl(app.resumeUrl, 60)
      .then(({ data }) => {
        if (data?.signedUrl) setResumeHref(data.signedUrl);
      });
  }, [app.resumeUrl]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white dark:bg-[#0b1526] shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: "slide-in-right 0.25s ease-out forwards" }}
        role="dialog"
        aria-modal="true"
        aria-label="Application detail"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-100 dark:border-[#1e3356] shrink-0">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8] mb-0.5">
              Application
            </p>
            <h2 className="text-lg font-bold text-[#0f172a] dark:text-[#f1f5f9] truncate leading-tight">
              {job ? job.title : "Job no longer available"}
            </h2>
            {job && (
              <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-0.5">
                {job.company} · {job.location} · {job.type}
                {job.salary ? ` · ${job.salary}` : ""}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 mt-0.5 p-1.5 rounded-lg text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-[#f1f5f9] hover:bg-slate-100 dark:hover:bg-[#152237] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">

          {/* Status + date */}
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${badge.classes}`}>
              {badge.label}
            </span>
            <span className="text-xs text-[#94a3b8] dark:text-[#64748b]">
              Applied {formatDate(app.appliedAt)}
            </span>
          </div>

          {/* Cover letter */}
          {app.coverLetter && (
            <section>
              <SectionHeading icon={<AlignLeft className="w-3.5 h-3.5" />} title="Cover Letter" />
              <p className="text-sm text-[#334155] dark:text-[#cbd5e1] whitespace-pre-line leading-relaxed mt-2">
                {app.coverLetter}
              </p>
            </section>
          )}

          {/* Summary */}
          {app.summary && (
            <section>
              <SectionHeading icon={<FileText className="w-3.5 h-3.5" />} title="Professional Summary" />
              <p className="text-sm text-[#334155] dark:text-[#cbd5e1] leading-relaxed mt-2">
                {app.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {app.experience.length > 0 && (
            <section>
              <SectionHeading icon={<Briefcase className="w-3.5 h-3.5" />} title="Experience" />
              <div className="flex flex-col gap-3 mt-2">
                {app.experience.map((exp, i) => (
                  <div key={i} className="pl-3 border-l-2 border-[#2563eb]/30 dark:border-[#3b82f6]/30">
                    <p className="text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9]">{exp.role}</p>
                    <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">{exp.company} · {exp.duration}</p>
                    {exp.description && (
                      <p className="text-sm text-[#334155] dark:text-[#cbd5e1] mt-1 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {app.education.length > 0 && (
            <section>
              <SectionHeading icon={<GraduationCap className="w-3.5 h-3.5" />} title="Education" />
              <div className="flex flex-col gap-2 mt-2">
                {app.education.map((edu, i) => (
                  <div key={i} className="pl-3 border-l-2 border-[#2563eb]/30 dark:border-[#3b82f6]/30">
                    <p className="text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9]">{edu.degree}</p>
                    <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">{edu.institution} · {edu.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {app.skills.length > 0 && (
            <section>
              <SectionHeading icon={<Wrench className="w-3.5 h-3.5" />} title="Skills" />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {app.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-full bg-[#eff6ff] dark:bg-[#152237] text-[#2563eb] dark:text-[#60a5fa] border border-blue-100 dark:border-[#1e3356]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Resume */}
          {app.resumeName && (
            <section>
              <SectionHeading icon={<Download className="w-3.5 h-3.5" />} title="Resume" />
              <div className="mt-2">
                {resumeHref ? (
                  <a
                    href={resumeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#2563eb] dark:text-[#60a5fa] hover:underline"
                  >
                    <Download className="w-4 h-4" />
                    {app.resumeName}
                  </a>
                ) : (
                  <span className="text-sm text-[#64748b] dark:text-[#94a3b8]">{app.resumeName}</span>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Footer — view full job listing */}
        {job && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-[#1e3356] shrink-0">
            <a
              href={`/jobs/${job.id}`}
              className="block w-full text-center py-2.5 text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] border border-[#2563eb] dark:border-[#3b82f6] rounded-full hover:bg-[#eff6ff] dark:hover:bg-[#152237] transition-colors"
            >
              View Job Listing
            </a>
          </div>
        )}
      </div>
    </>
  );
}

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">
      {icon}
      {title}
    </div>
  );
}

// ── SeekerDashboard ──────────────────────────────────────────────────────

export default function SeekerDashboard() {
  const { user, mounted } = useAuth();
  const [activeTab, setActiveTab] = useState<"applications" | "saved">("applications");
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Map<string, Job>>(new Map());
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const closeDrawer = useCallback(() => setSelectedApp(null), []);

  useEffect(() => {
    if (!mounted || !user) return;
    const supabase = createClient();

    supabase
      .from("applications")
      .select("*")
      .eq("seeker_id", user.id)
      .order("applied_at", { ascending: false })
      .then(async ({ data: appData }) => {
        const myApps = (appData ?? []).map(mapApplication);
        setApplications(myApps);
        setLoading(false);

        // Fetch associated jobs
        if (myApps.length > 0) {
          const jobIds = [...new Set(myApps.map((a) => a.jobId))];
          const { data: jobData } = await supabase
            .from("jobs")
            .select("*")
            .in("id", jobIds);
          const jobMap = new Map<string, Job>();
          (jobData ?? []).forEach((j) => jobMap.set(j.id, mapJob(j)));
          setJobs(jobMap);
        }
      });

    // Check if profile exists
    supabase
      .from("seeker_profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => setHasProfile(!!data));

    // Fetch saved jobs
    supabase
      .from("saved_jobs")
      .select("job_id, saved_at")
      .eq("seeker_id", user.id)
      .order("saved_at", { ascending: false })
      .then(async ({ data: savedData }) => {
        if (savedData?.length) {
          const { data: jobsData } = await supabase
            .from("jobs")
            .select("*")
            .in("id", savedData.map((r: { job_id: string }) => r.job_id));
          if (jobsData) setSavedJobs(jobsData.map(mapJob));
        }
      });
  }, [mounted, user]);

  if (!mounted || loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="h-9 w-52 bg-slate-200 dark:bg-[#1e3356] rounded-lg mb-2 animate-pulse" />
        <div className="h-4 w-36 bg-slate-100 dark:bg-[#152237] rounded mb-8 animate-pulse" />
        <div className="flex gap-3 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-1 bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] p-5 flex flex-col gap-2">
              <div className="h-7 w-10 bg-slate-200 dark:bg-[#1e3356] rounded animate-pulse" />
              <div className="h-4 w-20 bg-slate-100 dark:bg-[#152237] rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] p-5 flex items-center gap-4">
              <div className="flex-1">
                <div className="h-5 w-2/5 bg-slate-200 dark:bg-[#1e3356] rounded mb-2 animate-pulse" />
                <div className="h-4 w-1/3 bg-slate-100 dark:bg-[#152237] rounded animate-pulse" />
              </div>
              <div className="h-6 w-20 bg-slate-100 dark:bg-[#152237] rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Access guard ─────────────────────────────────────────────────────────
  if (!user || user.role !== "seeker") {
    return (
      <div
        className="max-w-2xl mx-auto bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none p-10 text-center"
        style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}
      >
        <h2 className="text-2xl font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-2">
          Seeker Access Only
        </h2>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-8">
          {user?.role === "employer"
            ? "This page is for job seekers. Go to your employer dashboard instead."
            : "Please log in with a seeker account to view your applications."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {user?.role === "employer" ? (
            <a
              href="/employer"
              className="px-8 py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
            >
              Go to Dashboard
            </a>
          ) : (
            <>
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
                Create Account
              </a>
            </>
          )}
        </div>
      </div>
    );
  }

  const pending = applications.filter((a) => a.status === "pending").length;
  const interview = applications.filter((a) => a.status === "interview").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;

  async function unsaveJob(jobId: string) {
    const supabase = createClient();
    await supabase.from("saved_jobs").delete()
      .eq("seeker_id", user!.id).eq("job_id", jobId);
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
  }

  return (
    <div
      className="max-w-4xl mx-auto"
      style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}
    >
      {/* Profile completion banner */}
      {hasProfile === false && (
        <div className="mb-6 flex items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
          <div>
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
              Complete your profile to start applying
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              Your profile autofills every application — set it up once.
            </p>
          </div>
          <a
            href="/profile"
            className="shrink-0 px-4 py-2 text-xs font-semibold text-white bg-amber-600 dark:bg-amber-500 rounded-full hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors"
          >
            Get Started
          </a>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#0f172a] dark:text-[#f1f5f9] tracking-tight">
          My Dashboard
        </h1>
        {activeTab === "applications" && applications.length > 0 && (
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            {applications.length} total
            {(pending + interview) > 0 && ` · ${pending + interview} under review`}
            {rejected > 0 && ` · ${rejected} not selected`}
          </p>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 border-b border-slate-200 dark:border-[#1e3356]">
        {(["applications", "saved"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-[#2563eb] text-[#2563eb] dark:text-[#60a5fa] dark:border-[#3b82f6]"
                : "border-transparent text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-[#f1f5f9]"
            }`}>
            {tab === "applications" ? "My Applications" : `Saved Jobs${savedJobs.length ? ` (${savedJobs.length})` : ""}`}
          </button>
        ))}
      </div>

      {/* Applications tab */}
      {activeTab === "applications" && (
        <>
          {applications.length === 0 ? (
            <div className="bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] p-12 text-center shadow-sm dark:shadow-none">
              <Inbox className="mx-auto mb-4 w-10 h-10 text-[#2563eb] dark:text-[#60a5fa] opacity-40" />
              <p className="text-[#64748b] dark:text-[#94a3b8] text-sm mb-6">
                You haven&apos;t applied to any jobs yet.
              </p>
              <a
                href="/jobs"
                className="px-8 py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
              >
                Browse Jobs
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {applications.map((app) => {
                const job = jobs.get(app.jobId);
                const badge = statusConfig[app.status];

                return (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="w-full text-left bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none px-6 py-5 hover:border-[#93c5fd] dark:hover:border-[#2563eb] hover:shadow-md dark:hover:shadow-none transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <span className="block text-base font-semibold text-[#0f172a] dark:text-[#f1f5f9] truncate group-hover:text-[#2563eb] dark:group-hover:text-[#60a5fa] transition-colors">
                          {job ? job.title : "Job no longer available"}
                        </span>
                        {job ? (
                          <span className="block text-sm text-[#64748b] dark:text-[#94a3b8] mt-0.5">
                            {job.company} · {job.location} · {job.type}
                            {job.salary ? ` · ${job.salary}` : ""}
                          </span>
                        ) : (
                          <span className="block text-sm text-[#94a3b8] dark:text-[#64748b] mt-0.5 italic">
                            This listing has been removed
                          </span>
                        )}
                        <span className="block text-xs text-[#94a3b8] dark:text-[#64748b] mt-1.5">
                          Applied {formatDate(app.appliedAt)}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full ${badge.classes}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Application detail drawer */}
      {selectedApp && (
        <ApplicationDrawer
          app={selectedApp}
          job={jobs.get(selectedApp.jobId)}
          onClose={closeDrawer}
        />
      )}

      {/* Saved Jobs tab */}
      {activeTab === "saved" && (
        <>
          {savedJobs.length === 0 ? (
            <div className="bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] p-12 text-center shadow-sm dark:shadow-none">
              <Bookmark className="mx-auto mb-4 w-10 h-10 text-[#2563eb] dark:text-[#60a5fa] opacity-40" />
              <p className="text-[#64748b] dark:text-[#94a3b8] text-sm mb-6">
                You haven&apos;t saved any jobs yet.
              </p>
              <a
                href="/jobs"
                className="px-8 py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
              >
                Browse Jobs
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {savedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none px-6 py-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="block text-base font-semibold text-[#0f172a] dark:text-[#f1f5f9] truncate">
                        {job.title}
                      </span>
                      <span className="block text-sm text-[#64748b] dark:text-[#94a3b8] mt-0.5">
                        {job.company} · {job.location} · {job.type}
                        {job.salary ? ` · ${job.salary}` : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`/jobs/${job.id}`}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors"
                      >
                        Apply Now
                      </a>
                      <button
                        onClick={() => unsaveJob(job.id)}
                        className="px-4 py-1.5 text-xs font-medium text-[#64748b] dark:text-[#94a3b8] border border-slate-200 dark:border-[#1e3356] rounded-full hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-800 transition-colors"
                      >
                        Unsave
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
