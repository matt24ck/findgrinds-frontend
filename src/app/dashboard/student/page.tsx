'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { parentApi, auth, sessions, resources } from '@/lib/api';
import { AccountSection } from '@/components/dashboard/AccountSection';
import {
  Calendar,
  Clock,
  Video,
  FileText,
  Download,
  Star,
  BookOpen,
  Settings,
  User,
  CreditCard,
  Users,
  Copy,
  Check,
  X,
  Loader2,
} from 'lucide-react';

type TabType = 'overview' | 'sessions' | 'resources' | 'settings';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [parentCode, setParentCode] = useState<{ code: string; expiresAt: string } | null>(null);
  const [linkedParents, setLinkedParents] = useState<{ linkId: string; parentName: string; linkedAt: string }[]>([]);
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [cancelSessionId, setCancelSessionId] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Real data state
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [purchasedResources, setPurchasedResources] = useState<any[]>([]);
  const [recentTutors, setRecentTutors] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setDashboardLoading(true);
      try {
        const [userRes, upcomingRes, purchasedRes, allSessionsRes] = await Promise.all([
          auth.me(),
          sessions.getUpcoming(),
          resources.getPurchased(),
          sessions.getAll(),
        ]);

        // User data
        const user = userRes.data;
        setUserData(user);
        if (user?.email) setUserEmail(user.email);

        // Map upcoming sessions
        setUpcomingSessions((upcomingRes.data || []).map((s: any) => {
          const tutorUser = s.tutor?.User;
          const tutorName = tutorUser
            ? `${tutorUser.firstName} ${tutorUser.lastName}`
            : (s.tutor?.headline || 'Tutor');
          return {
            id: s.id,
            tutorName,
            subject: s.subject,
            date: s.scheduledAt,
            time: new Date(s.scheduledAt).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' }),
            duration: s.durationMins,
            type: s.sessionType,
            meetingLink: s.meetingLink || s.zoomLink || '#',
            status: s.status,
          };
        }));

        // Map purchased resources
        setPurchasedResources((purchasedRes.data || []).map((p: any) => {
          const res = p.resource;
          const tutorUser = res?.tutor?.User;
          const tutorName = tutorUser
            ? `${tutorUser.firstName} ${tutorUser.lastName}`
            : 'Tutor';
          return {
            id: res?.id || p.resourceId,
            title: res?.title || 'Resource',
            tutorName,
            purchaseDate: new Date(p.createdAt).toLocaleDateString('en-IE'),
            type: res?.resourceType || 'PDF',
          };
        }));

        // Derive recent tutors from all sessions (unique tutors)
        const tutorMap = new Map();
        (allSessionsRes.data || []).forEach((s: any) => {
          if (s.tutor && !tutorMap.has(s.tutor.id)) {
            const tutorUser = s.tutor?.User;
            tutorMap.set(s.tutor.id, {
              id: s.tutor.id,
              name: tutorUser
                ? `${tutorUser.firstName} ${tutorUser.lastName}`
                : (s.tutor.headline || 'Tutor'),
              subject: s.subject,
              rating: Number(s.tutor.rating) || 0,
              hourlyRate: Number(s.tutor.baseHourlyRate) || 0,
            });
          }
        });
        setRecentTutors(Array.from(tutorMap.values()).slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboardData();

    parentApi.getMyCode()
      .then(res => {
        setParentCode(res.data.pendingCode);
        setLinkedParents(res.data.linkedParents);
      })
      .catch(() => {});
  }, []);

  const handleGenerateCode = async () => {
    setCodeLoading(true);
    try {
      const res = await parentApi.generateCode();
      setParentCode({ code: res.data.code, expiresAt: res.data.expiresAt });
    } catch {
      // silently fail
    } finally {
      setCodeLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (parentCode) {
      navigator.clipboard.writeText(parentCode.code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleDownloadResource = async (resourceId: string) => {
    try {
      const data = await resources.download(resourceId);
      if (data.success && data.data.downloadUrl) {
        window.open(data.data.downloadUrl, '_blank');
      }
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleCancelSession = async () => {
    if (!cancelSessionId) return;
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
        const upcomingRes = await sessions.getUpcoming();
        setUpcomingSessions((upcomingRes.data || []).map((s: any) => {
          const tutorUser = s.tutor?.User;
          const tutorName = tutorUser
            ? `${tutorUser.firstName} ${tutorUser.lastName}`
            : (s.tutor?.headline || 'Tutor');
          return {
            id: s.id,
            tutorName,
            subject: s.subject,
            date: s.scheduledAt,
            time: new Date(s.scheduledAt).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' }),
            duration: s.durationMins,
            type: s.sessionType,
            meetingLink: s.meetingLink || s.zoomLink || '#',
            status: s.status,
          };
        }));
      } else {
        alert(data.error || 'Failed to cancel session.');
      }
    } catch {
      alert('Failed to cancel session.');
    } finally {
      setCancelLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'sessions', label: 'My Sessions', icon: Calendar },
    { id: 'resources', label: 'My Resources', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">Student Dashboard</h1>
            <p className="text-[#5D6D7E]">
              {userData ? `Welcome back, ${userData.firstName}! Manage your sessions and resources.` : 'Welcome back! Manage your sessions and resources.'}
            </p>
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

          {dashboardLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#2D9B6E]" />
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Upcoming Sessions */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-[#2C3E50]">Upcoming Sessions</h2>
                      <Link href="/tutors">
                        <Button variant="secondary" size="sm">Book New Session</Button>
                      </Link>
                    </div>

                    {upcomingSessions.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingSessions.map(session => (
                          <div key={session.id} className="flex items-center gap-4 p-4 rounded-lg bg-[#F8F9FA]">
                            <Avatar size="md" fallback={session.tutorName} />
                            <div className="flex-1">
                              <div className="font-semibold text-[#2C3E50]">{session.tutorName}</div>
                              <div className="text-sm text-[#5D6D7E]">{session.subject}</div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 text-[#2C3E50]">
                                <Calendar className="w-4 h-4" />
                                {new Date(session.date).toLocaleDateString('en-IE', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-[#5D6D7E]">
                                <Clock className="w-4 h-4" />
                                {session.time}
                              </div>
                            </div>
                            {session.type === 'VIDEO' && (
                              <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Button size="sm">
                                  <Video className="w-4 h-4 mr-1" />
                                  Join
                                </Button>
                              </a>
                            )}
                            <button
                              onClick={() => setCancelSessionId(session.id)}
                              className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-[#D5DBDB] mx-auto mb-3" />
                        <p className="text-[#5D6D7E]">No upcoming sessions</p>
                        <Link href="/tutors">
                          <Button variant="secondary" size="sm" className="mt-4">
                            Find a Tutor
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Recent Tutors */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-[#2C3E50] mb-6">Recent Tutors</h2>
                    {recentTutors.length > 0 ? (
                      <div className="space-y-4">
                        {recentTutors.map(tutor => (
                          <Link key={tutor.id} href={`/tutors/${tutor.id}`}>
                            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F8F9FA] transition-colors">
                              <Avatar size="sm" fallback={tutor.name} />
                              <div className="flex-1">
                                <div className="font-medium text-[#2C3E50]">{tutor.name}</div>
                                <div className="text-sm text-[#5D6D7E]">{tutor.subject}</div>
                              </div>
                              <div className="text-right">
                                {tutor.rating > 0 && (
                                  <div className="flex items-center gap-1 text-sm">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    {tutor.rating.toFixed(1)}
                                  </div>
                                )}
                                {tutor.hourlyRate > 0 && (
                                  <div className="text-sm text-[#2D9B6E] font-semibold">€{tutor.hourlyRate}/hr</div>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <BookOpen className="w-10 h-10 text-[#D5DBDB] mx-auto mb-2" />
                        <p className="text-sm text-[#5D6D7E]">Book a session to see your tutors here</p>
                        <Link href="/tutors">
                          <Button variant="secondary" size="sm" className="mt-3">
                            Browse Tutors
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Recent Resources */}
                  <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-[#2C3E50]">Recent Purchases</h2>
                      <Link href="/resources">
                        <Button variant="secondary" size="sm">Browse Resources</Button>
                      </Link>
                    </div>
                    {purchasedResources.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {purchasedResources.slice(0, 4).map(resource => (
                          <div key={resource.id} className="p-4 rounded-lg border border-[#ECF0F1]">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-10 h-10 bg-[#F0F7F4] rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-[#2D9B6E]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-[#2C3E50] line-clamp-2 text-sm">{resource.title}</h4>
                                <p className="text-xs text-[#95A5A6]">by {resource.tutorName}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full" onClick={() => handleDownloadResource(resource.id)}>
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <FileText className="w-10 h-10 text-[#D5DBDB] mx-auto mb-2" />
                        <p className="text-sm text-[#5D6D7E]">No purchased resources yet</p>
                        <Link href="/resources">
                          <Button variant="secondary" size="sm" className="mt-3">
                            Browse Resources
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sessions Tab */}
              {activeTab === 'sessions' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-[#2C3E50] mb-6">All Sessions</h2>
                  {upcomingSessions.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingSessions.map(session => (
                        <div key={session.id} className="flex items-center gap-4 p-4 rounded-lg border border-[#ECF0F1]">
                          <Avatar size="md" fallback={session.tutorName} />
                          <div className="flex-1">
                            <div className="font-semibold text-[#2C3E50]">{session.tutorName}</div>
                            <div className="text-sm text-[#5D6D7E]">{session.subject} - {session.duration} minutes</div>
                          </div>
                          <Badge variant="primary">Upcoming</Badge>
                          <div className="text-right">
                            <div className="text-[#2C3E50]">
                              {new Date(session.date).toLocaleDateString('en-IE')} at {session.time}
                            </div>
                          </div>
                          {session.type === 'VIDEO' && (
                            <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                              <Button size="sm">
                                <Video className="w-4 h-4 mr-1" />
                                Join
                              </Button>
                            </a>
                          )}
                          <button
                            onClick={() => setCancelSessionId(session.id)}
                            className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-[#D5DBDB] mx-auto mb-3" />
                      <p className="text-[#5D6D7E]">No upcoming sessions</p>
                      <Link href="/tutors">
                        <Button variant="secondary" size="sm" className="mt-4">
                          Find a Tutor
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Resources Tab */}
              {activeTab === 'resources' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-[#2C3E50] mb-6">Purchased Resources</h2>
                  {purchasedResources.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {purchasedResources.map(resource => (
                        <div key={resource.id} className="p-4 rounded-lg border border-[#ECF0F1]">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 bg-[#F0F7F4] rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-[#2D9B6E]" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-[#2C3E50]">{resource.title}</h4>
                              <p className="text-sm text-[#95A5A6]">by {resource.tutorName}</p>
                              <p className="text-xs text-[#95A5A6] mt-1">Purchased {resource.purchaseDate}</p>
                            </div>
                          </div>
                          <Button variant="secondary" className="w-full" onClick={() => handleDownloadResource(resource.id)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-[#D5DBDB] mx-auto mb-3" />
                      <p className="text-[#5D6D7E]">No purchased resources yet</p>
                      <Link href="/resources">
                        <Button variant="secondary" size="sm" className="mt-4">
                          Browse Resources
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl space-y-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-[#2C3E50] mb-6">Profile Settings</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#2C3E50] mb-1">Full Name</label>
                        <input
                          type="text"
                          value={userData ? `${userData.firstName} ${userData.lastName}` : ''}
                          readOnly
                          className="w-full px-4 py-2 rounded-lg border border-[#D5DBDB] bg-[#F8F9FA] text-[#5D6D7E]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2C3E50] mb-1">Email</label>
                        <input
                          type="email"
                          value={userData?.email || ''}
                          readOnly
                          className="w-full px-4 py-2 rounded-lg border border-[#D5DBDB] bg-[#F8F9FA] text-[#5D6D7E]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-[#2C3E50] mb-4">Payments</h2>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-[#F8F9FA]">
                      <CreditCard className="w-8 h-8 text-[#5D6D7E]" />
                      <p className="text-sm text-[#5D6D7E]">
                        Payments are handled securely via Stripe. You&apos;ll be prompted to pay when booking sessions or purchasing resources.
                      </p>
                    </div>
                  </div>

                  {/* Parent Access */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-[#2D9B6E]" />
                      <h2 className="text-lg font-bold text-[#2C3E50]">Parent Access</h2>
                    </div>
                    <p className="text-sm text-[#5D6D7E] mb-4">
                      Generate a link code for your parent so they can view your sessions, resources, and book on your behalf.
                    </p>

                    {parentCode ? (
                      <div className="mb-4">
                        <div className="flex items-center gap-3 p-4 bg-[#F0F7F4] rounded-lg border border-[#2D9B6E]/20">
                          <span className="text-3xl font-mono font-bold tracking-[0.3em] text-[#2C3E50]">
                            {parentCode.code}
                          </span>
                          <button
                            onClick={handleCopyCode}
                            className="p-2 rounded-lg hover:bg-white/60 transition-colors"
                            title="Copy code"
                          >
                            {codeCopied ? (
                              <Check className="w-5 h-5 text-[#2D9B6E]" />
                            ) : (
                              <Copy className="w-5 h-5 text-[#5D6D7E]" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-[#95A5A6] mt-2">
                          Expires {new Date(parentCode.expiresAt).toLocaleString('en-IE', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>
                    ) : (
                      <Button onClick={handleGenerateCode} variant="secondary" size="sm" isLoading={codeLoading}>
                        Generate Parent Code
                      </Button>
                    )}

                    {linkedParents.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-[#ECF0F1]">
                        <h3 className="text-sm font-semibold text-[#2C3E50] mb-2">Linked Parents</h3>
                        <div className="space-y-2">
                          {linkedParents.map(p => (
                            <div key={p.linkId} className="flex items-center gap-3 p-2 rounded-lg bg-[#F8F9FA]">
                              <div className="w-8 h-8 rounded-full bg-[#2D9B6E]/10 flex items-center justify-center">
                                <Users className="w-4 h-4 text-[#2D9B6E]" />
                              </div>
                              <span className="text-sm font-medium text-[#2C3E50]">{p.parentName}</span>
                              <Badge variant="success">Connected</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Account (GDPR) */}
                  <AccountSection userEmail={userEmail} />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Cancel Session Confirmation Modal */}
      {cancelSessionId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-[#2C3E50] mb-2">Cancel Session?</h3>
            <p className="text-sm text-[#5D6D7E] mb-4">
              Your refund will be calculated based on the tutor&apos;s cancellation policy.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setCancelSessionId(null)}>
                Keep Session
              </Button>
              <Button
                className="flex-1 !bg-red-600 hover:!bg-red-700"
                isLoading={cancelLoading}
                onClick={handleCancelSession}
              >
                Cancel Session
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
