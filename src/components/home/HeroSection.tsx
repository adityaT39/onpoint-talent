export default function HeroSection() {
  return (
    <section className="bg-[#1e2d4d] text-white py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Find the Right Opportunity. Or the Right Talent.
        </h1>
        <p className="text-lg text-blue-200 mb-10 max-w-xl mx-auto leading-relaxed">
          OnPoint Talent connects skilled professionals with verified employers across New Zealand. Whether you&apos;re hiring or job hunting, we make the match.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 text-base font-semibold bg-[#3b6fd4] text-white rounded-lg hover:bg-blue-600 transition-colors">
            Look for Talent
          </button>
          <button className="px-8 py-3 text-base font-semibold bg-white text-[#1e2d4d] rounded-lg hover:bg-blue-50 transition-colors">
            Find a Job
          </button>
        </div>
      </div>
    </section>
  );
}
