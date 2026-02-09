'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  Star,
  CheckCircle,
  XCircle,
  Clock,
  User,
  ArrowLeft,
  Trash2,
  Flag,
} from 'lucide-react';
import { adminApi } from '@/lib/api';

interface ReviewReportItem {
  id: string;
  reason: string;
  details: string | null;
  status: string;
  createdAt: string;
  session: {
    id: string;
    subject: string;
    rating: number;
    reviewText: string;
    scheduledAt: string;
    student: { firstName: string; lastName: string };
    tutor: { User: { firstName: string; lastName: string } };
  };
  reporter: { firstName: string; lastName: string };
}

const REASON_LABELS: Record<string, string> = {
  inappropriate: 'Inappropriate',
  harassment: 'Harassment',
  false_claims: 'False Claims',
  other: 'Other',
};

const REASON_COLORS: Record<string, string> = {
  inappropriate: 'bg-red-100 text-red-700',
  harassment: 'bg-red-100 text-red-700',
  false_claims: 'bg-orange-100 text-orange-700',
  other: 'bg-gray-100 text-gray-700',
};

export default function AdminReviewReportsPage() {
  const [reports, setReports] = useState<ReviewReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'REVIEWED' | 'DISMISSED'>('PENDING');
  const [counts, setCounts] = useState({ pending: 0, reviewed: 0, dismissed: 0 });
  const [confirmAction, setConfirmAction] = useState<{ reportId: string; action: 'dismiss' | 'remove_review' } | null>(null);

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getReviewReports(statusFilter);
      setReports(data.data);
    } catch (err) {
      console.error('Failed to fetch review reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [pending, reviewed, dismissed] = await Promise.all([
          adminApi.getReviewReports('PENDING'),
          adminApi.getReviewReports('REVIEWED'),
          adminApi.getReviewReports('DISMISSED'),
        ]);
        setCounts({
          pending: pending.data?.length || 0,
          reviewed: reviewed.data?.length || 0,
          dismissed: dismissed.data?.length || 0,
        });
      } catch {
        // silently fail
      }
    };
    fetchCounts();
  }, []);

  const handleAction = async (reportId: string, action: 'dismiss' | 'remove_review') => {
    setActionLoading(reportId);
    setConfirmAction(null);
    try {
      await adminApi.actionReviewReport(reportId, action);
      setReports(prev => prev.filter(r => r.id !== reportId));
      setCounts(prev => ({
        ...prev,
        pending: prev.pending - 1,
        ...(action === 'dismiss' ? { dismissed: prev.dismissed + 1 } : { reviewed: prev.reviewed + 1 }),
      }));
    } catch (err) {
      console.error('Action failed:', err);
      alert(err instanceof Error ? err.message : 'Action failed');
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
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Flag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2C3E50]">Review Reports</h1>
              <p className="text-[#5D6D7E]">Review flagged tutor reviews and take action</p>
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
              <Trash2 className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#2C3E50]">{counts.reviewed}</p>
              <p className="text-sm text-[#5D6D7E]">Removed</p>
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
                {status === 'REVIEWED' ? 'Removed' : status.charAt(0) + status.slice(1).toLowerCase()}
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
              {statusFilter === 'REVIEWED' ? 'Removed' : statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()} Reports ({reports.length})
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
                    ? 'No pending review reports — all clear!'
                    : `No ${statusFilter === 'REVIEWED' ? 'removed' : 'dismissed'} reports`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="border border-[#ECF0F1] rounded-lg p-5">
                    {/* Reason Badge + Timestamp */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${REASON_COLORS[report.reason] || 'bg-gray-100 text-gray-700'}`}>
                        {REASON_LABELS[report.reason] || report.reason}
                      </span>
                      <span className="text-xs text-[#95A5A6]">
                        {new Date(report.createdAt).toLocaleString('en-IE')}
                      </span>
                    </div>

                    {/* The Review */}
                    <div className="bg-[#F8F9FA] rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-medium text-[#5D6D7E]">Flagged Review</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className={`w-4 h-4 ${star <= report.session.rating ? 'text-yellow-400 fill-yellow-400' : 'text-[#D5DBDB]'}`} />
                        ))}
                        <span className="ml-2 text-sm text-[#2C3E50] font-medium">{report.session.rating}/5</span>
                      </div>
                      {report.session.reviewText && (
                        <p className="text-sm text-[#5D6D7E] italic mb-2">&ldquo;{report.session.reviewText}&rdquo;</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-[#95A5A6]">
                        <span>By {report.session.student?.firstName} {report.session.student?.lastName?.charAt(0)}.</span>
                        <span>&middot;</span>
                        <span>{report.session.subject}</span>
                        <span>&middot;</span>
                        <span>{new Date(report.session.scheduledAt).toLocaleDateString('en-IE')}</span>
                      </div>
                    </div>

                    {/* Reporter Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-[#F0F7F4] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-[#2D9B6E]" />
                      </div>
                      <p className="text-sm font-medium text-[#2C3E50]">
                        Flagged by {report.reporter.firstName} {report.reporter.lastName} (Tutor)
                      </p>
                    </div>

                    {/* Details */}
                    {report.details && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-4">
                        <p className="text-xs font-medium text-yellow-800 mb-1">Tutor&apos;s comments:</p>
                        <p className="text-sm text-yellow-900">{report.details}</p>
                      </div>
                    )}

                    {/* Actions */}
                    {statusFilter === 'PENDING' && (
                      <div className="flex gap-2 pt-2 border-t border-[#ECF0F1]">
                        <Button
                          size="sm"
                          className="!bg-red-600 hover:!bg-red-700"
                          onClick={() => setConfirmAction({ reportId: report.id, action: 'remove_review' })}
                          isLoading={actionLoading === report.id}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove Review
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setConfirmAction({ reportId: report.id, action: 'dismiss' })}
                          isLoading={actionLoading === report.id}
                          className="text-[#5D6D7E]"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-[#2C3E50] mb-2">Confirm Action</h3>
            <p className="text-sm text-[#5D6D7E] mb-6">
              {confirmAction.action === 'remove_review'
                ? 'Remove this review? The review will be deleted and the tutor\'s rating will be recalculated.'
                : 'Dismiss this report? The review will remain visible.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 px-4 py-2 border border-[#ECF0F1] rounded-lg text-sm text-[#5D6D7E] hover:bg-[#F8F9FA] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(confirmAction.reportId, confirmAction.action)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                  confirmAction.action === 'dismiss' ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
    </AdminGuard>
  );
}
