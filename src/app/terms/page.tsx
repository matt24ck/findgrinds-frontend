import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Terms of Service | FindGrinds',
  description: 'Terms of Service for FindGrinds - The rules and guidelines for using our tutoring platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-8">Terms of Service</h1>

          <div className="prose prose-lg max-w-none text-[#5D6D7E]">
            <p className="text-sm text-[#95A5A6] mb-8">
              Last updated: January 2026
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">1. Acceptance of Terms</h2>
              <p>
                Welcome to FindGrinds. By accessing or using our platform at findgrinds.ie (the "Service"),
                you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms,
                please do not use our Service.
              </p>
              <p className="mt-4">
                These Terms constitute a legally binding agreement between you and FindGrinds Limited
                ("we", "our", or "us"), a company registered in Ireland.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">2. Description of Service</h2>
              <p>
                FindGrinds is an online marketplace that connects students and parents with qualified tutors
                for Junior Certificate and Leaving Certificate exam preparation in Ireland. Our Service includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Tutor discovery and search functionality</li>
                <li>Session booking and scheduling</li>
                <li>Secure payment processing</li>
                <li>Educational resource marketplace</li>
                <li>Communication tools between students and tutors</li>
                <li>Review and rating system</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">3. User Accounts</h2>

              <h3 className="text-xl font-semibold text-[#2C3E50] mt-6 mb-3">3.1 Account Registration</h3>
              <p>
                To use certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information as needed</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#2C3E50] mt-6 mb-3">3.2 Account Types</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Student:</strong> Users seeking tutoring services</li>
                <li><strong>Parent:</strong> Users managing bookings for their children</li>
                <li><strong>Tutor:</strong> Qualified educators offering tutoring services</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#2C3E50] mt-6 mb-3">3.3 Age Requirements</h3>
              <p>
                You must be at least 14 years old to use our Service. Users under 18 must have parental
                consent. Parents may create accounts to manage their children's tutoring.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">4. Tutor Requirements</h2>
              <p>Tutors on our platform agree to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provide accurate information about qualifications and experience</li>
                <li>Obtain and maintain Garda vetting where required</li>
                <li>Deliver high-quality tutoring services as advertised</li>
                <li>Maintain professional conduct with all students</li>
                <li>Comply with all applicable Irish laws and regulations</li>
                <li>Not engage in any inappropriate conduct with minors</li>
              </ul>
              <p className="mt-4">
                We reserve the right to verify tutor credentials and remove any tutor who violates these
                requirements or receives consistent negative feedback.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">5. Bookings and Sessions</h2>

              <h3 className="text-xl font-semibold text-[#2C3E50] mt-6 mb-3">5.1 Booking Process</h3>
              <p>
                When you book a session through our platform, you enter into a direct agreement with the
                tutor. FindGrinds facilitates this connection but is not a party to the tutoring agreement.
              </p>

              <h3 className="text-xl font-semibold text-[#2C3E50] mt-6 mb-3">5.2 Cancellation Policy</h3>
              <p>
                Each tutor sets their own cancellation policy, including the required notice period and
                refund percentage for late cancellations. You can view a tutor&apos;s cancellation policy
                on their profile before booking a session.
              </p>
              <p className="mt-4">
                Tutors who cancel sessions repeatedly may have their accounts suspended.
              </p>

              <h3 className="text-xl font-semibold text-[#2C3E50] mt-6 mb-3">5.3 Session Conduct</h3>
              <p>
                All sessions must be conducted professionally. Recording sessions without consent is
                prohibited. Both parties should arrive on time and be prepared for the session.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">6. Payments and Fees</h2>

              <h3 className="text-xl font-semibold text-[#2C3E50] mt-6 mb-3">6.1 Payment Processing</h3>
              <p>
                All payments are processed securely through Stripe. By making a payment, you agree to
                Stripe's terms of service. We do not store full payment card details.
              </p>

              <h3 className="text-xl font-semibold text-[#2C3E50] mt-6 mb-3">6.2 Platform Fees</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Tutoring sessions:</strong> 15% platform fee (deducted from tutor earnings)</li>
                <li><strong>Resource sales:</strong> 15% platform fee</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#2C3E50] mt-6 mb-3">6.3 Tutor Payouts</h3>
              <p>
                Tutors receive their earnings minus platform fees. Payouts are processed weekly via
                Stripe Connect. Tutors are responsible for their own tax obligations.
              </p>

              <h3 className="text-xl font-semibold text-[#2C3E50] mt-6 mb-3">6.4 Featured Tutor Subscriptions</h3>
              <p>
                Tutors may subscribe to featured placement tiers. Subscriptions auto-renew monthly
                unless cancelled. No refunds for partial subscription periods.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">7. Educational Resources</h2>
              <p>
                Tutors may upload and sell educational resources through our platform. By uploading content,
                tutors confirm they own or have rights to distribute the material. Purchased resources are
                for personal educational use only and may not be redistributed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">8. Prohibited Conduct</h2>
              <p>Users may not:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Impersonate others or provide false information</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Circumvent the platform to avoid fees</li>
                <li>Upload malicious content or spam</li>
                <li>Infringe on intellectual property rights</li>
                <li>Use the platform for any illegal purpose</li>
                <li>Attempt to access others' accounts without permission</li>
                <li>Scrape or collect user data without consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">9. Intellectual Property</h2>
              <p>
                The FindGrinds name, logo, and platform design are our intellectual property. Users retain
                ownership of content they create but grant us a license to display it on the platform.
                Educational resources remain the property of their creators.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">10. Limitation of Liability</h2>
              <p>
                FindGrinds is a marketplace connecting tutors and students. We do not guarantee:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>The quality or outcome of tutoring sessions</li>
                <li>Academic results or exam performance</li>
                <li>Tutor qualifications beyond what is verified</li>
                <li>Continuous, uninterrupted access to the platform</li>
              </ul>
              <p className="mt-4">
                To the maximum extent permitted by Irish law, FindGrinds shall not be liable for any
                indirect, incidental, special, or consequential damages arising from your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">11. Dispute Resolution</h2>
              <p>
                If you have a dispute with a tutor or another user, please contact us first at{' '}
                <strong>support@findgrinds.ie</strong>. We will attempt to resolve disputes informally.
                If informal resolution fails, disputes shall be governed by Irish law and subject to the
                jurisdiction of the Irish courts.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">12. Termination</h2>
              <p>
                We may suspend or terminate your account for violations of these Terms or for any other
                reason at our discretion. You may close your account at any time through your account
                settings. Upon termination, your right to use the Service ceases immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">13. Changes to Terms</h2>
              <p>
                We may update these Terms periodically. We will notify you of significant changes via
                email or a notice on our website. Continued use of the Service after changes constitutes
                acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">14. Contact Us</h2>
              <p>For questions about these Terms of Service:</p>
              <div className="bg-[#F8F9FA] p-6 rounded-lg mt-4">
                <p><strong>FindGrinds Limited</strong></p>
                <p>Email: support@findgrinds.ie</p>
                <p>Legal: legal@findgrinds.ie</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
