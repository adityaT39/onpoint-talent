import { Eye, Zap, Heart, CheckCircle } from "lucide-react";

const values = [
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Honest, clear communication at every step — from job listings to application status. No hidden fees, no surprises.",
  },
  {
    icon: Zap,
    title: "Speed",
    description:
      "Fast matches and quick responses. We believe great opportunities shouldn't wait weeks to be discovered.",
  },
  {
    icon: Heart,
    title: "People First",
    description:
      "Every application represents a real person with real goals. We build tools that respect and empower both sides.",
  },
];

const seekerPoints = [
  "Browse verified job listings across New Zealand",
  "Apply with a cover letter and resume in minutes",
  "Track your application status in one place",
];

const employerPoints = [
  "Post job listings and reach qualified candidates fast",
  "Review applications and manage statuses easily",
  "Download resumes and connect with the right talent",
];

// Static About page — no client hooks needed
export default function AboutContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2044] to-[#162d5f] dark:from-[#0e1a2e] dark:to-[#152237] text-white py-28 px-6">
        <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-40 rounded-full bg-blue-400/10 blur-2xl" />

        <div className="relative z-10 max-w-3xl mx-auto text-center fade-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 tracking-tight text-white">
            Connecting New Zealand&apos;s Talent with the Right Opportunities
          </h1>
          <p className="text-lg text-blue-200 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            OnPoint Talent is a purpose-built hiring platform that brings skilled professionals and verified New Zealand employers together — quickly, transparently, and without the noise.
          </p>
        </div>
      </section>

      {/* Mission / Our Story */}
      <section className="bg-[#eff6ff] dark:bg-[#0e1a2e] py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Story */}
          <div>
            <h2 className="text-3xl font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-6 tracking-tight">
              Our Story
            </h2>
            <p className="text-[#64748b] dark:text-[#94a3b8] text-sm leading-relaxed mb-4">
              OnPoint Talent was built out of a simple frustration: finding the right job — or the right hire — in New Zealand took too long and involved too many disconnected tools.
            </p>
            <p className="text-[#64748b] dark:text-[#94a3b8] text-sm leading-relaxed mb-4">
              We set out to create a platform that felt modern, honest, and focused on New Zealand&apos;s unique job market — one that worked equally well for a recent graduate and a growing SME.
            </p>
            <p className="text-[#64748b] dark:text-[#94a3b8] text-sm leading-relaxed">
              The result is OnPoint Talent: a clean, fast, and human-centered hiring experience built right here in Aotearoa.
            </p>
          </div>

          {/* Stat cards */}
          <div className="flex flex-col gap-4">
            {[
              { label: "NZ Focused", detail: "Built specifically for the New Zealand job market" },
              { label: "Two Roles", detail: "Designed for both job seekers and employers" },
              { label: "Free to Use", detail: "No subscription fees — sign up and start instantly" },
            ].map(({ label, detail }) => (
              <div
                key={label}
                className="bg-white dark:bg-[#152237] rounded-2xl p-6 border border-blue-100 dark:border-[#1e3356]"
              >
                <p className="text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] mb-1">{label}</p>
                <p className="text-[#64748b] dark:text-[#94a3b8] text-sm leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white dark:bg-[#080e1c] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#0f172a] dark:text-[#f1f5f9] mb-12 tracking-tight">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white dark:bg-[#152237] rounded-2xl p-8 shadow-sm dark:shadow-none flex flex-col items-start gap-4 border border-blue-100 dark:border-[#1e3356]"
              >
                <div className="w-11 h-11 bg-[#eff6ff] dark:bg-[#0e1a2e] rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#2563eb] dark:text-[#60a5fa]" />
                </div>
                <h3 className="text-base font-semibold text-[#0f172a] dark:text-[#f1f5f9]">{title}</h3>
                <p className="text-[#64748b] dark:text-[#94a3b8] leading-relaxed text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section className="bg-[#eff6ff] dark:bg-[#0e1a2e] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#0f172a] dark:text-[#f1f5f9] mb-12 tracking-tight">
            Built for Both Sides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seekers */}
            <div className="bg-white dark:bg-[#152237] rounded-2xl p-8 border border-blue-100 dark:border-[#1e3356]">
              <h3 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-6">For Job Seekers</h3>
              <ul className="flex flex-col gap-4">
                {seekerPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2563eb] dark:text-[#60a5fa] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#64748b] dark:text-[#94a3b8] leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Employers */}
            <div className="bg-white dark:bg-[#152237] rounded-2xl p-8 border border-blue-100 dark:border-[#1e3356]">
              <h3 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-6">For Employers</h3>
              <ul className="flex flex-col gap-4">
                {employerPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2563eb] dark:text-[#60a5fa] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#64748b] dark:text-[#94a3b8] leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-white dark:bg-[#080e1c] py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-4 tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="text-[#64748b] dark:text-[#94a3b8] text-sm mb-8">
            Join job seekers and employers already using OnPoint Talent across New Zealand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/jobs"
              className="inline-block px-8 py-3.5 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
            >
              Browse Jobs
            </a>
            <a
              href="/signup?role=employer"
              className="inline-block px-8 py-3.5 text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] border border-[#2563eb] dark:border-[#3b82f6] rounded-full hover:bg-[#eff6ff] dark:hover:bg-[#152237] transition-colors"
            >
              Post a Job
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
