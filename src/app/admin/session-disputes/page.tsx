'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  ArrowLeft,
  RotateCcw,
  Euro,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { adminApi } from '@/lib/api';

interface SessionDisputeItem {
  id: string;
  reason: string;
  details: string;
  evidenceKeys: string[];
  evidenceUrls?: (string | null)[];
  tutorResponse: string | null;
  tutorEvidenceKeys: string[] | null;
  tutorEvidenceUrls?: (string | null)[];
  respondedAt: string | null;
  status: string;
  createdAt: string;
  session: {
    id: string;
    subject: string;
    scheduledAt: string;
    price: string;
    stripePaymentIntentId: string;
    paymentStatus: string;
    student: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    tutor: {
      id: string;
      User: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
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
  tutor_no_show: 'Tutor No-Show',
  poor_quality: 'Poor Quality',
  inappropriate_behavior: 'Inappropriate Behavior',
  other: 'Other',
};

const REASON_COLORS: Record<string, string> = {
  tutor_no_show: 'bg-red-100 text-red-700',
  poor_quality: 'bg-orange-100 text-orange-700',
  inappropriate_behavior: 'bg-purple-100 text-purple-700',
  other: 'bg-gray-100 text-gray-700',
};

export default function AdminSessionDisputesPage() {
  const [disputes, setDisputes] = useState<SessionDisputeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'REFUNDED' | 'DISMISSED'>('PENDING');
  const [counts, setCounts] = useState({ pending: 0, refunded: 0, dismissed: 0 });
  const [confirmAction, setConfirmAction] = useState<{ disputeId: string; action: 'refund' | 'dismiss' } | null>(null);

  useEffect(() => {
    fetchDisputes();
  }, [statusFilter]);

  const fetchDisputes = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getSessionDisputes(statusFilter);
      setDisputes(data.data);
      setCounts(prev => ({ ...prev, [statusFilter.toLowerCase()]: data.count }));
    } catch (err) {
      console.error('Failed to fetch session disputes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [pending, refunded, dismissed] = await Promise.all([
          adminApi.getSessionDisputes('PENDING'),
          adminApi.getSessionDisputes('REFUNDED'),
          adminApi.getSessionDisputes('DISMISSED'),
        ]);
        setCounts({
          pending: pending.count || 0,
          refunded: refunded.count || 0,
          dismissed: dismissed.count || 0,
        });
      } catch {}
    };
    fetchCounts();
  }, []);

  const handleAction = async (disputeId: string, action: 'refund' | 'dismiss') => {
    setActionLoading(disputeId);
    setConfirmAction(null);
    try {
      await adminApi.actionSessionDispute(disputeId, action);
      setDisputes(prev => prev.filter(d => d.id !== disputeId));
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
    refund: 'Refund this session? The student will receive a full refund.',
    dismiss: 'Dismiss this dispute? No refund will be issued.',
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
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2C3E50]">Session Disputes</h1>
              <p className="text-[#5D6D7E]">Review session disputes and process refunds</p>
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

          {/* Disputes List */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[#2C3E50] mb-4">
              {statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()} Disputes ({disputes.length})
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-[#2D9B6E] border-t-transparent rounded-full" />
              </div>
            ) : disputes.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-[#5D6D7E]">
                  {statusFilter === 'PENDING'
                    ? 'No pending session disputes — all clear!'
                    : `No ${statusFilter.toLowerCase()} disputes`}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {disputes.map((dispute) => (
                  <div
                    key={dispute.id}
                    className="border border-[#ECF0F1] rounded-lg p-5"
                  >
                    {/* Reason Badge + Timestamp */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${REASON_COLORS[dispute.reason] || 'bg-gray-100 text-gray-700'}`}>
                        {REASON_LABELS[dispute.reason] || dispute.reason}
                      </span>
                      <span className="text-xs text-[#95A5A6]">
                        {new Date(dispute.createdAt).toLocaleString('en-IE')}
                      </span>
                    </div>

                    {/* Session Info */}
                    <div className="bg-[#F8F9FA] rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-[#95A5A6]" />
                        <span className="text-xs font-medium text-[#5D6D7E]">Disputed Session</span>
                      </div>
                      <div className="text-sm font-semibold text-[#2C3E50]">{dispute.session.subject}</div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[#95A5A6]">
                        <span>{new Date(dispute.session.scheduledAt).toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span>&middot;</span>
                        <span className="font-medium text-[#2C3E50]">€{Number(dispute.session.price).toFixed(2)}</span>
                        {dispute.session.paymentStatus === 'refunded' && (
                          <>
                            <span>&middot;</span>
                            <span className="text-green-600 font-medium">REFUNDED</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Student (Reporter) Section */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#2C3E50]">
                            Student: {dispute.reporter.firstName} {dispute.reporter.lastName}
                          </p>
                          <p className="text-xs text-[#95A5A6] flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {dispute.reporter.email}
                          </p>
                        </div>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
                        <p className="text-xs font-medium text-yellow-800 mb-1">Student&apos;s statement:</p>
                        <p className="text-sm text-yellow-900">{dispute.details}</p>
                      </div>
                      {dispute.evidenceUrls && dispute.evidenceUrls.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {dispute.evidenceUrls.map((url, i) => url && (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Evidence {i + 1}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tutor Section */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-[#F0F7F4] rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-[#2D9B6E]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#2C3E50]">
                            Tutor: {dispute.session.tutor?.User?.firstName} {dispute.session.tutor?.User?.lastName}
                          </p>
                          <p className="text-xs text-[#95A5A6] flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {dispute.session.tutor?.User?.email}
                          </p>
                        </div>
                      </div>
                      {dispute.tutorResponse ? (
                        <>
                          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                            <p className="text-xs font-medium text-green-800 mb-1 flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              Tutor&apos;s response:
                            </p>
                            <p className="text-sm text-green-900">{dispute.tutorResponse}</p>
                          </div>
                          {dispute.tutorEvidenceUrls && dispute.tutorEvidenceUrls.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {dispute.tutorEvidenceUrls.map((url, i) => url && (
                                <a
                                  key={i}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800 bg-green-50 px-2 py-1 rounded"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Tutor Evidence {i + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                          <p className="text-sm text-gray-500 italic">Tutor has not responded yet</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {statusFilter === 'PENDING' && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-[#ECF0F1]">
                        <Button
                          size="sm"
                          onClick={() => setConfirmAction({ disputeId: dispute.id, action: 'refund' })}
                          isLoading={actionLoading === dispute.id}
                        >
                          <Euro className="w-4 h-4 mr-1" />
                          Refund Student
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setConfirmAction({ disputeId: dispute.id, action: 'dismiss' })}
                          isLoading={actionLoading === dispute.id}
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
                onClick={() => handleAction(confirmAction.disputeId, confirmAction.action)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                  confirmAction.action === 'dismiss' ? 'bg-gray-500 hover:bg-gray-600' : 'bg-[#2D9B6E] hover:bg-[#258a5e]'
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
