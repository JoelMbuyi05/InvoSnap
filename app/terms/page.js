// app/terms/page.js
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TermsPage() {
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
              <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
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
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-700 leading-relaxed">
              By using InvoSnap, you agree to these Terms of Service ("Terms"). If you do not agree, do not use the site or app.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Service Description</h2>
            <p className="text-slate-700 leading-relaxed">
              InvoSnap offers tools for creating professional invoices, managing clients, sending invoices via email and WhatsApp, and tracking invoice status. Free usage is provided without limits on the number of invoices or clients.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Acceptable Use</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>Do not use the platform for unlawful, offensive, fraudulent, or abusive activities.</li>
              <li>Do not create fraudulent or misleading invoices.</li>
              <li>Do not upload copyrighted, harmful, or infringing content.</li>
              <li>Respect the privacy and data of your clients and other users.</li>
              <li>Do not spam or harass invoice recipients.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Content Ownership and License</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>Users retain ownership of their uploaded content (invoices, client data, business information).</li>
              <li>By uploading, you grant us a license to display, store, and transmit content solely for providing our service.</li>
              <li>We may remove content that violates these terms or the law.</li>
              <li>You are responsible for the accuracy and legality of your invoices.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Payment and Billing</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>InvoSnap is currently free to use with all features included.</li>
              <li>We may introduce paid plans in the future with advance notice.</li>
              <li>InvoSnap does not process payments between you and your clients.</li>
              <li>You are responsible for collecting payment from your clients.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Suspension and Termination</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>We may suspend or terminate accounts for violation of these Terms or abuse of the service.</li>
              <li>Users may delete their account and request data deletion at any time.</li>
              <li>Upon termination, public invoice links may become inaccessible.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Liability and Disclaimers</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>The platform is provided "as is." We do our best, but cannot guarantee uninterrupted, error-free service or data preservation.</li>
              <li>We are not liable for damages resulting from downtime, bugs, data loss, or unauthorized access.</li>
              <li>We are not responsible for payment disputes between you and your clients.</li>
              <li>You use InvoSnap at your own risk and should maintain backups of important data.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Modifications</h2>
            <p className="text-slate-700 leading-relaxed">
              We reserve the right to modify these Terms. Updates will be posted on this page, and major changes communicated to users via email or in-app notification.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Questions?</h2>
            <p className="text-slate-700 leading-relaxed">
              If you have any questions about these Terms of Service, please email us at{' '}
              <a href="mailto:joelmbuyi700@gmail.com" className="text-blue-600 hover:text-blue-700 font-semibold">
                joelmbuyi700@gmail.com
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