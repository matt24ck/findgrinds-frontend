import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Privacy Policy | FindGrinds',
  description: 'Privacy Policy for FindGrinds - How we collect, use, and protect your personal data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-8">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none text-[#5D6D7E]">
            <p className="text-sm text-[#95A5A6] mb-8">
              Last updated: January 2026
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">1. Introduction</h2>
              <p>
                FindGrinds Limited ("we", "our", or "us") is committed to protecting your personal data
                and respecting your privacy. This Privacy Policy explains how we collect, use, store, and
                protect your information when you use our platform at findgrinds.ie (the "Service").
              </p>
              <p className="mt-4">
                We are the data controller responsible for your personal data and are registered in Ireland.
                For any privacy-related queries, contact us at: <strong>privacy@findgrinds.ie</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">2. Data We Collect</h2>

              <h3 className="text-xl font-semibold text-[#2C3E50] mt-6 mb-3">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, password (encrypted), user type (student/parent/tutor)</li>
                <li><strong>Profile Information:</strong> Profile photo, bio, qualifications (tutors), subjects, location</li>
                <li><strong>Payment Information:</strong> Processed securely by Stripe. We do not store full card numbers.</li>
                <li><strong>Communications:</strong> Messages between students and tutors, support inquiries</li>
                <li><strong>Session Data:</strong> Booking details, reviews, ratings</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#2C3E50] mt-6 mb-3">2.2 Automatically Collected Data</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent, clicks, search queries</li>
                <li><strong>Cookies:</strong> See our Cookie section below</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">3. How We Use Your Data</h2>
              <p>We use your personal data for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Service Delivery:</strong> To operate the platform, process bookings, and facilitate payments</li>
                <li><strong>Communication:</strong> To send booking confirmations, reminders, and respond to inquiries</li>
                <li><strong>Improvement:</strong> To analyze usage and improve our services</li>
                <li><strong>Safety:</strong> To detect fraud, enforce our terms, and ensure platform safety</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations</li>
                <li><strong>Marketing:</strong> With your consent, to send promotional materials (you can opt out anytime)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">4. Legal Basis for Processing (GDPR)</h2>
              <p>Under the General Data Protection Regulation (GDPR), we process your data based on:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Contract:</strong> Processing necessary to provide our services to you</li>
                <li><strong>Legitimate Interests:</strong> To improve our services and ensure platform security</li>
                <li><strong>Consent:</strong> For marketing communications and optional cookies</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">5. Your Rights (GDPR)</h2>
              <p>Under GDPR, you have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate personal data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
                <li><strong>Right to Portability:</strong> Receive your data in a machine-readable format</li>
                <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
                <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time for consent-based processing</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, visit your <strong>Account Settings</strong> or email us at{' '}
                <strong>privacy@findgrinds.ie</strong>. We will respond within 30 days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">6. Data Retention</h2>
              <p>We retain your personal data for as long as necessary to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provide our services to you</li>
                <li>Comply with legal obligations (e.g., tax records for 7 years)</li>
                <li>Resolve disputes and enforce agreements</li>
              </ul>
              <p className="mt-4">
                When you delete your account, we anonymize or delete your personal data within 30 days,
                except where retention is required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">7. Data Security</h2>
              <p>We implement appropriate security measures including:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Encryption of data in transit (HTTPS/TLS)</li>
                <li>Encryption of sensitive data at rest (AES-256)</li>
                <li>Secure password hashing (bcrypt)</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and employee training</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">8. Cookies</h2>
              <p>We use the following types of cookies:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Necessary:</strong> Required for the website to function (authentication, security)</li>
                <li><strong>Analytics:</strong> Help us understand how visitors use our site (with your consent)</li>
                <li><strong>Marketing:</strong> Used to deliver relevant ads (with your consent)</li>
              </ul>
              <p className="mt-4">
                You can manage your cookie preferences at any time through our cookie banner or browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">9. Third-Party Services</h2>
              <p>We share data with the following third parties:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Stripe:</strong> Payment processing (PCI-DSS compliant)</li>
                <li><strong>Zoom:</strong> Video session hosting</li>
                <li><strong>SendGrid:</strong> Transactional emails</li>
                <li><strong>AWS:</strong> Cloud hosting (data stored in EU)</li>
              </ul>
              <p className="mt-4">
                All third parties are contractually bound to protect your data and comply with GDPR.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">10. International Transfers</h2>
              <p>
                Your data is primarily stored within the European Economic Area (EEA). Where transfers
                outside the EEA are necessary, we ensure appropriate safeguards such as Standard
                Contractual Clauses (SCCs) are in place.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">11. Children's Privacy</h2>
              <p>
                Our service is intended for users aged 14 and older. Users under 18 should have parental
                consent. We do not knowingly collect data from children under 14. If you believe we have
                collected such data, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">12. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically. We will notify you of significant changes
                via email or a prominent notice on our website. Continued use of the Service after changes
                constitutes acceptance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">13. Contact Us</h2>
              <p>For privacy-related inquiries or to exercise your rights:</p>
              <div className="bg-[#F8F9FA] p-6 rounded-lg mt-4">
                <p><strong>Data Protection Officer</strong></p>
                <p>FindGrinds Limited</p>
                <p>Email: privacy@findgrinds.ie</p>
                <p className="mt-4">
                  You also have the right to lodge a complaint with the Irish Data Protection Commission
                  (DPC) at <a href="https://www.dataprotection.ie" className="text-[#2D9B6E] hover:underline">www.dataprotection.ie</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
