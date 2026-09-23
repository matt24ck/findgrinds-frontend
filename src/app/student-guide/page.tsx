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
        description: 'Sign up for free as a Student or Parent. Just enter your name, email, and password to get started. Students also enter their date of birth.',
      },
      {
        title: 'Complete Your Profile',
        description: 'Check your details and add a profile photo if you like. Your date of birth can\'t be changed once it\'s saved, so make sure it\'s right — if it isn\'t, contact us and we\'ll correct it. When you book, you choose the subject and level so your tutor can tailor the session to you.',
      },
      {
        title: 'For Parents: Link Your Child\'s Account',
        description: 'If your child is under 18, you can link your parent account to their student account. Your child generates a 6-character link code from their student dashboard (it\'s valid for 24 hours) and shares it with you; you enter it in your parent dashboard. Once linked, you can see their bookings and conversations, and book and pay on their behalf.',
      },
      {
        title: 'Browse Tutors',
        description: 'Use the search and filter tools to find the perfect tutor. Filter by subject, level (Junior Cert or Leaving Cert), price range, rating, area, and whether they teach through Irish. View tutor profiles to see their qualifications and experience (as described by the tutor), availability, and student reviews.',
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
        description: 'Take your time exploring tutor profiles. Check their reviews from other students, qualifications, teaching experience, and hourly rates. Look for tutors with a Garda vetted badge for added peace of mind — it\'s shown once our team has approved the tutor\'s vetting document.',
      },
      {
        title: 'Book a Session',
        description: 'Once you\'ve found a tutor, select an available time slot from their calendar. Choose between online or in-person sessions and pick your preferred duration. FindGrinds makes scheduling flexible so you can learn on your terms.',
      },
      {
        title: 'Secure Payment',
        description: 'All payments are handled securely through Stripe. There are no booking fees for students — you pay the tutor\'s listed hourly rate for the length of the session. One-to-one sessions are paid in full when you book. For group sessions, your card is saved and only charged once the tutor\'s minimum number of students is reached; if it isn\'t reached 24 hours before the start, the session is cancelled and nobody is charged.',
      },
      {
        title: 'Manage Your Bookings',
        description: 'View all your upcoming and past sessions in your student dashboard. If you need to cancel, do it from your dashboard. Cancel before the tutor\'s notice period starts and you get a full refund automatically; later cancellations get the tutor\'s late-cancellation refund. If the tutor cancels, you always get a full refund.',
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
        description: 'Explore study resources created by tutors on FindGrinds — including notes, past paper solutions, study guides, and revision materials. Filter by subject and level to find exactly what you need.',
      },
      {
        title: 'Purchase & Download',
        description: 'Resources are a one-time purchase with instant download, and you can download them again any time from your dashboard. Prices are set by the tutors who created them. Resources are for your own study only — please don\'t share or resell them.',
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
        description: 'Parents and guardians of under-18 students can link to their child\'s account for visibility and oversight. This lets you see who your child is learning with, when sessions are scheduled, and what they\'re spending — and book and pay for them — all from your own dashboard. Under-18 students without a linked parent can only send tutors pre-written messages; linking unlocks free-text messaging.',
      },
      {
        title: 'How Linking Works',
        description: 'Sign up as a Parent. Your child then generates a 6-character link code from their student dashboard and shares it with you. Enter the code in your parent dashboard within 24 hours and your accounts are linked.',
      },
      {
        title: 'What Parents Can See',
        description: 'Once linked, you can view your child\'s upcoming and past sessions, the resources they\'ve bought, and how much they\'ve spent. You\'ll always know who they\'re learning with and when.',
      },
      {
        title: 'See Your Child\'s Conversations',
        description: 'Linked parents can read every message between their child and their tutors, and can message tutors directly on their child\'s behalf. This only works because conversations stay on FindGrinds — once a chat moves to WhatsApp, Snapchat or text, you lose sight of it completely.',
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
        description: 'Online sessions run right on FindGrinds — no extra apps or downloads needed. A Join button appears next to your upcoming online session in your dashboard — just click it when you\'re ready to start. Sessions are not recorded.',
      },
      {
        title: 'In-Person Sessions',
        description: 'For in-person sessions, coordinate the meeting location with your tutor through the in-app messaging system. We recommend meeting in safe, public places like libraries or school study areas.',
      },
      {
        title: 'Leave a Review',
        description: 'After your session, take a moment to rate and review your tutor (one review per session, shown with your first name and last initial). Your honest feedback helps other students find the best tutors and helps tutors improve their teaching.',
      },
      {
        title: 'Raise a Dispute',
        description: 'If a tutor doesn\'t show up or the session quality was seriously below expectations, you can raise a dispute from your dashboard after the session. Both you and the tutor can submit your side of the story with supporting evidence, and our admin team will review the case and issue a refund if warranted.',
      },
    ],
  },
  {
    id: 'safety-trust',
    icon: Shield,
    title: 'Safety & Trust',
    content: [
      {
        title: 'Garda Vetting & Qualifications',
        description: 'Tutors on FindGrinds can upload a Garda vetting document, which is reviewed by our admin team — look for the Garda vetted badge when choosing a tutor. Garda vetting is optional, and qualifications on profiles are written by tutors and are not checked by us. Featured badges show a paid plan, not a verification.',
      },
      {
        title: 'Secure Payments',
        description: 'All payments are processed through Stripe, meaning no cash exchanges are needed. If you cancel before the tutor\'s notice period starts, you\'ll receive a full refund automatically, and refunds go back to the card you paid with.',
      },
      {
        title: 'Keep Every Conversation on FindGrinds',
        description: 'Messaging, video lessons and payments all happen on FindGrinds, so there is never a reason to move a conversation elsewhere. Staying here means there\'s a record of every message, linked parents can see what\'s being said, and our team can step in if something isn\'t right. If a tutor asks to switch to another app or to be paid directly, please report the message — our admin team reviews every report.',
      },
      {
        title: 'Our Support',
        description: 'We\'re here to help. If you have any issues, visit our contact page or raise a dispute for session-related problems. Our admin team reviews every case to ensure a fair outcome.',
      },
    ],
  },
];

const stayOnPlatform = [
  {
    icon: FileText,
    title: 'A record of everything',
    description: 'Every message stays on your account. If something ever goes wrong, there\'s a clear record our team can review — unlike disappearing messages on other apps.',
  },
  {
    icon: Users,
    title: 'Parents stay in the loop',
    description: 'Linked parents can read their child\'s conversations with tutors and message tutors themselves. That oversight disappears the moment a chat moves to WhatsApp or Snapchat.',
  },
  {
    icon: Shield,
    title: 'Automatic safety checks',
    description: 'Messages from tutors to under-18 students are automatically checked for attempts to move the conversation elsewhere, such as asking for a phone number or social media handle, and flagged to our team.',
  },
  {
    icon: Video,
    title: 'No personal details needed',
    description: 'Messages, video lessons and payments all happen on FindGrinds, so you never need to give a tutor your phone number, email address or social media.',
  },
  {
    icon: CreditCard,
    title: 'Your money is protected',
    description: 'Sessions booked and paid through FindGrinds come with cancellation refunds and disputes. Cash or bank transfers arranged elsewhere have no protection at all.',
  },
  {
    icon: AlertTriangle,
    title: 'Easy to report',
    description: 'You can report any message straight from your inbox. Every report is reviewed by our admin team, who can suspend tutors who break the rules.',
  },
];

const quickTips = [
  { icon: Clock, tip: 'Creating an account is free' },
  { icon: Search, tip: 'Filter tutors by subject, level, price & ratings' },
  { icon: MessageSquare, tip: 'Keep all chats and payments on FindGrinds' },
  { icon: Users, tip: 'Link parent/student accounts for oversight' },
  { icon: ShoppingBag, tip: 'Browse and purchase study resources' },
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
                Everything you need to know about finding tutors, booking sessions, and making the most of FindGrinds.
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {quickTips.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                  <item.icon className="w-5 h-5 text-[#2D9B6E] mb-2" />
                  <p className="text-xs text-[#5D6D7E]">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stay On-Platform */}
        <section className="py-12 bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#F0F7F4] rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-[#2D9B6E]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#2C3E50]">Why You Never Need to Leave FindGrinds</h2>
                <p className="text-[#5D6D7E]">Keeping conversations here is the single biggest thing you can do to stay safe.</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {stayOnPlatform.map((item) => (
                <div key={item.title} className="bg-[#F8F9FA] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="w-5 h-5 text-[#2D9B6E]" />
                    <h3 className="font-bold text-[#2C3E50]">{item.title}</h3>
                  </div>
                  <p className="text-sm text-[#5D6D7E]">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-5">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#2C3E50]">
                <strong>Red flag:</strong> if a tutor asks for your phone number, asks you to move to WhatsApp,
                Snapchat, Instagram or text, or asks to be paid in cash or by bank transfer, don&apos;t go along
                with it. Report the message from your inbox and our team will look into it.
              </p>
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
                  'Created your account',
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
                  Browse tutors across Junior and Leaving Cert subjects. Find the right match for your learning needs.
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
                  Access study notes, past paper solutions, and revision materials created by tutors.
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
              Find the right tutor for your needs, online or in person
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
