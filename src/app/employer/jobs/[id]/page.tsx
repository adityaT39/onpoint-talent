import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ApplicationsReview from "@/components/employer/ApplicationsReview";

export const metadata: Metadata = {
  title: "Applications — OnPoint Talent",
  robots: { index: false, follow: false },
};

export default async function ApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#eff6ff] dark:bg-[#080e1c] px-6 py-16">
        <ApplicationsReview jobId={id} />
      </main>
      <Footer />
    </>
  );
}
