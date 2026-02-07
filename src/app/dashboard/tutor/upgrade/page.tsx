'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Star,
  Check,
  ChevronLeft,
  CheckCircle,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { stripeApi } from '@/lib/api';

type Tier = 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';

const TIER_ORDER: Tier[] = ['FREE', 'PROFESSIONAL', 'ENTERPRISE'];

const allTiers = [
  {
    id: 'FREE' as Tier,
    name: 'Free',
    price: 0,
    icon: CheckCircle,
    color: '#5D6D7E',
    description: 'Basic profile and unlimited bookings',
    features: [
      'Create a tutor profile',
      'Accept unlimited bookings',
      'Sell educational resources',
      'Collect reviews and ratings',
    ],
  },
  {
    id: 'PROFESSIONAL' as Tier,
    name: 'Professional',
    price: 19,
    icon: CheckCircle,
    color: '#2D9B6E',
    description: 'Get noticed by more students',
    features: [
      'Everything in Free',
      'Green verified tick on profile',
      '"Professional Tutor" badge',
      'Priority in search results',
      'Priority email support',
    ],
  },
  {
    id: 'ENTERPRISE' as Tier,
    name: 'Enterprise',
    price: 99,
    icon: CheckCircle,
    color: '#D4A574',
    description: 'For tutors employed in grinds schools',
    features: [
      'Everything in Professional',
      'Gold verified tick on profile',
      '"Enterprise Tutor" badge',
      'Top placement in all search results',
      'Link your profile to your organisation',
    ],
  },
];

export default function UpgradePage() {
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTier, setCurrentTier] = useState<Tier>('FREE');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTier = async () => {
      try {
        const data = await stripeApi.getMySubscription();
        if (data.tier && TIER_ORDER.includes(data.tier as Tier)) {
          setCurrentTier(data.tier as Tier);
        }
      } catch (err) {
        console.error('Failed to fetch subscription:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTier();
  }, []);

  const availableTiers = useMemo(
    () => allTiers.filter(t => t.id !== currentTier),
    [currentTier]
  );

  const isUpgrade = (tierId: Tier) => {
    return TIER_ORDER.indexOf(tierId) > TIER_ORDER.indexOf(currentTier);
  };

  const handleAction = async () => {
    if (!selectedTier) return;

    setIsProcessing(true);
    try {
      if (selectedTier === 'FREE') {
        // Downgrade: cancel existing subscription
        await stripeApi.cancelSubscription();
        window.location.href = '/dashboard/tutor?subscription=cancelled';
      } else {
        // Upgrade: redirect to Stripe checkout
        const data = await stripeApi.checkoutSubscription(selectedTier);
        if (data.url) {
          window.location.href = data.url;
        }
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      setIsProcessing(false);
    }
  };

  const currentTierName = allTiers.find(t => t.id === currentTier)?.name || 'Free';
  const selectedTierData = allTiers.find(t => t.id === selectedTier);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/dashboard/tutor"
            className="inline-flex items-center gap-2 text-[#5D6D7E] hover:text-[#2D9B6E] mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="featured" className="mb-4">Subscription Plans</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">
              Change Your Plan
            </h1>
            <p className="text-lg text-[#5D6D7E] max-w-2xl mx-auto">
              Featured tutors appear at the top of search results and get significantly more bookings.
            </p>
            {!isLoading && (
              <p className="text-sm text-[#95A5A6] mt-3">
                Current plan: <span className="font-medium text-[#2C3E50]">{currentTierName}</span>
              </p>
            )}
          </div>

          {/* Tier Cards */}
          {isLoading ? (
            <div className="text-center py-12 text-[#5D6D7E]">Loading...</div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
                {availableTiers.map(tier => {
                  const isSelected = selectedTier === tier.id;
                  const Icon = tier.icon;
                  const upgrading = isUpgrade(tier.id);

                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      className={`relative bg-white rounded-xl p-6 cursor-pointer transition-all ${
                        isSelected
                          ? 'ring-2 ring-[#2D9B6E] shadow-lg'
                          : 'border border-[#ECF0F1] hover:border-[#2D9B6E] hover:shadow-md'
                      }`}
                    >
                      {/* Upgrade/Downgrade indicator */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        {upgrading ? (
                          <span className="inline-flex items-center gap-1 bg-[#2D9B6E] text-white text-xs font-medium px-3 py-1 rounded-full">
                            <ArrowUp className="w-3 h-3" />
                            Upgrade
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-[#95A5A6] text-white text-xs font-medium px-3 py-1 rounded-full">
                            <ArrowDown className="w-3 h-3" />
                            Downgrade
                          </span>
                        )}
                      </div>

                      {/* Header */}
                      <div className="text-center mb-6 pt-2">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                          style={{ backgroundColor: `${tier.color}15` }}
                        >
                          <Icon className="w-8 h-8" style={{ color: tier.color }} />
                        </div>
                        <h3 className="text-xl font-bold text-[#2C3E50]">{tier.name}</h3>
                        <p className="text-sm text-[#5D6D7E] mt-1">{tier.description}</p>
                      </div>

                      {/* Price */}
                      <div className="text-center mb-6">
                        <span className="text-4xl font-bold text-[#2C3E50]">
                          {tier.price === 0 ? 'Free' : `\u20AC${tier.price}`}
                        </span>
                        {tier.price > 0 && <span className="text-[#95A5A6]">/month</span>}
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 mb-6">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-[#2D9B6E] flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-[#5D6D7E]">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Select Button */}
                      <Button
                        variant={isSelected ? 'primary' : 'secondary'}
                        className="w-full"
                      >
                        {isSelected ? 'Selected' : 'Select Plan'}
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              {selectedTier && selectedTierData && (
                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={handleAction}
                    isLoading={isProcessing}
                    className="min-w-[200px]"
                  >
                    {isUpgrade(selectedTier) ? (
                      <>
                        <Star className="w-5 h-5 mr-2" />
                        Upgrade to {selectedTierData.name}
                      </>
                    ) : (
                      <>
                        <ArrowDown className="w-5 h-5 mr-2" />
                        Downgrade to {selectedTierData.name}
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-[#95A5A6] mt-4">
                    {isUpgrade(selectedTier)
                      ? 'Cancel anytime. Billing starts immediately.'
                      : 'Your current plan will remain active until the end of the billing period.'}
                  </p>
                </div>
              )}
            </>
          )}

          {/* FAQ */}
          <div className="mt-16 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#2C3E50] text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-[#2C3E50] mb-2">How does Featured placement work?</h3>
                <p className="text-[#5D6D7E] text-sm">
                  Featured tutors appear at the top of search results for their chosen subjects. The higher your tier, the higher your placement and the more subjects you can feature.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-[#2C3E50] mb-2">Can I cancel anytime?</h3>
                <p className="text-[#5D6D7E] text-sm">
                  Yes! You can cancel your subscription at any time. Your Featured status will remain active until the end of your current billing period.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-[#2C3E50] mb-2">Do I keep my reviews and ratings?</h3>
                <p className="text-[#5D6D7E] text-sm">
                  Absolutely. Your reviews, ratings, and booking history remain unchanged. Featured status simply increases your visibility in search results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
