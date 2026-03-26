import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password — OnPoint Talent",
  description: "Reset your OnPoint Talent password. Enter your email to receive a reset link.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
