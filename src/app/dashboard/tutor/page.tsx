'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Calendar,
  Clock,
  Video,
  FileText,
  Upload,
  Star,
  Euro,
  TrendingUp,
  Users,
  Settings,
  BarChart3,
  Plus,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  Crown,
  CreditCard,
  ExternalLink,
  AlertCircle,
  X,
  Trash2,
  Flag,
} from 'lucide-react';
import { AvailabilityEditor } from '@/components/dashboard/AvailabilityEditor';
import { AccountSection } from '@/components/dashboard/AccountSection';
import { resources as resourcesApi, upload, sessions as sessionsApi, tutors as tutorsApi, auth } from '@/lib/api';
import { Loader2 } from 'lucide-react';

type TabType = 'overview' | 'sessions' | 'availability' | 'resources' | 'earnings' | 'settings';

interface StripeStatus {
  hasAccount: boolean;
  onboarded: boolean;
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
  requiresAction: boolean;
  currentDeadline: number | null;
}

export default function TutorDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stripeStatus, setStripeStatus] = useState<StripeStatus | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<{ hasWeeklySlots: boolean; slotCount: number } | null>(null);
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [cancellationNoticeHours, setCancellationNoticeHours] = useState(24);
  const [lateCancellationRefundPercent, setLateCancellationRefundPercent] = useState(0);
  const [prefsLoading, setPrefsLoading] = useState(false);
  const [cancelSessionId, setCancelSessionId] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Real data state
  const [earningsData, setEarningsData] = useState({ thisMonth: 0, lastMonth: 0, sessionsThisMonth: 0, resourcesSoldThisMonth: 0, sessionEarnings: 0, resourceEarnings: 0 });
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [myResources, setMyResources] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [tutorProfile, setTutorProfile] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Flag review state
  const [flagReviewId, setFlagReviewId] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState('');
  const [flagDetails, setFlagDetails] = useState('');
  const [flagLoading, setFlagLoading] = useState(false);

  // Delete resource state
  const [deleteResourceId, setDeleteResourceId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Upload resource state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', subject: 'MATHS', level: 'LC', resourceType: 'PDF', price: '' });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Fetch Stripe Connect status on mount
  const fetchStripeStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/stripe/connect/status`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setStripeStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch Stripe status:', error);
    }
  };

  // Fetch availability status + tutor profile
  const fetchAvailabilityStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      // Fetch tutor profile to get tutorId
      const profileRes = await fetch(`${apiUrl}/api/tutors/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        const profile = profileData.data || profileData;
        const id = profile?.id;
        if (id) setTutorId(id);
        if (profile?.isVisible !== undefined) setIsVisible(profile.isVisible);
        if (profile?.cancellationNoticeHours !== undefined) setCancellationNoticeHours(profile.cancellationNoticeHours);
        if (profile?.lateCancellationRefundPercent !== undefined) setLateCancellationRefundPercent(profile.lateCancellationRefundPercent);
      }

      // Fetch availability status
      const statusRes = await fetch(`${apiUrl}/api/availability/status`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setAvailabilityStatus(statusData.data || statusData);
      }
    } catch (error) {
      console.error('Failed to fetch availability status:', error);
    }
  };

  // Start Stripe Connect onboarding
  const handleStripeOnboard = async () => {
    setStripeLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/stripe/connect/onboard`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Failed to start Stripe onboarding:', error);
    } finally {
      setStripeLoading(false);
    }
  };

  // Open Stripe Express dashboard
  const handleStripeDashboard = async () => {
    setStripeLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/stripe/connect/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Failed to open Stripe dashboard:', error);
    } finally {
      setStripeLoading(false);
    }
  };

  // Toggle tutor visibility
  const toggleVisibility = async (newValue: boolean) => {
    setVisibilityLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/tutors/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isVisible: newValue }),
      });

      if (response.ok) {
        setIsVisible(newValue);
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
    } finally {
      setVisibilityLoading(false);
    }
  };

  // Fetch all dashboard data on mount
  useEffect(() => {
    // Fetch Stripe status (always needed for requirements banner)
    fetchStripeStatus();

    const fetchDashboardData = async () => {
      setDashboardLoading(true);
      try {
        // Fetch user info + tutor profile in parallel
        const [userRes, profileRes] = await Promise.all([
          auth.me().catch(() => null),
          fetchAvailabilityStatus().then(() => null),
        ]);

        if (userRes) {
          const u = (userRes as any).data || userRes;
          setIsAdmin(!!u.isAdmin);
          if (u.email) setUserEmail(u.email);
        }

        // Now that fetchAvailabilityStatus set tutorId, fetch dependent data
        // We need to re-fetch tutor profile to get the ID directly
        const profileData = await tutorsApi.getMe().catch(() => null);
        const profile = profileData?.data;
        if (profile) {
          setTutorProfile(profile);
          const tid = profile.id;

          // Fetch stats, sessions, resources, reviews in parallel
          const [statsRes, sessionsRes, resourcesRes, reviewsRes] = await Promise.all([
            tutorsApi.getMyStats().catch(() => null),
            sessionsApi.getUpcoming().catch(() => null),
            resourcesApi.search({ page: 1 }).catch(() => null), // We'll filter tutor's resources from backend
            tutorsApi.getReviews(tid, 1).catch(() => null),
          ]);

          // Also fetch tutor's own resources
          const token = localStorage.getItem('token');
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
          let tutorResources: any[] = [];
          try {
            const res = await fetch(`${apiUrl}/api/resources/tutor/${tid}`, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (res.ok) {
              const data = await res.json();
              tutorResources = data.data?.items || data.data || [];
            }
          } catch {}

          if (statsRes?.data) {
            setEarningsData(statsRes.data);
          }

          if (sessionsRes?.data) {
            const mapped = sessionsRes.data.map((s: any) => ({
              id: s.id,
              studentName: s.student ? `${s.student.firstName} ${s.student.lastName?.charAt(0) || ''}.` : 'Student',
              subject: s.subject || 'Session',
              date: s.scheduledAt ? new Date(s.scheduledAt).toISOString().split('T')[0] : '',
              time: s.scheduledAt ? new Date(s.scheduledAt).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' }) : '',
              duration: s.durationMins || 60,
              price: Number(s.price) || 0,
              status: s.status,
            }));
            setUpcomingSessions(mapped);
          }

          setMyResources(tutorResources.map((r: any) => ({
            id: r.id,
            title: r.title,
            price: Number(r.price) || 0,
            sales: r.salesCount || 0,
            revenue: Number(r.totalRevenue || 0),
            rating: Number(r.averageRating || 0),
            subject: r.subject,
            level: r.level,
            status: r.status,
          })));

          if (reviewsRes?.data?.items) {
            setRecentReviews(reviewsRes.data.items.slice(0, 5).map((r: any) => ({
              id: r.id,
              studentName: r.studentName || 'Student',
              rating: r.rating,
              text: r.text || '',
              date: r.date ? new Date(r.date).toLocaleDateString('en-IE') : '',
            })));
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch Stripe status when settings tab is active
  useEffect(() => {
    if (activeTab === 'settings') {
      fetchStripeStatus();
    }
  }, [activeTab]);

  const handleFlagReview = async () => {
    if (!flagReviewId || !flagReason) return;
    setFlagLoading(true);
    try {
      await sessionsApi.reportReview(flagReviewId, flagReason, flagDetails || undefined);
      setFlagReviewId(null);
      setFlagReason('');
      setFlagDetails('');
      alert('Review reported successfully. An admin will review it.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to report review');
    } finally {
      setFlagLoading(false);
    }
  };

  const handleUploadResource = async () => {
    if (uploadLoading) return;
    setUploadError('');

    if (!uploadForm.title.trim()) { setUploadError('Title is required'); return; }
    if (!uploadFile) { setUploadError('Please select a file'); return; }
    const priceNum = Number(uploadForm.price);
    if (!uploadForm.price || isNaN(priceNum) || priceNum < 0.50) { setUploadError('Price must be at least €0.50'); return; }
    if (Math.round(priceNum * 100) !== priceNum * 100) { setUploadError('Price must have at most 2 decimal places'); return; }

    setUploadLoading(true);
    try {
      // 1. Get presigned URL
      const presignedRes = await upload.getResourceUrl(uploadFile.name, uploadFile.type);
      const { uploadUrl, key } = presignedRes.data;

      // 2. Upload file to S3
      await upload.uploadToS3(uploadUrl, uploadFile);

      // 3. Create resource record
      await resourcesApi.create({
        title: uploadForm.title.trim(),
        description: uploadForm.description.trim(),
        fileKey: key,
        resourceType: uploadForm.resourceType,
        subject: uploadForm.subject,
        level: uploadForm.level,
        price: priceNum,
      });

      alert('Resource published successfully!');
      setShowUploadModal(false);
      setUploadForm({ title: '', description: '', subject: 'MATHS', level: 'LC', resourceType: 'PDF', price: '' });
      setUploadFile(null);
      // Refetch resources
      if (tutorId) {
        try {
          const token = localStorage.getItem('token');
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
          const res = await fetch(`${apiUrl}/api/resources/tutor/${tutorId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (res.ok) {
            const data = await res.json();
            const tutorResources = data.data?.items || data.data || [];
            setMyResources(tutorResources.map((r: any) => ({
              id: r.id, title: r.title, price: Number(r.price) || 0,
              sales: r.salesCount || 0, revenue: Number(r.totalRevenue || 0),
              rating: Number(r.averageRating || 0), subject: r.subject, level: r.level, status: r.status,
            })));
          }
        } catch {}
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload resource');
    } finally {
      setUploadLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'availability', label: 'Availability', icon: Clock },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'earnings', label: 'Earnings', icon: Euro },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      {isAdmin && (
        <div className="bg-[#2C3E50] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Admin Access</span>
              <span className="text-white/70 hidden sm:inline">— You have admin privileges</span>
            </div>
            <Link href="/admin" className="text-sm font-medium text-white hover:text-white/80 flex items-center gap-1">
              Go to Admin Dashboard
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">Tutor Dashboard</h1>
              <p className="text-[#5D6D7E]">Manage your sessions, resources, and earnings.</p>
            </div>
            <Link href="/dashboard/tutor/upgrade">
              <Button className="bg-[#D4A574] hover:bg-[#C69565]">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#2D9B6E] text-white'
                    : 'bg-white text-[#5D6D7E] hover:bg-[#F0F7F4]'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {dashboardLoading && activeTab === 'overview' && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#2D9B6E]" />
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && !dashboardLoading && (
            <div className="space-y-6">
              {/* Availability Setup Banner */}
              {availabilityStatus && !availabilityStatus.hasWeeklySlots && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-amber-800">Set Up Your Availability</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Students can't book sessions with you until you set your availability. It only takes a minute.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setActiveTab('availability')}
                    className="bg-amber-600 hover:bg-amber-700 flex-shrink-0"
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Set Availability
                  </Button>
                </div>
              )}

              {/* Hidden Profile Banner */}
              {!isVisible && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <EyeOff className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-amber-800">Your profile is hidden</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Students can't find or book you right now. Turn visibility back on when you're ready.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => toggleVisibility(true)}
                    isLoading={visibilityLoading}
                    className="bg-amber-600 hover:bg-amber-700 flex-shrink-0"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Go Visible
                  </Button>
                </div>
              )}

              {/* Stripe Requirements Banner */}
              {stripeStatus?.onboarded && stripeStatus?.requiresAction && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-800">Payment Account Action Required</p>
                    <p className="text-sm text-red-700 mt-1">
                      Stripe needs additional information to keep your payouts active.
                      {stripeStatus.currentDeadline && (
                        <> Complete by{' '}
                          <strong>
                            {new Date(stripeStatus.currentDeadline * 1000).toLocaleDateString('en-IE', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </strong>
                          {' '}to avoid payout interruptions.
                        </>
                      )}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleStripeOnboard}
                    isLoading={stripeLoading}
                    className="!bg-red-600 hover:!bg-red-700 flex-shrink-0"
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    Complete
                  </Button>
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#F0F7F4] rounded-lg flex items-center justify-center">
                      <Euro className="w-5 h-5 text-[#2D9B6E]" />
                    </div>
                    <span className="text-sm text-[#5D6D7E]">This Month</span>
                  </div>
                  <div className="text-2xl font-bold text-[#2C3E50]">€{earningsData.thisMonth.toFixed(2)}</div>
                  {earningsData.lastMonth > 0 ? (
                    <div className={`text-sm flex items-center gap-1 mt-1 ${earningsData.thisMonth >= earningsData.lastMonth ? 'text-[#2D9B6E]' : 'text-red-500'}`}>
                      <TrendingUp className="w-4 h-4" />
                      {earningsData.lastMonth > 0 ? `${Math.round(((earningsData.thisMonth - earningsData.lastMonth) / earningsData.lastMonth) * 100)}%` : ''} from last month
                    </div>
                  ) : (
                    <div className="text-sm text-[#5D6D7E] mt-1">No data last month</div>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#E8F4FD] rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#3498DB]" />
                    </div>
                    <span className="text-sm text-[#5D6D7E]">Sessions</span>
                  </div>
                  <div className="text-2xl font-bold text-[#2C3E50]">{earningsData.sessionsThisMonth}</div>
                  <div className="text-sm text-[#5D6D7E] mt-1">This month</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#FDF2E9] rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#D4A574]" />
                    </div>
                    <span className="text-sm text-[#5D6D7E]">Resources Sold</span>
                  </div>
                  <div className="text-2xl font-bold text-[#2C3E50]">{earningsData.resourcesSoldThisMonth}</div>
                  <div className="text-sm text-[#5D6D7E] mt-1">This month</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#E8F8F5] rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-[#27AE60]" />
                    </div>
                    <span className="text-sm text-[#5D6D7E]">Payouts</span>
                  </div>
                  <button
                    onClick={handleStripeDashboard}
                    className="text-sm text-[#2D9B6E] font-medium hover:underline mt-1"
                  >
                    Manage in Stripe →
                  </button>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Upcoming Sessions */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-[#2C3E50]">Upcoming Sessions</h2>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('sessions')}>View All</Button>
                  </div>
                  {upcomingSessions.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-10 h-10 text-[#D5DBDB] mx-auto mb-3" />
                      <p className="text-[#5D6D7E]">No upcoming sessions</p>
                      <p className="text-sm text-[#95A5A6] mt-1">Students can book you from your profile page.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingSessions.slice(0, 5).map(session => (
                        <div key={session.id} className="flex items-center gap-4 p-4 rounded-lg bg-[#F8F9FA]">
                          <Avatar size="md" fallback={session.studentName} />
                          <div className="flex-1">
                            <div className="font-semibold text-[#2C3E50]">{session.studentName}</div>
                            <div className="text-sm text-[#5D6D7E]">{session.subject}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[#2C3E50]">
                              {session.date ? new Date(session.date).toLocaleDateString('en-IE', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                              }) : ''}
                            </div>
                            <div className="text-sm text-[#5D6D7E]">{session.time}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-[#2D9B6E]">€{session.price.toFixed(2)}</div>
                          </div>
                          <button
                            onClick={() => setCancelSessionId(session.id)}
                            className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Reviews */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-[#2C3E50] mb-6">Recent Reviews</h2>
                  {recentReviews.length === 0 ? (
                    <div className="text-center py-8">
                      <Star className="w-10 h-10 text-[#D5DBDB] mx-auto mb-3" />
                      <p className="text-[#5D6D7E] text-sm">No reviews yet</p>
                      <p className="text-xs text-[#95A5A6] mt-1">Reviews appear after students complete sessions.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentReviews.map(review => (
                        <div key={review.id} className="pb-4 border-b border-[#ECF0F1] last:border-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-[#2C3E50]">{review.studentName}</span>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-[#D5DBDB]'}`}
                                  />
                                ))}
                              </div>
                              <button
                                onClick={() => { setFlagReviewId(review.id); setFlagReason(''); setFlagDetails(''); }}
                                className="p-1 text-[#95A5A6] hover:text-red-500 transition-colors"
                                title="Flag this review"
                              >
                                <Flag className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-[#5D6D7E]">{review.text}</p>
                          <div className="text-xs text-[#95A5A6] mt-2">{review.date}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Resource Performance */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-[#2C3E50]">Your Resources</h2>
                  <Button variant="secondary" size="sm" onClick={() => setShowUploadModal(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Upload New
                  </Button>
                </div>
                {myResources.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-10 h-10 text-[#D5DBDB] mx-auto mb-3" />
                    <p className="text-[#5D6D7E]">No resources yet</p>
                    <p className="text-sm text-[#95A5A6] mt-1">Upload your first resource to start earning.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#ECF0F1]">
                          <th className="text-left py-3 text-sm font-medium text-[#5D6D7E]">Resource</th>
                          <th className="text-right py-3 text-sm font-medium text-[#5D6D7E]">Price</th>
                          <th className="text-right py-3 text-sm font-medium text-[#5D6D7E]">Sales</th>
                          <th className="text-right py-3 text-sm font-medium text-[#5D6D7E]">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myResources.map(resource => (
                          <tr key={resource.id} className="border-b border-[#ECF0F1]">
                            <td className="py-4">
                              <div className="font-medium text-[#2C3E50]">{resource.title}</div>
                            </td>
                            <td className="py-4 text-right text-[#5D6D7E]">€{resource.price.toFixed(2)}</td>
                            <td className="py-4 text-right text-[#5D6D7E]">{resource.sales}</td>
                            <td className="py-4 text-right font-semibold text-[#2D9B6E]">€{resource.revenue.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-[#2C3E50] mb-6">Upcoming Sessions</h2>
              {upcomingSessions.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-[#D5DBDB] mx-auto mb-4" />
                  <p className="text-[#5D6D7E]">No upcoming sessions</p>
                  <p className="text-sm text-[#95A5A6] mt-1">Students can book you from your profile page.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map(session => (
                    <div key={session.id} className="flex items-center gap-4 p-4 rounded-lg border border-[#ECF0F1]">
                      <Avatar size="md" fallback={session.studentName} />
                      <div className="flex-1">
                        <div className="font-semibold text-[#2C3E50]">{session.studentName}</div>
                        <div className="text-sm text-[#5D6D7E]">{session.subject} - {session.duration} mins</div>
                      </div>
                      <Badge variant="primary">Upcoming</Badge>
                      <div className="text-right">
                        <div className="text-[#2C3E50]">
                          {session.date ? new Date(session.date).toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short' }) : ''} at {session.time}
                        </div>
                        <div className="text-sm font-semibold text-[#2D9B6E]">€{session.price.toFixed(2)}</div>
                      </div>
                      <button
                        onClick={() => setCancelSessionId(session.id)}
                        className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Availability Tab */}
          {activeTab === 'availability' && (
            <div>
              {tutorId ? (
                <AvailabilityEditor tutorId={tutorId} onSave={fetchAvailabilityStatus} />
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <Clock className="w-12 h-12 text-[#95A5A6] mx-auto mb-4" />
                  <p className="text-[#5D6D7E]">Loading tutor profile...</p>
                </div>
              )}
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button onClick={() => setShowUploadModal(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Resource
                </Button>
              </div>
              {myResources.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <FileText className="w-12 h-12 text-[#D5DBDB] mx-auto mb-4" />
                  <p className="text-lg font-medium text-[#2C3E50] mb-2">No resources yet</p>
                  <p className="text-sm text-[#95A5A6]">Upload your first resource to start earning from your expertise.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myResources.map(resource => (
                    <div key={resource.id} className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 bg-[#F0F7F4] rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-[#2D9B6E]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#2C3E50]">{resource.title}</h3>
                          <div className="text-sm text-[#2D9B6E] font-semibold">€{resource.price.toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center mb-4">
                        <div>
                          <div className="text-lg font-bold text-[#2C3E50]">{resource.sales}</div>
                          <div className="text-xs text-[#95A5A6]">Sales</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-[#2D9B6E]">€{resource.revenue.toFixed(2)}</div>
                          <div className="text-xs text-[#95A5A6]">Revenue</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/resources/${resource.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteResourceId(resource.id)}
                          className="!text-red-500 !border-red-200 hover:!bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-[#2C3E50] mb-4">Earnings This Month</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-[#ECF0F1]">
                      <span className="text-[#5D6D7E]">Session earnings</span>
                      <span className="font-semibold text-[#2C3E50]">€{earningsData.sessionEarnings.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-[#ECF0F1]">
                      <span className="text-[#5D6D7E]">Resource sales</span>
                      <span className="font-semibold text-[#2C3E50]">€{earningsData.resourceEarnings.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-[#ECF0F1]">
                      <span className="font-bold text-[#2C3E50]">Total this month</span>
                      <span className="font-bold text-[#2D9B6E]">€{earningsData.thisMonth.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-[#5D6D7E]">Last month</span>
                      <span className="text-[#5D6D7E]">€{earningsData.lastMonth.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-[#2C3E50] mb-4">Payouts</h2>
                  <div className="text-center py-4">
                    <p className="text-[#5D6D7E] mb-4">
                      Payouts are managed through your Stripe Express dashboard. Stripe processes payouts on a rolling basis.
                    </p>
                    <Button onClick={handleStripeDashboard} isLoading={stripeLoading}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Stripe Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              {/* Payment Setup (Stripe Connect) */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#F0F7F4] rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#2D9B6E]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#2C3E50]">Payment Setup</h2>
                    <p className="text-sm text-[#5D6D7E]">Set up payments to receive money from students</p>
                  </div>
                </div>

                {!stripeStatus?.hasAccount ? (
                  <>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Payments not set up</p>
                        <p className="text-sm text-amber-700">
                          You need to set up payment processing before students can book sessions with you.
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleStripeOnboard} isLoading={stripeLoading} className="w-full">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Set Up Payment Processing
                    </Button>
                  </>
                ) : stripeStatus?.onboarded ? (
                  <>
                    {stripeStatus.requiresAction ? (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-800">Action Required</p>
                          <p className="text-sm text-red-700">
                            Stripe needs additional information to keep your payouts active.
                            {stripeStatus.currentDeadline && (
                              <> Complete by{' '}
                                <strong>
                                  {new Date(stripeStatus.currentDeadline * 1000).toLocaleDateString('en-IE', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </strong>.
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-[#F0F7F4] rounded-lg mb-4 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#2D9B6E] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-[#2C3E50]">Payments Active</p>
                          <p className="text-sm text-[#5D6D7E]">
                            {stripeStatus.payoutsEnabled
                              ? 'You can receive payments and payouts are enabled.'
                              : 'Account is set up but payouts may still be pending verification.'}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-3">
                      {stripeStatus.requiresAction && (
                        <Button onClick={handleStripeOnboard} isLoading={stripeLoading} className="flex-1">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Complete Requirements
                        </Button>
                      )}
                      <Button variant="outline" onClick={handleStripeDashboard} isLoading={stripeLoading} className={stripeStatus.requiresAction ? 'flex-1' : 'w-full'}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Payment Dashboard
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Setup Incomplete</p>
                        <p className="text-sm text-amber-700">
                          Please complete your payment account setup to start receiving payments.
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleStripeOnboard} isLoading={stripeLoading} className="w-full">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Complete Payment Setup
                    </Button>
                  </>
                )}
              </div>

              {/* Garda Vetting Verification */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#F0F7F4] rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#2D9B6E]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#2C3E50]">Garda Vetted Badge</h2>
                    <p className="text-sm text-[#5D6D7E]">Optional verification for professional teachers</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">
                    Are you a teacher or tutor who is already Garda vetted through your employer?
                    Upload proof to display a verified badge on your profile.
                  </p>
                </div>

                <Link href="/dashboard/tutor/verification">
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Proof of Garda Vetting
                  </Button>
                </Link>
              </div>

              {/* Profile Settings */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-[#2C3E50] mb-6">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50] mb-1">Headline</label>
                    <input
                      type="text"
                      defaultValue={tutorProfile?.headline || ''}
                      key={`headline-${tutorProfile?.headline}`}
                      className="w-full px-4 py-2 rounded-lg border border-[#D5DBDB] focus:border-[#2D9B6E] focus:outline-none"
                      id="profile-headline"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50] mb-1">Hourly Rate (€)</label>
                    <input
                      type="number"
                      defaultValue={tutorProfile?.baseHourlyRate || ''}
                      key={`rate-${tutorProfile?.baseHourlyRate}`}
                      className="w-full px-4 py-2 rounded-lg border border-[#D5DBDB] focus:border-[#2D9B6E] focus:outline-none"
                      id="profile-rate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50] mb-1">Bio</label>
                    <textarea
                      rows={4}
                      defaultValue={tutorProfile?.bio || ''}
                      key={`bio-${tutorProfile?.bio?.slice(0, 20)}`}
                      className="w-full px-4 py-2 rounded-lg border border-[#D5DBDB] focus:border-[#2D9B6E] focus:outline-none"
                      id="profile-bio"
                    />
                  </div>
                  <Button
                    onClick={async () => {
                      const headline = (document.getElementById('profile-headline') as HTMLInputElement)?.value;
                      const baseHourlyRate = Number((document.getElementById('profile-rate') as HTMLInputElement)?.value);
                      const bio = (document.getElementById('profile-bio') as HTMLTextAreaElement)?.value;
                      try {
                        const token = localStorage.getItem('token');
                        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                        const res = await fetch(`${apiUrl}/api/tutors/me`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ headline, baseHourlyRate, bio }),
                        });
                        if (res.ok) alert('Profile updated!');
                        else alert('Failed to update profile.');
                      } catch { alert('Failed to update profile.'); }
                    }}
                  >Save Changes</Button>
                </div>
              </div>

              {/* Subjects & Levels */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-[#2C3E50] mb-6">Subjects & Levels</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50] mb-2">Subjects you teach</label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
                      {['MATHS', 'ENGLISH', 'IRISH', 'FRENCH', 'GERMAN', 'SPANISH', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'BUSINESS', 'ECONOMICS', 'ACCOUNTING', 'HISTORY', 'GEOGRAPHY', 'COMPUTER_SCIENCE', 'APPLIED_MATHS'].map((subject) => (
                        <label key={subject} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-[#D5DBDB] text-[#2D9B6E] focus:ring-[#2D9B6E]"
                            defaultChecked={tutorProfile?.subjects?.includes(subject)}
                            data-subject={subject}
                          />
                          <span className="text-[#2C3E50]">{subject.replace('_', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50] mb-2">Levels you teach</label>
                    <div className="flex gap-4">
                      {[{ label: 'Junior Cert', value: 'JC' }, { label: 'Leaving Cert', value: 'LC' }].map((level) => (
                        <label key={level.value} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-[#D5DBDB] text-[#2D9B6E] focus:ring-[#2D9B6E]"
                            defaultChecked={tutorProfile?.levels?.includes(level.value)}
                            data-level={level.value}
                          />
                          <span className="text-[#2C3E50]">{level.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={async () => {
                      const subjects = Array.from(document.querySelectorAll<HTMLInputElement>('[data-subject]'))
                        .filter(el => el.checked).map(el => el.dataset.subject!);
                      const levels = Array.from(document.querySelectorAll<HTMLInputElement>('[data-level]'))
                        .filter(el => el.checked).map(el => el.dataset.level!);
                      try {
                        const token = localStorage.getItem('token');
                        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                        const res = await fetch(`${apiUrl}/api/tutors/me`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ subjects, levels }),
                        });
                        if (res.ok) alert('Subjects & levels updated!');
                        else alert('Failed to update.');
                      } catch { alert('Failed to update.'); }
                    }}
                  >Update Subjects</Button>
                </div>
              </div>

              {/* Teaching Preferences */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-[#2C3E50] mb-6">Teaching Preferences</h2>
                <div className="space-y-4">
                  {/* Visibility Toggle */}
                  <div className={`flex items-center justify-between p-4 rounded-lg border ${isVisible ? 'bg-[#F0F7F4] border-[#2D9B6E]/20' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="flex items-center gap-3">
                      {isVisible ? <Eye className="w-5 h-5 text-[#2D9B6E]" /> : <EyeOff className="w-5 h-5 text-amber-600" />}
                      <div>
                        <p className="font-medium text-[#2C3E50]">Visible to Students</p>
                        <p className="text-sm text-[#5D6D7E]">When off, your profile won't appear in search results and students can't book sessions</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isVisible}
                        disabled={visibilityLoading}
                        onChange={(e) => toggleVisibility(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2D9B6E]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D9B6E]"></div>
                    </label>
                  </div>

                  {/* Teaches in Irish Toggle */}
                  <div className="flex items-center justify-between p-4 bg-[#F0F7F4] rounded-lg border border-[#2D9B6E]/20">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇮🇪</span>
                      <div>
                        <p className="font-medium text-[#2C3E50]">Grinds as Gaeilge</p>
                        <p className="text-sm text-[#5D6D7E]">I can teach my subjects through Irish</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked={tutorProfile?.teachesInIrish || false}
                        onChange={async (e) => {
                          try {
                            const token = localStorage.getItem('token');
                            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                            await fetch(`${apiUrl}/api/tutors/me`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                              body: JSON.stringify({ teachesInIrish: e.target.checked }),
                            });
                          } catch {}
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2D9B6E]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D9B6E]"></div>
                    </label>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-[#2C3E50]">Cancellation Policy</h3>
                    <p className="text-xs text-[#5D6D7E]">
                      Set how much notice students must give and what refund they receive for late cancellations.
                    </p>

                    <div>
                      <label className="block text-xs font-medium text-[#5D6D7E] mb-1">
                        Notice period before session
                      </label>
                      <select
                        value={cancellationNoticeHours}
                        onChange={(e) => setCancellationNoticeHours(Number(e.target.value))}
                        className="w-full px-4 py-2 rounded-lg border border-[#D5DBDB] focus:border-[#2D9B6E] focus:outline-none"
                      >
                        <option value={6}>6 hours</option>
                        <option value={12}>12 hours</option>
                        <option value={24}>24 hours (default)</option>
                        <option value={48}>48 hours</option>
                        <option value={72}>72 hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#5D6D7E] mb-1">
                        Refund for late cancellations (within notice period)
                      </label>
                      <select
                        value={lateCancellationRefundPercent}
                        onChange={(e) => setLateCancellationRefundPercent(Number(e.target.value))}
                        className="w-full px-4 py-2 rounded-lg border border-[#D5DBDB] focus:border-[#2D9B6E] focus:outline-none"
                      >
                        <option value={0}>0% — No refund</option>
                        <option value={25}>25% refund</option>
                        <option value={50}>50% refund</option>
                        <option value={75}>75% refund</option>
                        <option value={100}>100% — Full refund</option>
                      </select>
                    </div>

                    <div className="p-3 bg-[#F8F9FA] rounded-lg text-xs text-[#5D6D7E]">
                      <strong>Preview:</strong> Free cancellation up to {cancellationNoticeHours}h before the session.
                      {lateCancellationRefundPercent > 0
                        ? ` ${lateCancellationRefundPercent}% refund for late cancellations.`
                        : ' No refund for cancellations within the notice period.'}
                    </div>
                  </div>
                  <Button
                    isLoading={prefsLoading}
                    onClick={async () => {
                      setPrefsLoading(true);
                      try {
                        const token = localStorage.getItem('token');
                        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                        const res = await fetch(`${apiUrl}/api/tutors/me`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ cancellationNoticeHours, lateCancellationRefundPercent }),
                        });
                        if (res.ok) alert('Preferences saved!');
                      } catch { /* ignore */ } finally { setPrefsLoading(false); }
                    }}
                  >Save Preferences</Button>
                </div>
              </div>

              {/* Subscription Plan */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#FDF2E9] rounded-lg flex items-center justify-center">
                    <Crown className="w-5 h-5 text-[#D4A574]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#2C3E50]">Subscription Plan</h2>
                    <p className="text-sm text-[#5D6D7E]">Upgrade to get more visibility</p>
                  </div>
                </div>

                <div className="p-4 bg-[#F8F9FA] rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#2C3E50]">Free Plan</p>
                      <p className="text-sm text-[#5D6D7E]">Basic profile and unlimited bookings</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">Current</span>
                  </div>
                </div>

                <Link href="/dashboard/tutor/upgrade">
                  <Button className="w-full bg-[#D4A574] hover:bg-[#C69565]">
                    <Star className="w-4 h-4 mr-2" />
                    View Upgrade Options
                  </Button>
                </Link>
              </div>

              {/* Account (GDPR) */}
              <AccountSection userEmail={userEmail} />
            </div>
          )}
        </div>
      </main>

      {/* Cancel Session Confirmation Modal */}
      {cancelSessionId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-[#2C3E50] mb-2">Cancel Session?</h3>
            <p className="text-sm text-[#5D6D7E] mb-4">
              As the tutor, the student will receive a <strong>full refund</strong>.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setCancelSessionId(null)}>
                Keep Session
              </Button>
              <Button
                className="flex-1 !bg-red-600 hover:!bg-red-700"
                isLoading={cancelLoading}
                onClick={async () => {
                  setCancelLoading(true);
                  try {
                    const token = localStorage.getItem('token');
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                    const response = await fetch(`${apiUrl}/api/sessions/${cancelSessionId}/cancel`, {
                      method: 'PUT',
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    const data = await response.json();
                    if (response.ok) {
                      alert(data.message || 'Session cancelled.');
                      setCancelSessionId(null);
                      // Refetch sessions
                      try {
                        const sessionsRes = await sessionsApi.getUpcoming();
                        if (sessionsRes?.data) {
                          setUpcomingSessions(sessionsRes.data.map((s: any) => ({
                            id: s.id,
                            studentName: s.student ? `${s.student.firstName} ${s.student.lastName?.charAt(0) || ''}.` : 'Student',
                            subject: s.subject || 'Session',
                            date: s.scheduledAt ? new Date(s.scheduledAt).toISOString().split('T')[0] : '',
                            time: s.scheduledAt ? new Date(s.scheduledAt).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' }) : '',
                            duration: s.durationMins || 60,
                            price: Number(s.price) || 0,
                            status: s.status,
                          })));
                        }
                      } catch {}
                    } else {
                      alert(data.error || 'Failed to cancel session.');
                    }
                  } catch { alert('Failed to cancel session.'); } finally { setCancelLoading(false); }
                }}
              >
                Cancel Session
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Resource Confirmation Modal */}
      {deleteResourceId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-[#2C3E50] mb-2">Delete Resource?</h3>
            <p className="text-sm text-[#5D6D7E] mb-4">
              This will remove the resource from the marketplace. Existing buyers will retain access to their downloads.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteResourceId(null)} disabled={deleteLoading}>
                Keep Resource
              </Button>
              <Button
                className="flex-1 !bg-red-600 hover:!bg-red-700"
                isLoading={deleteLoading}
                onClick={async () => {
                  setDeleteLoading(true);
                  try {
                    await resourcesApi.delete(deleteResourceId);
                    setMyResources(prev => prev.filter(r => r.id !== deleteResourceId));
                    setDeleteResourceId(null);
                  } catch (err) {
                    alert(err instanceof Error ? err.message : 'Failed to delete resource');
                  } finally {
                    setDeleteLoading(false);
                  }
                }}
              >
                Delete Resource
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Resource Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#2C3E50]">Upload New Resource</h3>
              <button onClick={() => { setShowUploadModal(false); setUploadError(''); }} className="p-1 hover:bg-[#F8F9FA] rounded-lg">
                <X className="w-5 h-5 text-[#95A5A6]" />
              </button>
            </div>

            {uploadError && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{uploadError}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-1">Title *</label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D5DBDB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D9B6E]"
                  placeholder="e.g. Leaving Cert Maths Paper 1 Solutions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-1">Description</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-[#D5DBDB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D9B6E]"
                  placeholder="Describe what students will get..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C3E50] mb-1">Subject *</label>
                  <select
                    value={uploadForm.subject}
                    onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D5DBDB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D9B6E]"
                  >
                    <option value="MATHS">Maths</option>
                    <option value="ENGLISH">English</option>
                    <option value="IRISH">Irish</option>
                    <option value="BIOLOGY">Biology</option>
                    <option value="CHEMISTRY">Chemistry</option>
                    <option value="PHYSICS">Physics</option>
                    <option value="BUSINESS">Business</option>
                    <option value="HISTORY">History</option>
                    <option value="GEOGRAPHY">Geography</option>
                    <option value="FRENCH">French</option>
                    <option value="GERMAN">German</option>
                    <option value="SPANISH">Spanish</option>
                    <option value="ACCOUNTING">Accounting</option>
                    <option value="ECONOMICS">Economics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C3E50] mb-1">Level *</label>
                  <select
                    value={uploadForm.level}
                    onChange={(e) => setUploadForm({ ...uploadForm, level: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D5DBDB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D9B6E]"
                  >
                    <option value="JC">Junior Cert</option>
                    <option value="LC">Leaving Cert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C3E50] mb-1">Type</label>
                  <select
                    value={uploadForm.resourceType}
                    onChange={(e) => setUploadForm({ ...uploadForm, resourceType: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D5DBDB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D9B6E]"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="VIDEO">Video</option>
                    <option value="IMAGE">Image Pack</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C3E50] mb-1">Price (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.50"
                    value={uploadForm.price}
                    onChange={(e) => setUploadForm({ ...uploadForm, price: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D5DBDB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D9B6E]"
                    placeholder="9.99"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-1">File *</label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-[#D5DBDB] rounded-lg text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-[#F0F7F4] file:text-[#2D9B6E] hover:file:bg-[#E0EFE8]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => { setShowUploadModal(false); setUploadError(''); }} disabled={uploadLoading}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleUploadResource} isLoading={uploadLoading}>
                <Upload className="w-4 h-4 mr-2" />
                Publish Resource
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Flag Review Modal */}
      {flagReviewId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#2C3E50]">Flag Review</h3>
              <button onClick={() => setFlagReviewId(null)} className="text-[#95A5A6] hover:text-[#2C3E50]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-[#5D6D7E] mb-4">
              Why are you flagging this review? An admin will investigate.
            </p>

            <div className="space-y-2 mb-4">
              {[
                { value: 'inappropriate', label: 'Inappropriate content' },
                { value: 'harassment', label: 'Harassment or bullying' },
                { value: 'false_claims', label: 'False or misleading claims' },
                { value: 'other', label: 'Other' },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-3 p-3 rounded-lg border border-[#ECF0F1] cursor-pointer hover:bg-[#F8F9FA]">
                  <input
                    type="radio"
                    name="flagReason"
                    value={opt.value}
                    checked={flagReason === opt.value}
                    onChange={e => setFlagReason(e.target.value)}
                    className="accent-[#2D9B6E]"
                  />
                  <span className="text-sm text-[#2C3E50]">{opt.label}</span>
                </label>
              ))}
            </div>

            <textarea
              value={flagDetails}
              onChange={e => setFlagDetails(e.target.value)}
              rows={2}
              placeholder="Additional details (optional)"
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D9B6E] resize-none mb-4 text-sm"
            />

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setFlagReviewId(null)}>
                Cancel
              </Button>
              <Button
                className="flex-1 !bg-red-600 hover:!bg-red-700"
                disabled={!flagReason}
                isLoading={flagLoading}
                onClick={handleFlagReview}
              >
                <Flag className="w-4 h-4 mr-1" />
                Submit Report
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
