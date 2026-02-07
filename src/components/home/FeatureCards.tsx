'use client';

import { CreditCard, Users, BookOpen, Calendar } from 'lucide-react';

const features = [
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Pay securely through Stripe. No hidden fees for students, reliable weekly payouts for tutors.',
    color: '#2D9B6E',
  },
  {
    icon: Users,
    title: 'Professional Tutors',
    description: 'Browse qualified tutors across all Junior and Leaving Cert subjects. Read reviews and find the right fit.',
    color: '#3498DB',
  },
  {
    icon: BookOpen,
    title: 'Buy & Sell Resources',
    description: 'Access notes, past papers, and revision guides created by top tutors. Tutors earn from every sale.',
    color: '#D4A574',
  },
  {
    icon: Calendar,
    title: 'Flexible Booking',
    description: 'Book sessions that fit your schedule. Choose 1:1, group, or video grinds.',
    color: '#E74C3C',
  },
];

export function FeatureCards() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">
            Why Choose FindGrinds?
          </h2>
          <p className="text-lg text-[#5D6D7E] max-w-2xl mx-auto">
            We make finding quality grinds simple, trusted, and effective.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl p-6 border border-[#ECF0F1] hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <feature.icon
                  className="w-6 h-6"
                  style={{ color: feature.color }}
                />
              </div>
              <h3 className="text-lg font-bold text-[#2C3E50] mb-2">
                {feature.title}
              </h3>
              <p className="text-[#5D6D7E] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
