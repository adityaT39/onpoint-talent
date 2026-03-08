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

export default function WhySection() {
  return (
    <section className="bg-[#f8f9fa] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#1a1a2e] mb-12">
          Why OnPoint Talent?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-8 shadow-sm flex flex-col items-start gap-4"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#3b6fd4]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1a1a2e]">{feature.title}</h3>
                <p className="text-[#6b7280] leading-relaxed text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
