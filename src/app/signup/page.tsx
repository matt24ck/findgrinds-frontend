'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BookOpen, Mail, Lock, User, GraduationCap, Users, Calendar } from 'lucide-react';

type UserType = 'STUDENT' | 'PARENT' | 'TUTOR';

const SUBJECTS = [
  'MATHS', 'ENGLISH', 'IRISH', 'FRENCH', 'GERMAN', 'SPANISH', 'ITALIAN',
  'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'AGRICULTURAL_SCIENCE',
  'BUSINESS', 'ECONOMICS', 'ACCOUNTING',
  'HISTORY', 'GEOGRAPHY', 'POLITICS_SOCIETY',
  'COMPUTER_SCIENCE', 'APPLIED_MATHS', 'DCG', 'ENGINEERING',
  'ART', 'MUSIC', 'HOME_ECONOMICS', 'RELIGIOUS_EDUCATION',
];

const LEVELS = ['JC', 'LC', 'BOTH'];

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    subjects: [] as string[],
    levels: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const userTypes = [
    {
      type: 'STUDENT' as UserType,
      icon: GraduationCap,
      title: 'Student',
      description: 'Find tutors and book sessions',
    },
    {
      type: 'PARENT' as UserType,
      icon: Users,
      title: 'Parent',
      description: 'Manage your child\'s grinds',
    },
    {
      type: 'TUTOR' as UserType,
      icon: BookOpen,
      title: 'Tutor',
      description: 'Offer grinds and sell resources',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth || undefined,
          subjects: formData.subjects,
          levels: formData.levels,
          userType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Store token and redirect
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Redirect based on user type
      if (userType === 'TUTOR') {
        window.location.href = '/dashboard/tutor';
      } else if (userType === 'PARENT') {
        window.location.href = '/dashboard/parent';
      } else {
        window.location.href = '/dashboard/student';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
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
            <h1 className="text-2xl font-bold text-[#2C3E50]">Create Account</h1>
            <p className="text-[#5D6D7E] mt-2">
              Join Ireland's leading grinds marketplace
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-[#2D9B6E] text-white' : 'bg-[#ECF0F1] text-[#95A5A6]'}`}>1</div>
            <div className={`w-12 h-1 rounded ${step >= 2 ? 'bg-[#2D9B6E]' : 'bg-[#ECF0F1]'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-[#2D9B6E] text-white' : 'bg-[#ECF0F1] text-[#95A5A6]'}`}>2</div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {step === 1 && (
              <div>
                <h2 className="text-lg font-bold text-[#2C3E50] mb-6 text-center">
                  I am a...
                </h2>
                <div className="space-y-3">
                  {userTypes.map((ut) => (
                    <button
                      key={ut.type}
                      onClick={() => {
                        setUserType(ut.type);
                        setStep(2);
                      }}
                      className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                        userType === ut.type
                          ? 'border-[#2D9B6E] bg-[#F0F7F4]'
                          : 'border-[#ECF0F1] hover:border-[#2D9B6E]'
                      }`}
                    >
                      <div className="w-12 h-12 bg-[#F0F7F4] rounded-lg flex items-center justify-center">
                        <ut.icon className="w-6 h-6 text-[#2D9B6E]" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-[#2C3E50]">{ut.title}</div>
                        <div className="text-sm text-[#5D6D7E]">{ut.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-[#95A5A6]" />
                    <Input
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                  <Input
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-[#95A5A6]" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[#95A5A6]" />
                  <Input
                    type="password"
                    placeholder="Password (min. 8 characters)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[#95A5A6]" />
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>

                {(userType === 'STUDENT' || userType === 'TUTOR') && (
                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-[#95A5A6]" />
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="pl-10"
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <p className="text-xs text-[#95A5A6] mt-1">
                      {userType === 'STUDENT' ? 'Used for safeguarding purposes' : 'Optional'}
                    </p>
                  </div>
                )}

                {userType === 'TUTOR' && (
                  <>
                    {/* Subject Selection */}
                    <div>
                      <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                        Subjects you teach <span className="text-[#5D6D7E] font-normal">(select all that apply)</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
                        {SUBJECTS.map((subject) => (
                          <label key={subject} className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.subjects.includes(subject)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({ ...formData, subjects: [...formData.subjects, subject] });
                                } else {
                                  setFormData({ ...formData, subjects: formData.subjects.filter(s => s !== subject) });
                                }
                              }}
                              className="w-4 h-4 rounded border-[#D5DBDB] text-[#2D9B6E] focus:ring-[#2D9B6E]"
                            />
                            <span className="text-[#2C3E50]">{subject.replace('_', ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Level Selection */}
                    <div>
                      <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                        Levels you teach
                      </label>
                      <div className="flex gap-4">
                        {LEVELS.map((level) => (
                          <label key={level} className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.levels.includes(level)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({ ...formData, levels: [...formData.levels, level] });
                                } else {
                                  setFormData({ ...formData, levels: formData.levels.filter(l => l !== level) });
                                }
                              }}
                              className="w-4 h-4 rounded border-[#D5DBDB] text-[#2D9B6E] focus:ring-[#2D9B6E]"
                            />
                            <span className="text-[#2C3E50]">
                              {level === 'JC' ? 'Junior Cert' : level === 'LC' ? 'Leaving Cert' : 'Both'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Garda Vetting Info */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Already Garda vetted?</span>
                        <br />
                        Professional teachers can upload proof of Garda vetting from their dashboard to display a verified badge.
                      </p>
                    </div>
                  </>
                )}

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 mt-0.5 rounded border-[#D5DBDB] text-[#2D9B6E] focus:ring-[#2D9B6E]"
                  />
                  <label htmlFor="terms" className="text-sm text-[#5D6D7E]">
                    I agree to the{' '}
                    <Link href="/terms" className="text-[#2D9B6E] hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-[#2D9B6E] hover:underline">Privacy Policy</Link>
                  </label>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" isLoading={isLoading}>
                    Create Account
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-[#5D6D7E]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#2D9B6E] font-semibold hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
