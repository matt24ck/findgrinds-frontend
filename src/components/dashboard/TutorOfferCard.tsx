'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Gift, Copy, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { tutorOffer, TutorOfferStatus } from '@/lib/api';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Dublin' });

// Offer boundaries are exclusive (e.g. 1 July 00:00); show the last day that still counts.
const formatLastDay = (exclusiveEnd: string) => formatDate(new Date(new Date(exclusiveEnd).getTime() - 1).toISOString());

/**
 * Tutor offer (Sept 2026): the tutor's personal join link (0% fees for students who sign up
 * through it) and the free Professional month they unlock by bringing a student before 31 Oct.
 */
export function TutorOfferCard() {
  const [status, setStatus] = useState<TutorOfferStatus | null>(null);
  const [copied, setCopied] = useState(false);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    tutorOffer.getStatus().then((res) => setStatus(res.data)).catch(() => setStatus(null));
  }, []);

  if (!status) return null;

  const joinUrl = `${window.location.origin}/join/${status.inviteCode}`;
  const offerOver = new Date() >= new Date(status.feeWaiverEndsAt);
  const { proMonth } = status;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the link is visible to copy by hand.
    }
  };

  const activate = async () => {
    setActivating(true);
    setError('');
    try {
      // Stripe Checkout for the Professional plan with a 30-day free trial
      const res = await tutorOffer.activateProMonth();
      window.location.href = res.data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start your free month');
      setActivating(false);
    }
  };

  const proMonthActive = proMonth.endsAt && new Date(proMonth.endsAt) > new Date();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#2D9B6E]/20">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-[#F0F7F4] rounded-lg flex items-center justify-center flex-shrink-0">
          <Gift className="w-5 h-5 text-[#2D9B6E]" />
        </div>
        <div>
          <h3 className="font-semibold text-[#2C3E50]">Bring your students, pay 0% fees</h3>
          <p className="text-sm text-[#5D6D7E] mt-1">
            {offerOver
              ? 'This offer has ended.'
              : <>You pay no FindGrinds platform fee on lessons with students who sign up with your link (or whose parent does), for lessons scheduled up to {formatLastDay(status.feeWaiverEndsAt)}. Lessons with students who find you some other way carry the usual 15% fee. Resource sales are always 15%.</>}
          </p>
        </div>
      </div>

      {!offerOver && (
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            readOnly
            value={joinUrl}
            onFocus={(e) => e.target.select()}
            className="flex-1 min-w-0 px-3 py-2 text-sm bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#2C3E50]"
            aria-label="Your join link"
          />
          <Button size="sm" onClick={copyLink} className="flex-shrink-0">
            {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? 'Copied' : 'Copy link'}
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#5D6D7E] mb-4">
        <span><strong className="text-[#2C3E50]">{status.referredCount}</strong> joined with your link</span>
        <span><strong className="text-[#2C3E50]">{status.feeWaivedBookings}</strong> fee-free bookings</span>
      </div>

      <div className="p-4 bg-[#F8F9FA] rounded-lg flex flex-col sm:flex-row sm:items-center gap-3">
        <Star className="w-5 h-5 text-[#D4A574] flex-shrink-0" />
        <div className="flex-1 text-sm">
          <p className="font-medium text-[#2C3E50]">Free month of Professional</p>
          <p className="text-[#5D6D7E]">
            {proMonthActive && (
              <>
                Free until {formatDate(proMonth.endsAt!)}, then €19/month unless you cancel before then.{' '}
                <Link href="/dashboard/tutor/upgrade" className="text-[#2D9B6E] font-medium hover:underline">
                  Manage plan
                </Link>
              </>
            )}
            {!proMonthActive && proMonth.activatedAt && <>You've used your free month.</>}
            {!proMonth.activatedAt && proMonth.canActivate && (
              <>Unlocked! Start it whenever suits you, up to {formatLastDay(status.feeWaiverEndsAt)}. Free for 30 days (you&apos;ll need to add a card), then €19/month. Cancel before the 30 days are up and you won&apos;t be charged.</>
            )}
            {proMonth.blockedReason === 'not_qualified' && (
              <>Unlocks when a student who joined with your link books and pays for a lesson with you by {formatLastDay(proMonth.qualifyBy)}.</>
            )}
            {proMonth.blockedReason === 'deadline_passed' && <>The deadline to unlock this has passed.</>}
            {proMonth.blockedReason === 'already_on_paid_plan' && <>Unlocked, but you're already on a paid plan.</>}
            {proMonth.blockedReason === 'offer_ended' && <>This offer has ended.</>}
          </p>
          {error && <p className="text-red-600 mt-1">{error}</p>}
        </div>
        {proMonth.canActivate && (
          <Button size="sm" onClick={activate} isLoading={activating} className="flex-shrink-0">
            Start free month
          </Button>
        )}
      </div>
    </div>
  );
}
