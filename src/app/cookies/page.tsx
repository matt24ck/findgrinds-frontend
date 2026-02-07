'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

export default function CookiePolicyPage() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent) {
      try {
        setPreferences(JSON.parse(consent));
      } catch {
        // Use defaults
      }
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: preferences }));
    }

    alert('Cookie preferences saved successfully!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-8">Cookie Policy</h1>

          <div className="prose prose-lg max-w-none text-[#5D6D7E]">
            <p className="text-sm text-[#95A5A6] mb-8">
              Last updated: January 2026
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">What Are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your device when you visit a website.
                They help websites remember your preferences and improve your browsing experience.
                Cookies are widely used to make websites work more efficiently and provide information
                to website owners.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">How We Use Cookies</h2>
              <p>
                FindGrinds uses cookies and similar technologies for various purposes. Below we explain
                the types of cookies we use and why.
              </p>

              <div className="mt-6 space-y-6">
                <div className="bg-[#F8F9FA] p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">Necessary Cookies</h3>
                  <p className="text-sm mb-3">
                    These cookies are essential for the website to function properly. They enable core
                    functionality such as security, network management, and account authentication.
                    You cannot disable these cookies.
                  </p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Cookie</th>
                        <th className="text-left py-2">Purpose</th>
                        <th className="text-left py-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">session_token</td>
                        <td className="py-2">Maintains user login session</td>
                        <td className="py-2">7 days</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">csrf_token</td>
                        <td className="py-2">Security protection</td>
                        <td className="py-2">Session</td>
                      </tr>
                      <tr>
                        <td className="py-2">cookie-consent</td>
                        <td className="py-2">Stores your cookie preferences</td>
                        <td className="py-2">1 year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#F8F9FA] p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">Analytics Cookies</h3>
                  <p className="text-sm mb-3">
                    These cookies help us understand how visitors interact with our website by collecting
                    and reporting information anonymously. This helps us improve our services.
                  </p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Cookie</th>
                        <th className="text-left py-2">Purpose</th>
                        <th className="text-left py-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">_ga</td>
                        <td className="py-2">Google Analytics - distinguishes users</td>
                        <td className="py-2">2 years</td>
                      </tr>
                      <tr>
                        <td className="py-2">_gid</td>
                        <td className="py-2">Google Analytics - distinguishes users</td>
                        <td className="py-2">24 hours</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#F8F9FA] p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">Marketing Cookies</h3>
                  <p className="text-sm mb-3">
                    These cookies are used to track visitors across websites to display relevant
                    advertisements. They may be set by advertising partners.
                  </p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Cookie</th>
                        <th className="text-left py-2">Purpose</th>
                        <th className="text-left py-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">_fbp</td>
                        <td className="py-2">Facebook Pixel - ad targeting</td>
                        <td className="py-2">3 months</td>
                      </tr>
                      <tr>
                        <td className="py-2">_gcl_au</td>
                        <td className="py-2">Google Ads conversion tracking</td>
                        <td className="py-2">3 months</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">Manage Your Preferences</h2>
              <p className="mb-6">
                You can manage your cookie preferences below. Please note that disabling certain cookies
                may affect your experience on our website.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-lg">
                  <div>
                    <h4 className="font-medium text-[#2C3E50]">Necessary Cookies</h4>
                    <p className="text-sm text-[#5D6D7E]">Required for the website to function</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-5 h-5 rounded border-[#D5DBDB] text-[#2D9B6E]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-lg">
                  <div>
                    <h4 className="font-medium text-[#2C3E50]">Analytics Cookies</h4>
                    <p className="text-sm text-[#5D6D7E]">Help us improve our website</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="w-5 h-5 rounded border-[#D5DBDB] text-[#2D9B6E] focus:ring-[#2D9B6E]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-lg">
                  <div>
                    <h4 className="font-medium text-[#2C3E50]">Marketing Cookies</h4>
                    <p className="text-sm text-[#5D6D7E]">Used for advertising purposes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="w-5 h-5 rounded border-[#D5DBDB] text-[#2D9B6E] focus:ring-[#2D9B6E]"
                  />
                </div>
              </div>

              <Button onClick={savePreferences}>
                Save Preferences
              </Button>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">Browser Cookie Settings</h2>
              <p>
                Most web browsers allow you to control cookies through their settings. Here are links
                to instructions for popular browsers:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#2D9B6E] hover:underline">
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-[#2D9B6E] hover:underline">
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#2D9B6E] hover:underline">
                    Safari
                  </a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[#2D9B6E] hover:underline">
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">Changes to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time. Any changes will be posted on this
                page with an updated revision date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">Contact Us</h2>
              <p>
                If you have questions about our use of cookies, please contact us at{' '}
                <strong>privacy@findgrinds.ie</strong>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
