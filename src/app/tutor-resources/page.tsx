'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import {
  FileText,
  Upload,
  Euro,
  TrendingUp,
  CheckCircle,
  BookOpen,
  FileSpreadsheet,
  Video,
  Presentation,
  ArrowRight,
  Zap,
  BarChart3,
  Shield,
} from 'lucide-react';

const resourceTypes = [
  {
    icon: FileText,
    name: 'Study Notes',
    description: 'Comprehensive notes for specific topics or chapters',
    priceRange: '€5 - €15',
  },
  {
    icon: FileSpreadsheet,
    name: 'Exam Papers & Solutions',
    description: 'Past exam papers with worked solutions',
    priceRange: '€10 - €25',
  },
  {
    icon: Presentation,
    name: 'Revision Guides',
    description: 'Full subject revision guides and summaries',
    priceRange: '€15 - €35',
  },
  {
    icon: BookOpen,
    name: 'Workbooks',
    description: 'Practice problems and exercises with answers',
    priceRange: '€10 - €20',
  },
];

const benefits = [
  {
    icon: Euro,
    title: 'Earn Passive Income',
    description: 'Create once, sell unlimited times. Build a library of resources that generates ongoing revenue.',
  },
  {
    icon: TrendingUp,
    title: 'Reach More Students',
    description: 'Your resources can help students across Ireland, even those who can\'t book live sessions.',
  },
  {
    icon: Zap,
    title: 'Quick Setup',
    description: 'Upload your materials in minutes. We handle payments, delivery, and customer support.',
  },
  {
    icon: BarChart3,
    title: 'Track Performance',
    description: 'See which resources are selling, read reviews, and optimize your offerings.',
  },
];

export default function TutorResourcesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#2D9B6E] to-[#25A876] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Sell Your Study Resources
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  Turn your teaching materials into passive income. Upload notes, exam guides, and more - students across Ireland are waiting to learn from you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/become-tutor">
                    <Button variant="secondary" size="lg" className="bg-white text-[#2D9B6E] hover:bg-gray-100">
                      Start Selling
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/resources">
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                      Browse Marketplace
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-white/10 rounded-lg p-4">
                      <FileText className="w-8 h-8" />
                      <div>
                        <p className="font-semibold">LC Maths Higher - Complete Notes</p>
                        <p className="text-white/70 text-sm">Sold 234 times</p>
                      </div>
                      <span className="ml-auto font-bold">€19</span>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 rounded-lg p-4">
                      <FileSpreadsheet className="w-8 h-8" />
                      <div>
                        <p className="font-semibold">Biology Exam Solutions 2018-2024</p>
                        <p className="text-white/70 text-sm">Sold 156 times</p>
                      </div>
                      <span className="ml-auto font-bold">€25</span>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 rounded-lg p-4">
                      <BookOpen className="w-8 h-8" />
                      <div>
                        <p className="font-semibold">Irish Oral Prep Guide</p>
                        <p className="text-white/70 text-sm">Sold 89 times</p>
                      </div>
                      <span className="ml-auto font-bold">€12</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">How It Works</h2>
              <p className="text-[#5D6D7E] max-w-2xl mx-auto">
                Start selling your resources in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#F0F7F4] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-[#2D9B6E]" />
                </div>
                <div className="w-8 h-8 bg-[#2D9B6E] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  1
                </div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">Upload Your Resources</h3>
                <p className="text-[#5D6D7E]">
                  Upload PDFs, documents, or other files. Add a title, description, and set your price.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#F0F7F4] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-[#2D9B6E]" />
                </div>
                <div className="w-8 h-8 bg-[#2D9B6E] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  2
                </div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">We Review & Publish</h3>
                <p className="text-[#5D6D7E]">
                  Our team reviews your resource for quality, then publishes it to the marketplace.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#F0F7F4] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Euro className="w-8 h-8 text-[#2D9B6E]" />
                </div>
                <div className="w-8 h-8 bg-[#2D9B6E] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  3
                </div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">Earn 70% of Sales</h3>
                <p className="text-[#5D6D7E]">
                  You keep 70% of every sale. Payments are sent to your bank account monthly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Resource Types */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">What Can You Sell?</h2>
              <p className="text-[#5D6D7E]">Popular resource types that students are looking for</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resourceTypes.map((type) => (
                <div key={type.name} className="bg-[#F8F9FA] rounded-xl p-6">
                  <div className="w-12 h-12 bg-[#F0F7F4] rounded-lg flex items-center justify-center mb-4">
                    <type.icon className="w-6 h-6 text-[#2D9B6E]" />
                  </div>
                  <h3 className="font-bold text-[#2C3E50] mb-2">{type.name}</h3>
                  <p className="text-[#5D6D7E] text-sm mb-3">{type.description}</p>
                  <p className="text-[#2D9B6E] font-semibold">{type.priceRange}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">Why Sell on FindGrinds?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="w-12 h-12 bg-[#F0F7F4] rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-[#2D9B6E]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2C3E50] mb-2">{benefit.title}</h3>
                    <p className="text-[#5D6D7E]">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Earnings Calculator */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#2C3E50] to-[#34495E] rounded-2xl p-8 md:p-12 text-white">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Earning Potential</h2>
                <p className="text-white/80">See what you could earn selling resources</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white/10 rounded-xl p-6">
                  <p className="text-3xl font-bold mb-2">€350</p>
                  <p className="text-white/70 text-sm">10 sales/month at €50 average</p>
                  <p className="text-xs text-white/50 mt-2">(70% = €35 × 10)</p>
                </div>
                <div className="bg-white/10 rounded-xl p-6 ring-2 ring-[#2D9B6E]">
                  <p className="text-3xl font-bold mb-2">€875</p>
                  <p className="text-white/70 text-sm">25 sales/month at €50 average</p>
                  <p className="text-xs text-white/50 mt-2">(70% = €35 × 25)</p>
                </div>
                <div className="bg-white/10 rounded-xl p-6">
                  <p className="text-3xl font-bold mb-2">€1,750</p>
                  <p className="text-white/70 text-sm">50 sales/month at €50 average</p>
                  <p className="text-xs text-white/50 mt-2">(70% = €35 × 50)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">
              Ready to Start Selling?
            </h2>
            <p className="text-[#5D6D7E] mb-8 max-w-2xl mx-auto">
              Join hundreds of tutors already earning passive income on FindGrinds. Sign up today and upload your first resource.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/become-tutor">
                <Button size="lg">
                  Become a Tutor
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">Already a Tutor? Log In</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
