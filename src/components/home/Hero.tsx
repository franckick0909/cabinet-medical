import Image from "next/image";
import { FancyButton } from "../common/FancyButton";
import { Arrow } from "../ui/Arrow";
import { ScrollVelocityRow } from "../ui/scroll-based-velocity";

export default function Hero() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen py-20 z-[1] overflow-hidden 
      before:content-[''] before:absolute before:inset-0 before:z-[2]
      after:content-[''] after:absolute after:inset-0 after:h-full after:w-full after:bg-[url('/images/hero-bg.jpg')] after:bg-cover after:bg-center after:z-0 after:bg-no-repeat after:opacity-10"
    >
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[80vh] h-[80vh] -translate-x-1/2 bg-foreground/10 z-[2] rounded-full"></div>

      <div className="flex flex-col lg:flex-row gap-5 justify-between items-center w-full container mx-auto py-10 z-[3] h-full px-4">
        <div className="w-full lg:w-1/2 relative z-[2]">
          <div className="">
            <span className="relative border border-primary rounded-full p-2 pl-6 text-sm before:content-[''] before:absolute before:left-3 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-tertiary before:rounded-full">
              Cabinet Infirmier diplômé
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl my-5 font-cormorant-garamond flex items-center gap-4 flex-wrap">
              <span>Cabinet Médical </span>
              <div className="relative hidden md:block rounded-full overflow-hidden w-44 h-18 lg:w-52 lg:h-20">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover z-0"
                >
                  <source src="/vidéos/coeur.mp4" type="video/mp4" />
                </video>
              </div>
              <span className="text-transparent bg-clip-text  bg-gradient-to-b from-primary to-secondary uppercase text-stroke-primary">
                Harmonie
              </span>
            </h1>
            <p className="text-base md:text-lg text-foreground w-full sm:w-[80%] md:w-[60%] leading-snug">
              Réservez votre Soins infirmiers à domicile ou en cabinet.
              Choisissez le lieu, l&apos;horaire, et confirmez en ligne. Simple,
              rapide, sécurisé.
            </p>

            <div className="mt-6">
              <FancyButton
                variant="outline-tertiary"
                size="lg"
                className="px-6 py-4 gap-3 text-base md:text-lg"
                icon={<Arrow size={20} />}
                iconPosition="right"
                href="/rendez-vous"
              >
                <span className="inline">Réservez votre rendez-vous</span>
              </FancyButton>
            </div>
          </div>
        </div>

        <div className="relative w-full lg:w-1/2">
          <div className="w-full h-full aspect-square overflow-hidden rounded-2xl relative">
            <Image
              src="/images/contact-infirmiere.jpg"
              alt="Wave 2"
              fill
              className="object-cover rounded-2xl"
              priority
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-[500] flex items-center">
          <ScrollVelocityRow
            baseVelocity={8}
            direction={-1}
            className="  mix-blend-difference py-4"
          >
            <div className="relative w-full h-full">
              <span className="inline-flex items-center gap-8 leading-none mr-12 will-change-transform text-6xl font-stardom font-bold">
                <span className="text-transparent bg-clip-text bg-foreground">
                  Prenez rendez-vous
                </span>
                <span className="text-transparent bg-clip-text bg-foreground">
                  maintenant
                </span>
              </span>
            </div>
            <div className="relative w-full h-full">
              <Image
                src="/images/steto1.jpg"
                alt="Wave 2"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover rounded-2xl w-full h-full"
                priority
              />
            </div>
          </ScrollVelocityRow>
        </div>
      </div>
    </div>
  );
}
