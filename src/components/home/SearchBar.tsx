'use client';

import { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';

const subjects = [
  { value: '', label: 'All Subjects' },
  { value: 'MATHS', label: 'Maths' },
  { value: 'ENGLISH', label: 'English' },
  { value: 'IRISH', label: 'Irish' },
  { value: 'FRENCH', label: 'French' },
  { value: 'GERMAN', label: 'German' },
  { value: 'SPANISH', label: 'Spanish' },
  { value: 'BIOLOGY', label: 'Biology' },
  { value: 'CHEMISTRY', label: 'Chemistry' },
  { value: 'PHYSICS', label: 'Physics' },
  { value: 'GEOGRAPHY', label: 'Geography' },
  { value: 'HISTORY', label: 'History' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'ACCOUNTING', label: 'Accounting' },
  { value: 'ECONOMICS', label: 'Economics' },
];

const levels = [
  { value: '', label: 'All Levels' },
  { value: 'JC', label: 'Junior Cert' },
  { value: 'LC', label: 'Leaving Cert' },
];

export function SearchBar() {
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Build query string and navigate
    const params = new URLSearchParams();
    if (subject) params.set('subject', subject);
    if (level) params.set('level', level);
    if (location) params.set('location', location);
    window.location.href = `/tutors?${params.toString()}`;
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="bg-white rounded-2xl shadow-lg p-2 flex flex-col md:flex-row gap-2">
        {/* Subject Select */}
        <div className="flex-1 relative">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 pr-10 rounded-xl bg-[#F8F9FA] border-0 text-[#2C3E50] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D9B6E]/20"
          >
            {subjects.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#95A5A6] pointer-events-none" />
        </div>

        {/* Level Select */}
        <div className="flex-1 relative">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-4 py-3 pr-10 rounded-xl bg-[#F8F9FA] border-0 text-[#2C3E50] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D9B6E]/20"
          >
            {levels.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#95A5A6] pointer-events-none" />
        </div>

        {/* Location Input */}
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#95A5A6]" />
          <input
            type="text"
            placeholder="Dublin, Cork, Galway..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8F9FA] border-0 text-[#2C3E50] placeholder-[#95A5A6] focus:outline-none focus:ring-2 focus:ring-[#2D9B6E]/20"
          />
        </div>

        {/* Search Button */}
        <Button type="submit" size="lg" className="md:w-auto">
          <Search className="w-5 h-5 mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
}
