const seekerSteps = [
  "Create your profile",
  "Discover relevant jobs",
  "Apply instantly",
];

const employerSteps = [
  "Post a job opening",
  "Review qualified candidates",
  "Hire the right talent",
];

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="flex flex-col gap-5">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-4">
          <span className="w-8 h-8 flex-shrink-0 rounded-full bg-[#2563eb] dark:bg-[#3b82f6] text-white text-sm font-bold flex items-center justify-center shadow-sm">
            {index + 1}
          </span>
          <span className="text-[#0f172a] dark:text-[#f1f5f9] font-medium text-sm">{step}</span>
        </li>
      ))}
    </ol>
  );
}

// Side-by-side step lists showing the process for job seekers and employers
export default function HowItWorks() {
  return (
    <section className="bg-white dark:bg-[#080e1c] pt-20 pb-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-[#0f172a] dark:text-[#f1f5f9] mb-12 tracking-tight">
          How OnPoint Works?
        </h2>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Seeker Steps */}
          <div className="bg-[#eff6ff] dark:bg-[#0e1a2e] rounded-2xl p-8 border border-blue-100 dark:border-[#1e3356]">
            <h3 className="text-base font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-6">For Job Seekers</h3>
            <StepList steps={seekerSteps} />
          </div>
          {/* Employer Steps */}
          <div className="bg-[#eff6ff] dark:bg-[#0e1a2e] rounded-2xl p-8 border border-blue-100 dark:border-[#1e3356]">
            <h3 className="text-base font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-6">For Employers</h3>
            <StepList steps={employerSteps} />
          </div>
        </div>
      </div>
    </section>
  );
}
