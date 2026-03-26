import type { Metadata } from "next";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";

export const metadata: Metadata = {
  title: "Verify Email — OnPoint Talent",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return <VerifyEmailForm />;
}
