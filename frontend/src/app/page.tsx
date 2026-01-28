import { TopNav, Footer } from "@/components/layout";
import {
  HeroSection,
  HowItWorks,
  FeaturedProjects,
  Testimonials,
  CTASection,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      <TopNav />
      <main>
        <HeroSection />
        <HowItWorks />
        <FeaturedProjects />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
