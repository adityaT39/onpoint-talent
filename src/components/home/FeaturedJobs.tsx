import { MapPin, DollarSign, Building2 } from "lucide-react";

const jobs = [
  {
    title: "Frontend Developer",
    company: "TechFlow Inc.",
    location: "Auckland, NZ",
    salary: "$60k – $80k",
  },
  {
    title: "Frontend Developer",
    company: "Stride Digital",
    location: "Wellington, NZ",
    salary: "$65k – $85k",
  },
  {
    title: "Frontend Developer",
    company: "BlueSky Solutions",
    location: "Christchurch, NZ",
    salary: "$60k – $80k",
  },
  {
    title: "HR Business Partner",
    company: "Meridian Corp",
    location: "Auckland, NZ",
    salary: "$80k – $100k",
  },
  {
    title: "Project Manager",
    company: "Apex Consulting",
    location: "Hamilton, NZ",
    salary: "$90k – $110k",
  },
  {
    title: "Software Engineer",
    company: "NovaTech NZ",
    location: "Remote",
    salary: "$85k – $105k",
  },
];

// Grid of sample job listing cards to showcase available opportunities
export default function FeaturedJobs() {
  return (
    <section className="bg-[#eff6ff] dark:bg-[#080e1c] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-[#0f172a] dark:text-[#f1f5f9] mb-3 tracking-tight">
          Featured Opportunities
        </h2>

        {/* Subtext */}
        <p className="text-center text-[#64748b] dark:text-[#94a3b8] text-sm mb-12">
          Explore some of the latest roles posted by employers on OnPoint Talent.
        </p>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {jobs.map((job, i) => (
            <a
              key={i}
              href="/jobs"
              className="bg-white dark:bg-[#0e1a2e] rounded-2xl p-6 shadow-sm dark:shadow-none flex flex-col gap-4 border border-blue-100 dark:border-[#1e3356] hover:shadow-md dark:hover:border-[#3b82f6] transition-all"
            >
              <h3 className="text-base font-semibold text-[#0f172a] dark:text-[#f1f5f9]">{job.title}</h3>
              <div className="flex flex-col gap-2 text-sm text-[#64748b] dark:text-[#94a3b8]">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa]" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa]" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa]" />
                  <span>{job.salary}</span>
                </div>
              </div>
              <span className="mt-auto w-full py-2.5 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors text-center">
                View Job
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
