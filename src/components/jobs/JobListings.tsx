"use client";
import { useState, useEffect, useMemo } from "react";
import { Building2, MapPin, DollarSign, Search, X, Bookmark, BookmarkCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase";
import type { Job } from "@/types";

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

// ── JobListings ───────────────────────────────────────────────────────────

export default function JobListings() {
  const { user, mounted } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<"any" | "week" | "month">("any");
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;
    const supabase = createClient();

    supabase
      .from("jobs")
      .select("*")
      .order("posted_at", { ascending: false })
      .then(({ data }) => {
        setJobs((data ?? []).map(mapJob));
        setLoading(false);
      });

    if (user?.role === "seeker") {
      supabase
        .from("applications")
        .select("job_id")
        .eq("seeker_id", user.id)
        .then(({ data }) => {
          const ids = new Set((data ?? []).map((a: { job_id: string }) => a.job_id));
          setAppliedIds(ids);
        });

      supabase
        .from("saved_jobs")
        .select("job_id")
        .eq("seeker_id", user.id)
        .then(({ data }) => {
          if (data) setSavedIds(new Set(data.map((r: { job_id: string }) => r.job_id)));
        });
    }
  }, [mounted, user]);

  const jobTypes = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.type).filter(Boolean))).sort(),
    [jobs]
  );

  const locations = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location).filter(Boolean))).sort(),
    [jobs]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const now = Date.now();
    const cutoff =
      dateFilter === "week"
        ? now - 7 * 86400_000
        : dateFilter === "month"
        ? now - 30 * 86400_000
        : 0;

    return jobs.filter((job) => {
      const matchesQuery =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.requirements.toLowerCase().includes(q) ||
        job.requiredSkills?.some((s) => s.toLowerCase().includes(q));
      const matchesType = !typeFilter || job.type === typeFilter;
      const matchesLocation = !locationFilter || job.location === locationFilter;
      const matchesDate = cutoff === 0 || new Date(job.postedAt).getTime() >= cutoff;
      return matchesQuery && matchesType && matchesLocation && matchesDate;
    });
  }, [jobs, query, typeFilter, locationFilter, dateFilter]);

  async function toggleSave(jobId: string) {
    if (!user || user.role !== "seeker") return;
    const supabase = createClient();
    if (savedIds.has(jobId)) {
      await supabase.from("saved_jobs").delete()
        .eq("seeker_id", user.id).eq("job_id", jobId);
      setSavedIds((s) => { const n = new Set(s); n.delete(jobId); return n; });
    } else {
      await supabase.from("saved_jobs").insert({ seeker_id: user.id, job_id: jobId });
      setSavedIds((s) => new Set(s).add(jobId));
    }
  }

  function clearAll() {
    setQuery("");
    setTypeFilter("");
    setDateFilter("any");
    setLocationFilter("");
  }
  const hasFilters = query || typeFilter || locationFilter || dateFilter !== "any";

  if (!mounted || loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="h-9 w-36 bg-slate-200 dark:bg-[#1e3356] rounded-lg mb-3 animate-pulse" />
        <div className="h-4 w-28 bg-slate-100 dark:bg-[#152237] rounded mb-6 animate-pulse" />
        <div className="flex flex-col gap-3 mb-8">
          <div className="h-10 rounded-xl bg-white dark:bg-[#0e1a2e] border border-blue-100 dark:border-[#1e3356] animate-pulse" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-7 w-16 rounded-full bg-white dark:bg-[#0e1a2e] border border-blue-100 dark:border-[#1e3356] animate-pulse" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] p-6 flex flex-col gap-4">
              <div className="flex justify-between gap-2">
                <div className="h-5 bg-slate-200 dark:bg-[#1e3356] rounded w-3/5 animate-pulse" />
                <div className="h-5 w-14 bg-slate-100 dark:bg-[#152237] rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-4 bg-slate-100 dark:bg-[#152237] rounded w-2/5 animate-pulse" />
                <div className="h-4 bg-slate-100 dark:bg-[#152237] rounded w-2/5 animate-pulse" />
                <div className="h-4 bg-slate-100 dark:bg-[#152237] rounded w-1/3 animate-pulse" />
              </div>
              <div className="h-9 bg-slate-100 dark:bg-[#152237] rounded-full animate-pulse mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

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
      <p className="text-[#64748b] dark:text-[#94a3b8] text-sm mb-6">
        {hasFilters
          ? `${filtered.length} of ${jobs.length} listings match`
          : `${jobs.length} ${jobs.length === 1 ? "listing" : "listings"} available`}
      </p>

      {/* Search + filter bar */}
      <div className="flex flex-col gap-3 mb-8">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search by title, company, or location…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl border border-blue-100 dark:border-[#1e3356] bg-white dark:bg-[#0e1a2e] text-[#0f172a] dark:text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Job type pills */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {(["", ...jobTypes] as string[]).map((t) => {
            const active = typeFilter === t;
            return (
              <button
                key={t || "all"}
                onClick={() => setTypeFilter(active && t !== "" ? "" : t)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  active
                    ? "bg-[#2563eb] text-white border-[#2563eb]"
                    : "bg-white dark:bg-[#0e1a2e] text-[#64748b] dark:text-[#94a3b8] border-blue-100 dark:border-[#1e3356] hover:border-[#2563eb] dark:hover:border-[#3b82f6]"
                }`}
              >
                {t || "All"}
              </button>
            );
          })}
        </div>

        {/* Date pills */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {(["any", "week", "month"] as const).map((d) => {
            const label = d === "any" ? "Any time" : d === "week" ? "Past week" : "Past month";
            const active = dateFilter === d;
            return (
              <button
                key={d}
                onClick={() => setDateFilter(d)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  active
                    ? "bg-[#2563eb] text-white border-[#2563eb]"
                    : "bg-white dark:bg-[#0e1a2e] text-[#64748b] dark:text-[#94a3b8] border-blue-100 dark:border-[#1e3356] hover:border-[#2563eb] dark:hover:border-[#3b82f6]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Location dropdown + Clear all */}
        <div className="flex items-center gap-3">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-48 py-2 px-3 text-sm rounded-xl border border-blue-100 dark:border-[#1e3356] bg-white dark:bg-[#0e1a2e] text-[#0f172a] dark:text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
          >
            <option value="">All locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs font-medium text-[#64748b] dark:text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[#64748b] dark:text-[#94a3b8] text-sm py-16">
          No jobs match your search.{" "}
          <button
            onClick={clearAll}
            className="text-[#2563eb] dark:text-[#60a5fa] underline"
          >
            Clear filters
          </button>
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filtered.map((job) => {
          const hasApplied = appliedIds.has(job.id);
          const isSeeker = user?.role === "seeker";
          const isEmployer = user?.role === "employer";

          return (
            <div
              key={job.id}
              className="relative bg-white dark:bg-[#0e1a2e] rounded-2xl shadow-sm dark:shadow-none flex flex-col border border-blue-100 dark:border-[#1e3356] hover:shadow-md dark:hover:border-[#3b82f6] transition-all overflow-hidden"
              style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}
            >
              {user?.role === "seeker" && (
                <button
                  onClick={(e) => { e.preventDefault(); toggleSave(job.id); }}
                  aria-label={savedIds.has(job.id) ? "Remove bookmark" : "Save job"}
                  className="absolute top-4 right-4 text-[#2563eb] dark:text-[#60a5fa] hover:scale-110 transition-transform z-10"
                >
                  {savedIds.has(job.id)
                    ? <BookmarkCheck size={18} className="fill-current" />
                    : <Bookmark size={18} />}
                </button>
              )}
              {/* Clickable card body → job detail page */}
              <a
                href={`/jobs/${job.id}`}
                className="flex flex-col gap-4 p-6 flex-1 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-[#0f172a] dark:text-[#f1f5f9] group-hover:text-[#2563eb] dark:group-hover:text-[#60a5fa] transition-colors">
                    {job.title}
                  </h3>
                  <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-[#eff6ff] dark:bg-[#152237] text-[#2563eb] dark:text-[#60a5fa] mr-7">
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
