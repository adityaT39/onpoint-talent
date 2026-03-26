import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import JobDetail from "@/components/jobs/JobDetail";
import { createClient } from "@/lib/supabase-server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("jobs")
    .select("title, company, location, type, salary")
    .eq("id", id)
    .single();
  if (!data) return { title: "Job Listing — OnPoint Talent" };
  return {
    title: `${data.title} at ${data.company} — OnPoint Talent`,
    description: `${data.type} · ${data.location}${data.salary ? ` · ${data.salary}` : ""}. Apply for ${data.title} at ${data.company} on OnPoint Talent.`,
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#eff6ff] dark:bg-[#080e1c] px-6 py-16">
        <JobDetail jobId={id} />
      </main>
      <Footer />
    </>
  );
}
