'use client';

import { TutorCard, TutorCardData } from './TutorCard';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

interface TutorGridProps {
  tutors: TutorCardData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function TutorGrid({
  tutors,
  total,
  page,
  pageSize,
  totalPages,
  onPageChange,
  isLoading,
}: TutorGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#ECF0F1] p-5 animate-pulse">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-[#ECF0F1]" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-[#ECF0F1] rounded w-3/4" />
                <div className="h-4 bg-[#ECF0F1] rounded w-full" />
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-[#ECF0F1] rounded-full w-20" />
              <div className="h-6 bg-[#ECF0F1] rounded-full w-16" />
            </div>
            <div className="h-4 bg-[#ECF0F1] rounded w-1/2 mb-4" />
            <div className="pt-4 border-t border-[#ECF0F1] flex justify-between">
              <div className="h-8 bg-[#ECF0F1] rounded w-20" />
              <div className="h-8 bg-[#ECF0F1] rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tutors.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-[#F0F7F4] rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-[#2D9B6E]" />
        </div>
        <h3 className="text-xl font-bold text-[#2C3E50] mb-2">No tutors found</h3>
        <p className="text-[#5D6D7E] mb-6">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);

  return (
    <div>
      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-[#5D6D7E]">
          Showing <span className="font-semibold text-[#2C3E50]">{startIndex}-{endIndex}</span> of{' '}
          <span className="font-semibold text-[#2C3E50]">{total}</span> tutors
        </p>
        <select className="px-3 py-2 rounded-lg border border-[#D5DBDB] text-sm text-[#5D6D7E] focus:border-[#2D9B6E] focus:outline-none">
          <option value="featured">Sort by: Featured</option>
          <option value="rating">Highest Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tutors.map(tutor => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-lg border border-[#D5DBDB] text-[#5D6D7E] hover:bg-[#F0F7F4] hover:border-[#2D9B6E] hover:text-[#2D9B6E] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .map((p, i, arr) => (
              <span key={p}>
                {i > 0 && arr[i - 1] !== p - 1 && (
                  <span className="px-2 text-[#95A5A6]">...</span>
                )}
                <button
                  onClick={() => onPageChange(p)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    p === page
                      ? 'bg-[#2D9B6E] text-white'
                      : 'text-[#5D6D7E] hover:bg-[#F0F7F4]'
                  }`}
                >
                  {p}
                </button>
              </span>
            ))}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-[#D5DBDB] text-[#5D6D7E] hover:bg-[#F0F7F4] hover:border-[#2D9B6E] hover:text-[#2D9B6E] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
