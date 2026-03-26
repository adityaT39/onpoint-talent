import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import AuthPageBackground from "@/components/auth/AuthPageBackground";
import PostJobForm from "@/components/jobs/PostJobForm";

export const metadata = {
  title: "Post a Job — OnPoint Talent",
  description: "Post a new job listing on OnPoint Talent. Reach qualified candidates across New Zealand.",
};

// Employer job posting page — form saved to localStorage
export default function PostJobPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden min-h-screen bg-[#eff6ff] dark:bg-[#080e1c] flex items-center justify-center px-6 py-16">
        <AuthPageBackground />
        <PostJobForm />
      </main>
      <Footer />
    </>
  );
}
