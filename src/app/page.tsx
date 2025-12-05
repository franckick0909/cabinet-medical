import HarmonieAbout from "@/components/harmonie/HarmonieAbout";
import HarmonieContact from "@/components/harmonie/HarmonieContact";
import HarmonieFooter from "@/components/harmonie/HarmonieFooter";
import HarmonieHeader from "@/components/harmonie/HarmonieHeader";
import HarmonieHero from "@/components/harmonie/HarmonieHero";
import HarmonieLocation from "@/components/harmonie/HarmonieLocation";
import HarmonieServices from "@/components/harmonie/HarmonieServices";
import HarmonieTeam from "@/components/harmonie/HarmonieTeam";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F9F7F2] selection:bg-teal-700 selection:text-white">
      <HarmonieHeader />
      <HarmonieHero />
      <HarmonieAbout />
      <HarmonieServices />
      <HarmonieTeam />
      <HarmonieLocation />
      <HarmonieContact />
      <HarmonieFooter />
    </main>
  );
}
