'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BookOpen, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { auth } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await auth.forgotPassword(email);
      setIsSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-[#2C3E50]">Reset Your Password</h1>
            <p className="text-[#5D6D7E] mt-2">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            {isSent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-[#F0F7F4] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-[#2D9B6E]" />
                </div>
                <h2 className="text-lg font-semibold text-[#2C3E50]">Check your email</h2>
                <p className="text-[#5D6D7E] text-sm">
                  If an account exists with <strong>{email}</strong>, we've sent a password reset link. Check your inbox and follow the instructions.
                </p>
                <p className="text-[#95A5A6] text-xs">
                  The link will expire in 1 hour. If you don't see the email, check your spam folder.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-[#2D9B6E] hover:underline text-sm font-medium mt-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-[#95A5A6]" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                    Send Reset Link
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-[#5D6D7E] hover:text-[#2D9B6E] text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
