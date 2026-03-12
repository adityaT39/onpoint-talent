"use client";
import { useState, useEffect } from "react";
import { Building2, MapPin, DollarSign } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Job, Application } from "@/types";

// ── localStorage helpers ──────────────────────────────────────────────────

function getJobs(): Job[] {
  try { return JSON.parse(localStorage.getItem("onpoint_jobs") ?? "[]"); }
  catch { return []; }
}

function getApplications(): Application[] {
  try { return JSON.parse(localStorage.getItem("onpoint_applications") ?? "[]"); }
  catch { return []; }
}

// ── JobListings ───────────────────────────────────────────────────────────

export default function JobListings() {
  const { user, mounted } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!mounted) return;
    setJobs(getJobs());
    if (user?.role === "seeker") {
      const apps = getApplications();
      const ids = new Set(apps.filter((a) => a.seekerId === user.id).map((a) => a.jobId));
      setAppliedIds(ids);
    }
  }, [mounted, user]);

  if (!mounted) return null;

  if (jobs.length === 0) {
    return (
      <div className="max-w-6xl mx-auto text-center py-20">
        <p className="text-[#64748b] dark:text-[#94a3b8] text-sm">
          No jobs have been posted yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-3 tracking-tight">
        Browse Jobs
      </h1>
      <p className="text-[#64748b] dark:text-[#94a3b8] text-sm mb-10">
        {jobs.length} {jobs.length === 1 ? "listing" : "listings"} available
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {jobs.map((job) => {
          const hasApplied = appliedIds.has(job.id);
          const isSeeker = user?.role === "seeker";
          const isEmployer = user?.role === "employer";

          return (
            <div
              key={job.id}
              className="bg-white dark:bg-[#0e1a2e] rounded-2xl shadow-sm dark:shadow-none flex flex-col border border-blue-100 dark:border-[#1e3356] hover:shadow-md dark:hover:border-[#3b82f6] transition-all overflow-hidden"
              style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}
            >
              {/* Clickable card body → job detail page */}
              <a
                href={`/jobs/${job.id}`}
                className="flex flex-col gap-4 p-6 flex-1 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-[#0f172a] dark:text-[#f1f5f9] group-hover:text-[#2563eb] dark:group-hover:text-[#60a5fa] transition-colors">
                    {job.title}
                  </h3>
                  <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-[#eff6ff] dark:bg-[#152237] text-[#2563eb] dark:text-[#60a5fa]">
                    {job.type}
                  </span>
                </div>

                <div className="flex flex-col gap-2 text-sm text-[#64748b] dark:text-[#94a3b8]">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa] shrink-0" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa] shrink-0" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa] shrink-0" />
                    <span>{job.salary || "Not specified"}</span>
                  </div>
                </div>
              </a>

              {/* Action button row — separate from the link */}
              <div className="px-6 pb-6">
                {isSeeker && !hasApplied && (
                  <a
                    href={`/jobs/${job.id}`}
                    className="block w-full py-2.5 text-sm font-semibold text-center text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors"
                  >
                    Apply Now
                  </a>
                )}
                {isSeeker && hasApplied && (
                  <div className="w-full py-2.5 text-sm font-semibold text-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                    Applied ✓
                  </div>
                )}
                {!user && (
                  <a
                    href="/login"
                    className="block w-full py-2.5 text-sm font-semibold text-center text-[#2563eb] dark:text-[#60a5fa] border border-[#2563eb] dark:border-[#3b82f6] rounded-full hover:bg-[#eff6ff] dark:hover:bg-[#152237] transition-colors"
                  >
                    Log in to apply
                  </a>
                )}
                {isEmployer && (
                  <a
                    href={`/jobs/${job.id}`}
                    className="block w-full py-2.5 text-sm font-medium text-center text-[#64748b] dark:text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-colors"
                  >
                    View Details →
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
