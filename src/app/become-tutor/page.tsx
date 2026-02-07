import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckCircle, Users, Calendar, BookOpen, TrendingUp, Shield } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Become a Tutor | FindGrinds',
  description: 'Join Ireland\'s leading tutoring platform. Set your own rates, flexible schedule, and reach thousands of students preparing for Junior and Leaving Cert exams.',
};

const benefits = [
  {
    icon: TrendingUp,
    title: 'Earn More',
    description: 'Set your own hourly rate with competitive earnings on every session. Top tutors earn €50-100+ per hour.',
  },
  {
    icon: Calendar,
    title: 'Flexible Schedule',
    description: 'Work when you want. Set your availability and accept bookings that fit your life.',
  },
  {
    icon: Users,
    title: 'Reach Students',
    description: 'Connect with thousands of students across Ireland looking for quality grinds.',
  },
  {
    icon: BookOpen,
    title: 'Sell Resources',
    description: 'Upload and sell your notes, past paper solutions, and study guides for passive income.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Get paid reliably through our secure platform. Weekly payouts directly to your bank.',
  },
  {
    icon: CheckCircle,
    title: 'Build Reputation',
    description: 'Collect reviews, earn badges, and become a featured tutor to attract more students.',
  },
];

const steps = [
  {
    number: '1',
    title: 'Create Your Profile',
    description: 'Sign up and tell us about your qualifications, subjects, and teaching experience.',
  },
  {
    number: '2',
    title: 'Set Your Rates & Availability',
    description: 'Choose your hourly rate and set your weekly availability so students can book you.',
  },
  {
    number: '3',
    title: 'Set Up Payments',
    description: 'Connect your bank account through Stripe so you can get paid for sessions and resource sales.',
  },
  {
    number: '4',
    title: 'Start Teaching',
    description: 'Accept bookings, deliver great sessions, and grow your tutoring business.',
  },
];

const tiers = [
  {
    name: 'Free',
    price: '€0',
    period: '/month',
    description: 'Get started with the basics',
    features: [
      'Create a tutor profile',
      'Accept unlimited bookings',
      'Sell educational resources',
      'Collect reviews and ratings',
    ],
    cta: 'Get Started',
    featured: false,
    badge: null,
  },
  {
    name: 'Professional',
    price: '€19',
    period: '/month',
    description: 'Build trust with students and parents',
    features: [
      'Everything in Free',
      'Green verified tick on profile',
      '"Professional Tutor" badge',
      'Priority in search results',
      'Priority email support',
    ],
    cta: 'Go Professional',
    featured: true,
    badge: 'green',
  },
  {
    name: 'Enterprise',
    price: '€99',
    period: '/month',
    description: 'For tutors employed in grinds schools',
    features: [
      'Everything in Professional',
      'Gold verified tick on profile',
      '"Enterprise Tutor" badge',
      'Top placement in all search results',
      'Link your profile to your organisation',
    ],
    cta: 'Go Enterprise',
    featured: false,
    badge: 'gold',
  },
];

export default function BecomeTutorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#F0F7F4] to-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-6">
                Share Your Knowledge,<br />
                <span className="text-[#2D9B6E]">Grow Your Income</span>
              </h1>
              <p className="text-xl text-[#5D6D7E] mb-8">
                Join Ireland's fastest-growing tutoring platform. Connect with students,
                set your own rates, and build a flexible teaching career.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup?type=tutor">
                  <Button size="lg">
                    Start Tutoring Today
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-sm text-[#95A5A6]">
                Join tutors already earning on the platform
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">
                Why Tutor with FindGrinds?
              </h2>
              <p className="text-[#5D6D7E] max-w-2xl mx-auto">
                We provide everything you need to run a successful tutoring business
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="p-6 text-center">
                  <div className="w-12 h-12 bg-[#F0F7F4] rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-[#2D9B6E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-[#5D6D7E] text-sm">
                    {benefit.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 bg-[#F8F9FA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">
                How It Works
              </h2>
              <p className="text-[#5D6D7E] max-w-2xl mx-auto">
                Getting started is easy. Be up and running in less than 10 minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#2D9B6E] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      {step.number}
                    </div>
                    <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[#5D6D7E] text-sm">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-[#D5DBDB]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">
                Choose Your Plan
              </h2>
              <p className="text-[#5D6D7E] max-w-2xl mx-auto">
                Start for free, or get verified to build trust with students and parents
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {tiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`p-6 relative ${tier.featured ? 'border-2 border-[#2D9B6E] shadow-lg scale-105' : ''}`}
                >
                  {tier.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2D9B6E] text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-[#2C3E50]">
                        {tier.name}
                      </h3>
                      {tier.badge === 'green' && (
                        <CheckCircle className="w-5 h-5 text-[#2D9B6E] fill-[#2D9B6E] stroke-white" />
                      )}
                      {tier.badge === 'gold' && (
                        <CheckCircle className="w-5 h-5 text-[#D4A574] fill-[#D4A574] stroke-white" />
                      )}
                    </div>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-[#2C3E50]">{tier.price}</span>
                      <span className="text-[#95A5A6] ml-1">{tier.period}</span>
                    </div>
                    <p className="text-sm text-[#5D6D7E] mt-2">{tier.description}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-[#2D9B6E] flex-shrink-0 mt-0.5" />
                        <span className="text-[#5D6D7E]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/signup?type=tutor">
                    <Button
                      variant={tier.featured ? 'primary' : 'outline'}
                      className="w-full"
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-16 bg-[#F8F9FA]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">
                What You Need to Get Started
              </h2>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-[#2C3E50] mb-4">Required</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#2D9B6E] flex-shrink-0" />
                      <span className="text-[#5D6D7E]">Strong knowledge in your subject area</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#2D9B6E] flex-shrink-0" />
                      <span className="text-[#5D6D7E]">Reliable internet connection</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#2D9B6E] flex-shrink-0" />
                      <span className="text-[#5D6D7E]">Computer with webcam for online sessions</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-[#2C3E50] mb-4">Recommended</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#95A5A6] flex-shrink-0" />
                      <span className="text-[#5D6D7E]">Teaching qualification or degree</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#95A5A6] flex-shrink-0" />
                      <span className="text-[#5D6D7E]">Previous tutoring experience</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#95A5A6] flex-shrink-0" />
                      <span className="text-[#5D6D7E]">High grades in subjects you teach</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#95A5A6] flex-shrink-0" />
                      <span className="text-[#5D6D7E]">Enthusiasm and patience</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#95A5A6] flex-shrink-0" />
                      <span className="text-[#5D6D7E]">Garda vetting (builds trust with parents)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#2D9B6E]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Tutoring Journey?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Join tutors already earning on FindGrinds. Create your free
              profile today and start connecting with students.
            </p>
            <Link href="/signup?type=tutor">
              <Button variant="secondary" size="lg" className="bg-white text-[#2D9B6E] hover:bg-gray-100">
                Create Your Tutor Profile
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
