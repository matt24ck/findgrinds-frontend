'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Calendar, Users, Clock, Loader2 } from 'lucide-react';

function ReservationSuccessContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-blue-600" />
          </div>

          <h1 className="text-3xl font-bold text-[#2C3E50] mb-4">Spot Reserved!</h1>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-600">Awaiting Minimum Participants</span>
          </div>

          <p className="text-[#5D6D7E] mb-8">
            Your card details have been saved securely. <strong>You will NOT be charged</strong> until the minimum number of students have reserved.
          </p>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 text-left">
            <h2 className="font-semibold text-[#2C3E50] mb-4">What happens next?</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-[#2C3E50]">More students reserve</p>
                  <p className="text-sm text-[#5D6D7E]">Other students can also reserve their spot in this group session.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-[#2C3E50]">Minimum met = confirmed</p>
                  <p className="text-sm text-[#5D6D7E]">Once enough students have reserved, your card will be charged and the session is confirmed.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-[#2C3E50]">Or auto-cancels</p>
                  <p className="text-sm text-[#5D6D7E]">If the minimum isn&apos;t reached 24 hours before the session, your reservation is cancelled automatically. No charge.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-8 text-sm text-blue-700">
            You can cancel your reservation at any time from your dashboard before you are charged.
          </div>

          <div className="flex gap-4">
            <Link href="/dashboard/student" className="flex-1">
              <Button variant="secondary" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                View My Sessions
              </Button>
            </Link>
            <Link href="/tutors" className="flex-1">
              <Button className="w-full">
                Find More Tutors
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingReservedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-[#5D6D7E]">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <ReservationSuccessContent />
    </Suspense>
  );
}
