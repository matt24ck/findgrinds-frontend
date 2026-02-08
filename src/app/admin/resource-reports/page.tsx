'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  ArrowLeft,
  RotateCcw,
  Ban,
  Euro,
  Trash2,
} from 'lucide-react';
import { adminApi } from '@/lib/api';

interface ResourceReportItem {
  id: string;
  reason: string;
  details: string | null;
  refundRequested: boolean;
  status: string;
  createdAt: string;
  resource: {
    id: string;
    title: string;
    subject: string;
    level: string;
    price: string;
    status: string;
  };
  purchase: {
    id: string;
    amount: string;
    stripePaymentIntentId: string;
  };
  reporter: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const REASON_LABELS: Record<string, string> = {
  misleading_content: 'Misleading Content',
  poor_quality: 'Poor Quality',
  wrong_subject: 'Wrong Subject',
  incomplete: 'Incomplete',
  other: 'Other',
};

const REASON_COLORS: Record<string, string> = {
  misleading_content: 'bg-red-100 text-red-700',
  poor_quality: 'bg-orange-100 text-orange-700',
  wrong_subject: 'bg-purple-100 text-purple-700',
  incomplete: 'bg-yellow-100 text-yellow-700',
  other: 'bg-gray-100 text-gray-700',
};

export default function AdminResourceReportsPage() {
  const [reports, setReports] = useState<ResourceReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'REFUNDED' | 'DISMISSED'>('PENDING');
  const [counts, setCounts] = useState({ pending: 0, refunded: 0, dismissed: 0 });
  const [confirmAction, setConfirmAction] = useState<{ reportId: string; action: 'refund' | 'dismiss' | 'suspend' | 'delete' } | null>(null);

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getResourceReports(statusFilter);
      setReports(data.data);
      setCounts(prev => ({ ...prev, [statusFilter.toLowerCase()]: data.count }));
    } catch (err) {
      console.error('Failed to fetch resource reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all counts on mount
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [pending, refunded, dismissed] = await Promise.all([
          adminApi.getResourceReports('PENDING'),
          adminApi.getResourceReports('REFUNDED'),
          adminApi.getResourceReports('DISMISSED'),
        ]);
        setCounts({
          pending: pending.count || 0,
          refunded: refunded.count || 0,
          dismissed: dismissed.count || 0,
        });
      } catch {
        // silently fail
      }
    };
    fetchCounts();
  }, []);

  const handleAction = async (reportId: string, action: 'refund' | 'dismiss' | 'suspend' | 'delete') => {
    setActionLoading(reportId);
    setConfirmAction(null);
    try {
      await adminApi.actionResourceReport(reportId, action);
      setReports(prev => prev.filter(r => r.id !== reportId));
      setCounts(prev => ({
        ...prev,
        pending: prev.pending - 1,
        ...(action === 'dismiss' ? { dismissed: prev.dismissed + 1 } : { refunded: prev.refunded + 1 }),
      }));
    } catch (err) {
      console.error('Action failed:', err);
      alert(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const ACTION_LABELS: Record<string, string> = {
    refund: 'Refund this purchase? The buyer will receive their money back.',
    dismiss: 'Dismiss this report? No refund will be issued.',
    suspend: 'Suspend this resource and refund? The resource will be removed from the marketplace and the buyer refunded.',
    delete: 'Delete this resource and refund? The resource will be permanently removed from the marketplace and the buyer refunded.',
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
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2C3E50]">Resource Reports</h1>
              <p className="text-[#5D6D7E]">Review reported resources and process refunds</p>
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
              <RotateCcw className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#2C3E50]">{counts.refunded}</p>
              <p className="text-sm text-[#5D6D7E]">Refunded</p>
            </Card>
            <Card className="p-4 text-center">
              <XCircle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#2C3E50]">{counts.dismissed}</p>
              <p className="text-sm text-[#5D6D7E]">Dismissed</p>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {(['PENDING', 'REFUNDED', 'DISMISSED'] as const).map((status) => (
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
                    ? 'No pending resource reports — all clear!'
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
                        {report.refundRequested && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            Refund Requested
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#95A5A6]">
                        {new Date(report.createdAt).toLocaleString('en-IE')}
                      </span>
                    </div>

                    {/* Resource Info */}
                    <div className="bg-[#F8F9FA] rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-[#95A5A6]" />
                        <span className="text-xs font-medium text-[#5D6D7E]">Reported Resource</span>
                      </div>
                      <Link href={`/resources/${report.resource.id}`} className="text-sm font-semibold text-[#2D9B6E] hover:underline">
                        {report.resource.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[#95A5A6]">
                        <span>{report.resource.subject}</span>
                        <span>&middot;</span>
                        <span>{report.resource.level === 'LC' ? 'Leaving Cert' : 'Junior Cert'}</span>
                        <span>&middot;</span>
                        <span className="font-medium text-[#2C3E50]">€{Number(report.purchase.amount).toFixed(2)}</span>
                        {report.resource.status === 'SUSPENDED' && (
                          <>
                            <span>&middot;</span>
                            <span className="text-red-600 font-medium">SUSPENDED</span>
                          </>
                        )}
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
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-[#ECF0F1]">
                        <Button
                          size="sm"
                          onClick={() => setConfirmAction({ reportId: report.id, action: 'refund' })}
                          isLoading={actionLoading === report.id}
                        >
                          <Euro className="w-4 h-4 mr-1" />
                          Refund
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setConfirmAction({ reportId: report.id, action: 'suspend' })}
                          isLoading={actionLoading === report.id}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Ban className="w-4 h-4 mr-1" />
                          Suspend & Refund
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setConfirmAction({ reportId: report.id, action: 'delete' })}
                          isLoading={actionLoading === report.id}
                          className="!text-red-600 !border-red-200 hover:!bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete & Refund
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
              {ACTION_LABELS[confirmAction.action]}
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
                  confirmAction.action === 'dismiss' ? 'bg-gray-500 hover:bg-gray-600' :
                  confirmAction.action === 'suspend' || confirmAction.action === 'delete' ? 'bg-red-500 hover:bg-red-600' :
                  'bg-[#2D9B6E] hover:bg-[#258a5e]'
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
