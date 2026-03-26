import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";

export const metadata: Metadata = {
  title: "OnPoint Talent — Find the Right Opportunity",
  description: "Browse verified job listings and connect with top employers in New Zealand. Your next career move starts here.",
};
import HeroSection from "@/components/home/HeroSection";
import WhySection from "@/components/home/WhySection";
import HowItWorks from "@/components/home/HowItWorks";
import ConsultingSection from "@/components/home/ConsultingSection";
import FeaturedJobs from "@/components/home/FeaturedJobs";
import CtaBanner from "@/components/home/CtaBanner";
import Footer from "@/components/home/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <WhySection />
        <HowItWorks />
        <ConsultingSection />
        <FeaturedJobs />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
