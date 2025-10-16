import CircularText from "@/components/animations/CircularText";
import { Button } from "@/components/custom/Button";
import { Card } from "@/components/custom/Card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
  Stethoscope,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const infirmieres = [
    {
      name: "Christine LEVA",
      specialite: "Soins généraux & Coordination",
      experience: "15 ans",
      image: "/hero1.png",
      description:
        "Responsable du cabinet, spécialisée dans la coordination des soins",
    },
    {
      name: "Florence BROUARD",
      specialite: "Soins techniques & Pédiatrie",
      experience: "12 ans",
      image: "/hero2.png",
      description: "Experte en soins techniques et accompagnement pédiatrique",
    },
    {
      name: "Émilie CHAPLAIN",
      specialite: "Soins palliatifs & Gériatrie",
      experience: "18 ans",
      image: "/hero3.png",
      description: "Spécialisée dans l'accompagnement des personnes âgées",
    },
    {
      name: "Aude LESTRADE-CARBONNEL",
      specialite: "Diabétologie & Soins chroniques",
      experience: "10 ans",
      image: "/hero4.png",
      description: "Référente pour le suivi des pathologies chroniques",
    },
    {
      name: "Hélène ROPARS",
      specialite: "Soins post-opératoires",
      experience: "14 ans",
      image: "/hero5.png",
      description: "Experte en soins post-opératoires et rééducation",
    },
  ];

  return (
    <>
      <div className="min-h-screen overflow-hidden relative">
        {/* Hero Section Professionnel */}
        <section className="relative bg-gradient-to-br from-background via-muted to-accent dark:from-background dark:via-muted dark:to-accent pt-32 pb-20 overflow-hidden min-h-screen">
          {/* Fond wave.png */}
        {/*  <div className="absolute inset-0">
            <Image
              src="/wave.png"
              alt="Fond ondulé"
              fill
              className="object-cover object-center"
              priority
            />
          </div>*/}
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 relative">
            <div className="w-full max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-16 items-center justify-between">
                {/* Contenu principal */}
                <div className="flex-1 text-center lg:text-left">
                  <Badge className="mb-6 bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm px-4 py-2">
                    <Shield className="w-4 h-4 mr-2" />
                    Agréé Sécurité Sociale
                  </Badge>

                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                    Cabinet Infirmier
                    <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mt-2 bg-clip-text text-transparent font-kaushan-script bg-gradient-to-br from-blue-600 to-blue-200 font-normal">
                      Harmonie
                    </span>
                    <span className="block text-2xl sm:text-3xl lg:text-4xl text-muted-foreground mt-2 font-medium">
                      Soins à domicile et au cabinet
                    </span>
                  </h1>

                  <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    Une équipe de 5 infirmières diplômées d&apos;État vous
                    accompagne avec professionnalisme et bienveillance pour tous
                    vos soins à domicile.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-12">
                    <Link href="/demande/soins">
                      <Button
                        size="lg"
                        className="text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        <Calendar className="w-6 h-6 mr-3" />
                        Prendre rendez-vous
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg px-10 py-6 transition-all duration-300"
                      asChild
                    >
                      <a
                        href="tel:0553560456"
                        className="flex items-center justify-center gap-3"
                      >
                        <Phone className="w-6 h-6" />
                        <span>05 53 56 04 56</span>
                      </a>
                    </Button>
                  </div>

                  {/* Stats professionnelles */}
                  <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">
                        1200+
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        Patients suivis
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">
                        15+
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        Années d&apos;expérience
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">
                        24h/7j
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        Disponibilité
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image hero avec vraie photo */}
                <div className="flex-1 lg:flex justify-center items-end lg:justify-end hidden ">
                  <div className="relative lg:top-18 lg:left-0 top-24 left-24 w-full h-full aspect-square">
                    <Image
                      src="/images/steto.png"
                      alt="Cabinet médical - Soins à domicile"
                      fill
                      className="object-cover w-full h-full"
                    />

                    {/* Circular Text */}
                    <div className="absolute bottom-0 right-0 lg:bottom-0 lg:right-0">
                      <CircularText
                        text="Harmonie*Cabinet*Infirmier*"
                        onHover="speedUp"
                        spinDuration={20}
                        className="custom-class font-serif px-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Services Professionnelle */}
        <section className="py-24 bg-gradient-to-br from-background via-muted to-accent dark:from-background dark:via-muted dark:to-accent">
          <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                  Nos Services de Soins
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Une gamme complète de soins infirmiers à domicile, réalisés
                  par des professionnelles diplômées d&apos;État
                </p>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-6 md:grid-rows-4 gap-4 max-w-5xl mx-auto min-h-[620px] relative">
                {/* Soins Techniques */}
                <Card className="p-8 shadow-lg border-0 bg-background row-span-2 md:row-span-4 col-span-1 md:col-span-1 flex flex-col justify-between hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                  {/* Image de fond */}
                  <div className="absolute bottom-4 right-4 w-40 h-40 square opacity-90 rounded-xl overflow-hidden">
                    <Image
                      src="/images/steto.png"
                      alt="Stéthoscope"
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                  <div>
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 relative z-10">
                      <Stethoscope className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 relative z-10">
                      Soins Techniques
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed relative z-10">
                      Injections, perfusions, pansements complexes, surveillance
                      post-opératoire et soins spécialisés
                    </p>
                    <ul className="space-y-3 relative z-10">
                      <li className="flex items-center gap-3 text-foreground">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>
                          Injections sous-cutanées et intramusculaires
                        </span>
                      </li>
                      <li className="flex items-center gap-3 text-foreground">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>Pansements et soins de plaies</span>
                      </li>
                      <li className="flex items-center gap-3 text-foreground">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>Perfusions et chimiothérapie</span>
                      </li>
                    </ul>
                  </div>
                </Card>

                {/* Méga carte confort + suivi */}
                <div className="flex flex-col gap-4 row-span-4 md:row-span-4 col-span-1 md:col-span-2">
                  {/* Soins de Confort */}
                  <Card className="p-8 shadow-lg border-0 bg-background flex-1 min-h-0 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                    {/* Image de fond pour pansements */}
                    <div className="absolute top-4 right-4 w-28 h-28 aspect-square opacity-90 rounded-xl overflow-hidden">
                      <Image
                        src="/images/panse.png"
                        alt="Pansement"
                        fill
                        className="object-cover object-center"
                        priority
                      />
                    </div>
                    {/* Image de fond pour pillulier */}
                    <div className="absolute bottom-4 right-4 w-28 h-28 aspect-square opacity-90 rounded-xl overflow-hidden">
                      <Image
                        src="/images/pill.png"
                        alt="Pillulier"
                        fill
                        className="object-cover object-center"
                        priority
                      />
                    </div>
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 relative z-10">
                      <Heart className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 relative z-10">
                      Soins de Confort
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed relative z-10">
                      Accompagnement quotidien, aide à la mobilité et
                      surveillance des constantes vitales
                    </p>
                    <ul className="space-y-3 relative z-10">
                      <li className="flex items-center gap-3 text-foreground">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>Toilettes complètes et partielles</span>
                      </li>
                      <li className="flex items-center gap-3 text-foreground">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>Surveillance tension et glycémie</span>
                      </li>
                      <li className="flex items-center gap-3 text-foreground">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>Aide à la prise de médicaments</span>
                      </li>
                    </ul>
                  </Card>
                  {/* Suivi Personnalisé */}
                  <Card className="p-8 shadow-lg border-0 bg-background flex-1 min-h-0 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                    {/* Image de fond pour coordination médecin */}
                    <div className="absolute top-4 right-4 w-28 h-28 aspect-square opacity-90 rounded-xl overflow-hidden">
                      <Image
                        src="/medecin.jpeg"
                        alt="Coordination médecin"
                        fill
                        className="object-cover object-center"
                        priority
                      />
                    </div>
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 relative z-10">
                      <Users className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 relative z-10">
                      Suivi Personnalisé
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed relative z-10">
                      Accompagnement sur mesure, éducation thérapeutique et
                      coordination avec vos médecins
                    </p>
                    <ul className="space-y-3 relative z-10">
                      <li className="flex items-center gap-3 text-foreground">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>Suivi des traitements chroniques</span>
                      </li>
                      <li className="flex items-center gap-3 text-foreground">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>Coordination avec votre médecin</span>
                      </li>
                      <li className="flex items-center gap-3 text-foreground">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>Éducation thérapeutique</span>
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>
              {/* /Bento Grid */}
            </div>
          </div>
        </section>

        {/* Section Équipe Professionnelle avec vraies photos */}
        <section className="py-24 bg-muted/30 relative overflow-hidden">
          {/* Fond wave.png */}
          <div className="absolute inset-0 opacity-8">
            <Image
              src="/wave.png"
              alt="Fond ondulé"
              fill
              className="object-cover object-center"
            />
          </div>
          <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 relative z-10">
            <div className="w-full">
              <div className="text-center mb-20">
                <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                  Notre Équipe d&apos;Expertes
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Cinq infirmières diplômées d&apos;État, spécialisées et
                  expérimentées, unies par la même passion : votre bien-être
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-8">
                {infirmieres.map((infirmiere, index) => (
                  <Card
                    key={index}
                    className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 shadow-lg bg-card overflow-hidden min-w-72 relative"
                  >
                    {/* Motif inspiré de la carte de visite */}
                    <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2306b6d4' stroke-width='2'%3E%3Cpath d='M10,40 Q20,20 40,40 T70,40' /%3E%3Cpath d='M10,50 Q20,30 40,50 T70,50' /%3E%3Cpath d='M10,60 Q20,40 40,60 T70,60' /%3E%3C/g%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "contain",
                        }}
                      ></div>
                    </div>

                    <div className="relative">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={infirmiere.image}
                          alt={infirmiere.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Badge d'expérience avec style carte */}
                      <div className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        {infirmiere.experience}
                      </div>
                    </div>

                    <div className="p-4 relative">
                      {/* Petit motif décoratif */}
                      <div className="absolute top-2 left-2 w-8 h-8 opacity-20">
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2306b6d4'%3E%3Ccircle cx='16' cy='16' r='2' /%3E%3Cpath d='M8,16 Q12,8 16,16 T24,16' stroke='%2306b6d4' stroke-width='1' fill='none' /%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                          }}
                        ></div>
                      </div>

                      <h3 className="text-lg font-bold text-foreground mb-2 relative z-10">
                        {infirmiere.name}
                      </h3>
                      <p className="text-blue-600 font-semibold mb-3 text-sm relative z-10">
                        {infirmiere.specialite}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground relative z-10">
                        <Award className="w-4 h-4 text-blue-500" />
                        <span>Diplômée d&apos;État</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Certifications de l'équipe */}
              <div className="mt-16 text-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-3">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      Ordre National
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-3">
                      <Award className="w-8 h-8 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      Formation Continue
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-3">
                      <Heart className="w-8 h-8 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      Soins Palliatifs
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-3">
                      <Stethoscope className="w-8 h-8 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      Soins Techniques
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Localisation */}
        <section className="py-24 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-8">
                    Notre Cabinet
                  </h2>
                  <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed">
                    Situé au cœur de Paris, notre cabinet moderne vous accueille
                    dans un environnement chaleureux et professionnel. Nous
                    intervenons également à domicile dans un rayon de 25km.
                  </p>

                  <div className="space-y-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                          Adresse
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          123 Avenue de la Santé
                          <br />
                          75014 Paris, France
                          <br />
                          <span className="text-sm text-slate-500">
                            Métro : Glacière (ligne 6)
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                          Horaires
                        </h3>
                        <div className="text-slate-600 dark:text-slate-300 space-y-1">
                          <p>
                            <span className="font-semibold">
                              Lundi - Vendredi :
                            </span>{" "}
                            7h00 - 20h00
                          </p>
                          <p>
                            <span className="font-semibold">Samedi :</span> 8h00
                            - 18h00
                          </p>
                          <p>
                            <span className="font-semibold">Dimanche :</span>{" "}
                            Urgences uniquement
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                          Zone d&apos;intervention
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          Nous intervenons à domicile dans un rayon de 25km
                          autour du cabinet, couvrant Paris et la petite
                          couronne.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carte/Image du cabinet */}
                <div className="relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-900 rounded-3xl shadow-2xl overflow-hidden">
                    {/* Placeholder pour carte - remplacez par Google Maps */}
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-24 h-24 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                        <p className="text-blue-800 dark:text-blue-300 font-semibold">
                          Carte interactive
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Badge de zone */}
                  <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        25km
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        Zone d&apos;intervention
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Témoignages */}
        <section className="py-24 bg-slate-50 dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                  Témoignages Patients
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-300">
                  La satisfaction de nos patients est notre priorité
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    name: "Marie L.",
                    age: "78 ans",
                    comment:
                      "Un service exceptionnel ! L'équipe est très professionnelle, à l'écoute et d'une grande gentillesse. Je recommande vivement ce cabinet.",
                    rating: 5,
                  },
                  {
                    name: "Pierre M.",
                    age: "65 ans",
                    comment:
                      "Prise de rendez-vous facile et rapide. L'équipe est ponctuelle, compétente et rassurante. Parfait pour mes soins post-opératoires.",
                    rating: 5,
                  },
                  {
                    name: "Sylvie D.",
                    age: "52 ans",
                    comment:
                      "Très satisfaite du suivi personnalisé. Les infirmières expliquent bien les soins et sont d'un grand réconfort dans les moments difficiles.",
                    rating: 5,
                  },
                ].map((temoignage, index) => (
                  <Card
                    key={index}
                    className="p-8 hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(temoignage.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 italic text-lg leading-relaxed">
                      &quot;{temoignage.comment}&quot;
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {temoignage.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {temoignage.name}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {temoignage.age}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final Professionnel */}
        <section
          className="py-24 bg-primary relative overflow-hidden"
          style={{ background: "var(--gradient)" }}
        >
          {/* Fond wave.png */}
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/wave.png"
              alt="Fond ondulé"
              fill
              className="object-cover object-center"
            />
          </div>
          {/* Motif de fond */}

          <div className="container mx-auto px-4 relative">
            <div className="max-w-5xl mx-auto text-center text-white">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Prêt à bénéficier de nos soins ?
              </h2>
              <p className="text-xl mb-12 text-white/90 leading-relaxed">
                Faites votre demande en ligne en moins de 5 minutes ou
                contactez-nous directement. Notre équipe vous rappelle
                rapidement.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Link href="/demande/soins">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-10 py-6 shadow-2xl hover:shadow-3xl"
                  >
                    <Calendar className="w-6 h-6 mr-3" />
                    Prendre rendez-vous en ligne
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-6 border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300"
                  asChild
                >
                  <a href="tel:0553560456">
                    <Phone className="w-6 h-6 mr-3" />
                    Appeler maintenant
                  </a>
                </Button>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-white/20">
                <div className="flex items-center justify-center gap-3 text-white/90">
                  <Phone className="w-5 h-5" />
                  <span className="text-lg">01 23 45 67 89</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-white/90">
                  <Mail className="w-5 h-5" />
                  <span className="text-lg">contact@cabinet-medical.fr</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
