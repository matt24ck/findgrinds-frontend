'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BookOpen, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { auth } from '@/lib/api';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-[#2C3E50]">Invalid Reset Link</h2>
        <p className="text-[#5D6D7E] text-sm">
          This password reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block text-[#2D9B6E] hover:underline text-sm font-medium"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await auth.resetPassword(token, newPassword);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-[#F0F7F4] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-[#2D9B6E]" />
        </div>
        <h2 className="text-lg font-semibold text-[#2C3E50]">Password Reset Successfully</h2>
        <p className="text-[#5D6D7E] text-sm">
          Your password has been updated. You can now log in with your new password.
        </p>
        <Link
          href="/login"
          className="inline-block bg-[#2D9B6E] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#25A876] transition-colors mt-2"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="relative">
        <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[#95A5A6]" />
        <Input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="pl-10"
          required
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[#95A5A6]" />
        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="pl-10"
          required
        />
      </div>

      <p className="text-xs text-[#95A5A6]">
        Password must be at least 8 characters long.
      </p>

      <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
        Reset Password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-[#2D9B6E] rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-[#2C3E50]">Set New Password</h1>
            <p className="text-[#5D6D7E] mt-2">
              Enter your new password below
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <Suspense fallback={<div className="text-center text-[#5D6D7E]">Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
