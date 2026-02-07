'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import {
  Check,
  Shield,
  CreditCard,
  Clock,
  Users,
  FileText,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

const pricingFAQs = [
  {
    question: 'How much do tutoring sessions cost?',
    answer: 'Tutors set their own hourly rates, typically ranging from €25-€80 per hour depending on the subject, level, and tutor experience. You can filter tutors by price range when searching.',
  },
  {
    question: 'Are there any booking fees?',
    answer: 'No booking fees for students. The price you see on the tutor\'s profile is the price you pay. FindGrinds takes a small commission from tutors only.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept all major credit and debit cards through our secure payment provider, Stripe. Payment is processed when you book a session.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Yes, if a tutor cancels a session you\'ll receive a full refund. If you need to cancel, cancellations are subject to the tutor\'s specified cancellation policy.',
  },
  {
    question: 'Do tutors offer package discounts?',
    answer: 'Many tutors offer discounted rates when you book multiple sessions upfront. Check individual tutor profiles for any package deals they offer.',
  },
  {
    question: 'Is there a subscription or membership fee?',
    answer: 'No, FindGrinds is completely free to use for students. You only pay for the sessions you book.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#2C3E50] to-[#34495E] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-white/90">
                No hidden fees, no subscriptions. Just pay for the sessions you book.
              </p>
            </div>
          </div>
        </section>

        {/* How Pricing Works */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">How Pricing Works</h2>
              <p className="text-[#5D6D7E] max-w-2xl mx-auto">
                FindGrinds connects you directly with tutors. They set their own rates based on their experience and qualifications.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-[#F0F7F4] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-[#2D9B6E]" />
                </div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">Browse Tutors</h3>
                <p className="text-[#5D6D7E] text-sm">
                  View tutor profiles and their hourly rates. Filter by price, subject, and ratings.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-[#F0F7F4] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-[#2D9B6E]" />
                </div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">Book Sessions</h3>
                <p className="text-[#5D6D7E] text-sm">
                  Choose a time slot that works for you. Sessions are typically 1 hour.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-[#F0F7F4] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-6 h-6 text-[#2D9B6E]" />
                </div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">Pay Securely</h3>
                <p className="text-[#5D6D7E] text-sm">
                  Payment is processed securely through Stripe. No fees for students.
                </p>
              </div>
            </div>

            {/* Price Range Info */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-[#2D9B6E] text-white p-6">
                <h3 className="text-xl font-bold">Typical Tutor Rates</h3>
                <p className="text-white/80">Rates vary by subject, level, and tutor experience</p>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border border-[#E5E7EB] rounded-xl">
                    <p className="text-sm text-[#5D6D7E] mb-1">Junior Cert</p>
                    <p className="text-2xl font-bold text-[#2C3E50]">€25 - €45</p>
                    <p className="text-sm text-[#5D6D7E]">per hour</p>
                  </div>
                  <div className="text-center p-4 border-2 border-[#2D9B6E] rounded-xl bg-[#F0F7F4]">
                    <p className="text-sm text-[#5D6D7E] mb-1">Leaving Cert</p>
                    <p className="text-2xl font-bold text-[#2D9B6E]">€35 - €60</p>
                    <p className="text-sm text-[#5D6D7E]">per hour</p>
                  </div>
                  <div className="text-center p-4 border border-[#E5E7EB] rounded-xl">
                    <p className="text-sm text-[#5D6D7E] mb-1">Higher Level / Specialist</p>
                    <p className="text-2xl font-bold text-[#2C3E50]">€50 - €80</p>
                    <p className="text-sm text-[#5D6D7E]">per hour</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">What's Included</h2>
              <p className="text-[#5D6D7E]">Every booking on FindGrinds comes with these benefits</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: 'Professional Tutors', desc: 'Browse qualified, professional tutors across all subjects' },
                { icon: CreditCard, title: 'Secure Payments', desc: 'Pay safely through our platform with Stripe' },
                { icon: Clock, title: 'Flexible Scheduling', desc: 'Book sessions at times that suit you' },
                { icon: FileText, title: 'Session Notes', desc: 'Some tutors provide notes after each session' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#F0F7F4] rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-[#2D9B6E]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2C3E50] mb-1">{item.title}</h3>
                    <p className="text-sm text-[#5D6D7E]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Study Resources */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#2D9B6E] to-[#25A876] rounded-2xl p-8 md:p-12 text-white">
              <div className="max-w-3xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Study Resources
                </h2>
                <p className="text-white/90 mb-6">
                  In addition to 1-on-1 tutoring, you can purchase study notes, exam guides, and other resources from tutors. Browse and purchase study materials created by experienced tutors.
                </p>
                <Link href="/resources">
                  <Button variant="secondary" className="bg-white text-[#2D9B6E] hover:bg-gray-100">
                    Browse Resources
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {pricingFAQs.map((faq, index) => (
                <div key={index} className="bg-[#F8F9FA] rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-[#2D9B6E] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#2C3E50] mb-2">{faq.question}</h3>
                      <p className="text-[#5D6D7E] text-sm">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-[#5D6D7E] mb-8">
              Find the perfect tutor for your needs and book your first session today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tutors">
                <Button size="lg">Find a Tutor</Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline">Create Free Account</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
