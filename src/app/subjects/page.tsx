'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import {
  Calculator,
  BookOpen,
  Globe,
  FlaskConical,
  Languages,
  Landmark,
  Music,
  Palette,
  Laptop,
  TrendingUp,
  Users,
  Briefcase,
  Leaf,
  Home,
  Dumbbell,
  Search,
} from 'lucide-react';

const subjects = [
  {
    category: 'Languages',
    icon: Languages,
    color: 'bg-blue-500',
    subjects: [
      { name: 'Irish', slug: 'IRISH' },
      { name: 'English', slug: 'ENGLISH' },
      { name: 'French', slug: 'FRENCH' },
      { name: 'German', slug: 'GERMAN' },
      { name: 'Spanish', slug: 'SPANISH' },
      { name: 'Italian', slug: 'ITALIAN' },
    ],
  },
  {
    category: 'Mathematics',
    icon: Calculator,
    color: 'bg-purple-500',
    subjects: [
      { name: 'Maths', slug: 'MATHS' },
      { name: 'Applied Maths', slug: 'APPLIED_MATHS' },
    ],
  },
  {
    category: 'Sciences',
    icon: FlaskConical,
    color: 'bg-green-500',
    subjects: [
      { name: 'Biology', slug: 'BIOLOGY' },
      { name: 'Chemistry', slug: 'CHEMISTRY' },
      { name: 'Physics', slug: 'PHYSICS' },
      { name: 'Agricultural Science', slug: 'AGRICULTURAL_SCIENCE' },
    ],
  },
  {
    category: 'Business & Economics',
    icon: TrendingUp,
    color: 'bg-amber-500',
    subjects: [
      { name: 'Business', slug: 'BUSINESS' },
      { name: 'Economics', slug: 'ECONOMICS' },
      { name: 'Accounting', slug: 'ACCOUNTING' },
    ],
  },
  {
    category: 'Humanities',
    icon: Landmark,
    color: 'bg-rose-500',
    subjects: [
      { name: 'History', slug: 'HISTORY' },
      { name: 'Geography', slug: 'GEOGRAPHY' },
      { name: 'Politics & Society', slug: 'POLITICS_SOCIETY' },
      { name: 'Religious Education', slug: 'RELIGIOUS_EDUCATION' },
    ],
  },
  {
    category: 'Technology',
    icon: Laptop,
    color: 'bg-cyan-500',
    subjects: [
      { name: 'Computer Science', slug: 'COMPUTER_SCIENCE' },
      { name: 'Design & Communication Graphics', slug: 'DCG' },
      { name: 'Engineering', slug: 'ENGINEERING' },
    ],
  },
  {
    category: 'Arts',
    icon: Palette,
    color: 'bg-pink-500',
    subjects: [
      { name: 'Art', slug: 'ART' },
      { name: 'Music', slug: 'MUSIC' },
    ],
  },
  {
    category: 'Practical Subjects',
    icon: Home,
    color: 'bg-orange-500',
    subjects: [
      { name: 'Home Economics', slug: 'HOME_ECONOMICS' },
    ],
  },
];

export default function SubjectsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#2D9B6E] to-[#25A876] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find Tutors by Subject
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Browse all Junior and Leaving Cert subjects and find expert tutors ready to help you succeed
              </p>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for a subject..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Subjects Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {subjects.map((category) => (
                <div key={category.category}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#2C3E50]">{category.category}</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {category.subjects.map((subject) => (
                      <Link
                        key={subject.slug}
                        href={`/tutors?subject=${subject.slug}`}
                        className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:border-[#2D9B6E] border border-transparent group"
                      >
                        <h3 className="font-semibold text-[#2C3E50] group-hover:text-[#2D9B6E] transition-colors">
                          {subject.name}
                        </h3>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">
              Can't find your subject?
            </h2>
            <p className="text-[#5D6D7E] mb-8 max-w-2xl mx-auto">
              We're always adding new tutors and subjects. Let us know what you're looking for and we'll help you find the right tutor.
            </p>
            <Link href="/contact">
              <Button size="lg">Contact Us</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
