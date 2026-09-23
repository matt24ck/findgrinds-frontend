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
              Last updated: September 2026
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
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">Necessary (Browser Storage)</h3>
                  <p className="text-sm mb-3">
                    FindGrinds itself does not set any necessary cookies. Instead, we use your browser&apos;s
                    local storage and session storage for the items below, which are needed for the site to
                    work. You cannot disable these, but you can clear them at any time by signing out or
                    clearing your browser data.
                  </p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Name</th>
                        <th className="text-left py-2">Purpose</th>
                        <th className="text-left py-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">token, user</td>
                        <td className="py-2">Keeps you signed in and remembers basic account details</td>
                        <td className="py-2">Until you sign out or clear your browser data</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">cookie-consent, cookie-consent-date</td>
                        <td className="py-2">Stores your cookie preferences and when you set them</td>
                        <td className="py-2">Until you clear your browser data</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">fg_join_code</td>
                        <td className="py-2">Remembers a tutor invite link you followed, so it can be applied when you sign up</td>
                        <td className="py-2">Until used or cleared</td>
                      </tr>
                      <tr>
                        <td className="py-2">bookingForStudent</td>
                        <td className="py-2">Remembers which child a parent is booking for</td>
                        <td className="py-2">Until you close the tab</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#F8F9FA] p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">Analytics Cookies</h3>
                  <p className="text-sm mb-3">
                    Only set if you accept analytics cookies. Google Analytics is not loaded at all unless you
                    do. These cookies help us understand how visitors use our website, such as which pages
                    are visited, so we can improve it. The information is processed by Google.
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
                        <td className="py-2">_ga_&lt;ID&gt;</td>
                        <td className="py-2">Google Analytics - keeps track of your visit (session state)</td>
                        <td className="py-2">2 years</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#F8F9FA] p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">Marketing Cookies</h3>
                  <p className="text-sm mb-3">
                    We do not currently use any marketing or advertising cookies. If we add them in future,
                    we will list them here, and they will only be set if you accept marketing cookies.
                  </p>
                </div>

                <div className="bg-[#F8F9FA] p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">Third-Party Services</h3>
                  <p className="text-sm">
                    When you pay, you are taken to Stripe&apos;s secure checkout page, and online sessions use
                    video calls provided by Daily.co. These services may set their own cookies or use browser
                    storage on their own pages and in the video call, under their own cookie policies.
                  </p>
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
                    <p className="text-sm text-[#5D6D7E]">Google Analytics, to help us improve our website</p>
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
                    <p className="text-sm text-[#5D6D7E]">Not currently used. This choice will apply if we add marketing cookies in future.</p>
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
