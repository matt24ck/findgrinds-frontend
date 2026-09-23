'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Loader2 } from 'lucide-react';
import { tutorOffer, JoinLinkTutor, JOIN_CODE_KEY } from '@/lib/api';

export default function JoinPage() {
  const { code } = useParams<{ code: string }>();
  const [tutor, setTutor] = useState<JoinLinkTutor | null>(null);
  const [state, setState] = useState<'loading' | 'ok' | 'invalid'>('loading');

  useEffect(() => {
    tutorOffer
      .lookupJoinLink(code)
      .then((res) => {
        setTutor(res.data);
        setState('ok');
        // Remember the link so it still counts if they browse around before signing up.
        try {
          localStorage.setItem(JOIN_CODE_KEY, code);
        } catch {}
      })
      .catch(() => setState('invalid'));
  }, [code]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          {state === 'loading' && <Loader2 className="w-8 h-8 animate-spin text-[#2D9B6E] mx-auto" />}

          {state === 'invalid' && (
            <>
              <h1 className="text-xl font-bold text-[#2C3E50] mb-2">This link isn't valid</h1>
              <p className="text-[#5D6D7E] mb-6">Check with your tutor that you have the right link, or find a tutor on FindGrinds.</p>
              <Link href="/tutors">
                <Button>Browse tutors</Button>
              </Link>
            </>
          )}

          {state === 'ok' && tutor && (
            <>
              <div className="flex justify-center mb-4">
                <Avatar
                  src={tutor.profilePhotoUrl || undefined}
                  alt={`${tutor.firstName} ${tutor.lastName}`}
                  fallback={`${tutor.firstName[0] ?? ''}${tutor.lastName[0] ?? ''}`}
                  size="xl"
                />
              </div>
              <h1 className="text-2xl font-bold text-[#2C3E50]">
                {tutor.firstName} {tutor.lastName} has invited you to FindGrinds
              </h1>
              {tutor.headline && <p className="text-[#5D6D7E] mt-2">{tutor.headline}</p>}

              <p className="text-[#2C3E50] mt-6">
                Create your free account to book your lessons with {tutor.firstName} through FindGrinds: pay securely by card,
                join online lessons by video, and keep everything in one place.
              </p>

              <Link href={`/signup?join=${encodeURIComponent(code)}`} className="block mt-6">
                <Button size="lg" className="w-full">Create my account</Button>
              </Link>

              <p className="text-sm text-[#5D6D7E] mt-6">
                Already have an account?{' '}
                <Link href={`/tutors/${tutor.tutorId}`} className="text-[#2D9B6E] font-medium hover:underline">
                  Book {tutor.firstName} here
                </Link>
              </p>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
