'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Card } from '@/components/ui/Card';
import {
  Users,
  Shield,
  CreditCard,
  BarChart3,
  UserCheck,
  UserX,
  Crown,
  TrendingUp,
  Flag,
  FileText,
} from 'lucide-react';

interface Stats {
  users: {
    total: number;
    tutors: number;
    students: number;
    suspended: number;
  };
  subscriptions: {
    enterprise: number;
    professional: number;
    adminGranted: number;
  };
  sessions: {
    total: number;
    completed: number;
  };
  reports?: {
    pending: number;
  };
  resourceReports?: {
    pending: number;
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, reportsRes, resourceReportsRes] = await Promise.all([
        fetch(`${baseUrl}/api/admin/stats`, { headers }),
        fetch(`${baseUrl}/api/messages/admin/reports?status=PENDING`, { headers }),
        fetch(`${baseUrl}/api/admin/resources/reports?status=PENDING`, { headers }),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        const statsData = data.data;

        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          statsData.reports = { pending: reportsData.count || 0 };
        }

        if (resourceReportsRes.ok) {
          const resourceReportsData = await resourceReportsRes.json();
          statsData.resourceReports = { pending: resourceReportsData.count || 0 };
        }

        setStats(statsData);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const adminLinks = [
    {
      href: '/admin/users',
      icon: Users,
      title: 'User Management',
      description: 'View, suspend, or remove user accounts',
      color: '#3498DB',
    },
    {
      href: '/admin/verifications',
      icon: Shield,
      title: 'Garda Verifications',
      description: 'Review Garda vetting submissions',
      color: '#2D9B6E',
    },
    {
      href: '/admin/subscriptions',
      icon: CreditCard,
      title: 'Subscriptions',
      description: 'Manage tutor subscription tiers',
      color: '#D4A574',
    },
    {
      href: '/admin/reports',
      icon: Flag,
      title: 'Message Reports',
      description: 'Review reported messages and take action',
      color: '#E74C3C',
    },
    {
      href: '/admin/resource-reports',
      icon: FileText,
      title: 'Resource Reports',
      description: 'Review reported resources and process refunds',
      color: '#E67E22',
    },
  ];

  return (
    <AdminGuard>
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#2C3E50] rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2C3E50]">Admin Dashboard</h1>
              <p className="text-[#5D6D7E]">Manage your platform</p>
            </div>
          </div>

          {/* Stats Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </Card>
              ))}
            </div>
          ) : stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2C3E50]">{stats.users.total}</p>
                    <p className="text-sm text-[#5D6D7E]">Total Users</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2C3E50]">{stats.users.tutors}</p>
                    <p className="text-sm text-[#5D6D7E]">Tutors</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Crown className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2C3E50]">
                      {stats.subscriptions.professional + stats.subscriptions.enterprise}
                    </p>
                    <p className="text-sm text-[#5D6D7E]">Paid Subscriptions</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <UserX className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2C3E50]">{stats.users.suspended}</p>
                    <p className="text-sm text-[#5D6D7E]">Suspended</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#5D6D7E]">Admin-granted tiers</span>
                  <span className="font-bold text-[#D4A574]">{stats.subscriptions.adminGranted}</span>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#5D6D7E]">Total Sessions</span>
                  <span className="font-bold text-[#2C3E50]">{stats.sessions.total}</span>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#5D6D7E]">Completed Sessions</span>
                  <span className="font-bold text-green-600">{stats.sessions.completed}</span>
                </div>
              </Card>
              <Link href="/admin/reports">
                <Card className={`p-4 ${(stats.reports?.pending || 0) > 0 ? 'border-red-200 bg-red-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[#5D6D7E]">Pending Msg Reports</span>
                    <span className={`font-bold ${(stats.reports?.pending || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {stats.reports?.pending || 0}
                    </span>
                  </div>
                </Card>
              </Link>
              <Link href="/admin/resource-reports">
                <Card className={`p-4 ${(stats.resourceReports?.pending || 0) > 0 ? 'border-orange-200 bg-orange-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[#5D6D7E]">Resource Reports</span>
                    <span className={`font-bold ${(stats.resourceReports?.pending || 0) > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {stats.resourceReports?.pending || 0}
                    </span>
                  </div>
                </Card>
              </Link>
            </div>
          )}

          {/* Admin Links */}
          <h2 className="text-lg font-semibold text-[#2C3E50] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${link.color}15` }}
                  >
                    <link.icon className="w-6 h-6" style={{ color: link.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">{link.title}</h3>
                  <p className="text-sm text-[#5D6D7E]">{link.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
    </AdminGuard>
  );
}
