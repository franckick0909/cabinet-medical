import { Button } from "@/components/custom/Button";
import { Card } from "@/components/custom/Card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background dark:from-background dark:via-background dark:to-background pt-16">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 md:mb-6">
            Cabinet Médical
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 md:mb-8 px-2">
            Prenez rendez-vous en ligne pour vos soins à domicile
          </p>
          <Link href="/demande/soins">
            <Button size="lg" className="text-lg px-8 py-4">
              Faire une demande de soins
            </Button>
          </Link>
        </div>

        {/* Services */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Nos services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">🩺</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Soins à domicile
              </h3>
              <p className="text-muted-foreground">
                Injections, pansements, prélèvements, perfusions et bien plus
                encore
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Prise de RDV rapide
              </h3>
              <p className="text-muted-foreground">
                Réservez votre créneau en quelques clics, nous vous recontactons
                rapidement
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">👨‍⚕️</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Professionnels qualifiés
              </h3>
              <p className="text-muted-foreground">
                Une équipe d&apos;infirmiers diplômés d&apos;État à votre
                service
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto mt-12 md:mt-16">
          <Card className="p-6 sm:p-8 md:p-12 text-center bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white border-0 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">
              Besoin de soins à domicile ?
            </h2>
            <p className="text-base sm:text-lg mb-5 md:mb-6 text-violet-100">
              Faites votre demande en ligne en moins de 5 minutes
            </p>
            <Link href="/demande/soins">
              <Button variant="secondary" size="lg" className="shadow-lg">
                Commencer ma demande
              </Button>
            </Link>
          </Card>
        </div>

        {/* Contact */}
        <div className="max-w-3xl mx-auto mt-8 md:mt-12 text-center px-2">
          <p className="text-sm sm:text-base text-muted-foreground">
            Des questions ? Contactez-nous au{" "}
            <a
              href="tel:0123456789"
              className="text-primary hover:underline font-semibold whitespace-nowrap"
            >
              01 23 45 67 89
            </a>
            <br className="sm:hidden" />{" "}
            <span className="hidden sm:inline">ou par email à </span>
            <span className="sm:hidden">ou </span>
            <a
              href="mailto:contact@cabinet-medical.fr"
              className="text-primary hover:underline font-semibold break-all sm:break-normal"
            >
              contact@cabinet-medical.fr
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
