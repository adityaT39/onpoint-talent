"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function VerifyEmailForm() {
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleResend() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const email = session?.user?.email ?? sessionStorage.getItem("pending_verify_email");
    if (!email) {
      setError("No email found. Please sign up again.");
      return;
    }
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    if (resendError) setError(resendError.message);
    else setResent(true);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060d1a] flex items-center justify-center px-4">
      <div
        className="w-full max-w-md bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none p-10 text-center"
        style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}
      >
        {/* Icon */}
        <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-[#eff6ff] dark:bg-[#152237] flex items-center justify-center">
          <svg className="w-7 h-7 text-[#2563eb] dark:text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-[#0f172a] dark:text-[#f1f5f9] tracking-tight mb-2">
          Check your inbox
        </h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-8 leading-relaxed">
          We&apos;ve sent you a verification link. Click it to confirm your email and access your account.
        </p>

        {resent ? (
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4">
            Verification email resent!
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="w-full py-3 text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] border border-[#2563eb] dark:border-[#3b82f6] rounded-full hover:bg-[#eff6ff] dark:hover:bg-[#152237] transition-colors mb-4"
          >
            Resend verification email
          </button>
        )}

        {error && (
          <p className="text-xs text-red-500 dark:text-red-400 mb-4">{error}</p>
        )}

        <p className="text-xs text-[#94a3b8]">
          Already verified?{" "}
          <a href="/login" className="font-semibold text-[#2563eb] dark:text-[#60a5fa] hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
