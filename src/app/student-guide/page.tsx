'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import {
  BookOpen,
  User,
  Search,
  Calendar,
  ShoppingBag,
  Shield,
  CheckCircle,
  Lightbulb,
  Clock,
  CreditCard,
  Users,
  ArrowRight,
  Star,
  MessageSquare,
  AlertTriangle,
  Video,
  MapPin,
  FileText,
  Download,
} from 'lucide-react';

const sections = [
  {
    id: 'getting-started',
    icon: User,
    title: 'Getting Started',
    content: [
      {
        title: 'Create Your Account',
        description: 'Sign up for free as a Student or Parent — it takes under two minutes. Just enter your name, email, and password, then verify your email address to get started.',
      },
      {
        title: 'Complete Your Profile',
        description: 'Add your name and school year or level. This helps tutors understand your needs and tailor their sessions to you.',
      },
      {
        title: 'For Parents: Link Your Child\'s Account',
        description: 'If your child is under 18, you can link your parent account to their student account. Simply go to your dashboard, enter your child\'s email address, and they\'ll receive a confirmation request. Once linked, you can monitor their bookings and manage payments on their behalf.',
      },
      {
        title: 'Browse Tutors',
        description: 'Use the search and filter tools to find the perfect tutor. Filter by subject, level (Junior Cert or Leaving Cert), price range, rating, and availability. View tutor profiles to check their qualifications, experience, and student reviews.',
      },
    ],
  },
  {
    id: 'booking-sessions',
    icon: Calendar,
    title: 'Booking Sessions',
    content: [
      {
        title: 'Find the Right Tutor',
        description: 'Take your time exploring tutor profiles. Check their reviews from other students, qualifications, teaching experience, and hourly rates. Look for verified tutors and those with Garda vetting badges for added peace of mind.',
      },
      {
        title: 'Book a Session',
        description: 'Once you\'ve found a tutor, select an available time slot from their calendar. Choose between online or in-person sessions and pick your preferred duration. FindGrinds makes scheduling flexible so you can learn on your terms.',
      },
      {
        title: 'Secure Payment',
        description: 'All payments are handled securely through Stripe. There are no hidden fees for students — you simply pay the tutor\'s listed hourly rate. Your payment is held safely until the session takes place.',
      },
      {
        title: 'Manage Your Bookings',
        description: 'View all your upcoming and past sessions in your student dashboard. If you need to cancel, do so in advance according to the tutor\'s cancellation policy and you\'ll receive an automatic refund.',
      },
    ],
  },
  {
    id: 'study-resources',
    icon: ShoppingBag,
    title: 'Study Resources',
    content: [
      {
        title: 'Browse the Marketplace',
        description: 'Explore a growing library of study resources created by experienced tutors — including notes, past paper solutions, study guides, and revision materials. Filter by subject and level to find exactly what you need.',
      },
      {
        title: 'Purchase & Download',
        description: 'Resources are a one-time purchase with instant download. Prices are set by the tutors who created them, so you\'ll find options for every budget.',
      },
      {
        title: 'Report Issues',
        description: 'If a resource isn\'t as described or you\'re unhappy with the quality, you can report it directly from your dashboard. Our admin team will review the report and can issue a refund if appropriate.',
      },
    ],
  },
  {
    id: 'parent-features',
    icon: Users,
    title: 'Parent & Guardian Features',
    content: [
      {
        title: 'Why Link Accounts',
        description: 'Parents and guardians of under-18 students can link to their child\'s account for full visibility and oversight. This lets you monitor who your child is learning with, when sessions are scheduled, and manage payments — all from your own dashboard.',
      },
      {
        title: 'How Linking Works',
        description: 'Sign up as a Parent, then go to your dashboard and enter your child\'s student email address. Your child will receive a confirmation request — once they accept, your accounts are linked and you\'re in the loop.',
      },
      {
        title: 'What Parents Can See',
        description: 'Once linked, you can view upcoming sessions, tutor profiles, and your child\'s full booking history. You\'ll always know who they\'re learning with and when.',
      },
      {
        title: 'Managing Payments',
        description: 'Parents can book sessions and purchase resources on behalf of their child. All payments go through the same secure Stripe checkout, giving you full control over spending.',
      },
    ],
  },
  {
    id: 'during-after-sessions',
    icon: Star,
    title: 'During & After Sessions',
    content: [
      {
        title: 'Joining Online Sessions',
        description: 'Online sessions use Zoom for a reliable video experience. A join link will appear in your dashboard before your session time — just click it when you\'re ready to start.',
      },
      {
        title: 'In-Person Sessions',
        description: 'For in-person sessions, coordinate the meeting location with your tutor through the in-app messaging system. We recommend meeting in safe, public places like libraries or school study areas.',
      },
      {
        title: 'Leave a Review',
        description: 'After your session, take a moment to rate and review your tutor. Your honest feedback helps other students find the best tutors and helps tutors improve their teaching.',
      },
      {
        title: 'Raise a Dispute',
        description: 'If a tutor doesn\'t show up or the session quality was seriously below expectations, you can raise a dispute from your dashboard. Both you and the tutor can submit your side of the story with supporting evidence, and our admin team will review the case and issue a refund if warranted.',
      },
    ],
  },
  {
    id: 'safety-trust',
    icon: Shield,
    title: 'Safety & Trust',
    content: [
      {
        title: 'Verified Tutors',
        description: 'Tutors on FindGrinds can upload their qualifications and Garda vetting documents, which are reviewed by our admin team. Look for verified badges when choosing a tutor for extra confidence.',
      },
      {
        title: 'Secure Payments',
        description: 'All payments are processed through Stripe, meaning no cash exchanges are needed. If you cancel within the tutor\'s cancellation policy, you\'ll receive an automatic refund — no questions asked.',
      },
      {
        title: 'Messaging Safety',
        description: 'All communication happens through FindGrinds\' in-app messaging system, keeping conversations on-platform. If you ever receive an inappropriate message, you can report it immediately for admin review.',
      },
      {
        title: 'Our Support',
        description: 'We\'re here to help. If you have any issues, visit our contact page or raise a dispute for session-related problems. Our admin team reviews every case to ensure a fair outcome.',
      },
    ],
  },
];

const quickTips = [
  { icon: Clock, tip: 'Create a free account in under 2 minutes' },
  { icon: Search, tip: 'Filter tutors by subject, level, price & ratings' },
  { icon: Users, tip: 'Link parent/student accounts for oversight' },
  { icon: ShoppingBag, tip: 'Browse and purchase quality study resources' },
  { icon: Star, tip: 'Reviews help you find the best tutors' },
  { icon: CreditCard, tip: 'All payments are secure through Stripe' },
  { icon: AlertTriangle, tip: 'Raise a dispute if something goes wrong' },
];

export default function StudentGuidePage() {
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
                Complete Student & Parent Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your Guide to Finding the Perfect Tutor
              </h1>
              <p className="text-xl text-white/90">
                Everything you need to know about finding expert tutors, booking sessions, and making the most of FindGrinds.
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
              <h2 className="font-bold text-[#2C3E50]">Quick Tips for Students & Parents</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
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
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">Getting Started Checklist</h2>
              <p className="text-[#5D6D7E]">Make sure you&apos;ve completed these essential steps</p>
            </div>

            <div className="bg-[#F8F9FA] rounded-2xl p-8">
              <div className="space-y-4">
                {[
                  'Created account and verified email',
                  'Completed your profile',
                  'Linked parent account (if under 18)',
                  'Browsed tutor listings',
                  'Booked your first session',
                  'Explored study resources',
                  'Left a review after your session',
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

        {/* CTA Cards */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-[#2D9B6E] to-[#25A876] rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Find a Tutor</h3>
                <p className="text-white/90 mb-6">
                  Browse hundreds of experienced tutors across all Junior and Leaving Cert subjects. Find the perfect match for your learning needs.
                </p>
                <Link href="/tutors">
                  <Button variant="secondary" className="bg-white text-[#2D9B6E] hover:bg-gray-100">
                    Browse Tutors
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="bg-gradient-to-br from-[#2C3E50] to-[#34495E] rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Browse Resources</h3>
                <p className="text-white/90 mb-6">
                  Access quality study notes, past paper solutions, and revision materials created by experienced tutors.
                </p>
                <Link href="/resources">
                  <Button variant="secondary" className="bg-white text-[#2C3E50] hover:bg-gray-100">
                    View Resources
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-[#5D6D7E] mb-8">
              Join hundreds of students across Ireland finding the right tutor for their needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tutors">
                <Button size="lg">
                  Find a Tutor
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
