import type { Metadata } from "next";
import { Lato, Open_Sans } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/components/gdpr/CookieConsent";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "FindGrinds | Find Junior & Leaving Cert Grinds Tutors",
  description: "Ireland's trusted marketplace for Junior and Leaving Cert grinds. Find vetted tutors, book sessions, and access quality revision resources.",
  keywords: "grinds, tutoring, leaving cert, junior cert, Ireland, maths grinds, english grinds, dublin tutors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lato.variable} ${openSans.variable}`}>
      <body className="antialiased min-h-screen bg-white font-sans">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
