'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  UserX,
  UserCheck,
  Trash2,
  ArrowLeft
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'STUDENT' | 'PARENT' | 'TUTOR';
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  isAdmin: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, userTypeFilter, statusFilter]);

  const fetchUsers = async (searchQuery?: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      });

      if (searchQuery || search) params.append('search', searchQuery || search);
      if (userTypeFilter) params.append('userType', userTypeFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/users?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data.users);
        setPagination(data.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers(search);
  };

  const handleAction = async (userId: string, action: 'suspend' | 'unsuspend' | 'delete') => {
    const confirmMessage = {
      suspend: 'Are you sure you want to suspend this account?',
      unsuspend: 'Are you sure you want to reactivate this account?',
      delete: 'Are you sure you want to delete this account? This action cannot be undone.',
    };

    if (!confirm(confirmMessage[action])) return;

    try {
      const token = localStorage.getItem('token');
      let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/users/${userId}`;
      let method = 'PUT';

      if (action === 'suspend') {
        url += '/suspend';
      } else if (action === 'unsuspend') {
        url += '/unsuspend';
      } else if (action === 'delete') {
        method = 'DELETE';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: action === 'suspend' ? JSON.stringify({ reason: 'Admin action' }) : undefined,
      });

      if (response.ok) {
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || 'Action failed');
      }
    } catch (err) {
      console.error('Action failed:', err);
      alert('Action failed');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      SUSPENDED: 'bg-red-100 text-red-800',
      DELETED: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || ''}`}>
        {status}
      </span>
    );
  };

  const getUserTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      TUTOR: 'bg-blue-100 text-blue-800',
      STUDENT: 'bg-purple-100 text-purple-800',
      PARENT: 'bg-orange-100 text-orange-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type] || ''}`}>
        {type}
      </span>
    );
  };

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
            <div className="w-12 h-12 bg-[#3498DB] rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2C3E50]">User Management</h1>
              <p className="text-[#5D6D7E]">
                {pagination ? `${pagination.total} total users` : 'Loading...'}
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#95A5A6]" />
                  <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>

              <div className="flex gap-2">
                <select
                  value={userTypeFilter}
                  onChange={(e) => {
                    setUserTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-[#D5DBDB] rounded-lg text-sm"
                >
                  <option value="">All Types</option>
                  <option value="TUTOR">Tutors</option>
                  <option value="STUDENT">Students</option>
                  <option value="PARENT">Parents</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-[#D5DBDB] rounded-lg text-sm"
                >
                  <option value="">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="DELETED">Deleted</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Users Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F9FA] border-b border-[#ECF0F1]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2C3E50]">User</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2C3E50]">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2C3E50]">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2C3E50]">Joined</th>
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
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-[#5D6D7E]">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-[#F8F9FA]">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-[#2C3E50]">
                              {user.firstName} {user.lastName}
                              {user.isAdmin && (
                                <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                                  Admin
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-[#5D6D7E]">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">{getUserTypeBadge(user.userType)}</td>
                        <td className="px-4 py-3">{getStatusBadge(user.accountStatus)}</td>
                        <td className="px-4 py-3 text-sm text-[#5D6D7E]">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/users/${user.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            {user.accountStatus === 'ACTIVE' && !user.isAdmin && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAction(user.id, 'suspend')}
                                className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                              >
                                <UserX className="w-4 h-4" />
                              </Button>
                            )}
                            {user.accountStatus === 'SUSPENDED' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAction(user.id, 'unsuspend')}
                                className="text-green-600 border-green-200 hover:bg-green-50"
                              >
                                <UserCheck className="w-4 h-4" />
                              </Button>
                            )}
                            {!user.isAdmin && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAction(user.id, 'delete')}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-4 py-3 border-t border-[#ECF0F1] flex items-center justify-between">
                <p className="text-sm text-[#5D6D7E]">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
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
