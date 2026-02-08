'use client';

import Link from 'next/link';
import { Star, ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { tutors } from '@/lib/api';

const levelLabels: Record<string, string> = {
  LC: 'Leaving Cert',
  JC: 'Junior Cert',
};

function TutorCard({ tutor }: { tutor: any }) {
  const name = tutor.User
    ? `${tutor.User.firstName} ${tutor.User.lastName}`
    : 'Tutor';
  const verified = tutor.User?.gardaVettingVerified;
  const image = tutor.User?.profilePhotoUrl || undefined;
  const featured = tutor.featuredTier && tutor.featuredTier !== 'FREE';
  const level = tutor.levels?.[0];

  return (
    <Link href={`/tutors/${tutor.id}`}>
      <div className="bg-white rounded-xl border border-[#ECF0F1] p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar
            size="lg"
            src={image}
            alt={name}
            fallback={name}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-[#2C3E50] truncate">{name}</h3>
              {verified && (
                <CheckCircle className="w-4 h-4 text-[#2D9B6E] flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-[#5D6D7E] line-clamp-1">{tutor.headline}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tutor.featuredTier === 'ENTERPRISE' && <Badge variant="enterprise">Enterprise Tutor</Badge>}
          {tutor.featuredTier === 'PROFESSIONAL' && <Badge variant="professional">Professional</Badge>}
          {level && <Badge variant="primary">{levelLabels[level] || level}</Badge>}
          {tutor.subjects?.slice(0, 2).map((subject: string) => (
            <Badge key={subject} variant="default">{subject}</Badge>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-sm mb-4">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-semibold text-[#2C3E50]">{Number(tutor.rating).toFixed(1)}</span>
          <span className="text-[#95A5A6]">({tutor.reviewCount || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-4 border-t border-[#ECF0F1]">
          <div>
            <span className="text-2xl font-bold text-[#2D9B6E]">€{Number(tutor.baseHourlyRate).toFixed(0)}</span>
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
  const [tutorsList, setTutorsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tutors.search({ sortBy: 'featured', pageSize: 6 })
      .then(res => {
        if (res.success && res.data?.items) {
          setTutorsList(res.data.items);
        }
      })
      .catch(err => console.error('Failed to fetch tutors:', err))
      .finally(() => setLoading(false));
  }, []);

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

  // Hide entire section if no tutors and done loading
  if (!loading && tutorsList.length === 0) {
    return null;
  }

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
          {!loading && tutorsList.length > 0 && (
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
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#2D9B6E]" />
          </div>
        ) : (
          /* Carousel */
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tutorsList.map((tutor) => (
              <div
                key={tutor.id}
                className="flex-shrink-0 w-[300px] snap-start"
              >
                <TutorCard tutor={tutor} />
              </div>
            ))}
          </div>
        )}

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
