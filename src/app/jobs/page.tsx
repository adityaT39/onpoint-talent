import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import JobListings from "@/components/jobs/JobListings";

export const metadata: Metadata = {
  title: "Browse Jobs — OnPoint Talent",
  description: "Find your next opportunity. Browse verified job listings from employers on OnPoint Talent.",
};

export default function JobsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#eff6ff] dark:bg-[#080e1c] px-6 py-16">
        <JobListings />
      </main>
      <Footer />
    </>
  );
}
