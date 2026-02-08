'use client';

import Link from 'next/link';
import { Star, MapPin, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export interface TutorCardData {
  id: string;
  name: string;
  headline: string;
  subjects: string[];
  levels: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  location: string;
  image?: string;
  profilePhotoUrl?: string;
  featuredTier: 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';
  verified: boolean;
  totalBookings: number;
  teachesInIrish?: boolean;
}

interface TutorCardProps {
  tutor: TutorCardData;
}

const subjectLabels: Record<string, string> = {
  MATHS: 'Maths',
  ENGLISH: 'English',
  IRISH: 'Irish',
  FRENCH: 'French',
  GERMAN: 'German',
  SPANISH: 'Spanish',
  BIOLOGY: 'Biology',
  CHEMISTRY: 'Chemistry',
  PHYSICS: 'Physics',
  GEOGRAPHY: 'Geography',
  HISTORY: 'History',
  BUSINESS: 'Business',
  ACCOUNTING: 'Accounting',
  ECONOMICS: 'Economics',
};

export function TutorCard({ tutor }: TutorCardProps) {
  const isFeatured = tutor.featuredTier !== 'FREE';

  return (
    <Link href={`/tutors/${tutor.id}`}>
      <div className={`bg-white rounded-xl border p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full ${tutor.featuredTier === 'ENTERPRISE' ? 'border-[#D4A574] ring-1 ring-[#D4A574]/20' : tutor.featuredTier === 'PROFESSIONAL' ? 'border-[#2D9B6E] ring-1 ring-[#2D9B6E]/20' : 'border-[#ECF0F1]'}`}>
        {/* Featured Banner */}
        {isFeatured && (
          <div className="flex justify-end mb-2 -mt-2 -mr-2">
            <Badge variant={tutor.featuredTier === 'ENTERPRISE' ? 'enterprise' : 'professional'}>
              {tutor.featuredTier === 'ENTERPRISE' ? 'Enterprise Tutor' : 'Professional'}
            </Badge>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar
            size="lg"
            src={tutor.image}
            alt={tutor.name}
            fallback={tutor.name}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-[#2C3E50] truncate">{tutor.name}</h3>
              {tutor.verified && (
                <CheckCircle className="w-4 h-4 text-[#2D9B6E] flex-shrink-0" />
              )}
              {tutor.teachesInIrish && (
                <span className="flex-shrink-0 text-xs bg-[#169B62] text-white px-1.5 py-0.5 rounded font-medium" title="Teaches through Irish">
                  Gaeilge
                </span>
              )}
            </div>
            <p className="text-sm text-[#5D6D7E] line-clamp-2">{tutor.headline}</p>
          </div>
        </div>

        {/* Subjects & Levels */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tutor.levels.map(level => (
            <Badge key={level} variant="primary">
              {level === 'LC' ? 'Leaving Cert' : 'Junior Cert'}
            </Badge>
          ))}
          {tutor.subjects.slice(0, 3).map(subject => (
            <Badge key={subject} variant="default">
              {subjectLabels[subject] || subject}
            </Badge>
          ))}
          {tutor.subjects.length > 3 && (
            <Badge variant="default">+{tutor.subjects.length - 3} more</Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold text-[#2C3E50]">{tutor.rating.toFixed(1)}</span>
            <span className="text-[#95A5A6]">({tutor.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-[#5D6D7E]">
            <MapPin className="w-4 h-4" />
            <span className="truncate max-w-[120px]">{tutor.location}</span>
          </div>
        </div>

        {/* Booking Info */}
        <div className="flex items-center gap-2 text-xs text-[#95A5A6] mb-4">
          <Clock className="w-3.5 h-3.5" />
          <span>{tutor.totalBookings} sessions booked</span>
        </div>

        {/* Price & CTA */}
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
