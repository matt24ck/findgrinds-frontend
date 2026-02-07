'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Check, Download, FileText, Loader2 } from 'lucide-react';

function ResourceSuccessContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const sessionId = searchParams.get('session_id');
  const resourceId = params.id as string;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Brief delay to allow webhook to process
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-[#2D9B6E] animate-spin mx-auto mb-4" />
            <p className="text-[#5D6D7E]">Processing your purchase...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-[#F0F7F4] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-[#2D9B6E]" />
          </div>

          <h1 className="text-3xl font-bold text-[#2C3E50] mb-4">Purchase Complete!</h1>

          <p className="text-[#5D6D7E] mb-8">
            Your resource is ready to download. You can access it anytime from the resource page.
          </p>

          <Button size="lg" className="w-full mb-4" onClick={handleDownload}>
            <Download className="w-5 h-5 mr-2" />
            Download Now
          </Button>

          <div className="flex gap-4">
            <Link href={`/resources/${resourceId}`} className="flex-1">
              <Button variant="secondary" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                View Resource
              </Button>
            </Link>
            <Link href="/resources" className="flex-1">
              <Button variant="secondary" className="w-full">
                Browse More
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ResourceSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-[#2D9B6E] animate-spin mx-auto mb-4" />
            <p className="text-[#5D6D7E]">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <ResourceSuccessContent />
    </Suspense>
  );
}
