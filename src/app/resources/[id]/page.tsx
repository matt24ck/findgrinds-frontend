'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Star,
  Download,
  FileText,
  ChevronLeft,
  Check,
  ShoppingCart,
  Clock,
  Shield,
  Loader2,
  Flag,
  X,
} from 'lucide-react';
import { resources as resourcesApi } from '@/lib/api';

const subjectLabels: Record<string, string> = {
  MATHS: 'Maths',
  ENGLISH: 'English',
  IRISH: 'Irish',
  FRENCH: 'French',
  GERMAN: 'German',
  SPANISH: 'Spanish',
  BIOLOGY: 'Biology',
  CHEMISTRY: 'Chemistry',
  PHYSICS: 'Physics',
  GEOGRAPHY: 'Geography',
  HISTORY: 'History',
  BUSINESS: 'Business',
  ACCOUNTING: 'Accounting',
  ECONOMICS: 'Economics',
};

export default function ResourceDetailPage() {
  const params = useParams();
  const resourceId = params.id as string;
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/resources/${resourceId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Resource not found');
        }

        setResource(data.data);

        // Check ownership if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const ownershipRes = await fetch(`${apiUrl}/api/resources/${resourceId}/ownership`, {
              headers: { 'Authorization': `Bearer ${token}` },
            });
            const ownershipData = await ownershipRes.json();
            if (ownershipData.success && ownershipData.data.owned) {
              setIsPurchased(true);

              // Check report status
              try {
                const reportRes = await fetch(`${apiUrl}/api/resources/${resourceId}/report-status`, {
                  headers: { 'Authorization': `Bearer ${token}` },
                });
                const reportData = await reportRes.json();
                if (reportData.success && reportData.data.reported) {
                  setHasReported(true);
                }
              } catch {
                // Silently fail
              }
            }
          } catch {
            // Silently fail - user may not be logged in
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load resource');
      } finally {
        setLoading(false);
      }
    };

    if (resourceId) {
      fetchResource();
    }
  }, [resourceId]);

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = `/login?redirect=/resources/${resourceId}`;
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/resources/${resourceId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Purchase error:', err);
      setIsPurchasing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/resources/${resourceId}/download`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success && data.data.downloadUrl) {
        window.open(data.data.downloadUrl, '_blank');
      }
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleReport = async () => {
    if (!reportReason || reportLoading) return;
    setReportLoading(true);
    try {
      await resourcesApi.report(resourceId, reportReason, reportDetails || undefined);
      setHasReported(true);
      setShowReportModal(false);
      alert('Report submitted. Our team will review it shortly.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit report');
    } finally {
      setReportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#2D9B6E]" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#2C3E50] mb-2">Resource Not Found</h1>
            <p className="text-[#5D6D7E] mb-4">{error || 'The resource you are looking for does not exist.'}</p>
            <Link href="/resources">
              <Button>Browse Resources</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const levelLabel = resource.level === 'LC' ? 'Leaving Cert' : 'Junior Cert';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-[#5D6D7E] hover:text-[#2D9B6E] mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Resources
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Preview Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-[#F0F7F4] to-[#E8F5E9] flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <FileText className="w-12 h-12 text-[#2D9B6E]" />
                  </div>
                </div>
                <div className="p-6">
                  {/* Badges */}
                  <div className="flex gap-2 mb-3">
                    <Badge variant="primary">{levelLabel}</Badge>
                    <Badge variant="default">{subjectLabels[resource.subject] || resource.subject}</Badge>
                    <Badge variant="default">{resource.resourceType}</Badge>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl font-bold text-[#2C3E50] mb-4">
                    {resource.title}
                  </h1>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-[#2C3E50]">{resource.rating}</span>
                      <span className="text-[#95A5A6]">({resource.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#5D6D7E]">
                      <Download className="w-4 h-4" />
                      <span>{resource.salesCount} purchases</span>
                    </div>
                  </div>

                  {/* Description */}
                  {resource.description && (
                    <div className="prose prose-sm max-w-none">
                      <h3 className="text-lg font-bold text-[#2C3E50] mb-3">Description</h3>
                      <p className="text-[#5D6D7E] whitespace-pre-line">{resource.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                {/* Price */}
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-[#2D9B6E]">€{Number(resource.price).toFixed(2)}</span>
                </div>

                {/* Purchase/Download Button */}
                {isPurchased ? (
                  <div className="space-y-3">
                    <div className="bg-[#F0F7F4] rounded-lg p-4 text-center">
                      <Check className="w-8 h-8 text-[#2D9B6E] mx-auto mb-2" />
                      <p className="font-semibold text-[#2D9B6E]">Purchase Complete!</p>
                    </div>
                    <Button className="w-full" size="lg" onClick={handleDownload}>
                      <Download className="w-5 h-5 mr-2" />
                      Download Now
                    </Button>
                    {hasReported ? (
                      <p className="text-xs text-center text-[#95A5A6]">You have reported this resource</p>
                    ) : (
                      <button
                        onClick={() => setShowReportModal(true)}
                        className="w-full text-sm text-[#95A5A6] hover:text-red-500 flex items-center justify-center gap-1 py-2 transition-colors"
                      >
                        <Flag className="w-4 h-4" />
                        Report Resource
                      </button>
                    )}
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handlePurchase}
                    isLoading={isPurchasing}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Buy Now
                  </Button>
                )}

                {/* Features */}
                <div className="mt-6 pt-6 border-t border-[#ECF0F1] space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#5D6D7E]">
                    <Download className="w-5 h-5 text-[#2D9B6E]" />
                    <span>Instant download after purchase</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#5D6D7E]">
                    <Clock className="w-5 h-5 text-[#2D9B6E]" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#5D6D7E]">
                    <Shield className="w-5 h-5 text-[#2D9B6E]" />
                    <span>Secure payment via Stripe</span>
                  </div>
                </div>

                {/* Tutor Info */}
                {resource.tutor && (
                  <div className="mt-6 pt-6 border-t border-[#ECF0F1]">
                    <p className="text-sm text-[#95A5A6] mb-3">Created by</p>
                    <Link href={`/tutors/${resource.tutor.id}`}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F8F9FA] transition-colors">
                        <Avatar size="md" fallback={resource.tutor.User ? `${resource.tutor.User.firstName} ${resource.tutor.User.lastName}` : resource.tutor.headline || 'Tutor'} />
                        <div>
                          {resource.tutor.User ? (
                            <>
                              <div className="font-semibold text-[#2D9B6E] hover:underline">{resource.tutor.User.firstName} {resource.tutor.User.lastName}</div>
                              {resource.tutor.headline && (
                                <div className="text-sm text-[#5D6D7E]">{resource.tutor.headline}</div>
                              )}
                            </>
                          ) : (
                            <div className="font-semibold text-[#2D9B6E] hover:underline">{resource.tutor.headline || 'View Tutor'}</div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#2C3E50]">Report Resource</h3>
              <button onClick={() => setShowReportModal(false)} className="text-[#95A5A6] hover:text-[#2C3E50]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-[#5D6D7E] mb-4">
              If this resource is not as advertised, you can report it and request a refund.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-1">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full border border-[#ECF0F1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D9B6E]"
                >
                  <option value="">Select a reason...</option>
                  <option value="misleading_content">Misleading content</option>
                  <option value="poor_quality">Poor quality</option>
                  <option value="wrong_subject">Wrong subject</option>
                  <option value="incomplete">Incomplete</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-1">Details (optional)</label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  rows={3}
                  placeholder="Provide any additional details..."
                  className="w-full border border-[#ECF0F1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D9B6E] resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-2 border border-[#ECF0F1] rounded-lg text-sm text-[#5D6D7E] hover:bg-[#F8F9FA] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReport}
                  disabled={!reportReason || reportLoading}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reportLoading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
