import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { FeatureCards } from '@/components/home/FeatureCards';
import { TutorCarousel } from '@/components/home/TutorCarousel';
import { SubjectsSection } from '@/components/home/SubjectsSection';
import { CTASection } from '@/components/home/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeatureCards />
        <TutorCarousel />
        <SubjectsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
