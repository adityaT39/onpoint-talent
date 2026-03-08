const links = {
  Team: ["About Us", "Careers", "Contact"],
  Services: ["Post a Job", "Browse Jobs", "For Employers"],
  Legal: ["Privacy Policy", "Terms of Use", "Cookie Policy"],
};

export default function Footer() {
  return (
    <footer className="bg-[#1e2d4d] text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="text-xl font-bold text-white">OnPoint</span>
              <span className="text-xl font-bold text-blue-300">Talent</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Connecting talent with opportunity across New Zealand.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, pages]) => (
            <div key={heading}>
              <h4 className="font-semibold text-white mb-4">{heading}</h4>
              <ul className="flex flex-col gap-2">
                {pages.map((page) => (
                  <li key={page}>
                    <a
                      href="#"
                      className="text-blue-200 text-sm hover:text-white transition-colors"
                    >
                      {page}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-blue-800 pt-6 text-center text-blue-300 text-sm">
          © {new Date().getFullYear()} OnPoint Talent. Powered by OnPoint Consulting NZ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
