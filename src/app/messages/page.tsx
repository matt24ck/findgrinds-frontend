'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { messages } from '@/lib/api';
import { MessageSquare, Search } from 'lucide-react';

interface ConversationItem {
  id: string;
  student: { id: string; firstName: string; lastName: string; profilePhotoUrl: string | null };
  tutor: { id: string; firstName: string; lastName: string; profilePhotoUrl: string | null };
  lastMessage: {
    content: string;
    senderId: string;
    senderName: string;
    createdAt: string;
    onBehalfOfStudentId: string | null;
  } | null;
  unreadCount: number;
  lastMessageAt: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const user = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || 'null')
    : null;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      const res = await messages.getConversations();
      setConversations(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }

  function getOtherPerson(conv: ConversationItem) {
    if (user?.userType === 'TUTOR') {
      return conv.student;
    }
    return conv.tutor;
  }

  function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' });
  }

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const other = getOtherPerson(conv);
    const name = `${other.firstName} ${other.lastName}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#2C3E50]">Messages</h1>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-[#95A5A6]" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D9B6E] focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#2D9B6E] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[#5D6D7E] mt-4">Loading conversations...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 text-[#D5DBDB] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#2C3E50] mb-2">No messages yet</h2>
            <p className="text-[#5D6D7E] mb-6">
              {user?.userType === 'TUTOR'
                ? 'Students will be able to message you once they find your profile.'
                : 'Find a tutor and start a conversation!'}
            </p>
            {user?.userType !== 'TUTOR' && (
              <Link
                href="/tutors"
                className="inline-flex items-center px-6 py-3 bg-[#2D9B6E] text-white rounded-lg hover:bg-[#248a5e] transition-colors"
              >
                Browse Tutors
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] divide-y divide-[#E5E7EB]">
            {filteredConversations.map((conv) => {
              const other = getOtherPerson(conv);
              return (
                <Link
                  key={conv.id}
                  href={`/messages/${conv.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-[#F8F9FA] transition-colors"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-[#2D9B6E] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {other.firstName[0]}{other.lastName[0]}
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold text-[#2C3E50] truncate ${conv.unreadCount > 0 ? 'font-bold' : ''}`}>
                        {other.firstName} {other.lastName}
                      </h3>
                      {conv.lastMessage && (
                        <span className="text-xs text-[#95A5A6] flex-shrink-0 ml-2">
                          {formatTime(conv.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-[#2C3E50] font-medium' : 'text-[#5D6D7E]'}`}>
                        {conv.lastMessage.onBehalfOfStudentId
                          ? `${conv.lastMessage.senderName} (on behalf): `
                          : conv.lastMessage.senderId === user?.id
                          ? 'You: '
                          : ''}
                        {conv.lastMessage.content}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
