'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  Shield,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  ArrowLeft
} from 'lucide-react';

interface Verification {
  id: string;
  documentName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

interface VerificationStatus {
  isVerified: boolean;
  selfDeclared: boolean;
  verifications: Verification[];
}

export default function TutorVerificationPage() {
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/verification/garda-vetting/status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStatus(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch verification status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF, JPG, or PNG file');
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      // In a real app, you'd upload to cloud storage (S3, etc.) first
      // For now, we'll simulate with a placeholder URL
      const documentUrl = `/uploads/garda-vetting/${Date.now()}-${selectedFile.name}`;

      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/verification/garda-vetting/upload`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            documentUrl,
            documentName: selectedFile.name,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setSuccess('Document uploaded successfully! It will be reviewed by our team.');
      setSelectedFile(null);
      fetchVerificationStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = (verificationStatus: string) => {
    switch (verificationStatus) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <CheckCircle className="w-3 h-3" /> Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const hasPendingVerification = status?.verifications.some(v => v.status === 'PENDING');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard/tutor"
            className="inline-flex items-center gap-2 text-[#5D6D7E] hover:text-[#2D9B6E] mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#2D9B6E] rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2C3E50]">Garda Vetted Badge</h1>
              <p className="text-[#5D6D7E]">Verification for professional teachers and tutors</p>
            </div>
          </div>

          {/* Explanation Card */}
          <Card className="p-6 mb-6 border-l-4 border-l-blue-500">
            <h2 className="text-lg font-semibold text-[#2C3E50] mb-3">Who can get verified?</h2>
            <p className="text-[#5D6D7E] mb-4">
              This verification is for tutors who are <strong>already Garda vetted</strong> through their employer,
              such as a school, tuition centre, or other organisation that works with children.
            </p>
            <div className="bg-[#F8F9FA] rounded-lg p-4">
              <p className="text-sm font-medium text-[#2C3E50] mb-2">Acceptable proof includes:</p>
              <ul className="text-sm text-[#5D6D7E] space-y-1">
                <li>• Garda Vetting Disclosure letter from the National Vetting Bureau</li>
                <li>• Confirmation letter from your employer confirming your vetting status</li>
                <li>• Teaching Council registration (which requires vetting)</li>
              </ul>
            </div>
            <p className="text-sm text-[#95A5A6] mt-4">
              Note: You cannot apply for Garda vetting independently. It must be done through an organisation
              registered with the National Vetting Bureau.
            </p>
          </Card>

          {isLoading ? (
            <Card className="p-8 text-center">
              <p className="text-[#5D6D7E]">Loading verification status...</p>
            </Card>
          ) : (
            <>
              {/* Current Status */}
              <Card className="p-6 mb-6">
                <h2 className="text-lg font-semibold text-[#2C3E50] mb-4">Your Status</h2>
                <div className="flex items-center gap-4">
                  {status?.isVerified ? (
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg flex-1">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-800">Verified</p>
                        <p className="text-sm text-green-700">
                          Your Garda vetting has been verified. A badge is displayed on your profile.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-[#F8F9FA] rounded-lg flex-1">
                      <AlertCircle className="w-8 h-8 text-[#95A5A6]" />
                      <div>
                        <p className="font-semibold text-[#2C3E50]">No Badge</p>
                        <p className="text-sm text-[#5D6D7E]">
                          Upload proof of your Garda vetting to display a verified badge on your profile.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Upload Section */}
              {!status?.isVerified && (
                <Card className="p-6 mb-6">
                  <h2 className="text-lg font-semibold text-[#2C3E50] mb-4">Upload Document</h2>

                  {hasPendingVerification ? (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Clock className="w-5 h-5" />
                        <p className="font-medium">You have a pending verification request</p>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        Please wait for our team to review your submission before uploading a new document.
                      </p>
                    </div>
                  ) : (
                    <>
                      {error && (
                        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      {success && (
                        <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg text-sm">
                          {success}
                        </div>
                      )}

                      <div className="border-2 border-dashed border-[#D5DBDB] rounded-lg p-8 text-center">
                        <Upload className="w-10 h-10 text-[#95A5A6] mx-auto mb-4" />
                        <p className="text-[#5D6D7E] mb-2">
                          Upload your Garda vetting certificate
                        </p>
                        <p className="text-sm text-[#95A5A6] mb-4">
                          Accepted formats: PDF, JPG, PNG (max 10MB)
                        </p>

                        <input
                          type="file"
                          id="document"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileSelect}
                          className="hidden"
                        />

                        <label
                          htmlFor="document"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8F9FA] text-[#5D6D7E] rounded-lg cursor-pointer hover:bg-[#ECF0F1] transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          Choose File
                        </label>

                        {selectedFile && (
                          <div className="mt-4 p-3 bg-[#F0F7F4] rounded-lg inline-flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#2D9B6E]" />
                            <span className="text-sm text-[#2C3E50]">{selectedFile.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Button
                          onClick={handleUpload}
                          disabled={!selectedFile || isUploading}
                          isLoading={isUploading}
                        >
                          Upload Document
                        </Button>
                      </div>
                    </>
                  )}
                </Card>
              )}

              {/* Verification History */}
              {status?.verifications && status.verifications.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-[#2C3E50] mb-4">Submission History</h2>
                  <div className="space-y-4">
                    {status.verifications.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[#5D6D7E]" />
                          <div>
                            <p className="font-medium text-[#2C3E50]">{v.documentName}</p>
                            <p className="text-sm text-[#95A5A6]">
                              Submitted {new Date(v.submittedAt).toLocaleDateString()}
                            </p>
                            {v.status === 'REJECTED' && v.reviewNotes && (
                              <p className="text-sm text-red-600 mt-1">
                                Reason: {v.reviewNotes}
                              </p>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(v.status)}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Info Section */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Benefits of the Garda Vetted badge</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Builds trust with parents looking for vetted tutors</li>
                  <li>• Verified tutors appear higher in search results</li>
                  <li>• Distinguishes you as a professional educator</li>
                  <li>• Shows your commitment to child safety</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
