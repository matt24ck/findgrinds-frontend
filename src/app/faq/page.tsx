'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    title: 'Getting Started',
    items: [
      {
        question: 'What is FindGrinds?',
        answer:
          'FindGrinds is an Irish marketplace for Junior and Leaving Cert grinds. We connect students and parents with independent tutors for one-to-one sessions (online or in person) and online group sessions, and provide a marketplace for buying study resources like notes and revision guides created by tutors.',
      },
      {
        question: 'How do I create an account?',
        answer:
          'Click "Sign Up" in the top right corner and choose your account type: Student, Parent, or Tutor. Fill in your details — email, name, and password — and you\'re ready to go. Tutors will also be asked to select their subjects and set an hourly rate during signup.',
      },
      {
        question: 'Is FindGrinds only for Irish students?',
        answer:
          'FindGrinds is designed for the Irish education system, covering Junior Cert, Leaving Cert, and Leaving Cert Higher Level subjects. However, anyone can sign up and use the platform. Online sessions take place on FindGrinds\' built-in video calls, so location is not a barrier.',
      },
    ],
  },
  {
    title: 'For Students',
    items: [
      {
        question: 'How do I find a tutor?',
        answer:
          'Head to the "Find Tutors" page and use the filters to search by subject, level, price range, and rating. You can also filter for tutors who teach through Irish. Click on any tutor\'s profile to see their bio, qualifications (as described by the tutor), reviews, and availability.',
      },
      {
        question: 'How do I book a session?',
        answer:
          'Once you\'ve found a tutor, go to their profile and check their availability calendar. Select a time slot that suits you, choose your subject and level, then proceed to payment. One-to-one sessions are paid in full when you book, with no booking fee on top of the tutor\'s price. You\'ll receive a confirmation email with the session details.',
      },
      {
        question: 'Can I cancel a booking?',
        answer:
          'Yes, you can cancel a booking from your student dashboard. Each tutor sets a notice period (6 to 72 hours, 24 hours by default). Cancel before the notice period starts and you get a full refund; cancel later and you get the tutor\'s late-cancellation refund, which can be anywhere from 0% to 100%. If the tutor cancels, you always get a full refund. Check the tutor\'s cancellation policy on their profile before booking.',
      },
      {
        question: 'What subjects are available?',
        answer:
          'FindGrinds covers all major Junior and Leaving Cert subjects including Maths, English, Irish, Science, Biology, Chemistry, Physics, Business, Economics, History, Geography, French, German, Spanish, and more. Use the Subjects page to browse the full list.',
      },
      {
        question: 'How do I download a resource I purchased?',
        answer:
          'After purchasing a resource, go to your student dashboard and find the resource in your purchases. Click the "Download" button to get a time-limited download link. You can download the resource multiple times — the link refreshes each time you click.',
      },
    ],
  },
  {
    title: 'For Parents',
    items: [
      {
        question: 'How do I link my account to my child\'s?',
        answer:
          'First, your child needs to generate a linking code from their student dashboard under "Parent Linking". They share this 6-character code with you. Then go to your parent dashboard, enter the code in the "Link a Student" section, and you\'ll be connected. The code expires after 24 hours for security.',
      },
      {
        question: 'Can I see my child\'s bookings and purchases?',
        answer:
          'Yes. Once linked, your parent dashboard shows a summary of each linked student\'s activity including upcoming sessions, completed sessions, purchased resources, and total spending. You can also read their conversations with tutors, message tutors on their behalf, and book sessions or buy resources for them.',
      },
      {
        question: 'How do I unlink a student?',
        answer:
          'Go to your parent dashboard, find the student you want to unlink, and click the unlink option. This removes your access to their dashboard. The student can re-generate a linking code if you need to reconnect in the future.',
      },
    ],
  },
  {
    title: 'For Tutors',
    items: [
      {
        question: 'How do I become a tutor on FindGrinds?',
        answer:
          'Sign up and select "Tutor" as your account type. You\'ll be asked to pick your subjects, set your hourly rate, and fill in your profile. To start accepting paid bookings, you\'ll also need to complete Stripe Connect onboarding so we can process payments to your bank account.',
      },
      {
        question: 'How do I set my availability?',
        answer:
          'Go to your tutor dashboard and open the "Availability" tab. You can set your weekly recurring schedule (e.g. Monday 4pm–8pm, Tuesday 5pm–7pm) and add one-off overrides for specific dates. Students will only be able to book slots you\'ve marked as available.',
      },
      {
        question: 'How do I get paid?',
        answer:
          'Payments are handled through Stripe Connect. When a student books and pays for a session, your share (the price minus the 15% platform fee) is transferred to your Stripe account straight away. Stripe then pays it out to your bank account on its standard payout schedule. If a refund is given later, it is taken back from your share and our fee in proportion.',
      },
      {
        question: 'What is Stripe Connect?',
        answer:
          'Stripe Connect is a secure payment platform that allows FindGrinds to route payments directly to your bank account. During onboarding, Stripe will ask for identity information and your bank details. You need to complete this before students can book you. It\'s a one-time setup — once complete, future payments are automatic.',
      },
      {
        question: 'How do I sell resources?',
        answer:
          'From your tutor dashboard, go to the resources section and click "Create Resource". Upload your file (PDF, images, or video), set a title, description, subject, level, and price (minimum \u20AC0.50). Your resource is published straight away. We may remove resources that are reported and break our Terms.',
      },
      {
        question: 'What are the subscription tiers?',
        answer:
          'FindGrinds offers three tiers for tutors: Free (standard listing), Professional (\u20AC19/month — higher placement in search results and a Featured badge), and Enterprise (\u20AC99/month — the highest placement, an Enterprise Featured badge, and the option to show your organisation name and website). Featured badges show a subscription, not a verification. Plans are billed monthly and you can cancel at any time; your plan stays active until the end of the period you have paid for.',
      },
      {
        question: 'How do I get Garda vetted on the platform?',
        answer:
          'Go to your tutor dashboard and find the "Garda Vetting" section. Upload a copy of your Garda vetting disclosure document (PDF or image). Our admin team will review it and, once approved, a Garda vetted badge will appear on your profile. Garda vetting is optional on FindGrinds. This helps build trust with students and parents.',
      },
    ],
  },
  {
    title: 'Payments & Refunds',
    items: [
      {
        question: 'What payment methods are accepted?',
        answer:
          'We accept credit and debit cards through our secure payment partner, Stripe. All payments are processed in euros (\u20AC).',
      },
      {
        question: 'What is the platform fee?',
        answer:
          'FindGrinds charges a 15% platform fee on session bookings and resource purchases. This covers payment processing, platform maintenance, customer support, and the tools we provide for tutors and students. The fee is taken from the tutor\'s earnings — tutors receive 85% of each transaction, and students and parents pay no booking fee on top. Sessions with a student who signed up through the tutor\'s own invite link (or whose parent did) have no platform fee if scheduled before 1 July 2027.',
      },
      {
        question: 'How do refunds work?',
        answer:
          'If the tutor cancels, or you cancel before the tutor\'s notice period starts, you\'ll receive a full refund. Later cancellations get the tutor\'s late-cancellation refund. If a tutor doesn\'t show up or a session was seriously below what was advertised, you can raise a dispute from your dashboard after the session and our team will review it. If a purchased resource is faulty or not as described, report it from your dashboard and we\'ll review it. Refunds go back to the card you paid with and usually appear within 5–10 business days.',
      },
      {
        question: 'When do tutors receive their earnings?',
        answer:
          'When a student pays for a session or buys a resource, the tutor\'s share (85% of the transaction) is transferred to their Stripe account at the time of payment. Stripe then pays it out to the tutor\'s bank account on its standard payout schedule.',
      },
    ],
  },
  {
    title: 'Account & Privacy',
    items: [
      {
        question: 'How do I delete my account?',
        answer:
          'Go to your dashboard settings and find the "Account" section. Under GDPR options, you\'ll find a "Delete Account" button. You\'ll be asked to confirm by email. Your personal data is then removed or anonymised as described in our Privacy Policy. Note: this action cannot be undone.',
      },
      {
        question: 'How do I export my data?',
        answer:
          'Under your dashboard settings, find the GDPR section and click "Export My Data". We\'ll compile all the personal data we hold about you — profile information, session history, and payment records — into a downloadable JSON file. This is your right under GDPR Article 20.',
      },
      {
        question: 'How is my data protected?',
        answer:
          'We take data protection seriously. All data is encrypted in transit (HTTPS). Passwords are hashed using bcrypt. Payment information is handled entirely by Stripe — we never store your card details. We comply with GDPR and Irish data protection law. See our Privacy Policy for full details.',
      },
    ],
  },
];

function FAQAccordionItem({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#ECF0F1] rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F8F9FA] transition-colors rounded-lg"
      >
        <span className="font-medium text-[#2C3E50] pr-4">{item.question}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#95A5A6] flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-4 text-[#5D6D7E] leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-[#5D6D7E] mb-10">
            Everything you need to know about using FindGrinds.
          </p>

          <div className="space-y-10">
            {faqSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-bold text-[#2C3E50] mb-4">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <FAQAccordionItem key={item.question} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white rounded-xl border border-[#ECF0F1] text-center">
            <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">
              Still have questions?
            </h3>
            <p className="text-[#5D6D7E] mb-4">
              We're here to help. Reach out to our support team.
            </p>
            <a
              href="mailto:support@findgrinds.ie"
              className="inline-block px-6 py-2.5 bg-[#2D9B6E] hover:bg-[#25A876] text-white font-medium rounded-xl transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
