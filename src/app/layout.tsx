import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://onpointtalent.co.nz"),
  title: "OnPoint Talent — Find the Right Opportunity",
  description: "OnPoint Talent connects job seekers with verified employers. Find your next role or hire the right talent today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script prevents flash of wrong theme on load by applying saved preference before paint */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');})();` }} />
      </head>
      <body className={`${inter.variable} antialiased bg-white dark:bg-[#080e1c]`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
