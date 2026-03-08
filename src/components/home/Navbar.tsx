export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-[#1e2d4d]">OnPoint</span>
          <span className="text-xl font-bold text-[#3b6fd4]">Talent</span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-gray-600 hover:text-[#3b6fd4] font-medium transition-colors">
            Jobs
          </a>
          <a href="#" className="text-gray-600 hover:text-[#3b6fd4] font-medium transition-colors">
            About
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <button className="px-5 py-2 text-sm font-semibold text-[#3b6fd4] border border-[#3b6fd4] rounded-lg hover:bg-blue-50 transition-colors">
            Login
          </button>
          <button className="px-5 py-2 text-sm font-semibold text-white bg-[#3b6fd4] rounded-lg hover:bg-blue-700 transition-colors">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
