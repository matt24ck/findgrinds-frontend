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
              Last updated: September 2026
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">1. Introduction</h2>
              <p>
                FindGrinds is operated by Matthew Callinan Keenan, a sole trader based in Ireland trading as
                FindGrinds ("we", "our", or "us"). We are committed to protecting your personal data
                and respecting your privacy. This Privacy Policy explains how we collect, use, store, and
                protect your information when you use our platform at findgrinds.ie (the "Service").
              </p>
              <p className="mt-4">
                We are the data controller responsible for your personal data.
                For any privacy-related queries, contact us at: <strong>privacy@findgrinds.ie</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">2. Data We Collect</h2>

              <h3 className="text-xl font-semibold text-[#2C3E50] mt-6 mb-3">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, password (stored only as a secure hash), account type (student/parent/tutor)</li>
                <li><strong>Date of Birth (students):</strong> Used to work out whether a student is under 18, so that our child-safety protections apply</li>
                <li><strong>Profile Information:</strong> Profile photo, and for tutors: bio, headline, qualifications (as entered by the tutor; we do not check them), subjects, levels, area, rates and availability</li>
                <li><strong>Garda Vetting (tutors, optional):</strong> A self-declaration made at signup (not shown publicly) and, if you choose to upload one, your vetting document, which we review before showing a &quot;Garda vetted&quot; badge</li>
                <li><strong>Parent Links:</strong> If a parent links to a student account using a code the student generates, we record that link</li>
                <li><strong>Messages:</strong> Messages sent through FindGrinds between students, parents and tutors</li>
                <li><strong>Session and Purchase Data:</strong> Bookings, cancellations, disputes (including any evidence you upload), reviews and ratings, and resources bought or sold</li>
                <li><strong>Reports:</strong> Reports you make about messages, reviews or resources, and reports made about you</li>
                <li><strong>AI Assistant Chats:</strong> Messages you type into our AI chat assistant</li>
                <li><strong>Payment Information:</strong> Card and bank details are collected and held by Stripe, not by us. We keep records of payments, refunds and fees, and Stripe account and customer identifiers.</li>
                <li><strong>Support:</strong> Emails you send us</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#2C3E50] mt-6 mb-3">2.2 Automatically Collected Data</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Technical Data:</strong> IP address (used, for example, to limit repeated requests and protect against abuse), and the basic technical information your browser sends with each request</li>
                <li><strong>Analytics:</strong> If you accept analytics cookies, Google Analytics collects information such as pages visited and device and browser type</li>
                <li><strong>Cookies and Local Storage:</strong> See Section 8 and our <a href="/cookies" className="text-[#2D9B6E] hover:underline">Cookie Policy</a></li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">3. How We Use Your Data</h2>
              <p>We use your personal data for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Service Delivery:</strong> To operate the platform, show tutor profiles, process bookings and purchases, run video sessions, and pay tutors</li>
                <li><strong>Communication:</strong> To send account and booking emails (such as confirmations, reminders, cancellations and message notifications) and to respond to you</li>
                <li><strong>Improvement:</strong> If you consent to analytics cookies, to understand how the site is used and improve it</li>
                <li><strong>Safety:</strong> To protect students, especially those under 18, detect fraud and abuse, review reports, and enforce our Terms (see Section 3.1)</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations, such as keeping financial records</li>
              </ul>
              <p className="mt-4">
                We do not currently send marketing emails. If we start to, we will only do so with your consent,
                and you will be able to opt out at any time.
              </p>

              <h3 className="text-xl font-semibold text-[#2C3E50] mt-6 mb-3">3.1 Safety Measures Involving Messages</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Messages that tutors send to students under 18 are automatically screened for attempts to
                  move contact off FindGrinds (for example, sharing phone numbers or social media handles, or
                  suggesting meeting up). Flagged messages are not blocked, but they are sent to our team for review.
                </li>
                <li>
                  Any participant in a conversation can report a message. Our team reviews reported and flagged
                  messages, including who sent them and who received them, and may suspend accounts.
                </li>
                <li>
                  A parent or guardian who links to a student&apos;s account can see that student&apos;s sessions,
                  purchases, spending and conversations with tutors, and can message tutors on the student&apos;s behalf.
                </li>
                <li>
                  Students under 18 who do not have a linked parent can only send pre-written messages until a
                  parent links to their account.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">4. Legal Basis for Processing (GDPR)</h2>
              <p>Under the General Data Protection Regulation (GDPR), we process your data based on:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Contract:</strong> Processing necessary to provide our services to you</li>
                <li><strong>Legitimate Interests:</strong> To keep the platform secure, protect children and other users (including message screening and reviewing reports), and prevent fraud</li>
                <li><strong>Consent:</strong> For optional analytics cookies (and marketing, if we ever send it)</li>
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
                You can do some of this yourself in your <strong>Account Settings</strong>: download a copy
                of your data (a JSON file containing your profile, date of birth, tutor profile if you have
                one, sessions, messages you have sent, parent links, purchases, resources, Garda vetting
                submissions and transactions), and delete your account. For anything else, email us at <strong>privacy@findgrinds.ie</strong>. We will respond within
                one month.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">6. Data Retention</h2>
              <p>We retain your personal data for as long as necessary to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provide our services to you</li>
                <li>Comply with legal obligations (for example, keeping financial and tax records)</li>
                <li>Resolve disputes, investigate safety reports, and enforce our Terms</li>
              </ul>
              <p className="mt-4">
                When you delete your account from your Account Settings, we straight away remove your name,
                email address, password, date of birth, profile photo, tutor profile details, Garda vetting
                documents and parent links, and cancel any Featured subscription. Your account is replaced by
                an anonymous &quot;Deleted User&quot; record. Records of past sessions and payments are kept in
                this anonymised form for financial and legal purposes. Messages you sent are kept, shown as
                from &quot;Deleted User&quot;, so that the other person&apos;s conversation history stays intact
                and so we can investigate safety reports and disputes; their content may still contain
                anything you wrote in them. Resources a tutor has sold remain available to people who already
                bought them. Some data may also remain for a limited time in backups, and in records held by
                our service providers (such as Stripe) under their own legal obligations. If you want us to
                delete the content of your messages, contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">7. Data Security</h2>
              <p>We implement appropriate security measures including:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Encryption of data in transit (HTTPS/TLS)</li>
                <li>Secure password hashing (bcrypt)</li>
                <li>Card and bank details handled by Stripe rather than stored by us</li>
                <li>Uploaded files (such as vetting documents and paid resources) served only through time-limited links</li>
                <li>Access to admin tools restricted to authorised administrators</li>
                <li>Rate limiting on sign-in and other sensitive endpoints</li>
              </ul>
              <p className="mt-4">
                No system is completely secure, but we work to protect your data and will act promptly,
                including notifying you and the Data Protection Commission where required, if a breach occurs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">8. Cookies</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Necessary (browser storage):</strong> We use your browser&apos;s local storage to keep you
                  signed in, remember your cookie choices, and remember a tutor invite link you followed. These are
                  needed for the site to work.
                </li>
                <li>
                  <strong>Analytics (only with your consent):</strong> Google Analytics cookies, which help us
                  understand how visitors use the site. Google Analytics is not loaded unless you accept analytics cookies.
                </li>
              </ul>
              <p className="mt-4">
                We do not currently use advertising or marketing cookies. When you pay, you are taken to Stripe&apos;s
                checkout page, and during video sessions our video provider may use its own cookies or storage to run
                the call. You can manage your choices at any time on our{' '}
                <a href="/cookies" className="text-[#2D9B6E] hover:underline">Cookie Policy</a> page or in your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">9. Third-Party Services</h2>
              <p>We use the following service providers, who process personal data on our behalf or as needed to provide their service:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Stripe:</strong> Payment processing, tutor payouts (Stripe Connect) and tutor subscriptions. Stripe collects card details and, for tutors, identity and bank details.</li>
                <li><strong>Daily.co:</strong> Video calls for online sessions. Sessions are not recorded.</li>
                <li><strong>Resend:</strong> Sending account, booking and notification emails</li>
                <li><strong>Railway:</strong> Hosting for our backend servers and database (EU – Amsterdam), and storage for uploaded files such as profile photos, vetting documents, dispute evidence and paid resources</li>
                <li><strong>Vercel:</strong> Hosting for our website</li>
                <li><strong>Anthropic:</strong> Powers our AI chat assistant. Messages you type into the assistant are sent to Anthropic to generate a reply.</li>
                <li><strong>Google (Google Analytics):</strong> Website analytics, only if you accept analytics cookies</li>
              </ul>
              <p className="mt-4">
                We share personal data with these providers only as needed for them to provide their services to
                us. We do not sell your personal data. Other users see the information you choose to put on your
                profile, and the information needed to arrange and deliver sessions. We may also share data where
                the law requires it, or where needed to protect someone&apos;s safety.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">10. International Transfers</h2>
              <p>
                Our main database is hosted in the European Union (Amsterdam). Some of our service providers,
                including Anthropic (which is based in the United States), may process data outside the European
                Economic Area (EEA). Where personal data is transferred outside the EEA, we rely on appropriate
                safeguards, such as the European Commission&apos;s Standard Contractual Clauses or an adequacy
                decision.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">11. Children's Privacy</h2>
              <p>
                Students on FindGrinds may be under 18. Students under 18 must have the permission of a parent or
                guardian to use FindGrinds. We ask students for their date of birth so that extra protections
                apply to under-18s: tutor messages to them are screened (see Section 3.1), and until a parent or
                guardian links to their account they can only send pre-written messages. A linked parent or
                guardian can see the student&apos;s sessions, purchases, spending and conversations with tutors.
              </p>
              <p className="mt-4">
                A parent or guardian can contact us at <strong>privacy@findgrinds.ie</strong> to exercise data
                rights on behalf of their child, or if they have any concerns about their child&apos;s data.
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
                <p><strong>Privacy Contact</strong></p>
                <p>Matthew Callinan Keenan, trading as FindGrinds</p>
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
