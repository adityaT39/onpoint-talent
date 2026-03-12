import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import SeekerDashboard from "@/components/seeker/SeekerDashboard";

export const metadata: Metadata = {
  title: "My Applications — OnPoint Talent",
  description: "Track the status of your job applications on OnPoint Talent.",
};

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#eff6ff] dark:bg-[#080e1c] px-6 py-16">
        <SeekerDashboard />
      </main>
      <Footer />
    </>
  );
}
