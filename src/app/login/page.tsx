import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import LoginForm from "@/components/auth/LoginForm";
import AuthPageBackground from "@/components/auth/AuthPageBackground";

export const metadata = {
  title: "Log In — OnPoint Talent",
  description: "Log in to your OnPoint Talent account to manage applications and job listings.",
};

type Props = { searchParams: Promise<{ reset?: string; error?: string }> };

// Login route — centered form card between Navbar and Footer
export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const resetSuccess = params.reset === "success";
  const verificationError = params.error === "verification_failed";

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden min-h-screen bg-[#eff6ff] dark:bg-[#080e1c] flex items-center justify-center px-6 py-16">
        <AuthPageBackground />
        <LoginForm resetSuccess={resetSuccess} verificationError={verificationError} />
      </main>
      <Footer />
    </>
  );
}
