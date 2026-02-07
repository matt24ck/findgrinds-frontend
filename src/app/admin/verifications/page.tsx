'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Mail,
  ExternalLink
} from 'lucide-react';

interface PendingVerification {
  id: string;
  documentUrl: string;
  documentName: string;
  submittedAt: string;
  tutor: {
    id: string;
    headline: string;
    subjects: string[];
  } | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<PendingVerification[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState<{ [key: string]: string }>({});
  const [showRejectInput, setShowRejectInput] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const [pendingRes, statsRes] = await Promise.all([
        fetch(`${baseUrl}/api/verification/admin/pending`, { headers }),
        fetch(`${baseUrl}/api/verification/admin/stats`, { headers }),
      ]);

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        setVerifications(pendingData.data);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (action === 'reject' && !rejectNotes[id]) {
      setShowRejectInput(id);
      return;
    }

    setActionLoading(id);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/verification/admin/review/${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action,
            notes: rejectNotes[id] || null,
          }),
        }
      );

      if (response.ok) {
        // Remove from list and refresh stats
        setVerifications(prev => prev.filter(v => v.id !== id));
        setShowRejectInput(null);
        fetchData();
      }
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AdminGuard>
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#2D9B6E] rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2C3E50]">Verification Review</h1>
              <p className="text-[#5D6D7E]">Review Garda vetting document submissions</p>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 text-center">
                <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#2C3E50]">{stats.pending}</p>
                <p className="text-sm text-[#5D6D7E]">Pending</p>
              </Card>
              <Card className="p-4 text-center">
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#2C3E50]">{stats.approved}</p>
                <p className="text-sm text-[#5D6D7E]">Approved</p>
              </Card>
              <Card className="p-4 text-center">
                <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#2C3E50]">{stats.rejected}</p>
                <p className="text-sm text-[#5D6D7E]">Rejected</p>
              </Card>
              <Card className="p-4 text-center">
                <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#2C3E50]">{stats.total}</p>
                <p className="text-sm text-[#5D6D7E]">Total</p>
              </Card>
            </div>
          )}

          {/* Pending Verifications */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[#2C3E50] mb-4">
              Pending Verifications ({verifications.length})
            </h2>

            {isLoading ? (
              <p className="text-center text-[#5D6D7E] py-8">Loading...</p>
            ) : verifications.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-[#5D6D7E]">No pending verifications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {verifications.map((v) => (
                  <div
                    key={v.id}
                    className="border border-[#ECF0F1] rounded-lg p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        {/* User Info */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-[#F0F7F4] rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-[#2D9B6E]" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#2C3E50]">
                              {v.user?.firstName} {v.user?.lastName}
                            </p>
                            <p className="text-sm text-[#5D6D7E] flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {v.user?.email}
                            </p>
                          </div>
                        </div>

                        {/* Tutor Info */}
                        {v.tutor && (
                          <div className="text-sm text-[#5D6D7E] mb-2">
                            <p>{v.tutor.headline}</p>
                            <p>Subjects: {v.tutor.subjects?.join(', ')}</p>
                          </div>
                        )}

                        {/* Document Info */}
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-[#95A5A6]" />
                          <span className="text-[#5D6D7E]">{v.documentName}</span>
                          <a
                            href={v.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2D9B6E] hover:underline flex items-center gap-1"
                          >
                            View <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <p className="text-xs text-[#95A5A6] mt-2">
                          Submitted {new Date(v.submittedAt).toLocaleString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {showRejectInput === v.id ? (
                          <div className="space-y-2">
                            <textarea
                              placeholder="Reason for rejection..."
                              value={rejectNotes[v.id] || ''}
                              onChange={(e) =>
                                setRejectNotes({ ...rejectNotes, [v.id]: e.target.value })
                              }
                              className="w-full p-2 border border-[#D5DBDB] rounded-lg text-sm resize-none"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowRejectInput(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleAction(v.id, 'reject')}
                                isLoading={actionLoading === v.id}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Confirm Reject
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAction(v.id, 'approve')}
                              isLoading={actionLoading === v.id}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(v.id, 'reject')}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
    </AdminGuard>
  );
}
