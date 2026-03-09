import ThemeToggle from "./ThemeToggle";

// Sticky top navigation with logo, nav links, theme toggle, and auth actions
export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-[#080e1c] border-b border-slate-200 dark:border-[#1e3356]">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-0.5">
          <span className="text-xl font-bold tracking-tight text-[#0f2044] dark:text-[#f1f5f9]">OnPoint</span>
          <span className="mx-1.5 text-[#2563eb] dark:text-[#60a5fa] font-bold">·</span>
          <span className="text-xl font-bold tracking-tight text-[#2563eb] dark:text-[#60a5fa]">Talent</span>
        </a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#2563eb] dark:text-slate-400 dark:hover:text-white transition-colors">
            Find Jobs
          </a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#2563eb] dark:text-slate-400 dark:hover:text-white transition-colors">
            For Employers
          </a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#2563eb] dark:text-slate-400 dark:hover:text-white transition-colors">
            About
          </a>
        </div>

        {/* Auth + Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#2563eb] dark:text-slate-400 dark:hover:text-white transition-colors">
            Log in
          </a>
          <button className="px-5 py-2.5 text-sm font-semibold text-white bg-[#2563eb] dark:bg-[#3b82f6] rounded-full hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] transition-colors">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
