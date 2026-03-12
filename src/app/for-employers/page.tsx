import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ForEmployersContent from "@/components/employers/ForEmployersContent";

export const metadata: Metadata = {
  title: "For Employers — OnPoint Talent",
  description:
    "Post jobs free on OnPoint Talent. Reach qualified New Zealand candidates and unlock full applicant details only when you're ready.",
};

export default function ForEmployersPage() {
  return (
    <>
      <Navbar />
      <main>
        <ForEmployersContent />
      </main>
      <Footer />
    </>
  );
}
