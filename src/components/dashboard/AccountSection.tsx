'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { auth, gdpr } from '@/lib/api';
import { Download, Trash2, Lock, AlertTriangle } from 'lucide-react';

interface AccountSectionProps {
  userEmail: string;
}

export function AccountSection({ userEmail }: AccountSectionProps) {
  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Export state
  const [exportLoading, setExportLoading] = useState(false);

  // Delete state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleChangePassword = async () => {
    setPasswordMessage(null);

    if (!currentPassword || !newPassword) {
      setPasswordMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 8 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setPasswordLoading(true);
    try {
      await auth.changePassword(currentPassword, newPassword);
      setPasswordMessage({ type: 'success', text: 'Password changed successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMessage({ type: 'error', text: err.message || 'Failed to change password' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const data = await gdpr.exportData();
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `findgrinds-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExportLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteError('');
    setDeleteLoading(true);
    try {
      await gdpr.deleteAccount(deleteEmail, deleteReason || undefined);
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete account');
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#F0F7F4] rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-[#2D9B6E]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#2C3E50]">Change Password</h2>
            <p className="text-sm text-[#5D6D7E]">Update your account password</p>
          </div>
        </div>

        <div className="space-y-3 max-w-md">
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[#D5DBDB] focus:border-[#2D9B6E] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-4 py-2 rounded-lg border border-[#D5DBDB] focus:border-[#2D9B6E] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[#D5DBDB] focus:border-[#2D9B6E] focus:outline-none"
            />
          </div>

          {passwordMessage && (
            <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-[#2D9B6E]' : 'text-red-600'}`}>
              {passwordMessage.text}
            </p>
          )}

          <Button onClick={handleChangePassword} isLoading={passwordLoading}>
            Update Password
          </Button>
        </div>
      </div>

      {/* Export Data */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#F0F7F4] rounded-lg flex items-center justify-center">
            <Download className="w-5 h-5 text-[#2D9B6E]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#2C3E50]">Export My Data</h2>
            <p className="text-sm text-[#5D6D7E]">
              Download all personal data we hold about you (GDPR Article 20)
            </p>
          </div>
        </div>

        <p className="text-sm text-[#5D6D7E] mb-4">
          This includes your profile information, session history, resources, and transaction records.
          Passwords are never included. Payment card details are handled by Stripe and not stored by us.
        </p>

        <Button variant="secondary" onClick={handleExport} isLoading={exportLoading}>
          <Download className="w-4 h-4 mr-2" />
          Download My Data
        </Button>
      </div>

      {/* Delete Account */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-red-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-red-700">Delete Account</h2>
            <p className="text-sm text-[#5D6D7E]">Permanently remove your account and data</p>
          </div>
        </div>

        {!showDeleteConfirm ? (
          <Button
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete My Account
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">This action cannot be undone.</p>
                <p>
                  All your personal data will be permanently deleted. Some anonymised records
                  (transactions, session history) may be retained for legal and financial purposes.
                  You must cancel or complete any pending sessions before deleting your account.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Type your email to confirm: <span className="font-normal text-[#95A5A6]">{userEmail}</span>
              </label>
              <input
                type="email"
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                placeholder={userEmail}
                className="w-full px-4 py-2 rounded-lg border border-red-200 focus:border-red-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Reason for leaving <span className="font-normal text-[#95A5A6]">(optional)</span>
              </label>
              <textarea
                rows={2}
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#D5DBDB] focus:border-[#2D9B6E] focus:outline-none"
              />
            </div>

            {deleteError && (
              <p className="text-sm text-red-600">{deleteError}</p>
            )}

            <div className="flex gap-3">
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
                isLoading={deleteLoading}
                disabled={deleteEmail !== userEmail}
              >
                Permanently Delete Account
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteEmail('');
                  setDeleteReason('');
                  setDeleteError('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
