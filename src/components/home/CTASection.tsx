'use client';

import Link from 'next/link';
import { Button } from '../ui/Button';
import { GraduationCap, Euro } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-[#2D9B6E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* For Students */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Ace Your Exams?
            </h2>
            <p className="text-lg text-white/80 mb-6">
              Join thousands of students who found the perfect tutor on FindGrinds.
              Your next A is just a click away.
            </p>
            <Link href="/tutors">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-[#2D9B6E] hover:bg-white/90 border-0"
              >
                Find Your Tutor
              </Button>
            </Link>
          </div>

          {/* For Tutors */}
          <div className="text-center md:text-left bg-white/10 rounded-2xl p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4A574] rounded-2xl mb-6">
              <Euro className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Are You a Tutor?
            </h2>
            <p className="text-lg text-white/80 mb-6">
              Competitive earnings on every session with secure payments directly to your bank.
            </p>
            <Link href="/become-tutor">
              <Button
                size="lg"
                className="bg-[#D4A574] text-white hover:bg-[#C69565] border-0"
              >
                Start Teaching Today
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
