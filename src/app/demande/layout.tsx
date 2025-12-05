import { RecapSidebar } from "@/components/demande/RecapSidebar";
import HarmonieHeader from "@/components/harmonie/HarmonieHeader";

export default function DemandeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1a1a1a]">
      <HarmonieHeader />
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-12 py-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Contenu principal */}
          <div className="w-full lg:flex-[2] min-w-0">{children}</div>

          {/* Sidebar récapitulative - cachée sur mobile, visible sur desktop */}
          <div className="hidden lg:block lg:flex-[1] lg:sticky lg:top-24 max-w-md">
            <RecapSidebar />
          </div>
        </div>

        {/* Sidebar récapitulative mobile - en bas sur mobile */}
        <div className="lg:hidden mt-6">
          <RecapSidebar />
        </div>
      </div>
    </div>
  );
}
