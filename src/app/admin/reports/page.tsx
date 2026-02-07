'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  Flag,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  User,
  Mail,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';

interface MessageReport {
  id: string;
  reason: string;
  details: string | null;
  status: string;
  createdAt: string;
  message: {
    id: string;
    content: string;
    createdAt: string;
    sender: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    conversation: {
      id: string;
      studentId: string;
      tutorId: string;
    };
  };
  reporter: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const REASON_LABELS: Record<string, string> = {
  inappropriate: 'Inappropriate Content',
  harassment: 'Harassment',
  spam: 'Spam',
  safety_concern: 'Safety Concern',
  other: 'Other',
};

const REASON_COLORS: Record<string, string> = {
  inappropriate: 'bg-orange-100 text-orange-700',
  harassment: 'bg-red-100 text-red-700',
  spam: 'bg-gray-100 text-gray-700',
  safety_concern: 'bg-purple-100 text-purple-700',
  other: 'bg-blue-100 text-blue-700',
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<MessageReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'REVIEWED' | 'DISMISSED'>('PENDING');
  const [counts, setCounts] = useState({ pending: 0, reviewed: 0, dismissed: 0 });

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const response = await fetch(
        `${baseUrl}/api/messages/admin/reports?status=${statusFilter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setReports(data.data);

        // Update the count for the current filter
        setCounts(prev => ({ ...prev, [statusFilter.toLowerCase()]: data.count }));
      }
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all counts on mount
  useEffect(() => {
    const fetchCounts = async () => {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      try {
        const [pendingRes, reviewedRes, dismissedRes] = await Promise.all([
          fetch(`${baseUrl}/api/messages/admin/reports?status=PENDING`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${baseUrl}/api/messages/admin/reports?status=REVIEWED`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${baseUrl}/api/messages/admin/reports?status=DISMISSED`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const [pending, reviewed, dismissed] = await Promise.all([
          pendingRes.ok ? pendingRes.json() : { count: 0 },
          reviewedRes.ok ? reviewedRes.json() : { count: 0 },
          dismissedRes.ok ? dismissedRes.json() : { count: 0 },
        ]);

        setCounts({
          pending: pending.count || 0,
          reviewed: reviewed.count || 0,
          dismissed: dismissed.count || 0,
        });
      } catch {
        // silently fail
      }
    };

    fetchCounts();
  }, []);

  const handleReview = async (reportId: string, action: 'reviewed' | 'dismissed') => {
    setActionLoading(reportId);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const response = await fetch(
        `${baseUrl}/api/messages/admin/reports/${reportId}/review`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action }),
        }
      );

      if (response.ok) {
        setReports(prev => prev.filter(r => r.id !== reportId));
        setCounts(prev => ({
          ...prev,
          pending: prev.pending - 1,
          [action]: prev[action as keyof typeof prev] + 1,
        }));
      }
    } catch (err) {
      console.error('Review action failed:', err);
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
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Link
              href="/admin"
              className="p-2 text-[#5D6D7E] hover:text-[#2C3E50] hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <Flag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2C3E50]">Message Reports</h1>
              <p className="text-[#5D6D7E]">Review reported messages for policy violations</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="p-4 text-center">
              <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#2C3E50]">{counts.pending}</p>
              <p className="text-sm text-[#5D6D7E]">Pending</p>
            </Card>
            <Card className="p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#2C3E50]">{counts.reviewed}</p>
              <p className="text-sm text-[#5D6D7E]">Reviewed</p>
            </Card>
            <Card className="p-4 text-center">
              <XCircle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#2C3E50]">{counts.dismissed}</p>
              <p className="text-sm text-[#5D6D7E]">Dismissed</p>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {(['PENDING', 'REVIEWED', 'DISMISSED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  statusFilter === status
                    ? 'bg-[#2C3E50] text-white'
                    : 'bg-white text-[#5D6D7E] hover:bg-[#F0F7F4]'
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
                {status === 'PENDING' && counts.pending > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {counts.pending}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Reports List */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[#2C3E50] mb-4">
              {statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()} Reports ({reports.length})
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-[#2D9B6E] border-t-transparent rounded-full" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-[#5D6D7E]">
                  {statusFilter === 'PENDING'
                    ? 'No pending reports — all clear!'
                    : `No ${statusFilter.toLowerCase()} reports`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="border border-[#ECF0F1] rounded-lg p-5"
                  >
                    {/* Reason Badge + Timestamp */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${REASON_COLORS[report.reason] || 'bg-gray-100 text-gray-700'}`}>
                          {REASON_LABELS[report.reason] || report.reason}
                        </span>
                        {report.reason === 'safety_concern' && (
                          <AlertTriangle className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      <span className="text-xs text-[#95A5A6]">
                        {new Date(report.createdAt).toLocaleString('en-IE')}
                      </span>
                    </div>

                    {/* Reported Message */}
                    <div className="bg-[#F8F9FA] rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-[#95A5A6]" />
                        <span className="text-xs font-medium text-[#5D6D7E]">Reported Message</span>
                      </div>
                      <p className="text-sm text-[#2C3E50] mb-2">
                        "{report.message.content}"
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[#95A5A6]">
                        <span>
                          Sent by <strong className="text-[#2C3E50]">
                            {report.message.sender.firstName} {report.message.sender.lastName}
                          </strong>
                        </span>
                        <span>&middot;</span>
                        <span>{report.message.sender.email}</span>
                        <span>&middot;</span>
                        <span>{new Date(report.message.createdAt).toLocaleString('en-IE')}</span>
                      </div>
                    </div>

                    {/* Reporter Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-[#F0F7F4] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-[#2D9B6E]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#2C3E50]">
                          Reported by {report.reporter.firstName} {report.reporter.lastName}
                        </p>
                        <p className="text-xs text-[#95A5A6] flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {report.reporter.email}
                        </p>
                      </div>
                    </div>

                    {/* Additional Details */}
                    {report.details && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-4">
                        <p className="text-xs font-medium text-yellow-800 mb-1">Additional details from reporter:</p>
                        <p className="text-sm text-yellow-900">{report.details}</p>
                      </div>
                    )}

                    {/* Actions */}
                    {statusFilter === 'PENDING' && (
                      <div className="flex gap-2 pt-2 border-t border-[#ECF0F1]">
                        <Button
                          size="sm"
                          onClick={() => handleReview(report.id, 'reviewed')}
                          isLoading={actionLoading === report.id}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Reviewed
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReview(report.id, 'dismissed')}
                          isLoading={actionLoading === report.id}
                          className="text-[#5D6D7E]"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Dismiss
                        </Button>
                        <Link
                          href={`/admin/users/${report.message.sender.id}`}
                          className="ml-auto"
                        >
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                            View Sender Profile
                          </Button>
                        </Link>
                      </div>
                    )}
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
