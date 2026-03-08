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

export default function FeaturedJobs() {
  return (
    <section className="bg-[#f8f9fa] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#1a1a2e] mb-3">
          Featured Opportunities
        </h2>
        <p className="text-center text-[#6b7280] mb-12">
          Explore some of the latest roles posted by employers on OnPoint Talent.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.map((job, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="text-base font-semibold text-[#1a1a2e]">{job.title}</h3>
              </div>
              <div className="flex flex-col gap-2 text-sm text-[#6b7280]">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#3b6fd4]" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#3b6fd4]" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#3b6fd4]" />
                  <span>{job.salary}</span>
                </div>
              </div>
              <button className="mt-auto w-full py-2.5 text-sm font-semibold text-white bg-[#3b6fd4] rounded-lg hover:bg-blue-700 transition-colors">
                View Job
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
