"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

function inputClass(error?: string) {
  const base =
    "w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-[#080e1c] text-[#0f172a] dark:text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 transition";
  return error
    ? `${base} border-red-400 dark:border-red-500 focus:ring-red-400`
    : `${base} border-slate-200 dark:border-[#1e3356] focus:ring-[#2563eb] dark:focus:ring-[#3b82f6]`;
}

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const exchanged = useRef(false);

  useEffect(() => {
    if (!code || exchanged.current) return;
    exchanged.current = true;

    const supabase = createClient();
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        setSessionError("This reset link has expired or is invalid. Please request a new one.");
      } else {
        setReady(true);
      }
    });
  }, [code]);

  function validate() {
    const errs: { password?: string; confirm?: string } = {};
    if (password.length < 8) errs.password = "Password must be at least 8 characters";
    if (password !== confirm) errs.confirm = "Passwords do not match";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setErrors({ password: error.message });
    } else {
      router.push("/login?reset=success");
    }
  }

  if (!code) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060d1a] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm p-10 text-center">
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-4">Invalid or missing reset link.</p>
          <a href="/forgot-password" className="text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] hover:underline">
            Request a new one
          </a>
        </div>
      </div>
    );
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

        <h1 className="text-2xl font-bold text-[#0f172a] dark:text-[#f1f5f9] tracking-tight mb-2">
          Set new password
        </h1>

        {sessionError ? (
          <div className="mt-2">
            <p className="text-sm text-red-500 dark:text-red-400 mb-6">{sessionError}</p>
            <a
              href="/forgot-password"
              className="text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] hover:underline"
            >
              Request a new reset link
            </a>
          </div>
        ) : !ready ? (
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-2">Verifying link…</p>
        ) : (
          <>
            <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-8 leading-relaxed">
              Choose a strong password for your account.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoFocus
                  className={inputClass(errors.password)}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 dark:text-red-400">{errors.password}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your new password"
                  className={inputClass(errors.confirm)}
                />
                {errors.confirm && (
                  <p className="text-xs text-red-500 dark:text-red-400">{errors.confirm}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors shadow-sm disabled:opacity-60"
              >
                {loading ? "Saving…" : "Set new password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
