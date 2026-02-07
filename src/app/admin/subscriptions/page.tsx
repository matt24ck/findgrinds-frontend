'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { adminApi } from '@/lib/api';
import {
  CreditCard,
  ArrowLeft,
  Gift,
  CheckCircle,
  Crown,
  Eye,
  Filter,
  RotateCcw,
} from 'lucide-react';

interface Subscription {
  id: string;
  tutorId: string;
  tier: 'FREE' | 'VERIFIED' | 'PROFESSIONAL';
  isAdminGranted: boolean;
  adminGrantedReason?: string;
  stripeSubscriptionId?: string;
  status: string;
  tutor: {
    id: string;
    headline: string;
  } | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState('');
  const [adminGrantedFilter, setAdminGrantedFilter] = useState('');
  const [refundTarget, setRefundTarget] = useState<Subscription | null>(null);
  const [refundLoading, setRefundLoading] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, [tierFilter, adminGrantedFilter]);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (tierFilter) params.append('tier', tierFilter);
      if (adminGrantedFilter) params.append('isAdminGranted', adminGrantedFilter);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/subscriptions?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!refundTarget || refundLoading) return;
    setRefundLoading(true);
    try {
      const res = await adminApi.refundSubscription(refundTarget.id);
      alert(`Refund processed: €${res.data.amountRefunded.toFixed(2)} refunded. The tutor keeps their current subscription tier.`);
      setRefundTarget(null);
      fetchSubscriptions();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to process refund');
    } finally {
      setRefundLoading(false);
    }
  };

  const getTierBadge = (tier: string, isAdminGranted: boolean) => {
    const colors: Record<string, string> = {
      FREE: 'bg-gray-100 text-gray-800',
      VERIFIED: 'bg-green-100 text-green-800',
      PROFESSIONAL: 'bg-yellow-100 text-yellow-800',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${colors[tier]}`}>
        {tier === 'PROFESSIONAL' && <Crown className="w-3 h-3" />}
        {tier === 'VERIFIED' && <CheckCircle className="w-3 h-3" />}
        {tier}
        {isAdminGranted && <Gift className="w-3 h-3 ml-1 text-purple-600" />}
      </span>
    );
  };

  const adminGrantedCount = subscriptions.filter(s => s.isAdminGranted).length;
  const verifiedCount = subscriptions.filter(s => s.tier === 'VERIFIED').length;
  const professionalCount = subscriptions.filter(s => s.tier === 'PROFESSIONAL').length;

  return (
    <AdminGuard>
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-[#5D6D7E] hover:text-[#2D9B6E] mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#D4A574] rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2C3E50]">Subscription Management</h1>
              <p className="text-[#5D6D7E]">Manage tutor subscription tiers</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-[#2C3E50]">{subscriptions.length}</p>
              <p className="text-sm text-[#5D6D7E]">Total</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{verifiedCount}</p>
              <p className="text-sm text-[#5D6D7E]">Verified</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{professionalCount}</p>
              <p className="text-sm text-[#5D6D7E]">Professional</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">{adminGrantedCount}</p>
              <p className="text-sm text-[#5D6D7E]">Admin Granted</p>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <Filter className="w-5 h-5 text-[#5D6D7E]" />
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-3 py-2 border border-[#D5DBDB] rounded-lg text-sm"
              >
                <option value="">All Tiers</option>
                <option value="FREE">Free</option>
                <option value="VERIFIED">Verified</option>
                <option value="PROFESSIONAL">Professional</option>
              </select>

              <select
                value={adminGrantedFilter}
                onChange={(e) => setAdminGrantedFilter(e.target.value)}
                className="px-3 py-2 border border-[#D5DBDB] rounded-lg text-sm"
              >
                <option value="">All Sources</option>
                <option value="true">Admin Granted</option>
                <option value="false">Paid</option>
              </select>
            </div>
          </Card>

          {/* Subscriptions List */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F9FA] border-b border-[#ECF0F1]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2C3E50]">Tutor</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2C3E50]">Tier</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2C3E50]">Source</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2C3E50]">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-[#2C3E50]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECF0F1]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-[#5D6D7E]">
                        Loading...
                      </td>
                    </tr>
                  ) : subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-[#5D6D7E]">
                        No subscriptions found
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-[#F8F9FA]">
                        <td className="px-4 py-3">
                          {sub.user && (
                            <div>
                              <p className="font-medium text-[#2C3E50]">
                                {sub.user.firstName} {sub.user.lastName}
                              </p>
                              <p className="text-sm text-[#5D6D7E]">{sub.user.email}</p>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {getTierBadge(sub.tier, sub.isAdminGranted)}
                        </td>
                        <td className="px-4 py-3">
                          {sub.isAdminGranted ? (
                            <span className="inline-flex items-center gap-1 text-sm text-purple-600">
                              <Gift className="w-4 h-4" />
                              Admin Granted
                            </span>
                          ) : (
                            <span className="text-sm text-[#5D6D7E]">Paid</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            sub.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            sub.status === 'CANCELLED' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            {!sub.isAdminGranted && sub.status === 'ACTIVE' && sub.tier !== 'FREE' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setRefundTarget(sub)}
                                className="!text-orange-600 !border-orange-300 hover:!bg-orange-50"
                              >
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Refund
                              </Button>
                            )}
                            {sub.user && (
                              <Link href={`/admin/users/${sub.user.id}`}>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View User
                                </Button>
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">About Admin-Granted Tiers</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Admin-granted tiers give tutors free access to premium features</li>
              <li>• Use this for influencer partnerships or promotional offers</li>
              <li>• Granted tiers don't affect existing Stripe subscriptions</li>
              <li>• You can remove the grant at any time - they'll revert to paid/free</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Refund Confirmation Modal */}
      {refundTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-[#2C3E50] mb-2">Refund Subscription?</h3>
            <p className="text-sm text-[#5D6D7E] mb-1">
              This will refund the latest invoice payment for <strong>{refundTarget.user?.firstName} {refundTarget.user?.lastName}</strong> ({refundTarget.tier}).
            </p>
            <p className="text-sm text-[#5D6D7E] mb-4">
              The tutor will <strong>keep their current subscription tier</strong>. This is a goodwill refund only.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setRefundTarget(null)} disabled={refundLoading}>
                Cancel
              </Button>
              <Button
                className="flex-1 !bg-orange-600 hover:!bg-orange-700"
                onClick={handleRefund}
                isLoading={refundLoading}
              >
                Process Refund
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
    </AdminGuard>
  );
}
