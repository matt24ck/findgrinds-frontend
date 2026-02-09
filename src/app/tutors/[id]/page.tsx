'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge, VerifiedBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Star,
  Calendar,
  MessageCircle,
  Users,
  Award,
  BookOpen,
  ChevronRight,
  Loader2,
  Send,
  X,
  AlertTriangle,
} from 'lucide-react';
import { messages, tutors as tutorsApi, resources, availability as availabilityApi } from '@/lib/api';

interface TutorData {
  id: string;
  userId: string;
  bio?: string;
  headline?: string;
  qualifications: string[];
  subjects: string[];
  levels: string[];
  baseHourlyRate: number;
  teachesInIrish: boolean;
  featuredTier: 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';
  cancellationNoticeHours?: number;
  lateCancellationRefundPercent?: number;
  rating: number;
  reviewCount: number;
  totalBookings: number;
  User?: {
    firstName: string;
    lastName: string;
    profilePhotoUrl?: string;
    gardaVettingVerified: boolean;
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
  COMPUTER_SCIENCE: 'Computer Science',
  APPLIED_MATHS: 'Applied Maths',
};

type TabType = 'about' | 'reviews' | 'resources' | 'availability';

export default function TutorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [tutor, setTutor] = useState<TutorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real data state
  const [reviews, setReviews] = useState<any>(null);
  const [availabilitySlots, setAvailabilitySlots] = useState<any[]>([]);
  const [tutorResources, setTutorResources] = useState<any[]>([]);

  // Message modal state
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSending, setMessageSending] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [predefinedMessages, setPredefinedMessages] = useState<{ id: number; text: string }[]>([]);
  const [showPredefinedOnly, setShowPredefinedOnly] = useState(false);

  const currentUser = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || 'null')
    : null;

  // Fetch reviews, availability, and resources when tutor loads
  useEffect(() => {
    if (!tutor) return;

    const fetchExtras = async () => {
      try {
        const [reviewsRes, resourcesRes] = await Promise.all([
          tutorsApi.getReviews(params.id as string),
          resources.getByTutor(tutor.id),
        ]);
        setReviews(reviewsRes.data);
        setTutorResources(resourcesRes.data || []);
      } catch (err) {
        console.error('Failed to fetch tutor extras:', err);
      }

      // Fetch availability slots for next 7 days
      try {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 6);
        const slotsRes = await availabilityApi.getSlots(tutor.id, {
          medium: 'IN_PERSON',
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        });
        setAvailabilitySlots(slotsRes.data || []);
      } catch {
        // Tutor may not have availability configured
      }
    };

    fetchExtras();
  }, [tutor, params.id]);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/tutors/${params.id}`);

        if (!response.ok) {
          throw new Error('Tutor not found');
        }

        const result = await response.json();
        // API returns { success: true, data: tutor }
        setTutor(result.data || result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tutor');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTutor();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#2D9B6E]" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#2C3E50] mb-2">Tutor Not Found</h1>
            <p className="text-[#5D6D7E] mb-4">{error || 'The tutor you are looking for does not exist.'}</p>
            <Link href="/tutors">
              <Button>Browse Tutors</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tutorName = tutor.User ? `${tutor.User.firstName} ${tutor.User.lastName}` : 'Tutor';
  const isVerified = tutor.User?.gardaVettingVerified || false;
  const isFeatured = tutor.featuredTier !== 'FREE';

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'reviews', label: `Reviews (${tutor.reviewCount})` },
    { id: 'resources', label: 'Resources' },
    { id: 'availability', label: 'Availability' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1">
        {/* Profile Header */}
        <div className="bg-gradient-to-b from-[#F0F7F4] to-[#F8F9FA] py-8 md:py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Avatar */}
              <Avatar
                size="xl"
                src={tutor.User?.profilePhotoUrl}
                alt={tutorName}
                fallback={tutorName}
                className="ring-4 ring-white shadow-lg mx-auto md:mx-0"
              />

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  {isFeatured && (
                    <Badge variant={tutor.featuredTier === 'ENTERPRISE' ? 'enterprise' : 'professional'}>
                      {tutor.featuredTier === 'ENTERPRISE' ? 'Enterprise Tutor' : 'Professional'}
                    </Badge>
                  )}
                  {isVerified && <VerifiedBadge />}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-2">
                  {tutorName}
                </h1>
                <p className="text-lg text-[#5D6D7E] mb-4">{tutor.headline || 'Experienced Tutor'}</p>

                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-[#2C3E50]">{tutor.rating || 0}</span>
                    <span className="text-[#95A5A6]">({tutor.reviewCount || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#5D6D7E]">
                    <Users className="w-4 h-4" />
                    <span>{tutor.totalBookings || 0} sessions</span>
                  </div>
                  {tutor.teachesInIrish && (
                    <span className="text-xs bg-[#169B62] text-white px-2 py-1 rounded font-medium">
                      Gaeilge
                    </span>
                  )}
                </div>

                {/* Subject Badges */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {(tutor.levels || []).map(level => (
                    <Badge key={level} variant="primary">
                      {level === 'LC' ? 'Leaving Cert' : 'Junior Cert'}
                    </Badge>
                  ))}
                  {(tutor.subjects || []).map(subject => (
                    <Badge key={subject} variant="default">
                      {subjectLabels[subject] || subject}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Price Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 w-full md:w-auto md:min-w-[280px]">
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-[#2D9B6E]">€{tutor.baseHourlyRate}</span>
                  <span className="text-[#95A5A6]">/hour</span>
                </div>

                <Link href={`/book/${tutor.id}`}>
                  <Button className="w-full mb-3" size="lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Session
                  </Button>
                </Link>

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    if (!currentUser) {
                      router.push('/login');
                      return;
                    }
                    setShowMessageModal(true);
                    setMessageError('');
                    // Load predefined messages in case they're needed
                    messages.getPredefinedMessages().then((res) => {
                      setPredefinedMessages(res.data);
                    }).catch(() => {});
                  }}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Message Tutor
                </Button>

                <p className="text-xs text-center text-[#95A5A6] mt-4">
                  {(() => {
                    const hours = tutor?.cancellationNoticeHours ?? 24;
                    const latePercent = tutor?.lateCancellationRefundPercent ?? 0;
                    const notice = hours >= 48 ? `${hours / 24} days` : `${hours}h`;
                    if (latePercent === 100) {
                      return `Free cancellation at any time`;
                    }
                    if (latePercent === 0) {
                      return `Free cancellation up to ${notice} before. No refund for late cancellations.`;
                    }
                    return `Free cancellation up to ${notice} before. ${latePercent}% refund for late cancellations.`;
                  })()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-16 z-40 bg-white border-b border-[#ECF0F1]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-4 border-b-2 font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#2D9B6E] text-[#2D9B6E]'
                      : 'border-transparent text-[#5D6D7E] hover:text-[#2C3E50]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                {/* Bio */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-[#2C3E50] mb-4">About Me</h2>
                  <p className="text-[#5D6D7E] whitespace-pre-line">{tutor.bio}</p>
                </div>

                {/* Qualifications */}
                {(tutor.qualifications || []).length > 0 && (
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-[#2C3E50] mb-4">Qualifications</h2>
                    <ul className="space-y-3">
                      {tutor.qualifications.map((qual: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-[#2D9B6E] flex-shrink-0 mt-0.5" />
                          <span className="text-[#5D6D7E]">{qual}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-[#2C3E50] mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-[#5D6D7E]">Sessions completed</span>
                      <span className="font-semibold text-[#2C3E50]">{tutor.totalBookings || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5D6D7E]">Rating</span>
                      <span className="font-semibold text-[#2C3E50]">{tutor.rating || 0}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5D6D7E]">Reviews</span>
                      <span className="font-semibold text-[#2C3E50]">{tutor.reviewCount || 0}</span>
                    </div>
                    {tutor.teachesInIrish && (
                      <div className="flex justify-between">
                        <span className="text-[#5D6D7E]">Teaches in Irish</span>
                        <span className="font-semibold text-[#169B62]">Yes</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Rating Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-[#2C3E50]">{reviews?.averageRating?.toFixed(1) || tutor.rating}</div>
                    <div className="flex justify-center my-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${star <= Math.round(reviews?.averageRating || tutor.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-[#D5DBDB]'}`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-[#95A5A6]">{reviews?.total || tutor.reviewCount} reviews</div>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-[#5D6D7E] w-3">{rating}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <div className="flex-1 h-2 bg-[#ECF0F1] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{ width: `${reviews?.ratingBreakdown?.[rating] || 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              {!reviews?.items?.length ? (
                <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                  <Star className="w-12 h-12 text-[#D5DBDB] mx-auto mb-4" />
                  <p className="text-[#5D6D7E]">No reviews yet</p>
                  <p className="text-sm text-[#95A5A6] mt-1">Be the first to review this tutor after a session!</p>
                </div>
              ) : (
                reviews.items.map((review: any) => (
                  <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm" fallback={review.studentName} />
                        <div>
                          <div className="font-semibold text-[#2C3E50]">{review.studentName}</div>
                          <div className="text-sm text-[#95A5A6]">{review.subject}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-[#D5DBDB]'}`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.text && <p className="text-[#5D6D7E]">{review.text}</p>}
                    <div className="text-sm text-[#95A5A6] mt-3">
                      {new Date(review.date).toLocaleDateString('en-IE', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            tutorResources.length === 0 ? (
              <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                <BookOpen className="w-12 h-12 text-[#D5DBDB] mx-auto mb-4" />
                <p className="text-[#5D6D7E]">This tutor hasn&apos;t published any resources yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorResources.map((resource: any) => (
                  <Link key={resource.id} href={`/tutor-resources/${resource.id}`}>
                    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-[#F0F7F4] rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-[#2D9B6E]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#2C3E50] line-clamp-2">{resource.title}</h3>
                          <Badge variant="default" size="sm">{resource.resourceType}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-medium text-[#2C3E50]">{resource.rating || '—'}</span>
                        </div>
                        <span className="text-[#95A5A6]">{resource.salesCount || 0} sold</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-[#2D9B6E]">
                          {resource.price > 0 ? `€${resource.price}` : 'Free'}
                        </span>
                        <span className="text-sm text-[#2D9B6E] font-medium flex items-center">
                          View <ChevronRight className="w-4 h-4 ml-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}

          {/* Availability Tab */}
          {activeTab === 'availability' && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#2C3E50] mb-6">Available Sessions</h2>
              {availabilitySlots.filter((s: any) => s.available).length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-[#D5DBDB] mx-auto mb-4" />
                  <p className="text-[#5D6D7E]">This tutor hasn&apos;t set up their availability yet.</p>
                  <p className="text-sm text-[#95A5A6] mt-1">Contact them to arrange a session.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="flex gap-4 min-w-max">
                    {(() => {
                      // Group available slots by date
                      const availableSlots = availabilitySlots.filter((s: any) => s.available);
                      const grouped: Record<string, any[]> = {};
                      availableSlots.forEach((slot: any) => {
                        if (!grouped[slot.date]) grouped[slot.date] = [];
                        grouped[slot.date].push(slot);
                      });
                      const sortedDates = Object.keys(grouped).sort();

                      return sortedDates.map(date => {
                        const d = new Date(date + 'T00:00:00');
                        const dayName = d.toLocaleDateString('en-IE', { weekday: 'short' });
                        const dayNum = d.getDate();
                        const month = d.toLocaleDateString('en-IE', { month: 'short' });

                        return (
                          <div key={date} className="w-24">
                            <div className="text-center mb-3">
                              <div className="text-sm text-[#95A5A6]">{dayName}</div>
                              <div className="text-lg font-bold text-[#2C3E50]">{dayNum}</div>
                              <div className="text-xs text-[#95A5A6]">{month}</div>
                            </div>
                            <div className="space-y-2">
                              {grouped[date].map((slot: any) => (
                                <button
                                  key={slot.startTime}
                                  className="w-full py-2 rounded-lg text-sm font-medium transition-all bg-[#F0F7F4] text-[#2D9B6E] hover:bg-[#2D9B6E] hover:text-white"
                                  onClick={() => router.push(`/book/${tutor.id}`)}
                                >
                                  {slot.startTime.slice(0, 5)}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
              <div className="mt-6 pt-6 border-t border-[#ECF0F1]">
                <Link href={`/book/${tutor.id}`}>
                  <Button size="lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book a Session
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Message Tutor Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#2C3E50]">
                Message {tutorName}
              </h3>
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageText('');
                  setMessageError('');
                  setShowPredefinedOnly(false);
                }}
                className="text-[#95A5A6] hover:text-[#2C3E50]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {messageError && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{messageError}</span>
              </div>
            )}

            {showPredefinedOnly ? (
              <div className="space-y-3">
                <p className="text-sm text-[#5D6D7E]">Choose a message to send:</p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {predefinedMessages.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={async () => {
                        setMessageSending(true);
                        setMessageError('');
                        try {
                          const res = await messages.startConversationPredefined(tutor!.userId, pm.id);
                          router.push(`/messages/${res.data.conversationId}`);
                        } catch (err) {
                          setMessageError(err instanceof Error ? err.message : 'Failed to send message');
                        } finally {
                          setMessageSending(false);
                        }
                      }}
                      disabled={messageSending}
                      className="w-full text-left text-sm px-4 py-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg hover:bg-[#F0F7F4] hover:border-[#2D9B6E] transition-colors disabled:opacity-50"
                    >
                      {pm.text}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#95A5A6]">
                  <Link href="/dashboard/student" className="text-[#2D9B6E] underline">
                    Link a parent account
                  </Link>{' '}
                  to send custom messages.
                </p>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!messageText.trim() || messageSending) return;
                  setMessageSending(true);
                  setMessageError('');
                  try {
                    const res = await messages.startConversation(tutor!.userId, messageText.trim());
                    router.push(`/messages/${res.data.conversationId}`);
                  } catch (err: any) {
                    const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
                    // Check if this is a predefined-only error
                    if (errorMsg.includes('predefined') || errorMsg.includes('under 18')) {
                      setShowPredefinedOnly(true);
                    }
                    setMessageError(errorMsg);
                  } finally {
                    setMessageSending(false);
                  }
                }}
                className="space-y-4"
              >
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={4}
                  placeholder="Write your message..."
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D9B6E] resize-none"
                  disabled={messageSending}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!messageText.trim() || messageSending}
                  isLoading={messageSending}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
