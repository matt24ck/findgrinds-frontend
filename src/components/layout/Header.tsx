'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, BookOpen, LogOut, LayoutDashboard, ChevronDown, Shield, MessageSquare } from 'lucide-react';
import { messages as messagesApi } from '@/lib/api';
import { Button } from '../ui/Button';

interface AuthUser {
  firstName: string;
  lastName: string;
  userType: 'STUDENT' | 'PARENT' | 'TUTOR';
  profilePhotoUrl?: string;
  isAdmin?: boolean;
}

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(data => {
        const u = data.data || data;
        setUser({ firstName: u.firstName, lastName: u.lastName, userType: u.userType, profilePhotoUrl: u.profilePhotoUrl, isAdmin: u.isAdmin });
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      });
  }, []);

  // Poll unread message count
  useEffect(() => {
    if (!user) return;

    const fetchUnread = () => {
      messagesApi.getUnreadCount()
        .then((res) => setUnreadCount(res.data.count))
        .catch(() => {});
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
  };

  const dashboardPath = user?.userType === 'TUTOR' ? '/dashboard/tutor' : user?.userType === 'PARENT' ? '/dashboard/parent' : '/dashboard/student';
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#ECF0F1]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2D9B6E] rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#2C3E50]">
              Find<span className="text-[#2D9B6E]">Grinds</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/tutors"
              className="text-[#5D6D7E] hover:text-[#2D9B6E] font-medium transition-colors"
            >
              Find Tutors
            </Link>
            <Link
              href="/resources"
              className="text-[#5D6D7E] hover:text-[#2D9B6E] font-medium transition-colors"
            >
              Resources
            </Link>
            <Link
              href="/become-tutor"
              className="text-[#5D6D7E] hover:text-[#2D9B6E] font-medium transition-colors"
            >
              Become a Tutor
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#95A5A6]" />
              <input
                type="text"
                placeholder="Search tutors, subjects..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#D5DBDB] focus:border-[#2D9B6E] focus:ring-2 focus:ring-[#2D9B6E]/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Auth Area (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/messages"
                  className="relative p-2 text-[#5D6D7E] hover:text-[#2D9B6E] transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold leading-none">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    </span>
                  )}
                </Link>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#F8F9FA] transition-colors"
                >
                  {user.profilePhotoUrl ? (
                    <img
                      src={user.profilePhotoUrl}
                      alt={user.firstName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#2D9B6E] flex items-center justify-center text-white text-sm font-semibold">
                      {initials}
                    </div>
                  )}
                  <span className="text-sm font-medium text-[#2C3E50]">{user.firstName}</span>
                  <ChevronDown className={`w-4 h-4 text-[#95A5A6] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#ECF0F1] py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#ECF0F1]">
                      <p className="text-sm font-semibold text-[#2C3E50]">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-[#95A5A6] capitalize">{user.userType.toLowerCase()}</p>
                    </div>
                    <Link
                      href={dashboardPath}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#5D6D7E] hover:bg-[#F0F7F4] hover:text-[#2D9B6E] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    {user.isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#5D6D7E] hover:bg-[#F0F7F4] hover:text-[#2D9B6E] transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[#5D6D7E] hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#5D6D7E]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#ECF0F1]">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#95A5A6]" />
              <input
                type="text"
                placeholder="Search tutors, subjects..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#D5DBDB] focus:border-[#2D9B6E] focus:outline-none"
              />
            </div>

            {/* Mobile Nav Links */}
            <div className="space-y-2">
              <Link
                href="/tutors"
                className="block py-2 text-[#5D6D7E] hover:text-[#2D9B6E] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Tutors
              </Link>
              <Link
                href="/resources"
                className="block py-2 text-[#5D6D7E] hover:text-[#2D9B6E] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Resources
              </Link>
              <Link
                href="/become-tutor"
                className="block py-2 text-[#5D6D7E] hover:text-[#2D9B6E] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Become a Tutor
              </Link>
            </div>

            {/* Mobile Auth Area */}
            <div className="mt-4 pt-4 border-t border-[#ECF0F1]">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 py-2">
                    {user.profilePhotoUrl ? (
                      <img
                        src={user.profilePhotoUrl}
                        alt={user.firstName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#2D9B6E] flex items-center justify-center text-white font-semibold">
                        {initials}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-[#2C3E50]">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-[#95A5A6] capitalize">{user.userType.toLowerCase()}</p>
                    </div>
                  </div>
                  <Link
                    href="/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-[#5D6D7E] hover:text-[#2D9B6E] font-medium"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Messages
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href={dashboardPath}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-[#5D6D7E] hover:text-[#2D9B6E] font-medium"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                  {user.isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 text-[#5D6D7E] hover:text-[#2D9B6E] font-medium"
                    >
                      <Shield className="w-5 h-5" />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 py-2 text-[#5D6D7E] hover:text-red-600 font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link href="/login" className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button variant="primary" size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
