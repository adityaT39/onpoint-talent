import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

export const metadata: Metadata = {
  title: "Terms of Use — OnPoint Talent",
  description: "Terms and conditions for using the OnPoint Talent job board platform.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#eff6ff] dark:bg-[#080e1c] min-h-screen px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-[#0e1a2e] rounded-2xl border border-blue-100 dark:border-[#1e3356] shadow-sm dark:shadow-none p-10">
            <h1 className="text-3xl font-bold text-[#0f172a] dark:text-[#f1f5f9] tracking-tight mb-2">
              Terms of Use
            </h1>
            <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-10">
              Last updated: January 2025
            </p>

            <div className="prose prose-sm max-w-none text-[#374151] dark:text-[#cbd5e1] space-y-8">

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">1. Acceptance of Terms</h2>
                <p className="leading-relaxed">
                  By accessing or using OnPoint Talent (&quot;the Platform&quot;), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Platform. OnPoint Talent is operated by OnPoint Consulting NZ.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">2. Eligibility</h2>
                <p className="leading-relaxed">
                  You must be at least 16 years of age and legally permitted to work in New Zealand to use this Platform as a job seeker. Employers must be a legally registered business or organisation operating in New Zealand.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">3. Accounts</h2>
                <p className="leading-relaxed mb-2">You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.</p>
                <p className="leading-relaxed mb-2">You must provide accurate and complete information when registering. You may not impersonate any person or organisation or provide false information.</p>
                <p className="leading-relaxed">We reserve the right to suspend or terminate accounts that violate these terms or that we reasonably believe are being used fraudulently.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">4. Job Seekers</h2>
                <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                  <li>You may create one account and one profile on the Platform</li>
                  <li>The information in your profile and applications must be truthful and accurate</li>
                  <li>You consent to your profile and application data being shared with employers you apply to</li>
                  <li>You may not use the Platform to spam employers or submit fraudulent applications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">5. Employers</h2>
                <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                  <li>Job listings must be for genuine, legal employment opportunities</li>
                  <li>Listings must not discriminate unlawfully on the basis of age, gender, ethnicity, religion, disability, or any other protected characteristic under New Zealand law</li>
                  <li>Employers may only use applicant data for the purpose of evaluating that specific application</li>
                  <li>Employers must not share, sell, or misuse applicant personal data</li>
                  <li>We reserve the right to remove listings that violate these terms without notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">6. Prohibited Conduct</h2>
                <p className="leading-relaxed mb-2">You must not:</p>
                <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                  <li>Post false, misleading, or fraudulent content</li>
                  <li>Scrape, harvest, or copy data from the Platform without permission</li>
                  <li>Attempt to gain unauthorised access to any part of the Platform</li>
                  <li>Use the Platform for any unlawful purpose</li>
                  <li>Interfere with or disrupt the Platform&apos;s operation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">7. Intellectual Property</h2>
                <p className="leading-relaxed">
                  The Platform, including its design, code, and content, is owned by OnPoint Consulting NZ. You may not reproduce, distribute, or create derivative works from any part of the Platform without our written permission. You retain ownership of content you submit (profile data, resumes, job listings), but grant us a licence to store and display it for the purposes of operating the Platform.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">8. Disclaimer of Warranties</h2>
                <p className="leading-relaxed">
                  The Platform is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that job listings are accurate, that applications will be reviewed, or that use of the Platform will result in employment. We are not a party to any employment contract between job seekers and employers.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">9. Limitation of Liability</h2>
                <p className="leading-relaxed">
                  To the maximum extent permitted by New Zealand law, OnPoint Consulting NZ shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform. Our total liability to you for any claim shall not exceed NZD $100.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">10. Governing Law</h2>
                <p className="leading-relaxed">
                  These terms are governed by the laws of New Zealand. Any disputes shall be subject to the exclusive jurisdiction of the New Zealand courts.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">11. Changes to Terms</h2>
                <p className="leading-relaxed">
                  We may update these terms from time to time. We will notify registered users of material changes by email. Continued use of the Platform after updated terms are posted constitutes your acceptance.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-3">12. Contact</h2>
                <p className="leading-relaxed">
                  Questions about these terms? Email us at <a href="mailto:hello@onpointtalent.co.nz" className="text-[#2563eb] dark:text-[#60a5fa] hover:underline">hello@onpointtalent.co.nz</a>.
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
