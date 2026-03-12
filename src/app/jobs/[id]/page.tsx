import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import JobDetail from "@/components/jobs/JobDetail";

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
