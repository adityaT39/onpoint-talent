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
    <ol className="flex flex-col gap-4">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-4">
          <span className="w-8 h-8 flex-shrink-0 rounded-full bg-[#3b6fd4] text-white text-sm font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-[#1a1a2e] font-medium">{step}</span>
        </li>
      ))}
    </ol>
  );
}

export default function HowItWorks() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#1a1a2e] mb-12">
          How OnPoint Works?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* For Job Seekers */}
          <div className="bg-[#f8f9fa] rounded-xl p-8">
            <h3 className="text-lg font-semibold text-[#1a1a2e] mb-6">For Job Seekers</h3>
            <StepList steps={seekerSteps} />
          </div>

          {/* For Employers */}
          <div className="bg-[#f8f9fa] rounded-xl p-8">
            <h3 className="text-lg font-semibold text-[#1a1a2e] mb-6">For Employers</h3>
            <StepList steps={employerSteps} />
          </div>
        </div>
      </div>
    </section>
  );
}
