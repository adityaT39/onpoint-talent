import Image from "next/image";
import { CheckCircle } from "lucide-react";

const bullets = [
  "Built by experienced HR professionals",
  "Years of recruitment and workforce strategy expertise",
  "Designed to connect the right talent with the right opportunities",
];

export default function ConsultingSection() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-sm font-semibold text-[#3b6fd4] uppercase tracking-widest mb-3">
          Our Story
        </p>
        <h2 className="text-3xl font-bold text-center text-[#1a1a2e] mb-12">
          Powered by OnPoint Consulting NZ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <p className="text-[#6b7280] leading-relaxed mb-4">
              OnPoint Talent is a service created by OnPoint Consulting NZ, an established HR
              consulting firm dedicated to helping organisations build strong, high-performing teams.
            </p>
            <p className="text-[#6b7280] leading-relaxed mb-8">
              With years of experience in recruitment, talent management, and workforce strategy,
              OnPoint Consulting understands what both employers and candidates need. OnPoint
              Talent brings that expertise into a modern platform designed to make hiring and
              job searching faster, smarter, and more efficient.
            </p>
            <ul className="flex flex-col gap-3">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#3b6fd4] flex-shrink-0 mt-0.5" />
                  <span className="text-[#1a1a2e] text-sm">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image */}
          <div className="rounded-2xl overflow-hidden shadow-md">
            <Image
              src="/images/consulting-team.jpg"
              alt="OnPoint Consulting team"
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
