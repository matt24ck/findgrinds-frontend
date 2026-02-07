'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Cookie, X } from 'lucide-react';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      try {
        setPreferences(JSON.parse(consent));
      } catch {
        setShowBanner(true);
      }
    }
  }, []);

  const saveConsent = (accepted: boolean) => {
    const consentData = accepted
      ? { necessary: true, analytics: true, marketing: true }
      : { necessary: true, analytics: preferences.analytics, marketing: preferences.marketing };

    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setPreferences(consentData);
    setShowBanner(false);
    setShowPreferences(false);

    // Trigger consent event for analytics tools
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: consentData }));
    }
  };

  const savePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    setShowPreferences(false);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: preferences }));
    }
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Main Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-[#ECF0F1] shadow-lg">
        <div className="max-w-7xl mx-auto">
          {!showPreferences ? (
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="w-6 h-6 text-[#2D9B6E] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-[#2C3E50] mb-1">We value your privacy</h3>
                  <p className="text-sm text-[#5D6D7E]">
                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                    By clicking "Accept All", you consent to our use of cookies.{' '}
                    <Link href="/privacy" className="text-[#2D9B6E] hover:underline">
                      Read our Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreferences(true)}
                >
                  Customize
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => saveConsent(false)}
                >
                  Reject All
                </Button>
                <Button
                  size="sm"
                  onClick={() => saveConsent(true)}
                >
                  Accept All
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#2C3E50]">Cookie Preferences</h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="p-1 text-[#5D6D7E] hover:text-[#2C3E50]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between gap-4 p-3 bg-[#F8F9FA] rounded-lg">
                  <div>
                    <h4 className="font-medium text-[#2C3E50]">Necessary Cookies</h4>
                    <p className="text-sm text-[#5D6D7E]">
                      Required for the website to function. Cannot be disabled.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-5 h-5 mt-1 rounded border-[#D5DBDB] text-[#2D9B6E]"
                  />
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between gap-4 p-3 bg-[#F8F9FA] rounded-lg">
                  <div>
                    <h4 className="font-medium text-[#2C3E50]">Analytics Cookies</h4>
                    <p className="text-sm text-[#5D6D7E]">
                      Help us understand how visitors use our website.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="w-5 h-5 mt-1 rounded border-[#D5DBDB] text-[#2D9B6E] focus:ring-[#2D9B6E]"
                  />
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between gap-4 p-3 bg-[#F8F9FA] rounded-lg">
                  <div>
                    <h4 className="font-medium text-[#2C3E50]">Marketing Cookies</h4>
                    <p className="text-sm text-[#5D6D7E]">
                      Used to deliver relevant advertisements and track campaigns.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="w-5 h-5 mt-1 rounded border-[#D5DBDB] text-[#2D9B6E] focus:ring-[#2D9B6E]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => setShowPreferences(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={savePreferences}>
                  Save Preferences
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
