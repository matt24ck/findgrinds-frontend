'use client';

import Link from 'next/link';
import {
  Calculator,
  BookOpen,
  FlaskRound,
  Globe,
  Languages,
  TrendingUp,
  Atom,
  Landmark,
} from 'lucide-react';

const subjects = [
  { name: 'Maths', icon: Calculator, color: '#2D9B6E' },
  { name: 'English', icon: BookOpen, color: '#3498DB' },
  { name: 'Irish', icon: Languages, color: '#27AE60' },
  { name: 'Biology', icon: FlaskRound, color: '#E74C3C' },
  { name: 'Chemistry', icon: Atom, color: '#9B59B6' },
  { name: 'Physics', icon: Atom, color: '#F39C12' },
  { name: 'Geography', icon: Globe, color: '#1ABC9C' },
  { name: 'History', icon: Landmark, color: '#D4A574' },
  { name: 'Business', icon: TrendingUp, color: '#34495E' },
  { name: 'French', icon: Languages, color: '#E91E63' },
  { name: 'German', icon: Languages, color: '#FF5722' },
  { name: 'Spanish', icon: Languages, color: '#00BCD4' },
  { name: 'Accounting', icon: TrendingUp, color: '#795548' },
  { name: 'Economics', icon: TrendingUp, color: '#607D8B' },
];

export function SubjectsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">
            Browse by Subject
          </h2>
          <p className="text-lg text-[#5D6D7E]">
            Find tutors specialized in your subject
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {subjects.map((subject) => (
            <Link
              key={subject.name}
              href={`/tutors?subject=${subject.name.toUpperCase()}`}
              className="group"
            >
              <div className="bg-white rounded-xl border border-[#ECF0F1] p-5 text-center hover:shadow-lg hover:-translate-y-1 hover:border-[#2D9B6E] transition-all duration-200">
                <div
                  className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${subject.color}15` }}
                >
                  <subject.icon
                    className="w-6 h-6"
                    style={{ color: subject.color }}
                  />
                </div>
                <h3 className="font-semibold text-[#2C3E50]">
                  {subject.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
