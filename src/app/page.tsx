import Link from "next/link";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            Cabinet Médical
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 md:mb-8 px-2">
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nos services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">🩺</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Soins à domicile
              </h3>
              <p className="text-gray-600">
                Injections, pansements, prélèvements, perfusions et bien plus
                encore
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Prise de RDV rapide
              </h3>
              <p className="text-gray-600">
                Réservez votre créneau en quelques clics, nous vous recontactons
                rapidement
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">👨‍⚕️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Professionnels qualifiés
              </h3>
              <p className="text-gray-600">
                Une équipe d&apos;infirmiers diplômés d&apos;État à votre
                service
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto mt-12 md:mt-16">
          <Card className="p-6 sm:p-8 md:p-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">
              Besoin de soins à domicile ?
            </h2>
            <p className="text-base sm:text-lg mb-5 md:mb-6 text-blue-100">
              Faites votre demande en ligne en moins de 5 minutes
            </p>
            <Link href="/demande/soins">
              <Button variant="secondary" size="lg">
                Commencer ma demande
              </Button>
            </Link>
          </Card>
        </div>

        {/* Contact */}
        <div className="max-w-3xl mx-auto mt-8 md:mt-12 text-center px-2">
          <p className="text-sm sm:text-base text-gray-600">
            Des questions ? Contactez-nous au{" "}
            <a
              href="tel:0123456789"
              className="text-blue-600 hover:underline font-semibold whitespace-nowrap"
            >
              01 23 45 67 89
            </a>
            <br className="sm:hidden" />{" "}
            <span className="hidden sm:inline">ou par email à </span>
            <span className="sm:hidden">ou </span>
            <a
              href="mailto:contact@cabinet-medical.fr"
              className="text-blue-600 hover:underline font-semibold break-all sm:break-normal"
            >
              contact@cabinet-medical.fr
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
