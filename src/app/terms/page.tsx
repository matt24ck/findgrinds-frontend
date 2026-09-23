import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Terms of Service | FindGrinds',
  description: 'Terms of Service for FindGrinds - The rules and guidelines for using our tutoring platform.',
};

const h2 = 'text-2xl font-bold text-[#2C3E50] mb-4';
const h3 = 'text-xl font-semibold text-[#2C3E50] mt-6 mb-3';
const list = 'list-disc pl-6 space-y-2 mt-4';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-8">Terms of Service</h1>

          <div className="prose prose-lg max-w-none text-[#5D6D7E]">
            <p className="text-sm text-[#95A5A6] mb-8">
              Last updated: September 2026
            </p>

            <section className="mb-8">
              <h2 className={h2}>1. About These Terms</h2>
              <p>
                These Terms of Service (&quot;Terms&quot;) apply to your use of FindGrinds at findgrinds.ie
                (the &quot;Service&quot;). FindGrinds is operated by Matthew Callinan Keenan, a sole trader
                based in Ireland trading as FindGrinds (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;).
              </p>
              <p className="mt-4">
                By creating an account or using the Service, you agree to these Terms. If you do not agree,
                please do not use the Service. Our <Link href="/privacy" className="text-[#2D9B6E] hover:underline">Privacy Policy</Link> explains
                how we handle your personal data.
              </p>
              <p className="mt-4">
                If you are a consumer, nothing in these Terms affects your statutory rights under Irish or
                EU consumer law, including the Consumer Rights Act 2022.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>2. What FindGrinds Does</h2>
              <p>
                FindGrinds is an online marketplace that connects students and parents with independent
                tutors for Junior Certificate and Leaving Certificate grinds in Ireland. Through the Service
                you can:
              </p>
              <ul className={list}>
                <li>Search for tutors and view their profiles, rates and reviews</li>
                <li>Book and pay for one-to-one online, one-to-one in-person, and online group sessions</li>
                <li>Take online sessions through our built-in video calls</li>
                <li>Message tutors through our in-app messaging</li>
                <li>Buy and download study resources created by tutors</li>
                <li>Leave reviews and raise disputes</li>
              </ul>
              <p className="mt-4">
                Tutors are independent. They are not our employees, agents or contractors, and they decide
                how they teach. The agreement for tutoring is between you and the tutor. We are not a party
                to it, but we collect payment on the tutor&apos;s behalf through Stripe, and we run the
                cancellation, refund and dispute processes described in these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>3. Your Account</h2>

              <h3 className={h3}>3.1 Account types</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Student:</strong> someone looking for tutoring or study resources</li>
                <li><strong>Parent:</strong> a parent or guardian who books and oversees tutoring for their child</li>
                <li><strong>Tutor:</strong> someone offering tutoring sessions and study resources</li>
              </ul>

              <h3 className={h3}>3.2 Your responsibilities</h3>
              <p>When you create an account, you agree to:</p>
              <ul className={list}>
                <li>Give accurate, current and complete information, including your real name and date of birth</li>
                <li>Keep your password secure and not share your account</li>
                <li>Tell us straight away if you think someone else has accessed your account</li>
                <li>Take responsibility for everything done through your account</li>
              </ul>
              <p className="mt-4">
                Once your date of birth has been saved it cannot be changed from your account. If it is
                wrong, contact us and we will correct it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>4. Students Under 18 and Parents</h2>
              <p>
                If you are under 18, you must have permission from a parent or guardian to use FindGrinds.
                We strongly encourage parents to link their account to their child&apos;s account.
              </p>

              <h3 className={h3}>4.1 Linking accounts</h3>
              <p>
                A student generates a one-time link code from their dashboard, and their parent or guardian
                enters it in their own account. Once linked, the parent can:
              </p>
              <ul className={list}>
                <li>See the student&apos;s sessions, purchases and spending</li>
                <li>Read all of the student&apos;s conversations with tutors</li>
                <li>Message tutors on the student&apos;s behalf</li>
                <li>Book sessions and buy resources for the student</li>
              </ul>
              <p className="mt-4">
                By linking, the student agrees that their parent can see this information. A parent who
                books or pays for sessions is responsible for those bookings.
              </p>

              <h3 className={h3}>4.2 Messaging limits for under-18s</h3>
              <p>
                Students under 18 who do not have a linked parent can only send tutors a set of pre-written
                messages. Free-text messaging is unlocked once a parent links their account. Tutors
                must never ask a student to get around this limit.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>5. Safety: Keep Everything on FindGrinds</h2>
              <p>
                Keeping conversations, lessons and payments on FindGrinds is central to keeping students
                safe. Everyone who uses the Service agrees to the following rules.
              </p>
              <ul className={list}>
                <li>
                  All contact between tutors and students (or their parents) must happen through FindGrinds
                  messaging, and all online lessons must use FindGrinds video calls
                </li>
                <li>
                  Tutors must not ask for or share personal contact details (such as phone numbers, email
                  addresses or social media accounts), or ask to move a conversation to another app,
                  particularly with a student under 18
                </li>
                <li>
                  All payments for sessions booked through FindGrinds must be made through FindGrinds.
                  Asking for, offering or accepting payment in cash, by bank transfer or through any other
                  service is not allowed
                </li>
                <li>Tutors must never ask a student to keep anything secret from their parents or guardians</li>
              </ul>

              <h3 className={h3}>5.1 How we monitor messages</h3>
              <p>
                Messages from tutors to students under 18 are automatically checked for signs of an attempt
                to move contact off FindGrinds, such as sharing a phone number or social media handle.
                Messages that are flagged are not blocked, but are sent to our team for review. Any user
                can report a message from their inbox. We review every report and may suspend or remove
                accounts that break these rules.
              </p>

              <h3 className={h3}>5.2 In-person sessions</h3>
              <p>
                For in-person sessions, the tutor and the student or parent arrange the location through
                FindGrinds messaging. We recommend meeting in a safe, public place such as a library, or at
                home with a parent present. We do not supervise in-person sessions and are not responsible
                for what happens at them, except as set out in Section 17.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>6. Tutors</h2>

              <h3 className={h3}>6.1 Your obligations</h3>
              <p>As a tutor, you agree to:</p>
              <ul className={list}>
                <li>Give accurate information about your qualifications, experience and subjects</li>
                <li>Turn up to and deliver the sessions you are booked for, as advertised</li>
                <li>Behave professionally and appropriately with every student, especially students under 18</li>
                <li>Follow the safety rules in Section 5</li>
                <li>Comply with all laws that apply to you, including any Garda vetting requirements</li>
                <li>Handle your own tax affairs and declare your earnings. You are not our employee</li>
              </ul>

              <h3 className={h3}>6.2 Verification</h3>
              <p>
                Qualifications on tutor profiles are provided by the tutor and are not checked by us.
                Tutors can upload a Garda vetting document. A &quot;Garda vetted&quot; badge is only
                shown once our team has reviewed that document. Paid Featured badges (Section 10) show a
                tutor&apos;s subscription, not a verification.
              </p>

              <h3 className={h3}>6.3 Getting paid</h3>
              <p>
                To receive bookings you must set up a payout account with our payment provider, Stripe,
                and agree to the{' '}
                <a href="https://stripe.com/connect-account/legal" className="text-[#2D9B6E] hover:underline" target="_blank" rel="noopener noreferrer">
                  Stripe Connected Account Agreement
                </a>
                . Stripe may ask you for identity information to meet its legal obligations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>7. Bookings and Payments</h2>

              <h3 className={h3}>7.1 Prices</h3>
              <p>
                Tutors set their own hourly rates. The price of a session is the tutor&apos;s hourly rate
                (or group rate, for group sessions) multiplied by the length of the session. Sessions are
                booked in 30-minute steps. Students and parents pay no booking fees on top of the price
                shown.
              </p>

              <h3 className={h3}>7.2 One-to-one sessions</h3>
              <p>
                One-to-one sessions, online or in person, are paid in full when you book. Your booking is
                confirmed once payment goes through.
              </p>

              <h3 className={h3}>7.3 Group sessions</h3>
              <p>
                Group sessions need a minimum number of students, set by the tutor. When you reserve a
                place, your card is saved but not charged. Everyone who has reserved is charged once the
                minimum is reached. If the minimum has not been reached 24 hours before the session starts,
                the session is cancelled automatically and nobody is charged.
              </p>

              <h3 className={h3}>7.4 How payment works</h3>
              <p>
                All payments are processed by Stripe. We never see or store your full card details. When
                you pay, the tutor&apos;s share (the price minus our platform fee) is transferred to the
                tutor&apos;s Stripe account. If a refund is later given, the refunded amount is taken back
                from the tutor&apos;s share and our fee in proportion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>8. Cancellations, Refunds and Disputes</h2>

              <h3 className={h3}>8.1 If the tutor cancels</h3>
              <p>You always get a full refund.</p>

              <h3 className={h3}>8.2 If you cancel</h3>
              <p>
                Each tutor sets a cancellation policy, shown on their profile before you book:
              </p>
              <ul className={list}>
                <li>A notice period of 6, 12, 24, 48 or 72 hours</li>
                <li>If you cancel before the notice period starts, you get a full refund</li>
                <li>
                  If you cancel later than that, you get the tutor&apos;s late-cancellation refund, which is
                  0%, 25%, 50%, 75% or 100% of the price
                </li>
              </ul>
              <p className="mt-4">
                Cancelling a group reservation before you have been charged costs nothing. Refunds go back
                to the card you paid with.
              </p>

              <h3 className={h3}>8.3 Disputes</h3>
              <p>
                If a tutor does not show up, or a session was seriously below what was advertised, you can
                raise a dispute from your dashboard after the session. Both you and the tutor can give your
                side and upload evidence. Our team will review it and decide whether to give a refund. This
                does not affect your statutory rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>9. Platform Fees</h2>
              <p>Tutors pay us a platform fee, which is taken from their earnings:</p>
              <ul className={list}>
                <li><strong>Tutoring sessions:</strong> 15% of the session price</li>
                <li><strong>Study resource sales:</strong> 15% of the sale price</li>
              </ul>
              <p className="mt-4">
                <strong>Referral offer:</strong> there is no platform fee (0%) on sessions with a student
                who signed up through the tutor&apos;s own invite link, or whose parent did. This applies
                to sessions scheduled before 1 July 2027.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>10. Featured Tutor Subscriptions</h2>
              <p>
                Tutors can use FindGrinds for free, or subscribe to a paid Featured plan (Professional or
                Enterprise) at the prices shown on
                our <Link href="/featured" className="text-[#2D9B6E] hover:underline">Featured Listings</Link> page.
                Featured plans give higher placement in search results (see Section 13) and a Featured badge.
                The Enterprise plan also lets you show an organisation name and website.
              </p>
              <ul className={list}>
                <li>Subscriptions are billed monthly through Stripe and renew automatically</li>
                <li>
                  You can cancel at any time. Your plan stays active until the end of the period you have
                  paid for, then returns to the free plan
                </li>
                <li>We do not normally refund part-used periods, but we may do so at our discretion</li>
                <li>If a payment fails, your plan may be downgraded to free</li>
              </ul>
              <p className="mt-4">
                <strong>Free Professional month:</strong> tutors who qualify through our referral offer can
                start a free 30-day trial of the Professional plan. You must add a card to start the trial.
                Unless you cancel before the trial ends, you will be charged the standard Professional price
                each month after that.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>11. Study Resources</h2>

              <h3 className={h3}>11.1 For tutors selling resources</h3>
              <p>
                You may only upload material that you created or have the right to sell. It must be
                accurate and suitable for students. Resources are published straight away without review
                by us, but we may remove any resource that breaks these Terms. You keep ownership of your
                resources. You give buyers the licence described below, and give us permission to display,
                store and deliver them. Buyers keep access to resources they have already bought, even if
                you later remove the resource or close your account.
              </p>

              <h3 className={h3}>11.2 For buyers</h3>
              <p>
                When you buy a resource, you get a personal, non-transferable licence to download it and
                use it for your own study. You may not share, resell, copy for others, or publish it.
              </p>
              <p className="mt-4">
                Resources are digital content that you can download straight away. If you ask for immediate
                access when you buy, you lose your 14-day right to withdraw from the purchase once the
                download is available to you. If a resource is faulty or not as described, report it from
                your dashboard. We will review it and give a refund where appropriate. This does not affect
                your statutory rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>12. Reviews</h2>
              <p>
                Students can leave one review for each session after it has taken place. Reviews must be
                honest, based on your own experience, and must not contain abusive language or personal
                information. Reviews are shown with your first name and last initial. Tutors can report a
                review they believe breaks these rules, and we may remove it. We do not edit reviews, and we
                do not remove reviews just because they are negative.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>13. How Search Results Are Ranked</h2>
              <p>
                By default, tutor search results are ordered first by Featured plan (tutors on paid plans
                appear higher), then by rating. The rating takes into account how many reviews a tutor has,
                so that a small number of reviews does not count as much. You can also sort and filter
                results in other ways, such as by price.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>14. Video Sessions</h2>
              <p>
                Online sessions take place on video calls hosted by FindGrinds through our video provider.
                We do not record sessions. You must not record a session, or take screenshots of other
                participants, without the consent of everyone in it, and of a parent or guardian for any
                student under 18.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>15. AI Assistant</h2>
              <p>
                Our AI chat assistant can help you find tutors and resources and answer questions about
                FindGrinds. Its answers are automated and may sometimes be wrong. Check important details,
                such as prices and availability, on the relevant page. Do not share personal or sensitive
                information with the assistant.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>16. Prohibited Conduct</h2>
              <p>You must not:</p>
              <ul className={list}>
                <li>Break the safety rules in Section 5</li>
                <li>Harass, bully, threaten, or behave inappropriately towards anyone, especially a minor</li>
                <li>Pretend to be someone else, or give false information about yourself or your qualifications</li>
                <li>Arrange to pay or be paid outside FindGrinds for sessions found through FindGrinds</li>
                <li>Post fake reviews, or pressure anyone to change a review</li>
                <li>Upload content you do not have the rights to, or that is unlawful or inappropriate</li>
                <li>Upload malicious files or send spam</li>
                <li>Access or try to access other people&apos;s accounts</li>
                <li>Scrape the Service or collect other users&apos; data</li>
                <li>Use the Service for anything unlawful</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className={h2}>17. Our Liability</h2>
              <p>
                We work hard to keep FindGrinds safe and running, but we do not guarantee the quality or
                results of any tutoring, exam results, the accuracy of what tutors say about themselves
                (beyond what we have verified), or that the Service will always be available.
              </p>
              <p className="mt-4">
                Tutors are responsible for the sessions they deliver. To the extent the law allows, we are
                not liable for any loss arising from a tutor&apos;s or another user&apos;s conduct, or for
                indirect or consequential loss.
              </p>
              <p className="mt-4">
                Nothing in these Terms limits or excludes our liability for death or personal injury caused
                by our negligence, for fraud, or for anything else that cannot be limited or excluded under
                Irish law, including your rights as a consumer.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>18. Suspension and Closing Your Account</h2>
              <p>
                We may suspend or close an account, or remove a listing, resource or review, if we reasonably
                believe the user has broken these Terms, put someone at risk, or acted unlawfully. Where it is
                safe and lawful to do so, we will tell you why. Tutors will be told the reasons and can ask us
                to review the decision.
              </p>
              <p className="mt-4">
                You can delete your account from your account settings. You will need to cancel or complete
                any upcoming sessions first. When your account is deleted, your personal data is removed or
                anonymised as described in our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>19. Complaints and Governing Law</h2>
              <p>
                If you have a problem, please contact us first at <strong>support@findgrinds.ie</strong> and
                we will try to sort it out. These Terms are governed by Irish law. The Irish courts have
                jurisdiction, but if you are a consumer living elsewhere in the EU you may also bring
                proceedings in your own country.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>20. Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. We will tell you about significant changes by
                email or with a notice on the Service before they take effect. Tutors will get at least 15
                days&apos; notice of changes that affect them. If you keep using the Service after changes
                take effect, you accept the updated Terms. If you do not agree, you can close your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={h2}>21. Contact Us</h2>
              <p>For questions about these Terms of Service:</p>
              <div className="bg-[#F8F9FA] p-6 rounded-lg mt-4">
                <p><strong>Matthew Callinan Keenan, trading as FindGrinds</strong></p>
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
