'use client';

import Link from 'next/link';
import { Star, MapPin, CheckCircle, Calendar } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import type { AITutor } from '@/lib/api';

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

const levelLabel = (l: string) => (l === 'LC' ? 'Leaving Cert' : l === 'JC' ? 'Junior Cert' : l);

interface Props {
  tutor: AITutor;
  /** Optional human-readable availability line, e.g. "Next free: Mon 21 Jun, 16:00". */
  availabilityNote?: string;
  onNavigate?: () => void;
}

export function TutorResultCard({ tutor, availabilityNote, onNavigate }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#ECF0F1] p-3 text-left shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar size="md" src={tutor.profilePhotoUrl || undefined} alt={tutor.name} fallback={tutor.name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="font-bold text-[#2C3E50] text-sm truncate">{tutor.name}</h4>
            {tutor.verified && <CheckCircle className="w-3.5 h-3.5 text-[#2D9B6E] flex-shrink-0" />}
            {tutor.teachesInIrish && (
              <span
                className="flex-shrink-0 text-[10px] bg-[#169B62] text-white px-1 py-0.5 rounded font-medium"
                title="Teaches through Irish"
              >
                Gaeilge
              </span>
            )}
          </div>
          {tutor.headline && (
            <p className="text-xs text-[#5D6D7E] line-clamp-2 mt-0.5">{tutor.headline}</p>
          )}
          <div className="flex items-center gap-3 mt-1 text-xs text-[#5D6D7E]">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-[#2C3E50]">{tutor.rating.toFixed(1)}</span>
              <span className="text-[#95A5A6]">({tutor.reviewCount})</span>
            </span>
            {tutor.area && (
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate max-w-[110px]">{tutor.area}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-2">
        {tutor.levels.map((l) => (
          <span key={l} className="text-[10px] bg-[#F0F7F4] text-[#2D9B6E] px-1.5 py-0.5 rounded font-medium">
            {levelLabel(l)}
          </span>
        ))}
        {tutor.subjects.slice(0, 3).map((s) => (
          <span key={s} className="text-[10px] bg-[#ECF0F1] text-[#5D6D7E] px-1.5 py-0.5 rounded font-medium">
            {subjectLabels[s] || s}
          </span>
        ))}
      </div>

      {availabilityNote && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-[#5D6D7E]">
          <Calendar className="w-3.5 h-3.5 text-[#2D9B6E]" />
          <span>{availabilityNote}</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#ECF0F1]">
        <div>
          <span className="text-lg font-bold text-[#2D9B6E]">€{tutor.hourlyRate}</span>
          <span className="text-[#95A5A6] text-xs">/hour</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={tutor.profileUrl}
            onClick={onNavigate}
            className="text-xs font-semibold text-[#5D6D7E] hover:text-[#2C3E50] px-2 py-1.5"
          >
            View
          </Link>
          <Link
            href={tutor.bookUrl}
            onClick={onNavigate}
            className="text-xs font-semibold text-white bg-[#2D9B6E] hover:bg-[#25A876] px-3 py-1.5 rounded-lg transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
