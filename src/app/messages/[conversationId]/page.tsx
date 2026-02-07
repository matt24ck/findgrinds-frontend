'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { messages } from '@/lib/api';
import { ArrowLeft, Send, MoreVertical, Flag, X, AlertTriangle, Shield } from 'lucide-react';

interface MessageItem {
  id: string;
  content: string;
  senderId: string;
  sender: { id: string; firstName: string; lastName: string; profilePhotoUrl: string | null };
  isPredefined: boolean;
  onBehalfOfStudentId: string | null;
  readAt: string | null;
  createdAt: string;
}

interface Permission {
  isMinor: boolean;
  hasLinkedParent: boolean;
  canFreeText: boolean;
}

const REPORT_REASONS = [
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'harassment', label: 'Harassment or bullying' },
  { value: 'spam', label: 'Spam' },
  { value: 'safety_concern', label: 'Safety concern' },
  { value: 'other', label: 'Other' },
];

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.conversationId as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const [messageList, setMessageList] = useState<MessageItem[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  const [permission, setPermission] = useState<Permission | null>(null);
  const [predefinedMessages, setPredefinedMessages] = useState<{ id: number; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  // Report modal state
  const [reportingMessageId, setReportingMessageId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Message action menu
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const user = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || 'null')
    : null;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadMessages();
    loadPredefinedMessages();

    // Poll for new messages every 10 seconds
    pollingRef.current = setInterval(loadMessages, 10000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  async function loadMessages() {
    try {
      const res = await messages.getMessages(conversationId);
      setConversation(res.data.conversation);
      setMessageList(res.data.messages);
      setPermission(res.data.permission);
    } catch (err) {
      if (!conversation) {
        setError(err instanceof Error ? err.message : 'Failed to load messages');
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadPredefinedMessages() {
    try {
      const res = await messages.getPredefinedMessages();
      setPredefinedMessages(res.data);
    } catch {
      // Non-critical
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await messages.sendMessage(conversationId, newMessage.trim());
      setNewMessage('');
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  }

  async function handleSendPredefined(predefinedId: number) {
    if (sending) return;
    setSending(true);
    try {
      await messages.sendPredefinedMessage(conversationId, predefinedId);
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  }

  async function handleReportSubmit() {
    if (!reportingMessageId || !reportReason) return;
    setReportSubmitting(true);
    try {
      await messages.reportMessage(reportingMessageId, reportReason, reportDetails || undefined);
      setReportSuccess(true);
      setTimeout(() => {
        setReportingMessageId(null);
        setReportReason('');
        setReportDetails('');
        setReportSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to report message');
    } finally {
      setReportSubmitting(false);
    }
  }

  function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' });
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  function getOtherPerson() {
    if (!conversation) return null;
    if (user?.userType === 'TUTOR') return conversation.student;
    return conversation.tutor;
  }

  // Group messages by date
  function groupMessagesByDate(msgs: MessageItem[]): { date: string; messages: MessageItem[] }[] {
    const groups: { date: string; messages: MessageItem[] }[] = [];
    let currentDate = '';

    for (const msg of msgs) {
      const date = new Date(msg.createdAt).toDateString();
      if (date !== currentDate) {
        currentDate = date;
        groups.push({ date: msg.createdAt, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    }

    return groups;
  }

  const otherPerson = getOtherPerson();
  const showPredefinedOnly = permission?.isMinor && !permission?.canFreeText;
  const messageGroups = groupMessagesByDate(messageList);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
        {/* Chat Header */}
        <div className="bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center gap-3">
          <Link href="/messages" className="text-[#5D6D7E] hover:text-[#2C3E50]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          {otherPerson && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2D9B6E] rounded-full flex items-center justify-center text-white font-semibold">
                {otherPerson.firstName[0]}{otherPerson.lastName[0]}
              </div>
              <div>
                <h2 className="font-semibold text-[#2C3E50]">
                  {otherPerson.firstName} {otherPerson.lastName}
                </h2>
                <p className="text-xs text-[#95A5A6]">
                  {user?.userType === 'TUTOR' ? 'Student' : 'Tutor'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Safeguarding Banners */}
        {permission?.isMinor && permission?.hasLinkedParent && (
          <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              Your parent/guardian can view your messages for your safety.
            </p>
          </div>
        )}
        {showPredefinedOnly && (
          <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              You can send predefined messages only.{' '}
              <Link href="/dashboard/student" className="underline font-medium">
                Link a parent account
              </Link>{' '}
              to unlock custom messages.
            </p>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6" style={{ minHeight: '400px', maxHeight: 'calc(100vh - 300px)' }}>
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-[#2D9B6E] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
          ) : messageList.length === 0 ? (
            <div className="text-center py-12 text-[#95A5A6]">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messageGroups.map((group, gi) => (
              <div key={gi}>
                {/* Date separator */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 h-px bg-[#E5E7EB]" />
                  <span className="text-xs text-[#95A5A6] font-medium">{formatDate(group.date)}</span>
                  <div className="flex-1 h-px bg-[#E5E7EB]" />
                </div>

                {/* Messages */}
                <div className="space-y-3">
                  {group.messages.map((msg) => {
                    const isOwn = msg.senderId === user?.id;

                    return (
                      <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`relative group max-w-[75%] ${isOwn ? 'order-1' : ''}`}>
                          {/* On behalf label */}
                          {msg.onBehalfOfStudentId && (
                            <p className={`text-xs text-[#95A5A6] mb-1 ${isOwn ? 'text-right' : ''}`}>
                              {msg.sender.firstName} {msg.sender.lastName} (on behalf)
                            </p>
                          )}

                          <div
                            className={`px-4 py-2.5 rounded-2xl ${
                              isOwn
                                ? 'bg-[#2D9B6E] text-white rounded-br-md'
                                : 'bg-white border border-[#E5E7EB] text-[#2C3E50] rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                            <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-[#95A5A6]'}`}>
                              {formatTime(msg.createdAt)}
                              {isOwn && msg.readAt && ' · Read'}
                            </p>
                          </div>

                          {/* Report button (only for received messages) */}
                          {!isOwn && (
                            <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  if (activeMenuId === msg.id) {
                                    setActiveMenuId(null);
                                  } else {
                                    setActiveMenuId(msg.id);
                                  }
                                }}
                                className="p-1 text-[#95A5A6] hover:text-[#2C3E50]"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {activeMenuId === msg.id && (
                                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-1 z-10">
                                  <button
                                    onClick={() => {
                                      setReportingMessageId(msg.id);
                                      setActiveMenuId(null);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                                  >
                                    <Flag className="w-4 h-4" />
                                    Report
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-[#E5E7EB] px-4 py-3">
          {showPredefinedOnly ? (
            <div className="space-y-2">
              <p className="text-xs text-[#95A5A6] mb-2">Choose a message to send:</p>
              <div className="flex flex-wrap gap-2">
                {predefinedMessages.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => handleSendPredefined(pm.id)}
                    disabled={sending}
                    className="text-sm px-3 py-2 bg-[#F0F7F4] text-[#2D9B6E] border border-[#2D9B6E]/20 rounded-full hover:bg-[#2D9B6E] hover:text-white transition-colors disabled:opacity-50"
                  >
                    {pm.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-2 focus:ring-[#2D9B6E] focus:border-transparent"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="w-10 h-10 bg-[#2D9B6E] text-white rounded-full flex items-center justify-center hover:bg-[#248a5e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Report Modal */}
      {reportingMessageId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            {reportSuccess ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Flag className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-[#2C3E50]">Report Submitted</h3>
                <p className="text-sm text-[#5D6D7E] mt-1">Our team will review this message.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#2C3E50]">Report Message</h3>
                  <button
                    onClick={() => {
                      setReportingMessageId(null);
                      setReportReason('');
                      setReportDetails('');
                    }}
                    className="text-[#95A5A6] hover:text-[#2C3E50]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50] mb-2">Reason</label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D9B6E]"
                    >
                      <option value="">Select a reason...</option>
                      {REPORT_REASONS.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                      Additional details <span className="text-[#95A5A6] font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D9B6E] resize-none"
                      placeholder="Tell us more about the issue..."
                    />
                  </div>

                  <button
                    onClick={handleReportSubmit}
                    disabled={!reportReason || reportSubmitting}
                    className="w-full py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
