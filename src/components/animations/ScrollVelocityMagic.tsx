"use client";

import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";

interface ScrollVelocityMagicProps {
  disabled?: boolean;
  className?: string;
}

export function ScrollVelocityMagic({
  disabled = false,
  className,
}: ScrollVelocityMagicProps) {
  if (disabled) {
    return (
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-12 bg-gradient-to-b from-background to-background/95">
        <div className="text-6xl md:text-8xl lg:text-9xl font-normal tracking-[-0.02em] leading-none text-center">
          <div className="flex items-center justify-center gap-8 text-primary mb-2">
            <span className="text-primary/80">Cabinet de santé</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex w-full flex-col items-center justify-center scale-110 ${className || ""}`}
    >
      <ScrollVelocityContainer className="text-6xl lg:text-7xl tracking-[-0.02em] leading-none will-change-transform font-black space-y-[24rem]">
        {/* Première ligne - inclinée avec mix-blend */}
        <ScrollVelocityRow
          baseVelocity={10}
          direction={1}
          className="transform -rotate-2 bg-destructive mix-blend-difference py-4"
        >
          <span className="inline-flex items-center gap-8 leading-none mr-12 will-change-transform font-black mix-blend-difference">
            <span className="text-transparent bg-clip-text bg-gradient-to-t from-white to-white">
              cabinet médical
            </span>
            <span className="text-transparent bg-clip-text">
              harmonie
            </span>
          </span>
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </div>
  );
}
