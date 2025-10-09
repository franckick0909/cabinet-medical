import { RecapSidebar } from "../../components/demande/RecapSidebar";

export default function DemandeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container max-w-full mx-auto px-4 py-8">
        <div className="flex gap-8 items-start justify-baseline">
          {/* Contenu principal */}
          <div className="flex-2 min-w-0 ">{children}</div>

          {/* Sidebar récapitulative */}
          <div className="flex-1 flex-shrink-0 sticky top-14">
            <RecapSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
