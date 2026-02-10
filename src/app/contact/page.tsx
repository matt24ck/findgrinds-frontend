import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            <div className="w-14 h-14 bg-[#F0F7F4] rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-7 h-7 text-[#2D9B6E]" />
            </div>
            <h1 className="text-3xl font-bold text-[#2C3E50] mb-4">Contact Us</h1>
            <p className="text-[#5D6D7E] mb-6">
              Have a question, feedback, or need help? Get in touch with our team and we&apos;ll get back to you as soon as possible.
            </p>
            <a
              href="mailto:support@findgrinds.ie"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2D9B6E] text-white font-semibold rounded-lg hover:bg-[#248F5C] transition-colors"
            >
              <Mail className="w-5 h-5" />
              support@findgrinds.ie
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
