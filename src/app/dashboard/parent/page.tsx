'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { parentApi, auth, sessions as sessionsApi } from '@/lib/api';
import { AccountSection } from '@/components/dashboard/AccountSection';
import {
  Calendar,
  Clock,
  FileText,
  Users,
  CreditCard,
  BookOpen,
  X,
  Plus,
  Video,
  MapPin,
  UserPlus,
  MessageSquare,
  Send,
  Shield,
  Settings,
} from 'lucide-react';

interface Student {
  linkId: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhotoUrl: string | null;
  linkedAt: string;
}

interface DashboardData {
  sessions: any[];
  resources: any[];
  summary: {
    totalSpent: number;
    upcomingSessionCount: number;
    completedSessionCount: number;
    resourceCount: number;
  };
}

type TabType = 'overview' | 'sessions' | 'resources' | 'spending' | 'messages' | 'settings';

export default function ParentDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [dashLoading, setDashLoading] = useState(false);

  // Link code input
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkCode, setLinkCode] = useState('');
  const [linkError, setLinkError] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);

  // Unlink confirmation
  const [unlinkTarget, setUnlinkTarget] = useState<string | null>(null);

  // Messages state
  const [studentConversations, setStudentConversations] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [parentMessageText, setParentMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Cancel session state
  const [cancelSessionId, setCancelSessionId] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    loadStudents();
    auth.me()
      .then(res => {
        const u = res.data;
        if (u?.email) setUserEmail(u.email);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      loadDashboard(selectedStudentId);
    }
  }, [selectedStudentId]);

  useEffect(() => {
    if (activeTab === 'messages' && selectedStudentId) {
      loadStudentMessages(selectedStudentId);
    }
  }, [activeTab, selectedStudentId]);

  async function loadStudents() {
    try {
      const res = await parentApi.getStudents();
      setStudents(res.data);
      if (res.data.length > 0 && !selectedStudentId) {
        setSelectedStudentId(res.data[0].studentId);
      }
    } catch {
      // not linked to any students
    } finally {
      setLoading(false);
    }
  }

  async function loadDashboard(studentId: string) {
    setDashLoading(true);
    try {
      const res = await parentApi.getStudentDashboard(studentId);
      setDashboard(res.data);
    } catch {
      setDashboard(null);
    } finally {
      setDashLoading(false);
    }
  }

  async function handleLink() {
    if (!linkCode.trim()) return;
    setLinkError('');
    setLinkLoading(true);
    try {
      const res = await parentApi.linkStudent(linkCode.trim());
      setLinkCode('');
      setShowLinkInput(false);
      await loadStudents();
      setSelectedStudentId(res.data.studentId);
    } catch (err) {
      setLinkError(err instanceof Error ? err.message : 'Failed to link');
    } finally {
      setLinkLoading(false);
    }
  }

  async function handleUnlink(studentId: string) {
    try {
      await parentApi.unlinkStudent(studentId);
      setUnlinkTarget(null);
      if (selectedStudentId === studentId) {
        setSelectedStudentId(null);
        setDashboard(null);
      }
      await loadStudents();
    } catch {
      // silently fail
    }
  }

  async function loadStudentMessages(studentId: string) {
    setMessagesLoading(true);
    setSelectedConversation(null);
    setConversationMessages([]);
    try {
      const res = await parentApi.getStudentMessages(studentId);
      setStudentConversations(res.data);
    } catch {
      setStudentConversations([]);
    } finally {
      setMessagesLoading(false);
    }
  }

  async function loadConversationMessages(studentId: string, conversationId: string) {
    try {
      const res = await parentApi.getStudentConversation(studentId, conversationId);
      setSelectedConversation(res.data.conversation);
      setConversationMessages(res.data.messages);
    } catch {
      setConversationMessages([]);
    }
  }

  async function handleSendOnBehalf() {
    if (!selectedStudentId || !selectedConversation || !parentMessageText.trim() || sendingMessage) return;
    setSendingMessage(true);
    try {
      await parentApi.sendOnBehalf(selectedStudentId, selectedConversation.id, parentMessageText.trim());
      setParentMessageText('');
      await loadConversationMessages(selectedStudentId, selectedConversation.id);
    } catch {
      // silently fail
    } finally {
      setSendingMessage(false);
    }
  }

  async function handleCancelSession() {
    if (!cancelSessionId || cancelLoading) return;
    setCancelLoading(true);
    try {
      const res = await sessionsApi.cancel(cancelSessionId);
      alert(res.data?.refundMessage || 'Session cancelled successfully.');
      setCancelSessionId(null);
      if (selectedStudentId) loadDashboard(selectedStudentId);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel session');
    } finally {
      setCancelLoading(false);
    }
  }

  const selectedStudent = students.find(s => s.studentId === selectedStudentId);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'spending', label: 'Spending', icon: CreditCard },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#2D9B6E] border-t-transparent rounded-full" />
        </main>
        <Footer />
      </div>
    );
  }

  // No linked students — show link code entry
  if (students.length === 0 && !showLinkInput) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-[#F0F7F4] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <UserPlus className="w-8 h-8 text-[#2D9B6E]" />
              </div>
              <h1 className="text-2xl font-bold text-[#2C3E50] mb-2">Link Your Child's Account</h1>
              <p className="text-[#5D6D7E] mb-8">
                Ask your child to generate a link code from their dashboard, then enter it here to connect your accounts.
              </p>

              <div className="space-y-4">
                <input
                  type="text"
                  value={linkCode}
                  onChange={(e) => setLinkCode(e.target.value.toUpperCase().slice(0, 6))}
                  placeholder="Enter 6-character code"
                  maxLength={6}
                  className="w-full text-center text-3xl font-mono font-bold tracking-[0.4em] px-4 py-4 rounded-xl border-2 border-[#D5DBDB] focus:border-[#2D9B6E] focus:ring-2 focus:ring-[#2D9B6E]/20 focus:outline-none transition-all uppercase"
                />

                {linkError && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {linkError}
                  </div>
                )}

                <Button
                  onClick={handleLink}
                  className="w-full"
                  size="lg"
                  isLoading={linkLoading}
                  disabled={linkCode.length < 6}
                >
                  Link Account
                </Button>
              </div>
            </div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">Parent Dashboard</h1>
            <p className="text-[#5D6D7E]">Monitor your child's learning and manage bookings.</p>
          </div>

          {/* Student Selector Bar */}
          <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
            {students.map(s => (
              <button
                key={s.studentId}
                onClick={() => { setSelectedStudentId(s.studentId); setActiveTab('overview'); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 whitespace-nowrap transition-all ${
                  selectedStudentId === s.studentId
                    ? 'border-[#2D9B6E] bg-[#F0F7F4]'
                    : 'border-[#ECF0F1] bg-white hover:border-[#2D9B6E]/40'
                }`}
              >
                <Avatar size="sm" fallback={`${s.firstName} ${s.lastName}`} src={s.profilePhotoUrl || undefined} />
                <span className="text-sm font-semibold text-[#2C3E50]">{s.firstName}</span>
              </button>
            ))}
            <button
              onClick={() => setShowLinkInput(true)}
              className="flex items-center gap-1 px-4 py-2 rounded-full border-2 border-dashed border-[#D5DBDB] text-[#5D6D7E] hover:border-[#2D9B6E] hover:text-[#2D9B6E] transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Child</span>
            </button>
          </div>

          {/* Add Child Modal */}
          {showLinkInput && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#2C3E50]">Link Another Child</h3>
                  <button onClick={() => { setShowLinkInput(false); setLinkError(''); setLinkCode(''); }} className="p-1 hover:bg-[#F8F9FA] rounded-lg">
                    <X className="w-5 h-5 text-[#95A5A6]" />
                  </button>
                </div>
                <p className="text-sm text-[#5D6D7E] mb-4">
                  Enter the 6-character code from your child's dashboard.
                </p>
                <input
                  type="text"
                  value={linkCode}
                  onChange={(e) => setLinkCode(e.target.value.toUpperCase().slice(0, 6))}
                  placeholder="XXXXXX"
                  maxLength={6}
                  className="w-full text-center text-2xl font-mono font-bold tracking-[0.3em] px-4 py-3 rounded-xl border-2 border-[#D5DBDB] focus:border-[#2D9B6E] focus:outline-none transition-all uppercase mb-3"
                />
                {linkError && (
                  <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm mb-3">
                    {linkError}
                  </div>
                )}
                <Button onClick={handleLink} className="w-full" isLoading={linkLoading} disabled={linkCode.length < 6}>
                  Link Account
                </Button>
              </div>
            </div>
          )}

          {/* Unlink Confirmation */}
          {unlinkTarget && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">Unlink Student?</h3>
                <p className="text-sm text-[#5D6D7E] mb-4">
                  You will no longer be able to view their dashboard or book sessions on their behalf.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setUnlinkTarget(null)}>Cancel</Button>
                  <Button variant="primary" className="flex-1 !bg-red-600 hover:!bg-red-700" onClick={() => handleUnlink(unlinkTarget)}>Unlink</Button>
                </div>
              </div>
            </div>
          )}

          {selectedStudent && (
            <>
              {/* Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
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

              {dashLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin w-8 h-8 border-4 border-[#2D9B6E] border-t-transparent rounded-full" />
                </div>
              ) : dashboard ? (
                <>
                  {/* Overview */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Summary Cards */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-sm p-5">
                          <p className="text-sm text-[#5D6D7E] mb-1">Total Spent</p>
                          <p className="text-2xl font-bold text-[#2C3E50]">&euro;{dashboard.summary.totalSpent.toFixed(2)}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-5">
                          <p className="text-sm text-[#5D6D7E] mb-1">Upcoming Sessions</p>
                          <p className="text-2xl font-bold text-[#2D9B6E]">{dashboard.summary.upcomingSessionCount}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-5">
                          <p className="text-sm text-[#5D6D7E] mb-1">Completed Sessions</p>
                          <p className="text-2xl font-bold text-[#2C3E50]">{dashboard.summary.completedSessionCount}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-5">
                          <p className="text-sm text-[#5D6D7E] mb-1">Resources Purchased</p>
                          <p className="text-2xl font-bold text-[#2C3E50]">{dashboard.summary.resourceCount}</p>
                        </div>
                      </div>

                      {/* Upcoming sessions + Book CTA */}
                      <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-lg font-bold text-[#2C3E50]">Upcoming Sessions</h2>
                          <Link href={`/tutors?forStudent=${selectedStudentId}`}>
                            <Button size="sm">
                              <BookOpen className="w-4 h-4 mr-1" />
                              Book for {selectedStudent.firstName}
                            </Button>
                          </Link>
                        </div>

                        {dashboard.sessions.filter(s => new Date(s.scheduledAt) > new Date() && ['PENDING', 'CONFIRMED'].includes(s.status)).length > 0 ? (
                          <div className="space-y-3">
                            {dashboard.sessions
                              .filter(s => new Date(s.scheduledAt) > new Date() && ['PENDING', 'CONFIRMED'].includes(s.status))
                              .slice(0, 5)
                              .map(s => (
                                <div key={s.id} className="flex items-center gap-4 p-4 rounded-lg bg-[#F8F9FA]">
                                  <div className="flex-1">
                                    <div className="font-semibold text-[#2C3E50]">{s.tutorName}</div>
                                    <div className="text-sm text-[#5D6D7E]">{s.subject} - {s.level}</div>
                                  </div>
                                  <div className="text-right text-sm">
                                    <div className="flex items-center gap-1 text-[#2C3E50]">
                                      <Calendar className="w-4 h-4" />
                                      {new Date(s.scheduledAt).toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short' })}
                                    </div>
                                    <div className="flex items-center gap-1 text-[#5D6D7E]">
                                      <Clock className="w-4 h-4" />
                                      {new Date(s.scheduledAt).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </div>
                                  <Badge variant={s.sessionType === 'VIDEO' ? 'info' : s.sessionType === 'GROUP' ? 'warning' : 'primary'}>
                                    {s.sessionType === 'VIDEO' ? 'Video' : s.sessionType === 'GROUP' ? 'Group' : 'In Person'}
                                  </Badge>
                                  <button
                                    onClick={() => setCancelSessionId(s.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                                    title="Cancel session"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Calendar className="w-12 h-12 text-[#D5DBDB] mx-auto mb-3" />
                            <p className="text-[#5D6D7E]">No upcoming sessions</p>
                          </div>
                        )}
                      </div>

                      {/* Unlink option */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => setUnlinkTarget(selectedStudentId!)}
                          className="text-sm text-red-500 hover:text-red-700 transition-colors"
                        >
                          Unlink {selectedStudent.firstName}'s account
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sessions Tab */}
                  {activeTab === 'sessions' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-lg font-bold text-[#2C3E50] mb-6">All Sessions</h2>
                      {dashboard.sessions.length > 0 ? (
                        <div className="space-y-3">
                          {dashboard.sessions.map(s => {
                            const isPast = new Date(s.scheduledAt) < new Date();
                            return (
                              <div key={s.id} className="flex items-center gap-4 p-4 rounded-lg border border-[#ECF0F1]">
                                <div className="flex-1">
                                  <div className="font-semibold text-[#2C3E50]">{s.tutorName}</div>
                                  <div className="text-sm text-[#5D6D7E]">{s.subject} - {s.durationMins}min</div>
                                </div>
                                <div className="text-right text-sm">
                                  <div className="text-[#2C3E50]">
                                    {new Date(s.scheduledAt).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </div>
                                  <div className="text-[#5D6D7E]">
                                    {new Date(s.scheduledAt).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>
                                <Badge variant={
                                  s.status === 'COMPLETED' ? 'success' :
                                  s.status === 'CANCELLED' ? 'error' :
                                  s.status === 'CONFIRMED' ? 'primary' : 'warning'
                                }>
                                  {s.status}
                                </Badge>
                                <div className="text-sm font-semibold text-[#2C3E50]">
                                  &euro;{Number(s.price).toFixed(2)}
                                </div>
                                {!isPast && ['PENDING', 'CONFIRMED'].includes(s.status) && (
                                  <button
                                    onClick={() => setCancelSessionId(s.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                                    title="Cancel session"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 text-[#D5DBDB] mx-auto mb-3" />
                          <p className="text-[#5D6D7E]">No sessions yet</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Resources Tab */}
                  {activeTab === 'resources' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-lg font-bold text-[#2C3E50] mb-6">Purchased Resources</h2>
                      {dashboard.resources.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {dashboard.resources.map(r => (
                            <div key={r.id} className="p-4 rounded-lg border border-[#ECF0F1]">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-10 h-10 bg-[#F0F7F4] rounded-lg flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-5 h-5 text-[#2D9B6E]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-[#2C3E50] line-clamp-2 text-sm">{r.title}</h4>
                                  <p className="text-xs text-[#95A5A6]">{r.subject} - {r.resourceType}</p>
                                  <p className="text-xs text-[#95A5A6] mt-1">
                                    Purchased {new Date(r.purchasedAt).toLocaleDateString('en-IE')}
                                  </p>
                                </div>
                              </div>
                              <div className="text-sm font-semibold text-[#2D9B6E]">&euro;{Number(r.price).toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FileText className="w-12 h-12 text-[#D5DBDB] mx-auto mb-3" />
                          <p className="text-[#5D6D7E]">No resources purchased yet</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Spending Tab */}
                  {activeTab === 'spending' && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                          <p className="text-sm text-[#5D6D7E] mb-1">Total Spent</p>
                          <p className="text-3xl font-bold text-[#2C3E50]">&euro;{dashboard.summary.totalSpent.toFixed(2)}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                          <p className="text-sm text-[#5D6D7E] mb-1">Session Spending</p>
                          <p className="text-3xl font-bold text-[#2D9B6E]">
                            &euro;{dashboard.sessions.filter(s => s.paymentStatus === 'paid').reduce((sum: number, s: any) => sum + Number(s.price), 0).toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                          <p className="text-sm text-[#5D6D7E] mb-1">Resource Spending</p>
                          <p className="text-3xl font-bold text-[#2D9B6E]">
                            &euro;{dashboard.resources.reduce((sum: number, r: any) => sum + Number(r.price), 0).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-[#2C3E50] mb-4">Payment History</h2>
                        {dashboard.sessions.filter(s => s.paymentStatus === 'paid').length > 0 ? (
                          <div className="space-y-2">
                            {dashboard.sessions
                              .filter(s => s.paymentStatus === 'paid')
                              .sort((a: any, b: any) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
                              .map((s: any) => (
                                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F8F9FA]">
                                  <div>
                                    <span className="font-medium text-[#2C3E50]">{s.subject}</span>
                                    <span className="text-sm text-[#5D6D7E] ml-2">with {s.tutorName}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-semibold text-[#2C3E50]">&euro;{Number(s.price).toFixed(2)}</span>
                                    <span className="text-xs text-[#95A5A6] ml-2">
                                      {new Date(s.scheduledAt).toLocaleDateString('en-IE')}
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <p className="text-[#5D6D7E] text-center py-4">No payments yet</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Messages Tab */}
                  {activeTab === 'messages' && (
                    <div className="space-y-4">
                      {/* Safeguarding banner */}
                      <div className="bg-[#F0F7F4] border border-[#2D9B6E]/20 rounded-lg px-4 py-3 flex items-start gap-3">
                        <Shield className="w-5 h-5 text-[#2D9B6E] mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-[#2C3E50]">
                          You can view {selectedStudent.firstName}'s conversations with tutors and send messages on their behalf for safeguarding purposes.
                        </p>
                      </div>

                      {messagesLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin w-8 h-8 border-4 border-[#2D9B6E] border-t-transparent rounded-full" />
                        </div>
                      ) : selectedConversation ? (
                        /* Conversation view */
                        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB]">
                          {/* Conversation header */}
                          <div className="flex items-center gap-3 p-4 border-b border-[#E5E7EB]">
                            <button
                              onClick={() => { setSelectedConversation(null); setConversationMessages([]); }}
                              className="text-[#5D6D7E] hover:text-[#2C3E50] transition-colors"
                            >
                              &larr; Back
                            </button>
                            <div className="w-8 h-8 bg-[#2D9B6E] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {selectedConversation.tutor?.firstName?.[0]}{selectedConversation.tutor?.lastName?.[0]}
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#2C3E50] text-sm">
                                {selectedConversation.tutor?.firstName} {selectedConversation.tutor?.lastName}
                              </h3>
                              <p className="text-xs text-[#95A5A6]">
                                Conversation with {selectedStudent.firstName}
                              </p>
                            </div>
                          </div>

                          {/* Messages */}
                          <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                            {conversationMessages.length === 0 ? (
                              <p className="text-center text-[#95A5A6] py-8">No messages yet</p>
                            ) : (
                              conversationMessages.map((msg: any) => {
                                const isStudentOrParent = msg.senderId === selectedStudentId || msg.onBehalfOfStudentId === selectedStudentId;
                                return (
                                  <div key={msg.id} className={`flex ${isStudentOrParent ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                                      isStudentOrParent
                                        ? 'bg-[#2D9B6E] text-white'
                                        : 'bg-[#F1F2F6] text-[#2C3E50]'
                                    }`}>
                                      {msg.onBehalfOfStudentId && (
                                        <p className={`text-xs mb-1 ${isStudentOrParent ? 'text-white/70' : 'text-[#95A5A6]'}`}>
                                          {msg.senderName} (on behalf of {selectedStudent.firstName})
                                        </p>
                                      )}
                                      <p className="text-sm">{msg.content}</p>
                                      <p className={`text-xs mt-1 ${isStudentOrParent ? 'text-white/60' : 'text-[#95A5A6]'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* Send on behalf */}
                          <div className="border-t border-[#E5E7EB] p-4">
                            <p className="text-xs text-[#95A5A6] mb-2">
                              Messaging as parent on behalf of {selectedStudent.firstName}
                            </p>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={parentMessageText}
                                onChange={(e) => setParentMessageText(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendOnBehalf(); } }}
                                placeholder={`Send a message on behalf of ${selectedStudent.firstName}...`}
                                className="flex-1 px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D9B6E] focus:border-transparent"
                              />
                              <button
                                onClick={handleSendOnBehalf}
                                disabled={!parentMessageText.trim() || sendingMessage}
                                className="px-4 py-2.5 bg-[#2D9B6E] text-white rounded-lg hover:bg-[#248a5e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Send className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : studentConversations.length === 0 ? (
                        <div className="text-center py-16">
                          <MessageSquare className="w-16 h-16 text-[#D5DBDB] mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">No conversations yet</h3>
                          <p className="text-[#5D6D7E]">
                            {selectedStudent.firstName} hasn't started any conversations with tutors yet.
                          </p>
                        </div>
                      ) : (
                        /* Conversations list */
                        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] divide-y divide-[#E5E7EB]">
                          {studentConversations.map((conv: any) => (
                            <button
                              key={conv.id}
                              onClick={() => loadConversationMessages(selectedStudentId!, conv.id)}
                              className="flex items-center gap-4 p-4 hover:bg-[#F8F9FA] transition-colors w-full text-left"
                            >
                              <div className="w-10 h-10 bg-[#2D9B6E] rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                {conv.tutor?.firstName?.[0]}{conv.tutor?.lastName?.[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                  <h4 className="font-semibold text-[#2C3E50] text-sm truncate">
                                    {conv.tutor?.firstName} {conv.tutor?.lastName}
                                  </h4>
                                  {conv.lastMessage && (
                                    <span className="text-xs text-[#95A5A6] flex-shrink-0 ml-2">
                                      {new Date(conv.lastMessage.createdAt).toLocaleDateString('en-IE', { day: 'numeric', month: 'short' })}
                                    </span>
                                  )}
                                </div>
                                {conv.lastMessage && (
                                  <p className="text-sm text-[#5D6D7E] truncate">{conv.lastMessage.content}</p>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-[#5D6D7E]">Unable to load dashboard data</p>
                </div>
              )}
            </>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl">
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
              The refund will be calculated based on the tutor's cancellation policy.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setCancelSessionId(null)} disabled={cancelLoading}>
                Keep Session
              </Button>
              <Button
                className="flex-1 !bg-red-600 hover:!bg-red-700"
                onClick={handleCancelSession}
                isLoading={cancelLoading}
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
