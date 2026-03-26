import { Suspense } from "react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import SignupForm from "@/components/auth/SignupForm";
import AuthPageBackground from "@/components/auth/AuthPageBackground";

export const metadata = {
  title: "Sign Up — OnPoint Talent",
  description: "Create your free OnPoint Talent account. Find jobs or post listings as an employer.",
};

// Signup route — centered form card between Navbar and Footer
export default function SignupPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden min-h-screen bg-[#eff6ff] dark:bg-[#080e1c] flex items-center justify-center px-6 py-16">
        <AuthPageBackground />
        <Suspense>
          <SignupForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
