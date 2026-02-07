'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Users,
  CreditCard,
  Check,
  ChevronLeft,
  Star,
  AlertCircle,
  Minus,
  Plus,
  Info,
} from 'lucide-react';

type SessionType = 'VIDEO' | 'IN_PERSON' | 'GROUP';

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function computeEndTime(startTime: string, durationMins: number): string {
  const [h, m] = startTime.split(':').map(Number);
  const totalMins = h * 60 + m + durationMins;
  const endH = Math.floor(totalMins / 60);
  const endM = totalMins % 60;
  return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
}

function getMaxConsecutiveDuration(slots: { startTime: string; endTime: string }[], startTime: string): number {
  const startIndex = slots.findIndex(s => s.startTime === startTime);
  if (startIndex === -1) return 0;
  let count = 1;
  for (let i = startIndex + 1; i < slots.length; i++) {
    if (slots[i - 1].endTime === slots[i].startTime) {
      count++;
    } else {
      break;
    }
  }
  return count * 30;
}

interface TutorData {
  id: string;
  userId: string;
  headline: string;
  bio: string;
  subjects: string[];
  levels: string[];
  baseHourlyRate: number;
  groupHourlyRate?: number;
  maxGroupSize?: number;
  rating: number;
  reviewCount: number;
  stripeConnectOnboarded: boolean;
  cancellationNoticeHours?: number;
  lateCancellationRefundPercent?: number;
  User: {
    firstName: string;
    lastName: string;
    profilePhotoUrl?: string;
  };
}

interface AvailabilitySlot {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  medium: SessionType;
  price: number;
  groupSpotsLeft?: number;
  groupSpotsTotal?: number;
}

interface DayAvailability {
  date: string;
  dayName: string;
  dayNum: number;
  month: string;
  slots: AvailabilitySlot[];
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const forStudentId = searchParams.get('forStudent')
    || (typeof window !== 'undefined' ? sessionStorage.getItem('bookingForStudent') : null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTutor, setIsFetchingTutor] = useState(true);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [tutor, setTutor] = useState<TutorData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<DayAvailability[]>([]);

  // Booking state
  const [sessionType, setSessionType] = useState<SessionType>('VIDEO');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [durationMins, setDurationMins] = useState<number>(30);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [studentNotes, setStudentNotes] = useState('');

  // Fetch availability slots for the selected medium
  const fetchAvailability = async (medium: SessionType) => {
    setIsFetchingSlots(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() + 1);
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 15);

      const searchParams = new URLSearchParams({
        medium,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });

      const response = await fetch(
        `${apiUrl}/api/availability/${params.tutorId}/slots?${searchParams.toString()}`
      );

      if (!response.ok) {
        setAvailability([]);
        return;
      }

      const result = await response.json();
      const rawData = result.data || {};
      const slots: AvailabilitySlot[] = rawData.slots || rawData || [];

      // Group slots by date
      const dayMap = new Map<string, AvailabilitySlot[]>();
      for (const slot of slots) {
        if (!slot.available) continue;
        const existing = dayMap.get(slot.date) || [];
        existing.push(slot);
        dayMap.set(slot.date, existing);
      }

      // Convert to DayAvailability array
      const days: DayAvailability[] = [];
      for (const [date, daySlots] of dayMap) {
        const dateObj = new Date(date + 'T12:00:00');
        days.push({
          date,
          dayName: dateObj.toLocaleDateString('en-IE', { weekday: 'short' }),
          dayNum: dateObj.getDate(),
          month: dateObj.toLocaleDateString('en-IE', { month: 'short' }),
          slots: daySlots.sort((a, b) => a.startTime.localeCompare(b.startTime)),
        });
      }

      days.sort((a, b) => a.date.localeCompare(b.date));
      setAvailability(days);
    } catch (err) {
      console.error('Failed to fetch availability:', err);
      setAvailability([]);
    } finally {
      setIsFetchingSlots(false);
    }
  };

  // Fetch tutor data
  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/tutors/${params.tutorId}`);

        if (!response.ok) {
          throw new Error('Tutor not found');
        }

        const result = await response.json();
        const tutorData = result.data || result;
        setTutor(tutorData);

        if (tutorData.subjects?.length > 0) {
          setSelectedSubject(tutorData.subjects[0]);
        }
        if (tutorData.levels?.length > 0) {
          setSelectedLevel(tutorData.levels[0]);
        }
      } catch (err) {
        setError('Could not load tutor information');
      } finally {
        setIsFetchingTutor(false);
      }
    };

    fetchTutor();
  }, [params.tutorId]);

  // Fetch availability when tutor loads or session type changes
  useEffect(() => {
    if (params.tutorId) {
      setSelectedDate(null);
      setSelectedTime(null);
      setDurationMins(30);
      fetchAvailability(sessionType);
    }
  }, [params.tutorId, sessionType]);

  const tutorName = tutor?.User ? `${tutor.User.firstName} ${tutor.User.lastName}` : 'Tutor';
  const hourlyRate = tutor
    ? sessionType === 'GROUP' && tutor.groupHourlyRate
      ? Number(tutor.groupHourlyRate)
      : Number(tutor.baseHourlyRate)
    : 0;
  const pricePerSlot = hourlyRate / 2;
  const numberOfSlots = durationMins / 30;
  const total = pricePerSlot * numberOfSlots;

  // Find selected slot for group info
  const selectedSlot = selectedDate && selectedTime
    ? availability.find(d => d.date === selectedDate)?.slots.find(s => s.startTime === selectedTime)
    : null;

  const sessionTypes = [
    { type: 'VIDEO' as SessionType, icon: Video, label: '1:1 Video', description: 'Online video call' },
    { type: 'IN_PERSON' as SessionType, icon: MapPin, label: 'In Person', description: 'Meet face-to-face' },
    { type: 'GROUP' as SessionType, icon: Users, label: 'Group Class', description: 'Join with others' },
  ];

  const handleProceedToPayment = async () => {
    if (!tutor || !selectedDate || !selectedTime) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push(`/login?redirect=/book/${params.tutorId}`);
        return;
      }

      // Create scheduled datetime
      const [hours, mins] = selectedTime.split(':');
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(parseInt(hours), parseInt(mins), 0, 0);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/stripe/checkout/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          tutorId: tutor.id,
          subject: selectedSubject,
          level: selectedLevel,
          sessionType,
          scheduledAt: scheduledAt.toISOString(),
          durationMins,
          ...(forStudentId ? { studentId: forStudentId } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        sessionStorage.removeItem('bookingForStudent');
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setIsLoading(false);
    }
  };

  const canProceedToStep2 = selectedDate && selectedTime;
  const canProceedToStep3 = selectedSubject && selectedLevel;

  if (isFetchingTutor) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D9B6E]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#2C3E50] mb-4">Tutor Not Found</h1>
            <p className="text-[#5D6D7E] mb-6">The tutor you're looking for doesn't exist.</p>
            <Link href="/tutors">
              <Button>Browse Tutors</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href={`/tutors/${params.tutorId}`}
            className="inline-flex items-center gap-2 text-[#5D6D7E] hover:text-[#2D9B6E] mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to profile
          </Link>

          {/* Parent Booking Banner */}
          {forStudentId && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Booking on behalf of your child</p>
                <p className="text-sm text-blue-700">
                  This session will be added to your child's schedule.
                </p>
              </div>
            </div>
          )}

          {/* Payment Not Set Up Warning */}
          {!tutor.stripeConnectOnboarded && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Payments not available</p>
                <p className="text-sm text-amber-700">
                  This tutor hasn't set up payment processing yet. You can still contact them directly.
                </p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                  step >= s ? 'bg-[#2D9B6E] text-white' : 'bg-[#ECF0F1] text-[#95A5A6]'
                }`}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${step > s ? 'bg-[#2D9B6E]' : 'bg-[#ECF0F1]'}`} />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Select Time */}
              {step === 1 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-[#2C3E50] mb-6">Select Date & Time</h2>

                  {/* Session Type */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#2C3E50] mb-3">Session Type</label>
                    <div className="grid grid-cols-3 gap-3">
                      {sessionTypes.map((st) => (
                        <button
                          key={st.type}
                          onClick={() => setSessionType(st.type)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            sessionType === st.type
                              ? 'border-[#2D9B6E] bg-[#F0F7F4]'
                              : 'border-[#ECF0F1] hover:border-[#2D9B6E]'
                          }`}
                        >
                          <st.icon className={`w-6 h-6 mx-auto mb-2 ${sessionType === st.type ? 'text-[#2D9B6E]' : 'text-[#5D6D7E]'}`} />
                          <div className="font-medium text-[#2C3E50] text-sm">{st.label}</div>
                          <div className="text-xs text-[#95A5A6]">{st.description}</div>
                          {st.type === 'GROUP' && tutor?.groupHourlyRate && (
                            <div className="text-xs text-[#2D9B6E] font-medium mt-1">€{Number(tutor.groupHourlyRate)}/hr</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calendar */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#2C3E50] mb-3">Select a Date</label>
                    {isFetchingSlots ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D9B6E]"></div>
                        <span className="ml-3 text-[#5D6D7E]">Loading availability...</span>
                      </div>
                    ) : availability.length === 0 ? (
                      <div className="text-center py-8 bg-[#F8F9FA] rounded-xl">
                        <Clock className="w-10 h-10 text-[#95A5A6] mx-auto mb-3" />
                        <p className="text-[#5D6D7E] font-medium">No availability</p>
                        <p className="text-sm text-[#95A5A6] mt-1">
                          This tutor hasn't set their availability for {sessionType === 'VIDEO' ? '1:1 Video' : sessionType === 'IN_PERSON' ? 'In-Person' : 'Group'} sessions yet. Try selecting a different session type.
                        </p>
                      </div>
                    ) : (
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {availability.map((day) => (
                          <button
                            key={day.date}
                            onClick={() => {
                              setSelectedDate(day.date);
                              setSelectedTime(null);
                              setDurationMins(30);
                            }}
                            className={`flex-shrink-0 w-16 py-3 rounded-xl border-2 text-center transition-all ${
                              selectedDate === day.date
                                ? 'border-[#2D9B6E] bg-[#F0F7F4]'
                                : 'border-[#ECF0F1] hover:border-[#2D9B6E]'
                            }`}
                          >
                            <div className="text-xs text-[#95A5A6]">{day.dayName}</div>
                            <div className="text-lg font-bold text-[#2C3E50]">{day.dayNum}</div>
                            <div className="text-xs text-[#95A5A6]">{day.month}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-[#2C3E50] mb-3">Select a Start Time</label>
                      <div className="grid grid-cols-4 gap-3">
                        {availability
                          .find((d) => d.date === selectedDate)
                          ?.slots.map((slot) => (
                            <button
                              key={slot.startTime}
                              onClick={() => {
                                setSelectedTime(slot.startTime);
                                setDurationMins(30);
                              }}
                              className={`py-3 px-2 rounded-xl font-medium transition-all ${
                                selectedTime === slot.startTime
                                  ? 'bg-[#2D9B6E] text-white'
                                  : 'bg-[#F0F7F4] text-[#2D9B6E] hover:bg-[#2D9B6E] hover:text-white'
                              }`}
                            >
                              <div>{slot.startTime}</div>
                              {sessionType === 'GROUP' && slot.groupSpotsLeft != null && (
                                <div className={`text-xs mt-1 ${
                                  selectedTime === slot.startTime ? 'text-white/80' : 'text-[#95A5A6]'
                                }`}>
                                  {slot.groupSpotsLeft} spot{slot.groupSpotsLeft !== 1 ? 's' : ''} left
                                </div>
                              )}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Duration Selector */}
                  {selectedDate && selectedTime && (() => {
                    const daySlots = availability.find(d => d.date === selectedDate)?.slots || [];
                    const maxDuration = getMaxConsecutiveDuration(daySlots, selectedTime);

                    return (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-[#2C3E50] mb-3">Session Duration</label>
                        <div className="flex items-center justify-center gap-5 py-4 bg-[#F8F9FA] rounded-xl">
                          <button
                            onClick={() => setDurationMins(Math.max(30, durationMins - 30))}
                            disabled={durationMins <= 30}
                            className="w-10 h-10 rounded-full border-2 border-[#ECF0F1] flex items-center justify-center text-[#2C3E50] hover:border-[#2D9B6E] hover:text-[#2D9B6E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <div className="text-center min-w-[140px]">
                            <div className="text-2xl font-bold text-[#2C3E50]">
                              {formatDuration(durationMins)}
                            </div>
                            <div className="text-sm text-[#95A5A6] mt-1">
                              {selectedTime} – {computeEndTime(selectedTime, durationMins)}
                            </div>
                          </div>
                          <button
                            onClick={() => setDurationMins(Math.min(maxDuration, durationMins + 30))}
                            disabled={durationMins >= maxDuration}
                            className="w-10 h-10 rounded-full border-2 border-[#ECF0F1] flex items-center justify-center text-[#2C3E50] hover:border-[#2D9B6E] hover:text-[#2D9B6E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        {maxDuration > 30 && (
                          <p className="text-xs text-[#95A5A6] mt-2 text-center">
                            Up to {formatDuration(maxDuration)} available from {selectedTime}
                          </p>
                        )}
                      </div>
                    );
                  })()}

                  <div className="mt-8 pt-6 border-t border-[#ECF0F1]">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!canProceedToStep2}
                      className="w-full"
                      size="lg"
                    >
                      Continue to Details
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Session Details */}
              {step === 2 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-[#2C3E50] mb-6">Session Details</h2>

                  <div className="space-y-5">
                    {/* Subject Selection */}
                    <div>
                      <label className="block text-sm font-medium text-[#2C3E50] mb-2">Subject</label>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-[#D5DBDB] focus:border-[#2D9B6E] focus:outline-none"
                      >
                        {tutor.subjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Level Selection */}
                    <div>
                      <label className="block text-sm font-medium text-[#2C3E50] mb-2">Level</label>
                      <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-[#D5DBDB] focus:border-[#2D9B6E] focus:outline-none"
                      >
                        {tutor.levels.map((level) => (
                          <option key={level} value={level}>
                            {level === 'JC' ? 'Junior Cert' : level === 'LC' ? 'Leaving Cert' : level}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Textarea
                      label="Learning Goals (Optional)"
                      placeholder="Tell the tutor what you'd like to focus on..."
                      value={studentNotes}
                      onChange={(e) => setStudentNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#ECF0F1] flex gap-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!canProceedToStep3}
                      className="flex-1"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-[#2C3E50] mb-6">Confirm & Pay</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between py-3 border-b border-[#ECF0F1]">
                      <span className="text-[#5D6D7E]">Tutor</span>
                      <span className="font-medium text-[#2C3E50]">{tutorName}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#ECF0F1]">
                      <span className="text-[#5D6D7E]">Subject</span>
                      <span className="font-medium text-[#2C3E50]">{selectedSubject.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#ECF0F1]">
                      <span className="text-[#5D6D7E]">Level</span>
                      <span className="font-medium text-[#2C3E50]">
                        {selectedLevel === 'JC' ? 'Junior Cert' : selectedLevel === 'LC' ? 'Leaving Cert' : selectedLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#ECF0F1]">
                      <span className="text-[#5D6D7E]">Date & Time</span>
                      <span className="font-medium text-[#2C3E50]">
                        {selectedDate && new Date(selectedDate).toLocaleDateString('en-IE', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })} at {selectedTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#ECF0F1]">
                      <span className="text-[#5D6D7E]">Duration</span>
                      <span className="font-medium text-[#2C3E50]">{formatDuration(durationMins)}</span>
                    </div>
                  </div>

                  <div className="bg-[#F0F7F4] rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-[#2D9B6E] mb-2">
                      <CreditCard className="w-5 h-5" />
                      <span className="font-medium">Secure Payment</span>
                    </div>
                    <p className="text-sm text-[#5D6D7E]">
                      You'll be redirected to our secure payment provider to complete your booking.
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#ECF0F1] flex gap-4">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={handleProceedToPayment}
                      isLoading={isLoading}
                      disabled={!tutor.stripeConnectOnboarded}
                      className="flex-1"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay €{total.toFixed(2)}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="font-bold text-[#2C3E50] mb-4">Booking Summary</h3>

                {/* Tutor Info */}
                <div className="flex items-center gap-3 pb-4 border-b border-[#ECF0F1]">
                  <Avatar size="md" fallback={tutorName} src={tutor.User.profilePhotoUrl} />
                  <div>
                    <div className="font-semibold text-[#2C3E50]">{tutorName}</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-[#2C3E50]">{tutor.rating || 'New'}</span>
                      {tutor.reviewCount > 0 && (
                        <span className="text-[#95A5A6]">({tutor.reviewCount})</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Session Details */}
                <div className="py-4 border-b border-[#ECF0F1] space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="default">
                      {sessionType === 'VIDEO' ? '1:1 Video' : sessionType === 'IN_PERSON' ? 'In Person' : 'Group'}
                    </Badge>
                  </div>

                  {selectedDate && (
                    <div className="flex items-center gap-2 text-sm text-[#5D6D7E]">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedDate).toLocaleDateString('en-IE', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                      {selectedTime && ` at ${selectedTime}`}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-[#5D6D7E]">
                    <Clock className="w-4 h-4" />
                    {formatDuration(durationMins)}
                    {selectedTime && ` (${selectedTime} – ${computeEndTime(selectedTime, durationMins)})`}
                  </div>

                  {sessionType === 'GROUP' && selectedSlot?.groupSpotsLeft != null && (
                    <div className="flex items-center gap-2 text-sm text-[#5D6D7E]">
                      <Users className="w-4 h-4" />
                      {selectedSlot.groupSpotsLeft} of {selectedSlot.groupSpotsTotal} spots left
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="py-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#5D6D7E]">Session ({formatDuration(durationMins)})</span>
                    <span className="text-[#2C3E50]">€{total.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-[#95A5A6]">
                    €{hourlyRate}/hr{sessionType === 'GROUP' ? ' (group rate)' : ''} &times; {numberOfSlots} slot{numberOfSlots > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#ECF0F1] flex justify-between items-center">
                  <span className="font-bold text-[#2C3E50]">Total</span>
                  <span className="text-2xl font-bold text-[#2D9B6E]">€{total.toFixed(2)}</span>
                </div>

                <p className="text-xs text-[#95A5A6] mt-4 text-center">
                  {tutor && (() => {
                    const hours = tutor.cancellationNoticeHours ?? 24;
                    const latePercent = tutor.lateCancellationRefundPercent ?? 0;
                    const notice = hours >= 48 ? `${hours / 24} days` : `${hours} hours`;
                    if (latePercent === 100) {
                      return `Free cancellation at any time`;
                    }
                    if (latePercent === 0) {
                      return `Free cancellation up to ${notice} before your session. No refund for late cancellations.`;
                    }
                    return `Free cancellation up to ${notice} before your session. ${latePercent}% refund for late cancellations.`;
                  })()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
