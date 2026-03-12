import { Briefcase, MapPin, Star, Users, TrendingUp, Building2 } from "lucide-react";

// Purely decorative background — animated blobs, dot grid, and floating icons.
// Shared by LoginPage and SignupPage.
export default function AuthPageBackground() {
  return (
    <>
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Blob 1 — blue, top-left */}
      <div
        className="absolute top-[-10%] left-[-8%] w-[520px] h-[520px] rounded-full bg-blue-500/20 dark:bg-blue-500/10 blur-3xl pointer-events-none"
        style={{ animation: "float 8s ease-in-out infinite" }}
      />

      {/* Blob 2 — indigo, bottom-right */}
      <div
        className="absolute bottom-[-8%] right-[-5%] w-[420px] h-[420px] rounded-full bg-indigo-400/20 dark:bg-indigo-400/10 blur-3xl pointer-events-none"
        style={{ animation: "float 10s ease-in-out infinite 2s" }}
      />

      {/* Blob 3 — sky, top-right */}
      <div
        className="absolute top-[25%] right-[5%] w-[220px] h-[220px] rounded-full bg-sky-400/15 dark:bg-sky-400/[0.08] blur-3xl pointer-events-none"
        style={{ animation: "float 7s ease-in-out infinite 1s" }}
      />

      {/* Floating icons */}
      <Briefcase
        className="absolute top-[12%] left-[6%] w-10 h-10 text-blue-600/[0.08] dark:text-blue-400/[0.06] pointer-events-none select-none"
        style={{ animation: "float 8s ease-in-out infinite 0s" }}
      />
      <MapPin
        className="absolute top-[20%] right-[7%] w-8 h-8 text-blue-600/[0.08] dark:text-blue-400/[0.06] pointer-events-none select-none"
        style={{ animation: "float 8s ease-in-out infinite 1.5s" }}
      />
      <Star
        className="absolute bottom-[25%] left-[5%] w-7 h-7 text-blue-600/[0.08] dark:text-blue-400/[0.06] pointer-events-none select-none"
        style={{ animation: "float 8s ease-in-out infinite 0.8s" }}
      />
      <Users
        className="absolute bottom-[15%] right-[8%] w-9 h-9 text-blue-600/[0.08] dark:text-blue-400/[0.06] pointer-events-none select-none"
        style={{ animation: "float 8s ease-in-out infinite 2.5s" }}
      />
      <TrendingUp
        className="absolute top-[55%] left-[3%] w-8 h-8 text-blue-600/[0.08] dark:text-blue-400/[0.06] pointer-events-none select-none"
        style={{ animation: "float 8s ease-in-out infinite 3s" }}
      />
      <Building2
        className="absolute top-[40%] right-[4%] w-10 h-10 text-blue-600/[0.08] dark:text-blue-400/[0.06] pointer-events-none select-none"
        style={{ animation: "float 8s ease-in-out infinite 1s" }}
      />
    </>
  );
}
