import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

export const metadata: Metadata = {
  title: "Page Not Found — OnPoint Talent",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#eff6ff] dark:bg-[#080e1c] flex items-center justify-center px-6 py-16">
        <div
          className="max-w-md w-full bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none p-12 text-center"
          style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}
        >
          <p className="text-6xl font-black text-[#2563eb] dark:text-[#3b82f6] mb-4 tracking-tight">
            404
          </p>
          <h1 className="text-xl font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-3">
            Page not found
          </h1>
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/jobs"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm"
            >
              Browse Jobs
            </a>
            <a
              href="/"
              className="px-6 py-2.5 text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] border border-[#2563eb] dark:border-[#3b82f6] rounded-full hover:bg-[#eff6ff] dark:hover:bg-[#152237] transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
