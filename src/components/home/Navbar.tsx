"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";

// Sticky top navigation with logo, nav links, theme toggle, and auth actions
export default function Navbar() {
  const { user, mounted, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isLoggedIn = mounted && !!user;
  const isEmployer = isLoggedIn && user?.role === "employer";
  const isSeeker = isLoggedIn && user?.role === "seeker";
  const firstName = user?.name.split(" ")[0] ?? "";

  const linkClass = "text-sm font-medium text-slate-600 hover:text-[#2563eb] dark:text-slate-400 dark:hover:text-white transition-colors";
  const mobileLinkClass = "block py-2 text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9] hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-colors";

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-[#080e1c] border-b border-slate-200 dark:border-[#1e3356]">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-0.5">
          <span className="text-xl font-bold tracking-tight text-[#0f2044] dark:text-[#f1f5f9]">OnPoint</span>
          <span className="mx-1.5 text-[#2563eb] dark:text-[#60a5fa] font-bold">·</span>
          <span className="text-xl font-bold tracking-tight text-[#2563eb] dark:text-[#60a5fa]">Talent</span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {!mounted ? (
            // Skeleton nav links
            <>
              <div className="w-20 h-4 rounded bg-slate-200 dark:bg-[#1e3356] animate-pulse" />
              <div className="w-24 h-4 rounded bg-slate-200 dark:bg-[#1e3356] animate-pulse" />
              <div className="w-14 h-4 rounded bg-slate-200 dark:bg-[#1e3356] animate-pulse" />
            </>
          ) : isEmployer ? (
            <>
              <a href="/post-job" className={linkClass}>Post a Job</a>
              <a href="/employer" className={linkClass}>Dashboard</a>
              <a href="/pricing" className={linkClass}>Pricing</a>
            </>
          ) : isSeeker ? (
            <>
              <a href="/jobs" className={linkClass}>Browse Jobs</a>
              <a href="/dashboard" className={linkClass}>My Applications</a>
              <a href="/profile" className={linkClass}>Profile</a>
            </>
          ) : (
            <>
              <a href="/jobs" className={linkClass}>Find Jobs</a>
              <a href="/for-employers" className={linkClass}>For Employers</a>
            </>
          )}
          {mounted && <a href="/about" className={linkClass}>About</a>}
        </div>

        {/* Desktop Auth + Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {!mounted ? (
            // Skeleton — same size as the logged-in/out buttons to prevent layout shift
            <div className="flex items-center gap-3">
              <div className="w-16 h-4 rounded bg-slate-200 dark:bg-[#1e3356] animate-pulse" />
              <div className="w-20 h-9 rounded-full bg-slate-200 dark:bg-[#1e3356] animate-pulse" />
            </div>
          ) : isLoggedIn ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-slate-100 dark:hover:bg-[#1e3356] transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-200 dark:ring-[#1e3356] flex-shrink-0">
                  {user?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#2563eb] dark:bg-[#3b82f6] flex items-center justify-center text-white text-xs font-bold select-none">
                      {firstName[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
                  {firstName}
                </span>
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 dark:border-[#1e3356] bg-white dark:bg-[#0e1a2e] shadow-lg py-1.5 z-50">
                  {isEmployer ? (
                    <>
                      <a href="/employer" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-[#0f172a] dark:text-[#f1f5f9] hover:bg-slate-50 dark:hover:bg-[#152237]">Dashboard</a>
                      <a href="/post-job" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-[#0f172a] dark:text-[#f1f5f9] hover:bg-slate-50 dark:hover:bg-[#152237]">Post a Job</a>
                      <a href="/pricing" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-[#0f172a] dark:text-[#f1f5f9] hover:bg-slate-50 dark:hover:bg-[#152237]">Pricing</a>
                    </>
                  ) : (
                    <>
                      <a href="/dashboard" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-[#0f172a] dark:text-[#f1f5f9] hover:bg-slate-50 dark:hover:bg-[#152237]">My Applications</a>
                      <a href="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-[#0f172a] dark:text-[#f1f5f9] hover:bg-slate-50 dark:hover:bg-[#152237]">Profile</a>
                    </>
                  )}
                  <div className="border-t border-slate-100 dark:border-[#1e3356] my-1" />
                  <button
                    onClick={() => { setProfileOpen(false); logout(); }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-50 dark:hover:bg-[#152237]"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <a href="/login" className={linkClass}>Log in</a>
              <a href="/signup" className="px-5 py-2.5 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors">
                Sign Up
              </a>
            </>
          )}
        </div>

        {/* Mobile: Theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="p-2 rounded-lg text-[#0f172a] dark:text-[#f1f5f9] hover:bg-slate-100 dark:hover:bg-[#1e3356] transition-colors"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-[#1e3356] bg-white dark:bg-[#080e1c] px-6 py-4">
          {/* Nav links */}
          <div className="flex flex-col gap-1 mb-4">
            {isEmployer ? (
              <>
                <a href="/post-job" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Post a Job</a>
                <a href="/employer" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Dashboard</a>
                <a href="/pricing" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Pricing</a>
              </>
            ) : isSeeker ? (
              <>
                <a href="/jobs" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Browse Jobs</a>
                <a href="/dashboard" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>My Applications</a>
                <a href="/profile" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Profile</a>
              </>
            ) : (
              <>
                <a href="/jobs" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Find Jobs</a>
                <a href="/for-employers" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>For Employers</a>
              </>
            )}
            <a href="/about" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>About</a>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-[#1e3356] my-3" />

          {/* Auth section */}
          {!mounted ? null : isLoggedIn ? (
            <div className="flex items-center justify-between">
              <a
                href={isEmployer ? "/employer" : "/profile"}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-200 dark:ring-[#1e3356] flex-shrink-0">
                  {user?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#2563eb] dark:bg-[#3b82f6] flex items-center justify-center text-white text-xs font-bold select-none">
                      {firstName[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">
                  {firstName}
                </span>
              </a>
              <button
                onClick={() => { setMenuOpen(false); logout(); }}
                className="text-sm font-medium text-[#64748b] dark:text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <a
                href="/login"
                className="block w-full py-2.5 text-sm font-semibold text-center text-[#0f172a] dark:text-[#f1f5f9] border border-slate-200 dark:border-[#1e3356] rounded-full hover:bg-slate-50 dark:hover:bg-[#1e3356] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Log in
              </a>
              <a
                href="/signup"
                className="block w-full py-2.5 text-sm font-semibold text-center text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </a>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
