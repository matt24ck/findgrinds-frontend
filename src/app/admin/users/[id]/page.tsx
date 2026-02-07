'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Crown,
  BookOpen,
  ArrowLeft,
  UserX,
  UserCheck,
  Trash2,
  CheckCircle,
  Gift
} from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'STUDENT' | 'PARENT' | 'TUTOR';
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  isAdmin: boolean;
  gardaVettingVerified: boolean;
  gardaVettingSelfDeclared: boolean;
  suspensionReason?: string;
  suspendedAt?: string;
  createdAt: string;
}

interface TutorProfile {
  id: string;
  headline: string;
  subjects: string[];
  baseHourlyRate: number;
  rating: number;
  reviewCount: number;
}

interface Subscription {
  id: string;
  tier: 'FREE' | 'VERIFIED' | 'PROFESSIONAL';
  isAdminGranted: boolean;
  adminGrantedReason?: string;
  status: string;
}

interface Stats {
  totalSessions?: number;
  totalResources?: number;
  totalBookings?: number;
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<UserData | null>(null);
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [tierReason, setTierReason] = useState('');
  const [showTierModal, setShowTierModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('');

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
        setTutorProfile(data.data.tutorProfile);
        setSubscription(data.data.subscription);
        setStats(data.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action: 'suspend' | 'unsuspend' | 'delete') => {
    const confirmMessage = {
      suspend: 'Are you sure you want to suspend this account?',
      unsuspend: 'Are you sure you want to reactivate this account?',
      delete: 'Are you sure you want to delete this account?',
    };

    if (!confirm(confirmMessage[action])) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/users/${userId}`;
      let method = 'PUT';

      if (action === 'suspend') url += '/suspend';
      else if (action === 'unsuspend') url += '/unsuspend';
      else if (action === 'delete') method = 'DELETE';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: action === 'suspend' ? JSON.stringify({ reason: 'Admin action' }) : undefined,
      });

      if (response.ok) {
        fetchUserDetails();
      } else {
        const data = await response.json();
        alert(data.error || 'Action failed');
      }
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetTier = async () => {
    if (!selectedTier) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/users/${userId}/tier`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tier: selectedTier, reason: tierReason }),
        }
      );

      if (response.ok) {
        setShowTierModal(false);
        setTierReason('');
        setSelectedTier('');
        fetchUserDetails();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to set tier');
      }
    } catch (err) {
      console.error('Failed to set tier:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveTier = async () => {
    if (!confirm('Remove admin-granted tier? User will revert to FREE or their paid tier.')) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/users/${userId}/tier`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        fetchUserDetails();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to remove tier');
      }
    } catch (err) {
      console.error('Failed to remove tier:', err);
    } finally {
      setActionLoading(false);
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
        {tier}
        {isAdminGranted && <Gift className="w-3 h-3" />}
      </span>
    );
  };

  if (isLoading) {
    return (
      <AdminGuard>
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[#5D6D7E]">Loading...</p>
        </main>
        <Footer />
      </div>
      </AdminGuard>
    );
  }

  if (!user) {
    return (
      <AdminGuard>
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[#5D6D7E]">User not found</p>
        </main>
        <Footer />
      </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-[#5D6D7E] hover:text-[#2D9B6E] mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </Link>

          {/* User Header */}
          <Card className="p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#F0F7F4] rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-[#2D9B6E]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#2C3E50]">
                    {user.firstName} {user.lastName}
                    {user.isAdmin && (
                      <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        Admin
                      </span>
                    )}
                  </h1>
                  <p className="text-[#5D6D7E] flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.accountStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      user.accountStatus === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.accountStatus}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {user.userType}
                    </span>
                    {user.gardaVettingVerified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Garda Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {!user.isAdmin && (
                <div className="flex gap-2">
                  {user.accountStatus === 'ACTIVE' && (
                    <Button
                      variant="outline"
                      onClick={() => handleAction('suspend')}
                      disabled={actionLoading}
                      className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Suspend
                    </Button>
                  )}
                  {user.accountStatus === 'SUSPENDED' && (
                    <Button
                      variant="outline"
                      onClick={() => handleAction('unsuspend')}
                      disabled={actionLoading}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Reactivate
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleAction('delete')}
                    disabled={actionLoading}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            {user.accountStatus === 'SUSPENDED' && user.suspensionReason && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Suspension Reason:</strong> {user.suspensionReason}
                </p>
                {user.suspendedAt && (
                  <p className="text-xs text-red-600 mt-1">
                    Suspended on {new Date(user.suspendedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </Card>

          {/* Account Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[#2C3E50] mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Account Details
              </h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-[#5D6D7E]">User ID</dt>
                  <dd className="text-sm font-mono text-[#2C3E50]">{user.id}</dd>
                </div>
                <div>
                  <dt className="text-sm text-[#5D6D7E]">Joined</dt>
                  <dd className="text-[#2C3E50]">{new Date(user.createdAt).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-sm text-[#5D6D7E]">Garda Vetting Self-Declared</dt>
                  <dd className="text-[#2C3E50]">{user.gardaVettingSelfDeclared ? 'Yes' : 'No'}</dd>
                </div>
              </dl>
            </Card>

            {stats && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-[#2C3E50] mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Statistics
                </h2>
                <dl className="space-y-3">
                  {stats.totalSessions !== undefined && (
                    <div className="flex justify-between">
                      <dt className="text-[#5D6D7E]">Total Sessions</dt>
                      <dd className="font-semibold text-[#2C3E50]">{stats.totalSessions}</dd>
                    </div>
                  )}
                  {stats.totalResources !== undefined && (
                    <div className="flex justify-between">
                      <dt className="text-[#5D6D7E]">Resources Created</dt>
                      <dd className="font-semibold text-[#2C3E50]">{stats.totalResources}</dd>
                    </div>
                  )}
                  {stats.totalBookings !== undefined && (
                    <div className="flex justify-between">
                      <dt className="text-[#5D6D7E]">Bookings Made</dt>
                      <dd className="font-semibold text-[#2C3E50]">{stats.totalBookings}</dd>
                    </div>
                  )}
                </dl>
              </Card>
            )}
          </div>

          {/* Tutor-specific sections */}
          {user.userType === 'TUTOR' && (
            <>
              {/* Subscription/Tier Management */}
              <Card className="p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#2C3E50] flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Subscription Tier
                  </h2>
                  <div className="flex gap-2">
                    <Button onClick={() => setShowTierModal(true)}>
                      <Gift className="w-4 h-4 mr-2" />
                      Grant Tier
                    </Button>
                    {subscription?.isAdminGranted && (
                      <Button variant="outline" onClick={handleRemoveTier} disabled={actionLoading}>
                        Remove Grant
                      </Button>
                    )}
                  </div>
                </div>

                {subscription ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="text-[#5D6D7E]">Current Tier:</span>
                      {getTierBadge(subscription.tier, subscription.isAdminGranted)}
                    </div>
                    {subscription.isAdminGranted && subscription.adminGrantedReason && (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Grant Reason:</strong> {subscription.adminGrantedReason}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[#5D6D7E]">No subscription (FREE tier by default)</p>
                )}
              </Card>

              {/* Tutor Profile */}
              {tutorProfile && (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-[#2C3E50] mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Tutor Profile
                  </h2>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-[#5D6D7E]">Headline</dt>
                      <dd className="text-[#2C3E50]">{tutorProfile.headline || 'Not set'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-[#5D6D7E]">Subjects</dt>
                      <dd className="text-[#2C3E50]">{tutorProfile.subjects?.join(', ') || 'None'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-[#5D6D7E]">Hourly Rate</dt>
                      <dd className="text-[#2C3E50]">€{tutorProfile.baseHourlyRate}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-[#5D6D7E]">Rating</dt>
                      <dd className="text-[#2C3E50]">
                        {tutorProfile.rating ? `${tutorProfile.rating} (${tutorProfile.reviewCount} reviews)` : 'No ratings'}
                      </dd>
                    </div>
                  </dl>
                </Card>
              )}
            </>
          )}
        </div>
      </main>

      {/* Tier Grant Modal */}
      {showTierModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Grant Subscription Tier</h3>
            <p className="text-sm text-[#5D6D7E] mb-4">
              Grant this tutor free access to a premium tier. This won't affect their existing payments.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2">Select Tier</label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5DBDB] rounded-lg"
                >
                  <option value="">Select a tier...</option>
                  <option value="VERIFIED">Verified (€19/mo value)</option>
                  <option value="PROFESSIONAL">Professional (€99/mo value)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                  Reason (for records)
                </label>
                <textarea
                  value={tierReason}
                  onChange={(e) => setTierReason(e.target.value)}
                  placeholder="e.g., Influencer partnership, Early adopter reward..."
                  className="w-full px-3 py-2 border border-[#D5DBDB] rounded-lg resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowTierModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSetTier} disabled={!selectedTier || actionLoading} isLoading={actionLoading}>
                Grant Tier
              </Button>
            </div>
          </Card>
        </div>
      )}

      <Footer />
    </div>
    </AdminGuard>
  );
}
