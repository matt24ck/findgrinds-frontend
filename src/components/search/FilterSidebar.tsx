'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface FilterSidebarProps {
  onFiltersChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export interface FilterState {
  subjects: string[];
  level: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  availability: string;
  teachesInIrish: boolean;
}

const subjects = [
  'MATHS', 'ENGLISH', 'IRISH', 'FRENCH', 'GERMAN', 'SPANISH',
  'BIOLOGY', 'CHEMISTRY', 'PHYSICS', 'GEOGRAPHY', 'HISTORY',
  'BUSINESS', 'ACCOUNTING', 'ECONOMICS'
];

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

export function FilterSidebar({ onFiltersChange, initialFilters }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters || {
    subjects: [],
    level: '',
    minPrice: 0,
    maxPrice: 150,
    minRating: 0,
    availability: '',
    teachesInIrish: false,
  });

  const [expandedSections, setExpandedSections] = useState({
    subjects: true,
    level: true,
    price: true,
    rating: true,
    availability: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleSubject = (subject: string) => {
    const newSubjects = filters.subjects.includes(subject)
      ? filters.subjects.filter(s => s !== subject)
      : [...filters.subjects, subject];
    updateFilter('subjects', newSubjects);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      subjects: [],
      level: '',
      minPrice: 0,
      maxPrice: 150,
      minRating: 0,
      availability: '',
      teachesInIrish: false,
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.subjects.length > 0 ||
    filters.level !== '' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 150 ||
    filters.minRating > 0 ||
    filters.availability !== '' ||
    filters.teachesInIrish;

  return (
    <div className="bg-white rounded-xl border border-[#ECF0F1] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-[#2C3E50]">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-[#2D9B6E] hover:underline flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Subjects */}
      <div className="border-b border-[#ECF0F1] pb-4 mb-4">
        <button
          onClick={() => toggleSection('subjects')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <span className="font-semibold text-[#2C3E50]">Subject</span>
          <ChevronDown className={`w-5 h-5 text-[#95A5A6] transition-transform ${expandedSections.subjects ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.subjects && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {subjects.map(subject => (
              <label key={subject} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.subjects.includes(subject)}
                  onChange={() => toggleSubject(subject)}
                  className="w-4 h-4 rounded border-[#D5DBDB] text-[#2D9B6E] focus:ring-[#2D9B6E]"
                />
                <span className="text-sm text-[#5D6D7E]">{subjectLabels[subject]}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Exam Level */}
      <div className="border-b border-[#ECF0F1] pb-4 mb-4">
        <button
          onClick={() => toggleSection('level')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <span className="font-semibold text-[#2C3E50]">Exam Level</span>
          <ChevronDown className={`w-5 h-5 text-[#95A5A6] transition-transform ${expandedSections.level ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.level && (
          <div className="space-y-2">
            {[
              { value: '', label: 'All Levels' },
              { value: 'JC', label: 'Junior Cert' },
              { value: 'LC', label: 'Leaving Cert' },
            ].map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="level"
                  checked={filters.level === option.value}
                  onChange={() => updateFilter('level', option.value)}
                  className="w-4 h-4 border-[#D5DBDB] text-[#2D9B6E] focus:ring-[#2D9B6E]"
                />
                <span className="text-sm text-[#5D6D7E]">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-[#ECF0F1] pb-4 mb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <span className="font-semibold text-[#2C3E50]">Price Range</span>
          <ChevronDown className={`w-5 h-5 text-[#95A5A6] transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.price && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-xs text-[#95A5A6] block mb-1">Min</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#95A5A6]">€</span>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', Number(e.target.value))}
                    className="w-full pl-7 pr-2 py-2 rounded-lg border border-[#D5DBDB] text-sm focus:border-[#2D9B6E] focus:outline-none"
                    min={0}
                    max={filters.maxPrice}
                  />
                </div>
              </div>
              <span className="text-[#95A5A6] mt-5">-</span>
              <div className="flex-1">
                <label className="text-xs text-[#95A5A6] block mb-1">Max</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#95A5A6]">€</span>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
                    className="w-full pl-7 pr-2 py-2 rounded-lg border border-[#D5DBDB] text-sm focus:border-[#2D9B6E] focus:outline-none"
                    min={filters.minPrice}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="border-b border-[#ECF0F1] pb-4 mb-4">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <span className="font-semibold text-[#2C3E50]">Minimum Rating</span>
          <ChevronDown className={`w-5 h-5 text-[#95A5A6] transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.rating && (
          <div className="space-y-2">
            {[
              { value: 0, label: 'Any Rating' },
              { value: 4.5, label: '4.5+ stars' },
              { value: 4.0, label: '4.0+ stars' },
              { value: 3.5, label: '3.5+ stars' },
            ].map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === option.value}
                  onChange={() => updateFilter('minRating', option.value)}
                  className="w-4 h-4 border-[#D5DBDB] text-[#2D9B6E] focus:ring-[#2D9B6E]"
                />
                <span className="text-sm text-[#5D6D7E]">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Teaches in Irish */}
      <div className="border-b border-[#ECF0F1] pb-4 mb-4">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="text-lg">🇮🇪</span>
            <span className="font-semibold text-[#2C3E50]">Grinds as Gaeilge</span>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={filters.teachesInIrish}
              onChange={(e) => updateFilter('teachesInIrish', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2D9B6E]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D9B6E]"></div>
          </div>
        </label>
        <p className="text-xs text-[#95A5A6] mt-2">Show tutors who teach through Irish</p>
      </div>

      {/* Apply Button (Mobile) */}
      <div className="lg:hidden">
        <Button className="w-full" onClick={() => onFiltersChange(filters)}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
