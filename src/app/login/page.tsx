import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import LoginForm from "@/components/auth/LoginForm";
import AuthPageBackground from "@/components/auth/AuthPageBackground";

export const metadata = { title: "Log In — OnPoint Talent" };

// Login route — centered form card between Navbar and Footer
export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden min-h-screen bg-[#eff6ff] dark:bg-[#080e1c] flex items-center justify-center px-6 py-16">
        <AuthPageBackground />
        <LoginForm />
      </main>
      <Footer />
    </>
  );
}
