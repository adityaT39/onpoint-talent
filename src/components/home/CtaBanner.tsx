// Centered call-to-action banner prompting users to browse jobs or post a listing
export default function CtaBanner() {
  return (
    <section className="bg-white dark:bg-[#0e1a2e] py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        {/* Headline */}
        <h2 className="text-3xl font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-4 tracking-tight">
          Ready to get started
        </h2>
        <p className="text-[#64748b] dark:text-[#94a3b8] text-sm mb-8">
          Join thousands of job seekers and employers already using OnPoint Talent.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3.5 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm">
            Browse All Jobs
          </button>
          <button className="px-8 py-3.5 text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] border border-[#2563eb] dark:border-[#3b82f6] rounded-full hover:bg-[#eff6ff] dark:hover:bg-[#152237] transition-colors">
            Post a Job
          </button>
        </div>
      </div>
    </section>
  );
}
