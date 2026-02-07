'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(data => {
        const user = data.data || data;
        if (user.isAdmin) {
          setStatus('authorized');
        } else {
          setStatus('unauthorized');
          const path = user.userType === 'TUTOR' ? '/dashboard/tutor' : user.userType === 'PARENT' ? '/dashboard/parent' : '/dashboard/student';
          router.replace(path);
        }
      })
      .catch(() => {
        setStatus('unauthorized');
        router.replace('/login');
      });
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D9B6E]"></div>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return null;
  }

  return <>{children}</>;
}
