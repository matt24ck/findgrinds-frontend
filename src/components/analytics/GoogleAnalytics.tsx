'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const GA_ID = 'G-41C40LGV30';

export function GoogleAnalytics() {
  const [analyticsConsented, setAnalyticsConsented] = useState(false);

  useEffect(() => {
    // Check existing consent on mount
    try {
      const consent = localStorage.getItem('cookie-consent');
      if (consent) {
        const parsed = JSON.parse(consent);
        setAnalyticsConsented(parsed.analytics === true);
      }
    } catch {
      // No consent stored
    }

    // Listen for consent changes
    const handleConsentUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setAnalyticsConsented(detail?.analytics === true);
    };

    window.addEventListener('cookie-consent-updated', handleConsentUpdate);
    return () => window.removeEventListener('cookie-consent-updated', handleConsentUpdate);
  }, []);

  if (!analyticsConsented) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
