'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle,
  Star,
  Shield,
  Users,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

const tiers = [
  {
    name: 'Free',
    price: '€0',
    period: '/month',
    description: 'Get started with the basics',
    badge: null,
    features: [
      'Create a tutor profile',
      'Accept unlimited bookings',
      'Sell educational resources',
      'Collect reviews and ratings',
    ],
    cta: 'Get Started',
    ctaLink: '/become-tutor',
    featured: false,
  },
  {
    name: 'Professional',
    price: '€19',
    period: '/month',
    description: 'Stand out to students and parents',
    badge: 'green',
    features: [
      'Everything in Free',
      '"Professional" Featured badge',
      'Highlighted card in search results',
      'Higher placement in search results',
    ],
    cta: 'Go Professional',
    ctaLink: '/dashboard/tutor/upgrade',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: '€99',
    period: '/month',
    description: 'For tutors employed in grinds schools',
    badge: 'gold',
    features: [
      'Everything in Professional',
      '"Enterprise Tutor" Featured badge',
      'Highest placement in default search results',
      'Show your organisation name and website',
    ],
    cta: 'Go Enterprise',
    ctaLink: '/dashboard/tutor/upgrade',
    featured: false,
  },
];

export default function FeaturedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#2C3E50] to-[#34495E] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-[#D4A574]/20 text-[#D4A574] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <CheckCircle className="w-4 h-4" />
                Tutor Subscription Tiers
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Stand Out from the Crowd
              </h1>
              <p className="text-xl text-white/90">
                Upgrade your profile to appear higher in search results and get a Featured badge. Featured badges show your subscription — they are not a verification.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">Choose Your Plan</h2>
              <p className="text-[#5D6D7E] max-w-2xl mx-auto">
                Start free and upgrade when you're ready to take your tutoring to the next level
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden ${
                    tier.featured ? 'ring-2 ring-[#2D9B6E] scale-105' : ''
                  }`}
                >
                  {tier.featured && (
                    <div className="bg-[#2D9B6E] text-white text-center py-2 text-sm font-medium">
                      Recommended
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-[#2C3E50]">{tier.name}</h3>
                      {tier.badge === 'green' && (
                        <CheckCircle className="w-5 h-5 text-[#2D9B6E]" />
                      )}
                      {tier.badge === 'gold' && (
                        <CheckCircle className="w-5 h-5 text-[#D4A574]" />
                      )}
                    </div>
                    <p className="text-[#5D6D7E] text-sm mb-4">{tier.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-[#2C3E50]">{tier.price}</span>
                      <span className="text-[#5D6D7E]">{tier.period}</span>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-[#2D9B6E] flex-shrink-0 mt-0.5" />
                          <span className="text-[#5D6D7E] text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={tier.ctaLink}>
                      <Button
                        className={`w-full ${
                          tier.badge === 'gold'
                            ? 'bg-[#D4A574] hover:bg-[#C69565]'
                            : tier.featured
                            ? ''
                            : 'bg-[#2C3E50] hover:bg-[#34495E]'
                        }`}
                      >
                        {tier.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Badge Showcase */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">What Students See</h2>
              <p className="text-[#5D6D7E]">Your badge appears on your profile and in search results</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Professional Badge Preview */}
              <div className="bg-[#F8F9FA] rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2C3E50]">Sarah O'Connor</span>
                    </div>
                    <p className="text-[#5D6D7E] text-sm">LC Maths & Physics</p>
                    <span className="inline-flex items-center gap-1 text-xs bg-[#D1FAE5] text-[#065F46] px-2 py-0.5 rounded-full mt-1">
                      <Shield className="w-3 h-3" />
                      Professional
                    </span>
                  </div>
                </div>
                <p className="text-sm text-[#5D6D7E]">
                  The "Professional" badge and highlighted card help your profile stand out to parents and students in search results.
                </p>
              </div>

              {/* Enterprise Badge Preview */}
              <div className="bg-[#F8F9FA] rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2C3E50]">Michael Kelly</span>
                    </div>
                    <p className="text-[#5D6D7E] text-sm">LC Biology & Chemistry</p>
                    <span className="inline-flex items-center gap-1 text-xs bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-full mt-1">
                      <Star className="w-3 h-3" />
                      Enterprise Tutor
                    </span>
                  </div>
                </div>
                <p className="text-sm text-[#5D6D7E]">
                  The "Enterprise Tutor" badge and gold-highlighted card give your profile the most prominent look in search results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Breakdown */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">Why Upgrade?</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-[#F0F7F4] rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[#2D9B6E]" />
                </div>
                <h3 className="font-bold text-[#2C3E50] mb-2">Get Noticed</h3>
                <p className="text-[#5D6D7E] text-sm">
                  A Featured badge makes your profile easier to spot for students and parents.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-[#F0F7F4] rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-[#2D9B6E]" />
                </div>
                <h3 className="font-bold text-[#2C3E50] mb-2">Get More Bookings</h3>
                <p className="text-[#5D6D7E] text-sm">
                  Featured tutors appear above free listings in the default search order.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-[#FDF2E9] rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-[#D4A574]" />
                </div>
                <h3 className="font-bold text-[#2C3E50] mb-2">Your Organisation (Enterprise)</h3>
                <p className="text-[#5D6D7E] text-sm">
                  Show your grinds school or organisation name and website on your profile.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-[#FDF2E9] rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-[#D4A574]" />
                </div>
                <h3 className="font-bold text-[#2C3E50] mb-2">No Long-Term Commitment</h3>
                <p className="text-[#5D6D7E] text-sm">
                  Billed monthly through Stripe. Cancel any time and keep your plan until the end of the period you have paid for.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">Questions?</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-[#F8F9FA] rounded-xl p-6">
                <h3 className="font-semibold text-[#2C3E50] mb-2">Can I cancel anytime?</h3>
                <p className="text-[#5D6D7E] text-sm">
                  Yes, you can cancel your subscription at any time. Your plan and badge stay active until the end of the period you have paid for, then your profile returns to the free plan.
                </p>
              </div>
              <div className="bg-[#F8F9FA] rounded-xl p-6">
                <h3 className="font-semibold text-[#2C3E50] mb-2">What's the difference between Professional and Enterprise?</h3>
                <p className="text-[#5D6D7E] text-sm">
                  Professional is ideal for individual tutors who want higher placement in search results and a Featured badge. Enterprise is designed for tutors working with grinds schools who want to show their organisation name and website on their profile and get the highest placement in the default search order.
                </p>
              </div>
              <div className="bg-[#F8F9FA] rounded-xl p-6">
                <h3 className="font-semibold text-[#2C3E50] mb-2">What payment methods do you accept?</h3>
                <p className="text-[#5D6D7E] text-sm">
                  We accept credit and debit cards through Stripe. Your subscription will renew automatically each month until you cancel.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">
              Ready to Stand Out?
            </h2>
            <p className="text-[#5D6D7E] mb-8">
              Upgrade your profile and start standing out in search results
            </p>
            <Link href="/dashboard/tutor/upgrade">
              <Button size="lg">
                View Plans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
