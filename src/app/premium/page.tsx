import PremiumCarousel from "@/components/premium/PremiumCarousel";
import PremiumContent from "@/components/premium/PremiumContent";
import PremiumFooter from "@/components/premium/PremiumFooter";
import PremiumHeader from "@/components/premium/PremiumHeader";
import PremiumHero from "@/components/premium/PremiumHero";

export default function PremiumPage() {
  return (
    <main className="min-h-screen bg-white selection:bg-teal-600 selection:text-white">
      <PremiumHeader />
      <PremiumHero />
      <PremiumContent />
      <PremiumCarousel />
      <PremiumFooter />
    </main>
  );
}
