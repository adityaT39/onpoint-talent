type LinkEntry = { label: string; href: string };

const links: Record<string, LinkEntry[]> = {
  Team: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Services: [
    { label: "Post a Job", href: "/post-job" },
    { label: "Browse Jobs", href: "#" },
    { label: "For Employers", href: "/for-employers" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

// Site footer with brand tagline, link columns, and copyright line
export default function Footer() {
  return (
    <footer className="bg-[#0f2044] dark:bg-[#050b16] text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-0.5 mb-4">
              <span className="text-xl font-bold tracking-tight text-white">OnPoint</span>
              <span className="mx-1.5 text-blue-300 dark:text-[#60a5fa] font-bold">·</span>
              <span className="text-xl font-bold tracking-tight text-blue-300 dark:text-[#60a5fa]">Talent</span>
            </div>
            <p className="text-blue-200 dark:text-[#64748b] text-sm leading-relaxed">
              Connecting talent with opportunity across New Zealand.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, pages]) => (
            <div key={heading}>
              <h4 className="font-semibold text-white text-sm mb-4">{heading}</h4>
              <ul className="flex flex-col gap-2.5">
                {pages.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-blue-200 dark:text-[#64748b] text-sm hover:text-white dark:hover:text-[#94a3b8] transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-800 dark:border-[#1e3356] pt-6 text-center text-blue-300 dark:text-[#64748b] text-sm">
          © {new Date().getFullYear()} OnPoint Talent. Powered by OnPoint Consulting NZ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
