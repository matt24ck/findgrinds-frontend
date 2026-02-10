'use client';

import Link from 'next/link';
import { BookOpen, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2C3E50] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2D9B6E] rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Find<span className="text-[#2D9B6E]">Grinds</span>
              </span>
            </Link>
            <p className="text-[#95A5A6] text-sm">
              Ireland's trusted marketplace for Junior and Leaving Cert grinds.
              Find professional tutors and quality resources.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a href="#" className="text-[#95A5A6] hover:text-[#2D9B6E] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#95A5A6] hover:text-[#2D9B6E] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#95A5A6] hover:text-[#2D9B6E] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#95A5A6] hover:text-[#2D9B6E] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* For Students */}
          <div>
            <h4 className="font-bold mb-4">For Students</h4>
            <ul className="space-y-2 text-[#95A5A6]">
              <li>
                <Link href="/tutors" className="hover:text-[#2D9B6E] transition-colors">
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-[#2D9B6E] transition-colors">
                  Browse Resources
                </Link>
              </li>
              <li>
                <Link href="/subjects" className="hover:text-[#2D9B6E] transition-colors">
                  Subjects
                </Link>
              </li>
              <li>
                <Link href="/student-guide" className="hover:text-[#2D9B6E] transition-colors">
                  Student/Parent Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* For Tutors */}
          <div>
            <h4 className="font-bold mb-4">For Tutors</h4>
            <ul className="space-y-2 text-[#95A5A6]">
              <li>
                <Link href="/become-tutor" className="hover:text-[#2D9B6E] transition-colors">
                  Become a Tutor
                </Link>
              </li>
              <li>
                <Link href="/tutor-resources" className="hover:text-[#2D9B6E] transition-colors">
                  Sell Resources
                </Link>
              </li>
              <li>
                <Link href="/featured" className="hover:text-[#2D9B6E] transition-colors">
                  Featured Listings
                </Link>
              </li>
              <li>
                <Link href="/tutor-guide" className="hover:text-[#2D9B6E] transition-colors">
                  Tutor Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* FindGrinds */}
          <div>
            <h4 className="font-bold mb-4">FindGrinds</h4>
            <ul className="space-y-2 text-[#95A5A6]">
              <li>
                <Link href="/faq" className="hover:text-[#2D9B6E] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#2D9B6E] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#2D9B6E] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#2D9B6E] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#5D6D7E]/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#95A5A6] text-sm">
            &copy; {currentYear} FindGrinds. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-[#95A5A6]">
            <Link href="/privacy" className="hover:text-[#2D9B6E] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#2D9B6E] transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-[#2D9B6E] transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
