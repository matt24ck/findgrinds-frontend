'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Search,
  Filter,
  Star,
  Download,
  FileText,
  Video,
  Image as ImageIcon,
  ChevronDown,
  ShoppingCart,
  Loader2,
} from 'lucide-react';
import { resources as resourcesApi } from '@/lib/api';

const subjects = [
  { value: '', label: 'All Subjects' },
  { value: 'MATHS', label: 'Maths' },
  { value: 'ENGLISH', label: 'English' },
  { value: 'IRISH', label: 'Irish' },
  { value: 'BIOLOGY', label: 'Biology' },
  { value: 'CHEMISTRY', label: 'Chemistry' },
  { value: 'PHYSICS', label: 'Physics' },
  { value: 'BUSINESS', label: 'Business' },
];

const resourceTypes = [
  { value: '', label: 'All Types' },
  { value: 'PDF', label: 'PDF Documents' },
  { value: 'VIDEO', label: 'Video Courses' },
  { value: 'IMAGE', label: 'Image Packs' },
];

const typeIcons = {
  PDF: FileText,
  VIDEO: Video,
  IMAGE: ImageIcon,
};

const subjectLabels: Record<string, string> = {
  MATHS: 'Maths',
  ENGLISH: 'English',
  IRISH: 'Irish',
  BIOLOGY: 'Biology',
  CHEMISTRY: 'Chemistry',
  PHYSICS: 'Physics',
  BUSINESS: 'Business',
};

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('sales');
  const [resourcesList, setResourcesList] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { sortBy, page };
      if (selectedSubject) params.subject = selectedSubject;
      if (selectedType) params.resourceType = selectedType;
      const res = await resourcesApi.search(params);
      if (res.success && res.data) {
        // Client-side search filter (backend doesn't support text search)
        let items = res.data.items || [];
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          items = items.filter((r: any) =>
            r.title?.toLowerCase().includes(q) ||
            r.description?.toLowerCase().includes(q)
          );
        }
        setResourcesList(items);
        setTotalResults(searchQuery ? items.length : res.data.total);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedSubject, selectedType, sortBy, page, searchQuery]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedSubject, selectedType, sortBy]);

  const filteredResources = resourcesList;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-2">
              Revision Resources
            </h1>
            <p className="text-[#5D6D7E]">
              High-quality notes, solutions, and study materials from top tutors
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#95A5A6]" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#D5DBDB] focus:border-[#2D9B6E] focus:ring-2 focus:ring-[#2D9B6E]/20 focus:outline-none"
                />
              </div>

              {/* Subject Filter */}
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="appearance-none w-full md:w-48 px-4 py-3 pr-10 rounded-lg border border-[#D5DBDB] bg-white text-[#2C3E50] focus:border-[#2D9B6E] focus:outline-none"
                >
                  {subjects.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#95A5A6] pointer-events-none" />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none w-full md:w-48 px-4 py-3 pr-10 rounded-lg border border-[#D5DBDB] bg-white text-[#2C3E50] focus:border-[#2D9B6E] focus:outline-none"
                >
                  {resourceTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#95A5A6] pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-full md:w-48 px-4 py-3 pr-10 rounded-lg border border-[#D5DBDB] bg-white text-[#2C3E50] focus:border-[#2D9B6E] focus:outline-none"
                >
                  <option value="sales">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#95A5A6] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-[#5D6D7E] mb-6">
            {loading ? 'Loading...' : (
              <>Showing <span className="font-semibold text-[#2C3E50]">{totalResults}</span> resources</>
            )}
          </p>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#2D9B6E]" />
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-[#D5DBDB] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#2C3E50] mb-2">No resources found</h3>
              <p className="text-[#5D6D7E]">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              {/* Resources Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredResources.map(resource => {
                  const TypeIcon = typeIcons[(resource.resourceType || resource.type) as keyof typeof typeIcons] || FileText;
                  const tutorName = resource.tutor?.User
                    ? `${resource.tutor.User.firstName} ${resource.tutor.User.lastName}`
                    : resource.tutorName || 'Tutor';

                  return (
                    <Link key={resource.id} href={`/resources/${resource.id}`}>
                      <div className="bg-white rounded-xl border border-[#ECF0F1] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
                        {/* Preview Area */}
                        <div className="h-32 bg-gradient-to-br from-[#F0F7F4] to-[#E8F5E9] flex items-center justify-center">
                          <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center">
                            <TypeIcon className="w-8 h-8 text-[#2D9B6E]" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex-1 flex flex-col">
                          {/* Badges */}
                          <div className="flex gap-2 mb-2">
                            <Badge variant="primary">{subjectLabels[resource.subject] || resource.subject}</Badge>
                            <Badge variant="default">{resource.resourceType || resource.type}</Badge>
                          </div>

                          {/* Title */}
                          <h3 className="font-semibold text-[#2C3E50] mb-2 line-clamp-2">
                            {resource.title}
                          </h3>

                          {/* Tutor */}
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar size="sm" fallback={tutorName} />
                            {resource.tutor?.id ? (
                              <Link
                                href={`/tutors/${resource.tutor.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm text-[#2D9B6E] hover:underline"
                              >
                                {tutorName}
                              </Link>
                            ) : (
                              <span className="text-sm text-[#5D6D7E]">{tutorName}</span>
                            )}
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between text-sm mt-auto mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="font-medium text-[#2C3E50]">{Number(resource.rating).toFixed(1)}</span>
                              <span className="text-[#95A5A6]">({resource.reviewCount || 0})</span>
                            </div>
                            <div className="flex items-center gap-1 text-[#5D6D7E]">
                              <Download className="w-4 h-4" />
                              <span>{resource.salesCount || 0}</span>
                            </div>
                          </div>

                          {/* Price & CTA */}
                          <div className="flex items-center justify-between pt-3 border-t border-[#ECF0F1]">
                            <span className="text-xl font-bold text-[#2D9B6E]">€{Number(resource.price).toFixed(2)}</span>
                            <Button variant="secondary" size="sm">
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Buy
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-[#5D6D7E]">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
