"use client";
import { useState, useEffect } from "react";
import { Inbox } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
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
    label: "Interview",
    classes:
      "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
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

export default function SeekerDashboard() {
  const { user, mounted } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (!mounted || !user) return;
    const allApps: Application[] = JSON.parse(
      localStorage.getItem("onpoint_applications") ?? "[]"
    );
    const myApps = allApps
      .filter((a) => a.seekerId === user.id)
      .sort(
        (a, b) =>
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      );
    setApplications(myApps);
    const allJobs: Job[] = JSON.parse(
      localStorage.getItem("onpoint_jobs") ?? "[]"
    );
    setJobs(allJobs);
  }, [mounted, user]);

  if (!mounted) return null;

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

  function getJob(jobId: string): Job | undefined {
    return jobs.find((j) => j.id === jobId);
  }

  const pending = applications.filter((a) => a.status === "pending").length;
  const interview = applications.filter((a) => a.status === "interview").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;

  return (
    <div
      className="max-w-4xl mx-auto"
      style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a] dark:text-[#f1f5f9] tracking-tight">
          My Applications
        </h1>
        {applications.length > 0 && (
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            {applications.length} total
            {pending > 0 && ` · ${pending} under review`}
            {interview > 0 && ` · ${interview} interview`}
            {rejected > 0 && ` · ${rejected} not selected`}
          </p>
        )}
      </div>

      {/* Empty state */}
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
            const job = getJob(app.jobId);
            const badge = statusConfig[app.status];

            return (
              <div
                key={app.id}
                className="bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none px-6 py-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <span className="block text-base font-semibold text-[#0f172a] dark:text-[#f1f5f9] truncate">
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
