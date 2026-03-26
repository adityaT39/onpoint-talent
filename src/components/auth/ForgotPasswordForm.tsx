"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const origin = window.location.origin;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?type=recovery`,
    });

    setLoading(false);
    if (resetError) {
      setError(resetError.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060d1a] flex items-center justify-center px-4">
      <div
        className="w-full max-w-md bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none p-10"
        style={{ animation: "fade-slide-up 0.5s ease-out forwards" }}
      >
        {/* Icon */}
        <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-[#eff6ff] dark:bg-[#152237] flex items-center justify-center">
          <svg className="w-7 h-7 text-[#2563eb] dark:text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        {sent ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#0f172a] dark:text-[#f1f5f9] tracking-tight mb-2">
              Check your inbox
            </h1>
            <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-8 leading-relaxed">
              We&apos;ve sent a password reset link to <span className="font-medium text-[#0f172a] dark:text-[#f1f5f9]">{email}</span>. Click it to set a new password.
            </p>
            <a
              href="/login"
              className="text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] hover:underline"
            >
              Back to login
            </a>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-[#0f172a] dark:text-[#f1f5f9] tracking-tight mb-2">
              Forgot password?
            </h1>
            <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-8 leading-relaxed">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-[#1e3356] bg-white dark:bg-[#080e1c] text-[#0f172a] dark:text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] transition"
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-[#94a3b8]">
              Remember your password?{" "}
              <a href="/login" className="font-semibold text-[#2563eb] dark:text-[#60a5fa] hover:underline">
                Log in
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
