export default function CtaBanner() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#1a1a2e] mb-8">
          Ready to get started
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 text-base font-semibold text-white bg-[#3b6fd4] rounded-lg hover:bg-blue-700 transition-colors">
            Browse All Jobs
          </button>
          <button className="px-8 py-3 text-base font-semibold text-[#3b6fd4] border border-[#3b6fd4] rounded-lg hover:bg-blue-50 transition-colors">
            Post a Job
          </button>
        </div>
      </div>
    </section>
  );
}
