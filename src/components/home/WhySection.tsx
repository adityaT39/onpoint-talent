import { Search, ShieldCheck, Zap } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Faster Matching",
    description:
      "Get matched to roles that fit your skills, location, and salary goals — no endless scrolling.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Employers",
    description:
      "We review employers and listings to keep the platform clean, safe, and high-quality.",
  },
  {
    icon: Zap,
    title: "Simple Hiring",
    description:
      "Employers can post roles, review applicants, and shortlist candidates in minutes.",
  },
];

// Three-column feature grid explaining the platform's core value propositions
export default function WhySection() {
  return (
    <section className="bg-[#eff6ff] dark:bg-[#0e1a2e] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-[#0f172a] dark:text-[#f1f5f9] mb-12 tracking-tight">
          Why OnPoint Talent?
        </h2>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white dark:bg-[#152237] rounded-2xl p-8 shadow-sm dark:shadow-none flex flex-col items-start gap-4 border border-blue-100 dark:border-[#1e3356]"
              >
                <div className="w-11 h-11 bg-[#eff6ff] dark:bg-[#0e1a2e] rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#2563eb] dark:text-[#60a5fa]" />
                </div>
                <h3 className="text-base font-semibold text-[#0f172a] dark:text-[#f1f5f9]">{feature.title}</h3>
                <p className="text-[#64748b] dark:text-[#94a3b8] leading-relaxed text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
