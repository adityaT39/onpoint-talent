import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import EmployerDashboard from "@/components/employer/EmployerDashboard";

export const metadata: Metadata = {
  title: "Employer Dashboard — OnPoint Talent",
  description: "Manage your job postings and review applicants on OnPoint Talent.",
};

export default function EmployerPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#eff6ff] dark:bg-[#080e1c] px-6 py-16">
        <EmployerDashboard />
      </main>
      <Footer />
    </>
  );
}
