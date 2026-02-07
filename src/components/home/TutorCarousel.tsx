'use client';

import Link from 'next/link';
import { Star, ChevronLeft, ChevronRight, MapPin, CheckCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

// Mock data for featured tutors
const featuredTutors = [
  {
    id: '1',
    name: 'Sarah O\'Brien',
    headline: 'Experienced LC Maths & Physics Tutor',
    subjects: ['Maths', 'Physics'],
    level: 'LC',
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 55,
    location: 'Dublin South',
    image: null,
    featured: true,
    verified: true,
  },
  {
    id: '2',
    name: 'John Murphy',
    headline: 'Chemistry & Biology Specialist',
    subjects: ['Chemistry', 'Biology'],
    level: 'LC',
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 50,
    location: 'Cork City',
    image: null,
    featured: true,
    verified: true,
  },
  {
    id: '3',
    name: 'Emma Kelly',
    headline: 'English & Irish Grinds Teacher',
    subjects: ['English', 'Irish'],
    level: 'LC',
    rating: 4.9,
    reviewCount: 156,
    hourlyRate: 45,
    location: 'Galway',
    image: null,
    featured: false,
    verified: true,
  },
  {
    id: '4',
    name: 'Michael Byrne',
    headline: 'Business & Economics Expert',
    subjects: ['Business', 'Economics'],
    level: 'LC',
    rating: 4.7,
    reviewCount: 72,
    hourlyRate: 48,
    location: 'Dublin North',
    image: null,
    featured: false,
    verified: true,
  },
  {
    id: '5',
    name: 'Aoife Walsh',
    headline: 'French & German Language Tutor',
    subjects: ['French', 'German'],
    level: 'LC',
    rating: 5.0,
    reviewCount: 43,
    hourlyRate: 52,
    location: 'Limerick',
    image: null,
    featured: true,
    verified: true,
  },
];

function TutorCard({ tutor }: { tutor: typeof featuredTutors[0] }) {
  return (
    <Link href={`/tutors/${tutor.id}`}>
      <div className="bg-white rounded-xl border border-[#ECF0F1] p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar
            size="lg"
            src={tutor.image || undefined}
            alt={tutor.name}
            fallback={tutor.name}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-[#2C3E50] truncate">{tutor.name}</h3>
              {tutor.verified && (
                <CheckCircle className="w-4 h-4 text-[#2D9B6E] flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-[#5D6D7E] line-clamp-1">{tutor.headline}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tutor.featured && <Badge variant="featured">Featured</Badge>}
          <Badge variant="primary">{tutor.level === 'LC' ? 'Leaving Cert' : 'Junior Cert'}</Badge>
          {tutor.subjects.slice(0, 2).map((subject) => (
            <Badge key={subject} variant="default">{subject}</Badge>
          ))}
        </div>

        {/* Rating & Location */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold text-[#2C3E50]">{tutor.rating}</span>
            <span className="text-[#95A5A6]">({tutor.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-[#5D6D7E]">
            <MapPin className="w-4 h-4" />
            <span>{tutor.location}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-4 border-t border-[#ECF0F1]">
          <div>
            <span className="text-2xl font-bold text-[#2D9B6E]">€{tutor.hourlyRate}</span>
            <span className="text-[#95A5A6] text-sm">/hour</span>
          </div>
          <Button variant="secondary" size="sm">View Profile</Button>
        </div>
      </div>
    </Link>
  );
}

export function TutorCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-2">
              Popular Tutors
            </h2>
            <p className="text-[#5D6D7E]">
              Top-rated tutors ready to help you succeed
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-2 rounded-full border border-[#D5DBDB] text-[#5D6D7E] hover:bg-white hover:border-[#2D9B6E] hover:text-[#2D9B6E] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-2 rounded-full border border-[#D5DBDB] text-[#5D6D7E] hover:bg-white hover:border-[#2D9B6E] hover:text-[#2D9B6E] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="flex-shrink-0 w-[300px] snap-start"
            >
              <TutorCard tutor={tutor} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link href="/tutors">
            <Button size="lg">
              Browse All Tutors
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
