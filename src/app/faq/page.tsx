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
          'FindGrinds is Ireland\'s trusted marketplace for Junior and Leaving Cert grinds. We connect students with qualified tutors for one-on-one or group sessions, and provide a marketplace for purchasing study resources like notes, exam papers, and revision guides.',
      },
      {
        question: 'How do I create an account?',
        answer:
          'Click "Sign Up" in the top right corner and choose your account type: Student, Parent, or Tutor. Fill in your details — email, name, and password — and you\'re ready to go. Tutors will also be asked to select their subjects and set an hourly rate during signup.',
      },
      {
        question: 'Is FindGrinds only for Irish students?',
        answer:
          'FindGrinds is designed for the Irish education system, covering Junior Cert, Leaving Cert, and Leaving Cert Higher Level subjects. However, anyone can sign up and use the platform. Sessions can be conducted via video call, so location is not a barrier.',
      },
    ],
  },
  {
    title: 'For Students',
    items: [
      {
        question: 'How do I find a tutor?',
        answer:
          'Head to the "Find Tutors" page and use the filters to search by subject, level, price range, and rating. You can also filter for tutors who teach through Irish. Click on any tutor\'s profile to see their bio, qualifications, reviews, and availability.',
      },
      {
        question: 'How do I book a session?',
        answer:
          'Once you\'ve found a tutor, go to their profile and check their availability calendar. Select a time slot that suits you, choose your subject and level, then proceed to payment. You\'ll receive a confirmation email with the session details.',
      },
      {
        question: 'Can I cancel a booking?',
        answer:
          'Yes, you can cancel a booking from your student dashboard. Cancellation policies vary by tutor — some offer free cancellation up to 24 hours in advance, while others may have stricter policies. Check the tutor\'s cancellation policy on their profile before booking.',
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
          'Yes. Once linked, your parent dashboard shows a summary of each linked student\'s activity including upcoming sessions, completed sessions, purchased resources, and total spending. Click on any student to see their full dashboard.',
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
          'Payments are handled through Stripe Connect. When a student books and pays for a session, the funds are held by Stripe. After the session, your earnings (minus the 15% platform fee) are transferred to your connected bank account. Stripe typically processes payouts within 2–7 business days.',
      },
      {
        question: 'What is Stripe Connect?',
        answer:
          'Stripe Connect is a secure payment platform that allows FindGrinds to route payments directly to your bank account. During onboarding, you\'ll verify your identity and link your bank details. This is a one-time setup — once complete, all future payments are automatic.',
      },
      {
        question: 'How do I sell resources?',
        answer:
          'From your tutor dashboard, go to the resources section and click "Create Resource". Upload your file (PDF, images, or video), set a title, description, subject, level, and price (between \u20AC2 and \u20AC25). Resources go through a brief quality review before being published.',
      },
      {
        question: 'What are the subscription tiers?',
        answer:
          'FindGrinds offers three tiers for tutors: Free (basic listing), Professional (\u20AC19/month — priority placement in search results and a verified badge), and Enterprise (\u20AC99/month — top placement, premium badge, and additional visibility features). You can upgrade or downgrade at any time from your dashboard.',
      },
      {
        question: 'How do I get Garda vetted on the platform?',
        answer:
          'Go to your tutor dashboard and find the "Garda Vetting" section. Upload a copy of your Garda vetting disclosure document (PDF or image). Our admin team will review it and, once approved, a verified badge will appear on your profile. This helps build trust with students and parents.',
      },
    ],
  },
  {
    title: 'Payments & Refunds',
    items: [
      {
        question: 'What payment methods are accepted?',
        answer:
          'We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure payment partner, Stripe. All payments are processed in euros (\u20AC).',
      },
      {
        question: 'What is the platform fee?',
        answer:
          'FindGrinds charges a 15% platform fee on session bookings and resource purchases. This covers payment processing, platform maintenance, customer support, and the tools we provide for tutors and students. The fee is deducted automatically — tutors receive 85% of each transaction.',
      },
      {
        question: 'How do refunds work?',
        answer:
          'If a session is cancelled within the tutor\'s cancellation policy window, you\'ll receive a full refund. Refunds for resources are handled on a case-by-case basis — contact us at support@findgrinds.ie if you have an issue with a purchased resource. Refunds are processed back to your original payment method and typically appear within 5–10 business days.',
      },
      {
        question: 'When do tutors receive their earnings?',
        answer:
          'After a session is completed or a resource is purchased, the tutor\'s share (85% of the transaction) is sent to their connected bank account via Stripe. Stripe processes payouts on a rolling basis, typically within 2–7 business days depending on your bank.',
      },
    ],
  },
  {
    title: 'Account & Privacy',
    items: [
      {
        question: 'How do I delete my account?',
        answer:
          'Go to your dashboard settings and find the "Account" section. Under GDPR options, you\'ll find a "Delete Account" button. This permanently removes all your personal data from our systems in compliance with GDPR. Note: this action cannot be undone.',
      },
      {
        question: 'How do I export my data?',
        answer:
          'Under your dashboard settings, find the GDPR section and click "Export My Data". We\'ll compile all the personal data we hold about you — profile information, session history, and payment records — into a downloadable format. This is your right under GDPR Article 20.',
      },
      {
        question: 'How is my data protected?',
        answer:
          'We take data protection seriously. All data is encrypted in transit (HTTPS) and at rest. Passwords are hashed using bcrypt. Payment information is handled entirely by Stripe — we never store your card details. We comply with GDPR and Irish data protection law. See our Privacy Policy for full details.',
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
