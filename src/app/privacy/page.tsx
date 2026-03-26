import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — OnPoint Talent",
  description: "How OnPoint Talent collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#eff6ff] dark:bg-[#080e1c] min-h-screen px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none p-10">
            <h1 className="text-3xl font-bold text-[#0f172a] dark:text-[#f1f5f9] tracking-tight mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-10">
              Last updated: January 2025
            </p>

            <div className="prose prose-sm max-w-none text-[#374151] dark:text-[#cbd5e1] space-y-8">

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">1. Who We Are</h2>
                <p className="leading-relaxed">
                  OnPoint Talent is operated by OnPoint Consulting NZ. We run a job board platform connecting job seekers with employers across New Zealand. This policy explains what personal information we collect, how we use it, and your rights under the New Zealand Privacy Act 2020.
                </p>
                <p className="leading-relaxed mt-2">
                  For privacy enquiries, contact us at: <a href="mailto:hello@onpointtalent.co.nz" className="text-[#2563eb] dark:text-[#60a5fa] hover:underline">hello@onpointtalent.co.nz</a>
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">2. Information We Collect</h2>
                <p className="leading-relaxed mb-2"><strong className="text-[#0f172a] dark:text-[#f1f5f9]">Account information:</strong> When you register, we collect your name, email address, and role (job seeker or employer).</p>
                <p className="leading-relaxed mb-2"><strong className="text-[#0f172a] dark:text-[#f1f5f9]">Profile information:</strong> Job seekers may optionally provide a phone number, location, professional summary, skills, work experience, education history, and a resume (PDF).</p>
                <p className="leading-relaxed mb-2"><strong className="text-[#0f172a] dark:text-[#f1f5f9]">Application data:</strong> When you apply for a job, we collect the information you submit in the application form, including cover letters and any resume you upload.</p>
                <p className="leading-relaxed mb-2"><strong className="text-[#0f172a] dark:text-[#f1f5f9]">Employer information:</strong> Employers provide company name, contact email, and job listing details.</p>
                <p className="leading-relaxed"><strong className="text-[#0f172a] dark:text-[#f1f5f9]">Usage data:</strong> We may collect basic usage information (page visits, feature use) to improve the platform. We do not use third-party advertising trackers.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">3. How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                  <li>To create and manage your account</li>
                  <li>To match job seekers with relevant job listings</li>
                  <li>To share your application and profile with the employer you apply to</li>
                  <li>To send transactional emails (e.g. application status updates)</li>
                  <li>To improve and maintain the platform</li>
                  <li>To comply with our legal obligations</li>
                </ul>
                <p className="leading-relaxed mt-3">We do not sell your personal information to third parties. We do not use your data for advertising purposes.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">4. Who We Share Your Data With</h2>
                <p className="leading-relaxed mb-2"><strong className="text-[#0f172a] dark:text-[#f1f5f9]">Employers:</strong> When you submit a job application, the employer who posted the listing can see your application details, profile, and resume.</p>
                <p className="leading-relaxed mb-2"><strong className="text-[#0f172a] dark:text-[#f1f5f9]">Service providers:</strong> We use Supabase (database and file storage) and Resend (email delivery). These providers process data on our behalf under appropriate data processing agreements.</p>
                <p className="leading-relaxed">We do not share your data with any other third parties without your explicit consent, except where required by law.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">5. Data Storage and Security</h2>
                <p className="leading-relaxed">
                  Your data is stored securely using Supabase, hosted in data centres with industry-standard security controls. Resumes and files are stored in private, access-controlled storage buckets. We use row-level security to ensure users can only access their own data.
                </p>
                <p className="leading-relaxed mt-2">
                  No method of transmission or storage is 100% secure. If you believe your account has been compromised, contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">6. Your Rights</h2>
                <p className="leading-relaxed mb-2">Under the New Zealand Privacy Act 2020, you have the right to:</p>
                <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your account and associated data</li>
                  <li>Withdraw consent for optional data processing</li>
                </ul>
                <p className="leading-relaxed mt-3">
                  To exercise any of these rights, email us at <a href="mailto:hello@onpointtalent.co.nz" className="text-[#2563eb] dark:text-[#60a5fa] hover:underline">hello@onpointtalent.co.nz</a>. We will respond within 20 working days.
                </p>
              </section>

              <section id="cookies">
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">7. Cookies</h2>
                <p className="leading-relaxed">
                  We use minimal cookies required for the platform to function — specifically, authentication session cookies managed by Supabase. We also store your dark/light mode preference in your browser&apos;s local storage.
                </p>
                <p className="leading-relaxed mt-2">
                  We do not use advertising cookies, analytics cookies, or third-party tracking pixels.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">8. Data Retention</h2>
                <p className="leading-relaxed">
                  We retain your account and profile data for as long as your account is active. Application data is retained for up to 2 years to allow employers to refer back to past candidates. You may request earlier deletion by contacting us.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">9. Changes to This Policy</h2>
                <p className="leading-relaxed">
                  We may update this policy from time to time. We will notify registered users of significant changes by email. Continued use of the platform after changes take effect constitutes acceptance of the updated policy.
                </p>
              </section>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
