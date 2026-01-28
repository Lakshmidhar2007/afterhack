import { TopNav, Footer } from "@/components/layout";
import { HeroSection } from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      <TopNav />
      <main>
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}

