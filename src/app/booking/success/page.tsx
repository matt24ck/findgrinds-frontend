'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Check, Calendar, Video, MapPin, Users, Loader2 } from 'lucide-react';

interface BookingDetails {
  id: string;
  subject: string;
  level: string;
  sessionType: 'VIDEO' | 'IN_PERSON' | 'GROUP';
  scheduledAt: string;
  durationMins: number;
  price: number;
  status: string;
  tutor: {
    id: string;
    firstName: string;
    lastName: string;
    profilePhotoUrl?: string;
  };
  student: {
    firstName: string;
    lastName: string;
  };
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

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/stripe/booking/${sessionId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }

        const result = await response.json();
        setBooking(result.data);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Could not load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [sessionId]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-IE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSessionTypeConfig = (sessionType: 'VIDEO' | 'IN_PERSON' | 'GROUP') => {
    switch (sessionType) {
      case 'VIDEO':
        return {
          icon: Video,
          label: '1-on-1 Video Session',
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          steps: [
            {
              title: 'Check your email',
              description: "We've sent you a confirmation with session details",
            },
            {
              title: 'Join your session',
              description: 'Join your session directly from your dashboard when it\'s time',
            },
            {
              title: 'Start learning',
              description: 'Your video call opens right on FindGrinds — no extra apps needed',
            },
          ],
        };
      case 'IN_PERSON':
        return {
          icon: MapPin,
          label: 'In-Person Session',
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          steps: [
            {
              title: 'Check your email',
              description: "We've sent you a confirmation with session details",
            },
            {
              title: 'Arrange meeting location',
              description: 'Your tutor will contact you to confirm where to meet',
            },
            {
              title: 'Attend your session',
              description: 'Meet your tutor at the agreed location at the scheduled time',
            },
          ],
        };
      case 'GROUP':
        return {
          icon: Users,
          label: 'Group Class',
          color: 'text-purple-500',
          bgColor: 'bg-purple-50',
          steps: [
            {
              title: 'Check your email',
              description: "We've sent you a confirmation with class details",
            },
            {
              title: 'Receive class information',
              description: "You'll get details about the location and other participants",
            },
            {
              title: 'Join the class',
              description: 'Attend the group session at the scheduled time',
            },
          ],
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-[#2D9B6E] animate-spin mx-auto mb-4" />
            <p className="text-[#5D6D7E]">Loading booking details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Fallback for when we can't load booking details
  const sessionType = booking?.sessionType || 'VIDEO';
  const config = getSessionTypeConfig(sessionType);
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-[#F0F7F4] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-[#2D9B6E]" />
          </div>

          <h1 className="text-3xl font-bold text-[#2C3E50] mb-4">Booking Confirmed!</h1>

          {/* Session Type Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 ${config.bgColor} rounded-full mb-4`}>
            <IconComponent className={`w-5 h-5 ${config.color}`} />
            <span className={`font-medium ${config.color}`}>{config.label}</span>
          </div>

          <p className="text-[#5D6D7E] mb-8">
            Your tutoring session has been booked successfully. You'll receive a confirmation email shortly with all the details.
          </p>

          {/* Booking Summary */}
          {booking && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 text-left">
              <h2 className="font-semibold text-[#2C3E50] mb-4">Session Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#5D6D7E]">Subject</span>
                  <span className="font-medium text-[#2C3E50]">
                    {subjectLabels[booking.subject] || booking.subject}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5D6D7E]">Tutor</span>
                  <span className="font-medium text-[#2C3E50]">
                    {booking.tutor.firstName} {booking.tutor.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5D6D7E]">Date</span>
                  <span className="font-medium text-[#2C3E50]">
                    {formatDate(booking.scheduledAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5D6D7E]">Time</span>
                  <span className="font-medium text-[#2C3E50]">
                    {formatTime(booking.scheduledAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5D6D7E]">Duration</span>
                  <span className="font-medium text-[#2C3E50]">
                    {booking.durationMins} minutes
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#ECF0F1]">
                  <span className="text-[#5D6D7E]">Total Paid</span>
                  <span className="font-bold text-[#2D9B6E]">
                    €{Number(booking.price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 text-left">
            <h2 className="font-semibold text-[#2C3E50] mb-4">What's next?</h2>
            <ul className="space-y-4">
              {config.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#F0F7F4] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[#2D9B6E] font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-[#2C3E50]">{step.title}</p>
                    <p className="text-sm text-[#5D6D7E]">{step.description}</p>
                  </div>
                </li>
              ))}
            </ul>
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

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-[#2D9B6E] animate-spin mx-auto mb-4" />
            <p className="text-[#5D6D7E]">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
}
