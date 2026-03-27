import {
  Briefcase,
  Eye,
  LayoutDashboard,
  CheckCircle,
  X,
  Check,
  Minus,
} from "lucide-react";
import CheckoutButton from "./CheckoutButton";

const freeFeatures = [
  {
    icon: Briefcase,
    title: "Post Unlimited Jobs",
    description: "List as many positions as you need — no caps, no limits.",
  },
  {
    icon: Eye,
    title: "Preview Applicants",
    description: "See each applicant's name and general area for free.",
  },
  {
    icon: LayoutDashboard,
    title: "Manage Your Dashboard",
    description: "Track all your job posts and applicants in one place.",
  },
];

const starterFeatures = [
  { label: "Post unlimited jobs", included: true },
  { label: "See applicant name", included: true },
  { label: "See general area", included: true },
  { label: "Full applicant profile", included: false },
  { label: "Resume & cover letter", included: false },
  { label: "Contact information", included: false },
];

const perListingFeatures = [
  { label: "Everything in Starter", included: true },
  { label: "Full applicant profile", included: true },
  { label: "Resume & cover letter", included: true },
  { label: "Contact information", included: true },
  { label: "One job post", included: true },
  { label: "All current & future listings", included: false },
];

const proFeatures = [
  { label: "Everything in Per Listing", included: true },
  { label: "Full applicant profile", included: true },
  { label: "Resume & cover letter", included: true },
  { label: "Contact information", included: true },
  { label: "All current job posts", included: true },
  { label: "Future job posts included", included: true },
];

const unlockSteps = [
  "Post your job — free, takes 2 minutes",
  "See applicant previews instantly",
  "Unlock details when ready",
];

const tableFeatures: { feature: string; starter: boolean; perListing: boolean; pro: boolean }[] = [
  { feature: "Post unlimited jobs", starter: true, perListing: true, pro: true },
  { feature: "See applicant name", starter: true, perListing: true, pro: true },
  { feature: "See general location", starter: true, perListing: true, pro: true },
  { feature: "Full applicant profile", starter: false, perListing: true, pro: true },
  { feature: "Resume & cover letter", starter: false, perListing: true, pro: true },
  { feature: "Contact information", starter: false, perListing: true, pro: true },
  { feature: "All current job posts", starter: false, perListing: false, pro: true },
  { feature: "Future job posts included", starter: false, perListing: false, pro: true },
];

export default function PricingContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2044] to-[#162d5f] dark:from-[#0e1a2e] dark:to-[#152237] text-white py-28 px-6">
        <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-40 rounded-full bg-blue-400/10 blur-2xl" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 tracking-tight text-white">
            Hire Smart. Pay Only When You&apos;re Ready.
          </h1>
          <p className="text-lg text-blue-200 dark:text-slate-400 max-w-xl mx-auto leading-relaxed mb-8">
            Post jobs for free. Only pay to unlock full applicant details when you find someone worth pursuing.
          </p>
          <a
            href="/signup?role=employer"
            className="inline-block px-8 py-3.5 text-sm font-semibold text-[#1d4ed8] bg-white rounded-full hover:bg-blue-50 transition-colors shadow-sm"
          >
            Get Started Free
          </a>
        </div>
      </section>

      {/* What's Always Free */}
      <section className="bg-[#eff6ff] dark:bg-[#0e1a2e] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-[#2563eb] dark:text-[#60a5fa] text-center mb-4 uppercase">
            Always Free
          </p>
          <h2 className="text-3xl font-bold text-center text-[#0f172a] dark:text-[#f1f5f9] mb-10 tracking-tight">
            No Cost to Get Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {freeFeatures.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white dark:bg-[#152237] rounded-2xl p-6 border border-blue-100 dark:border-[#1e3356] flex flex-col gap-4"
              >
                <div className="w-11 h-11 bg-[#eff6ff] dark:bg-[#0e1a2e] rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#2563eb] dark:text-[#60a5fa]" />
                </div>
                <h3 className="text-base font-semibold text-[#0f172a] dark:text-[#f1f5f9]">{title}</h3>
                <p className="text-sm text-[#64748b] dark:text-[#94a3b8] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="bg-white dark:bg-[#080e1c] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#0f172a] dark:text-[#f1f5f9] mb-12 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="rounded-2xl p-8 border border-blue-100 dark:border-[#1e3356] bg-white dark:bg-[#152237] flex flex-col">
              <div className="mb-6">
                <p className="text-sm font-semibold text-[#64748b] dark:text-[#94a3b8] mb-2">Starter</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-[#0f172a] dark:text-[#f1f5f9]">Free</span>
                </div>
                <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-2">Forever free to post</p>
              </div>
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {starterFeatures.map(({ label, included }) => (
                  <li key={label} className="flex items-center gap-3">
                    {included ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                    )}
                    <span className={`text-sm ${included ? "text-[#0f172a] dark:text-[#f1f5f9]" : "text-slate-400 dark:text-slate-600"}`}>
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="/signup?role=employer"
                className="block text-center px-6 py-3 text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] border border-[#2563eb] dark:border-[#3b82f6] rounded-full hover:bg-[#eff6ff] dark:hover:bg-[#0e1a2e] transition-colors"
              >
                Get Started Free
              </a>
            </div>

            {/* Per Listing */}
            <div className="rounded-2xl p-8 border border-blue-100 dark:border-[#1e3356] bg-white dark:bg-[#152237] flex flex-col">
              <div className="mb-6">
                <p className="text-sm font-semibold text-[#64748b] dark:text-[#94a3b8] mb-2">Per Listing</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-[#0f172a] dark:text-[#f1f5f9]">$29</span>
                  <span className="text-sm text-slate-400 mb-1">/ listing</span>
                </div>
                <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-2">Pay only for what you need</p>
              </div>
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {perListingFeatures.map(({ label, included }) => (
                  <li key={label} className="flex items-center gap-3">
                    {included ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                    )}
                    <span className={`text-sm ${included ? "text-[#0f172a] dark:text-[#f1f5f9]" : "text-slate-400 dark:text-slate-600"}`}>
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
              <CheckoutButton
                type="per_listing"
                label="Unlock a Listing"
                className="block text-center px-6 py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors disabled:opacity-60"
              />
            </div>

            {/* Pro */}
            <div className="rounded-2xl p-8 border-2 border-[#2563eb] dark:border-[#3b82f6] bg-[#eff6ff] dark:bg-[#0e1a2e] flex flex-col relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563eb] dark:bg-[#3b82f6] text-white text-xs font-bold px-4 py-1 rounded-full">
                Most Popular
              </span>
              <div className="mb-6">
                <p className="text-sm font-semibold text-[#64748b] dark:text-[#94a3b8] mb-2">Pro</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-[#0f172a] dark:text-[#f1f5f9]">$79</span>
                  <span className="text-sm text-slate-400 mb-1">/ month</span>
                </div>
                <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-2">Full access across all listings</p>
              </div>
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {proFeatures.map(({ label, included }) => (
                  <li key={label} className="flex items-center gap-3">
                    {included ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                    )}
                    <span className={`text-sm ${included ? "text-[#0f172a] dark:text-[#f1f5f9]" : "text-slate-400 dark:text-slate-600"}`}>
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
              <CheckoutButton
                type="pro"
                label="Start Pro"
                className="block text-center px-6 py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors disabled:opacity-60"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How Unlocking Works */}
      <section className="bg-[#eff6ff] dark:bg-[#0e1a2e] py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#0f172a] dark:text-[#f1f5f9] mb-12 tracking-tight">
            How Unlocking Works
          </h2>
          <ol className="flex flex-col gap-6">
            {unlockSteps.map((step, index) => (
              <li key={step} className="flex items-center gap-5">
                <span className="w-9 h-9 flex-shrink-0 rounded-full bg-[#2563eb] dark:bg-[#3b82f6] text-white text-sm font-bold flex items-center justify-center shadow-sm">
                  {index + 1}
                </span>
                <span className="text-[#0f172a] dark:text-[#f1f5f9] font-medium text-sm">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="bg-white dark:bg-[#080e1c] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#0f172a] dark:text-[#f1f5f9] mb-12 tracking-tight">
            Full Feature Breakdown
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-blue-100 dark:border-[#1e3356]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-blue-100 dark:border-[#1e3356]">
                  <th className="text-left px-6 py-4 font-semibold text-[#0f172a] dark:text-[#f1f5f9] bg-white dark:bg-[#152237]">
                    Feature
                  </th>
                  <th className="text-center px-6 py-4 font-semibold text-[#0f172a] dark:text-[#f1f5f9] bg-white dark:bg-[#152237]">
                    Starter
                  </th>
                  <th className="text-center px-6 py-4 font-semibold text-[#0f172a] dark:text-[#f1f5f9] bg-white dark:bg-[#152237]">
                    Per Listing
                  </th>
                  <th className="text-center px-6 py-4 font-semibold text-[#2563eb] dark:text-[#60a5fa] bg-white dark:bg-[#152237]">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableFeatures.map(({ feature, starter, perListing, pro }, i) => (
                  <tr
                    key={feature}
                    className={i % 2 === 0 ? "bg-[#f8fafc] dark:bg-[#0e1a2e]" : "bg-white dark:bg-[#152237]"}
                  >
                    <td className="px-6 py-4 text-[#0f172a] dark:text-[#f1f5f9]">{feature}</td>
                    <td className="px-6 py-4 text-center">
                      {starter ? (
                        <Check className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa] mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {perListing ? (
                        <Check className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa] mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {pro ? (
                        <Check className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa] mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2044] to-[#162d5f] dark:from-[#0e1a2e] dark:to-[#152237] text-white py-24 px-6 text-center">
        <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">
            Start Hiring for Free Today
          </h2>
          <p className="text-blue-200 dark:text-slate-400 text-sm mb-8">
            No credit card required. Post your first job in 2 minutes.
          </p>
          <a
            href="/signup?role=employer"
            className="inline-block px-8 py-3.5 text-sm font-semibold text-[#1d4ed8] bg-white rounded-full hover:bg-blue-50 transition-colors shadow-sm"
          >
            Create Free Account
          </a>
        </div>
      </section>
    </>
  );
}
