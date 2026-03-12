// Full-width hero banner with gradient background, decorative glows, headline, and dual CTAs
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2044] to-[#162d5f] dark:from-[#0e1a2e] dark:to-[#152237] text-white py-28 px-6">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-40 rounded-full bg-blue-400/10 blur-2xl" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 tracking-tight text-white">
          Find the Right Opportunity. Or the Right Talent.
        </h1>

        {/* Subtext */}
        <p className="text-lg text-blue-200 dark:text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
          OnPoint Talent connects skilled professionals with verified employers across New Zealand. Whether you&apos;re hiring or job hunting, we make the match.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/signup?role=employer" className="px-8 py-3.5 text-sm font-semibold bg-[#2563eb] dark:bg-[#3b82f6] text-white rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-lg">
            Look for Talent
          </a>
          <a href="/jobs" className="px-8 py-3.5 text-sm font-semibold bg-white dark:bg-transparent text-[#0f2044] dark:text-white rounded-full hover:bg-blue-50 dark:border dark:border-[#1e3356] dark:hover:bg-[#152237] transition-colors shadow-md">
            Find a Job
          </a>
        </div>
      </div>
    </section>
  );
}
