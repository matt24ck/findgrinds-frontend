'use client';

import { SearchBar } from './SearchBar';
import { CheckCircle, CreditCard, Shield, BookOpen } from 'lucide-react';

export function HeroSection() {
  const trustPoints = [
    { icon: CreditCard, label: 'Secure Payments via Stripe' },
    { icon: Shield, label: 'Every Tutor is ID-Verified' },
    { icon: BookOpen, label: 'Buy & Sell Study Resources' },
  ];

  return (
    <section className="relative bg-gradient-to-b from-[#F0F7F4] to-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#2D9B6E]/10 text-[#2D9B6E] px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <CheckCircle className="w-4 h-4" />
            Connect with Top Tutors across Ireland
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2C3E50] mb-6 leading-tight">
            Find the Right Tutor{' '}
            <span className="text-[#2D9B6E]">for Your Exam</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-[#5D6D7E] mb-8">
            Browse professional tutors across Dublin, Cork, Galway and beyond.
            Book sessions, access revision resources, and ace your exams.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <SearchBar />
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {trustPoints.map((point) => (
            <div key={point.label} className="flex items-center gap-2">
              <point.icon className="w-5 h-5 text-[#2D9B6E]" />
              <span className="text-sm font-medium text-[#5D6D7E]">{point.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#2D9B6E]/5 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#D4A574]/5 rounded-full blur-2xl" />
    </section>
  );
}
