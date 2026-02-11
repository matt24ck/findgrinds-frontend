'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FilterSidebar, FilterState } from '@/components/search/FilterSidebar';
import { TutorGrid } from '@/components/search/TutorGrid';
import { TutorCardData } from '@/components/search/TutorCard';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AREA_LABELS } from '@/lib/constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function TutorsPageContent() {
  const searchParams = useSearchParams();
  const [tutors, setTutors] = useState<TutorCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Persist forStudent param so it survives navigation to tutor profile → booking page
  useEffect(() => {
    const forStudent = searchParams.get('forStudent');
    if (forStudent) {
      sessionStorage.setItem('bookingForStudent', forStudent);
    }
  }, [searchParams]);

  const [filters, setFilters] = useState<FilterState>({
    subjects: searchParams.get('subject') ? [searchParams.get('subject')!] : [],
    level: searchParams.get('level') || '',
    area: searchParams.get('area') || '',
    minPrice: 0,
    maxPrice: 150,
    minRating: 0,
    availability: '',
    teachesInIrish: false,
  });

  const pageSize = 9;

  useEffect(() => {
    const fetchTutors = async () => {
      setIsLoading(true);
      try {
        // Build query params
        const params = new URLSearchParams();
        params.set('page', page.toString());
        params.set('pageSize', pageSize.toString());

        if (filters.subjects.length > 0) {
          params.set('subject', filters.subjects[0]); // API handles one subject at a time
        }
        if (filters.level) {
          params.set('level', filters.level);
        }
        if (filters.minPrice > 0) {
          params.set('minPrice', filters.minPrice.toString());
        }
        if (filters.maxPrice < 150) {
          params.set('maxPrice', filters.maxPrice.toString());
        }
        if (filters.minRating > 0) {
          params.set('minRating', filters.minRating.toString());
        }
        if (filters.area) {
          params.set('area', filters.area);
        }
        if (filters.teachesInIrish) {
          params.set('teachesInIrish', 'true');
        }
        if (sortBy) {
          params.set('sortBy', sortBy);
        }

        const response = await fetch(`${API_URL}/api/tutors?${params.toString()}`);
        const data = await response.json();

        if (data.success && data.data) {
          // Transform API response to match TutorCardData format
          const transformedTutors: TutorCardData[] = data.data.items.map((tutor: any) => ({
            id: tutor.id,
            name: tutor.User ? `${tutor.User.firstName} ${tutor.User.lastName}` : 'Unknown',
            headline: tutor.headline || 'Tutor',
            subjects: tutor.subjects || [],
            levels: tutor.levels || [],
            rating: Number(tutor.rating) || 0,
            reviewCount: tutor.reviewCount || 0,
            hourlyRate: Number(tutor.baseHourlyRate) || 0,
            location: tutor.area ? (AREA_LABELS[tutor.area] || tutor.area) : 'Ireland',
            featuredTier: tutor.featuredTier || 'FREE',
            verified: tutor.User?.gardaVettingVerified || false,
            totalBookings: tutor.totalBookings || 0,
            profilePhotoUrl: tutor.User?.profilePhotoUrl,
            teachesInIrish: tutor.teachesInIrish || false,
          }));

          setTutors(transformedTutors);
          setTotal(data.data.total);
          setTotalPages(data.data.totalPages);
        } else {
          setTutors([]);
          setTotal(0);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Failed to fetch tutors:', error);
        setTutors([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutors();
  }, [filters, page, sortBy]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-2">
              Find Your Perfect Tutor
            </h1>
            <p className="text-[#5D6D7E]">
              Browse our network of verified tutors across Ireland
            </p>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <Button
              variant="outline"
              onClick={() => setMobileFiltersOpen(true)}
              className="w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {(filters.subjects.length > 0 || filters.level || filters.minRating > 0) && (
                <span className="ml-2 bg-[#2D9B6E] text-white text-xs px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </Button>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar
                  onFiltersChange={handleFiltersChange}
                  initialFilters={filters}
                />
              </div>
            </aside>

            {/* Mobile Sidebar */}
            {mobileFiltersOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto">
                  <div className="flex items-center justify-between p-4 border-b border-[#ECF0F1]">
                    <h3 className="font-bold text-[#2C3E50]">Filters</h3>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="p-2 text-[#5D6D7E]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <FilterSidebar
                      onFiltersChange={(newFilters) => {
                        handleFiltersChange(newFilters);
                        setMobileFiltersOpen(false);
                      }}
                      initialFilters={filters}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Results Grid */}
            <div className="flex-1 min-w-0">
              <TutorGrid
                tutors={tutors}
                total={total}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                onPageChange={setPage}
                sortBy={sortBy}
                onSortChange={(s) => { setSortBy(s); setPage(1); }}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TutorsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D9B6E]"></div>
      </div>
    }>
      <TutorsPageContent />
    </Suspense>
  );
}
