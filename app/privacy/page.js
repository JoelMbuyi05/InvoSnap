// app/privacy/page.js
import { Zap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-6 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
              <p className="text-slate-600 text-sm mt-1">Last updated: February 10, 2025</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 sm:px-6 py-10 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
            <p className="text-slate-700 leading-relaxed">
              Welcome to InvoSnap! Your privacy is important to us. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your personal data. If you have questions, reach out to our support team.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              We may collect the following user data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li><strong>Personal Information:</strong> Name, email address, business information.</li>
              <li><strong>Invoice Data:</strong> Client details, invoice amounts, payment terms.</li>
              <li><strong>Usage Data:</strong> Analytics and feature usage patterns.</li>
              <li><strong>Cookies:</strong> Used to maintain sessions and track usage patterns.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>To operate, maintain, and improve the platform.</li>
              <li>To generate and send invoices on your behalf.</li>
              <li>To respond to support requests and feedback.</li>
              <li>To display your content (invoices, client data) to authorized users.</li>
              <li>To analyze usage and improve features.</li>
              <li>To send occasional notifications or updates (you may opt out).</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Information Sharing and Disclosure</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>We do not sell your personal data.</li>
              <li>Third-party providers (Firebase, Resend) may process data solely to deliver our service.</li>
              <li>Invoice data is shared only with recipients you explicitly specify (clients).</li>
              <li>Information may be disclosed if required by law or to enforce terms and protect users.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Storage and Security</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>Data is stored securely using Firebase (Google) with modern encryption and access controls.</li>
              <li>We retain user data as long as your account is active or as necessary for our services.</li>
              <li>You can request data deletion at any time by contacting support.</li>
              <li>Invoices sent to clients remain accessible via public links until deleted.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Rights</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data.</li>
              <li><strong>Correction:</strong> Update inaccurate personal data.</li>
              <li><strong>Deletion:</strong> Request erasure of your data and all associated invoices.</li>
              <li><strong>Export:</strong> Download all your data in a portable format.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Age Restrictions</h2>
            <p className="text-slate-700 leading-relaxed">
              No age restriction. InvoSnap is available to users of all ages who can legally enter into contracts in their jurisdiction.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Changes to This Policy</h2>
            <p className="text-slate-700 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this page, and significant updates will be communicated via email or in-app notification.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Questions?</h2>
            <p className="text-slate-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please email us at{' '}
              <a href="mailto:support@invosnap.app" className="text-blue-600 hover:text-blue-700 font-semibold">
                support@invosnap.app
              </a>
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} InvoSnap. All rights reserved.</p>
      </footer>
    </div>
  );
}