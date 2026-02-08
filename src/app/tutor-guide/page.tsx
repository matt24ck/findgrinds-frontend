'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import {
  BookOpen,
  User,
  Camera,
  FileText,
  Calendar,
  MessageSquare,
  Star,
  TrendingUp,
  Shield,
  CheckCircle,
  Lightbulb,
  Clock,
  Euro,
  CreditCard,
  Users,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

const sections = [
  {
    id: 'getting-started',
    icon: User,
    title: 'Getting Started',
    content: [
      {
        title: 'Create Your Account',
        description: 'Sign up as a tutor and verify your email address. You\'ll need to provide basic information including your name, email, and subjects you teach.',
      },
      {
        title: 'Complete Your Profile',
        description: 'A complete profile gets 5x more views. Add your qualifications, teaching experience, subjects, levels taught, and a compelling bio that highlights your expertise.',
      },
      {
        title: 'Upload a Professional Photo',
        description: 'Profiles with photos get 7x more bookings. Use a clear, friendly headshot with good lighting. Dress professionally and smile!',
      },
      {
        title: 'Set Your Rates',
        description: 'Research typical rates for your subjects and experience level. You can always adjust later. Consider offering a lower introductory rate to build reviews.',
      },
    ],
  },
  {
    id: 'payments',
    icon: CreditCard,
    title: 'Stripe Onboarding for Tutors',
    content: [
      {
        title: 'Navigate to Payment Setup',
        description: 'Go to your tutor dashboard, click the Settings tab, and press \'Set Up Payment Processing\'. You\'ll be redirected to Stripe to complete onboarding.',
      },
      {
        title: 'Personal Details',
        description: 'Enter your full name, email address, home address, and phone number. Make sure these match your official ID documents.',
      },
      {
        title: 'Business Details',
        description: 'When asked for your industry, select \'Other Educational Services\'. If you don\'t have a website, add a short business description such as \'I provide tutoring and sell educational resources\'.',
      },
      {
        title: 'Bank Details',
        description: 'Enter your Irish bank account IBAN where you\'d like to receive payouts. Earnings are paid out directly to this account.',
      },
      {
        title: 'Start Earning',
        description: 'Once your details are submitted, you\'re ready to accept session bookings and resource purchases. Earnings are paid out directly to your bank account.',
      },
      {
        title: 'Identity Verification (Later)',
        description: 'After some time, Stripe will require you to verify your identity by uploading a government-issued photo ID and proof of address. When this happens, you\'ll see a warning on your Tutor Dashboard with a link to complete it. Make sure to do this promptly to avoid any interruption to your payouts.',
      },
    ],
  },
  {
    id: 'profile-tips',
    icon: Star,
    title: 'Optimizing Your Profile',
    content: [
      {
        title: 'Write a Compelling Bio',
        description: 'Start with your key qualifications, then explain your teaching approach. Mention specific exam success rates if you have them. Keep it personal but professional.',
      },
      {
        title: 'Highlight Your Qualifications',
        description: 'List your degrees, teaching qualifications, and any relevant certifications. If you\'ve achieved high points in the subjects you teach, mention it.',
      },
      {
        title: 'Showcase Your Experience',
        description: 'Include years of tutoring experience, number of students helped, and any notable results. Parents want to see proven track records.',
      },
      {
        title: 'Verify Your Profile',
        description: 'Consider uploading qualifications or certifications to build trust. This helps parents feel confident booking tutors for their children.',
      },
    ],
  },
  {
    id: 'sessions',
    icon: Calendar,
    title: 'Running Great Sessions',
    content: [
      {
        title: 'Be Prepared',
        description: 'Review the student\'s needs before each session. Have relevant materials ready and a clear plan for what you\'ll cover.',
      },
      {
        title: 'Start Strong',
        description: 'Begin each session by reviewing what was covered last time and setting clear goals for today. This helps students feel oriented and engaged.',
      },
      {
        title: 'Be Patient and Encouraging',
        description: 'Every student learns differently. Celebrate small wins and provide constructive feedback. Your encouragement makes a huge difference.',
      },
      {
        title: 'End with Action Items',
        description: 'Summarize what was learned and give specific homework or practice tasks. This helps reinforce learning between sessions.',
      },
    ],
  },
  {
    id: 'communication',
    icon: MessageSquare,
    title: 'Communication Best Practices',
    content: [
      {
        title: 'Respond Quickly',
        description: 'Aim to respond to booking requests and messages within 24 hours. Fast responses lead to more bookings.',
      },
      {
        title: 'Set Clear Expectations',
        description: 'Discuss goals, scheduling preferences, and cancellation policies upfront. Clear communication prevents misunderstandings.',
      },
      {
        title: 'Keep Parents Informed',
        description: 'For younger students, send brief updates to parents about progress and areas to focus on. They appreciate being kept in the loop.',
      },
      {
        title: 'Handle Cancellations Professionally',
        description: 'Life happens. If you need to cancel, give as much notice as possible and offer to reschedule promptly.',
      },
    ],
  },
  {
    id: 'reviews',
    icon: TrendingUp,
    title: 'Building Your Reputation',
    content: [
      {
        title: 'Deliver Excellent Service',
        description: 'The best way to get great reviews is to be a great tutor. Go above and beyond for your students.',
      },
      {
        title: 'Ask for Reviews',
        description: 'After a few successful sessions, politely ask students or parents to leave a review. Most happy students are glad to help.',
      },
      {
        title: 'Respond to Feedback',
        description: 'Thank students for positive reviews. If you receive constructive criticism, respond professionally and show you\'re committed to improving.',
      },
      {
        title: 'Build Long-Term Relationships',
        description: 'Regular students are your best asset. Offer package deals and be flexible to keep them coming back.',
      },
    ],
  },
];

const quickTips = [
  { icon: Camera, tip: 'Add a professional photo - 7x more bookings' },
  { icon: Shield, tip: 'Upload qualifications to build trust with parents' },
  { icon: Clock, tip: 'Respond to inquiries within 24 hours' },
  { icon: FileText, tip: 'Upload resources to earn passive income' },
  { icon: Euro, tip: 'Consider introductory rates to get first reviews' },
  { icon: CreditCard, tip: 'Set up Stripe payments to start earning' },
  { icon: Users, tip: 'Ask happy students for reviews' },
];

export default function TutorGuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#2D9B6E] to-[#25A876] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <BookOpen className="w-4 h-4" />
                Complete Tutor Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Everything You Need to Succeed
              </h1>
              <p className="text-xl text-white/90">
                Learn how to build a thriving tutoring business on FindGrinds. From profile optimization to running great sessions.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-4 justify-center">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F8F9FA] rounded-lg text-[#5D6D7E] hover:bg-[#F0F7F4] hover:text-[#2D9B6E] transition-colors text-sm"
                >
                  <section.icon className="w-4 h-4" />
                  {section.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Tips Banner */}
        <section className="py-8 bg-[#F0F7F4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-[#2D9B6E]" />
              <h2 className="font-bold text-[#2C3E50]">Quick Tips for Success</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickTips.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                  <item.icon className="w-5 h-5 text-[#2D9B6E] mb-2" />
                  <p className="text-xs text-[#5D6D7E]">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {sections.map((section, sectionIndex) => (
                <div key={section.id} id={section.id} className="scroll-mt-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-[#F0F7F4] rounded-xl flex items-center justify-center">
                      <section.icon className="w-6 h-6 text-[#2D9B6E]" />
                    </div>
                    <div>
                      <span className="text-sm text-[#2D9B6E] font-medium">Section {sectionIndex + 1}</span>
                      <h2 className="text-2xl font-bold text-[#2C3E50]">{section.title}</h2>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-[#2D9B6E] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                            {itemIndex + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-[#2C3E50] mb-2">{item.title}</h3>
                            <p className="text-[#5D6D7E]">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">New Tutor Checklist</h2>
              <p className="text-[#5D6D7E]">Make sure you've completed these essential steps</p>
            </div>

            <div className="bg-[#F8F9FA] rounded-2xl p-8">
              <div className="space-y-4">
                {[
                  'Created account and verified email',
                  'Added a professional profile photo',
                  'Written a compelling bio',
                  'Listed qualifications and experience',
                  'Selected subjects and levels',
                  'Set competitive hourly rates',
                  'Completed Stripe onboarding (bank account added)',
                  'Added availability to calendar',
                  'Uploaded qualifications (if available)',
                  'Read and understood the terms of service',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-4">
                    <div className="w-6 h-6 border-2 border-[#2D9B6E] rounded flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-[#2D9B6E] opacity-0" />
                    </div>
                    <span className="text-[#2C3E50]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Resources CTA */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-[#2D9B6E] to-[#25A876] rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Sell Your Resources</h3>
                <p className="text-white/90 mb-6">
                  Turn your teaching materials into passive income. Upload notes, exam guides, and more.
                </p>
                <Link href="/tutor-resources">
                  <Button variant="secondary" className="bg-white text-[#2D9B6E] hover:bg-gray-100">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="bg-gradient-to-br from-[#2C3E50] to-[#34495E] rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Get Verified</h3>
                <p className="text-white/90 mb-6">
                  Stand out with a verified badge and get more bookings from students and parents.
                </p>
                <Link href="/featured">
                  <Button variant="secondary" className="bg-white text-[#2C3E50] hover:bg-gray-100">
                    View Plans
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">
              Ready to Start Tutoring?
            </h2>
            <p className="text-[#5D6D7E] mb-8">
              Join hundreds of tutors making a difference for Irish students
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/become-tutor">
                <Button size="lg">
                  Become a Tutor
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">Have Questions? Contact Us</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
