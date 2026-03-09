import Image from "next/image";
import { CheckCircle } from "lucide-react";

const bullets = [
  "Built by experienced HR professionals",
  "Years of recruitment and workforce strategy expertise",
  "Designed to connect the right talent with the right opportunities",
];

// Two-column section introducing OnPoint Consulting NZ — text credentials alongside founder image
export default function ConsultingSection() {
  return (
    <section className="bg-white dark:bg-[#0e1a2e] pt-10 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Eyebrow Label */}
        <p className="text-center text-xs font-semibold text-[#2563eb] dark:text-[#60a5fa] uppercase tracking-widest mb-3">
          Our Story
        </p>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-[#0f172a] dark:text-[#f1f5f9] mb-12 tracking-tight">
          Powered by OnPoint Consulting NZ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <p className="text-[#64748b] dark:text-[#94a3b8] leading-relaxed mb-4 text-sm">
              OnPoint Talent is a service created by OnPoint Consulting NZ, an established HR
              consulting firm dedicated to helping organisations build strong, high-performing teams.
            </p>
            <p className="text-[#64748b] dark:text-[#94a3b8] leading-relaxed mb-8 text-sm">
              With years of experience in recruitment, talent management, and workforce strategy,
              OnPoint Consulting understands what both employers and candidates need. OnPoint
              Talent brings that expertise into a modern platform designed to make hiring and
              job searching faster, smarter, and more efficient.
            </p>
            {/* Credentials List */}
            <ul className="flex flex-col gap-3">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#2563eb] dark:text-[#3b82f6] flex-shrink-0 mt-0.5" />
                  <span className="text-[#0f172a] dark:text-[#f1f5f9] text-sm">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg dark:shadow-2xl dark:border dark:border-[#1e3356]">
            <Image
              src="/images/founder.jpg"
              alt="Priya Dwivedi, Founder of OnPoint Consulting NZ"
              width={600}
              height={450}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
