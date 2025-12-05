"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const images = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2128&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=2069&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop",
];

export default function PremiumCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    // Infinite Marquee
    const totalWidth = slider.scrollWidth;
    const duration = 20; // seconds for one full loop

    gsap.to(slider, {
      x: "-50%", // Move half the duplicated width
      duration: duration,
      ease: "none",
      repeat: -1,
    });

    // Parallax/Scale effect on scroll
    gsap.fromTo(
      containerRef.current,
      { scale: 0.9, opacity: 0.8 },
      {
        scale: 1,
        opacity: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "center center",
          scrub: true,
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 overflow-hidden bg-[#F8F9FA]">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
          Notre Environnement
        </h2>
      </div>

      <div className="relative w-full">
        {/* Duplicated content for infinite loop */}
        <div ref={sliderRef} className="flex gap-8 w-max px-4">
          {[...images, ...images].map((src, index) => (
            <div
              key={index}
              className="relative w-[300px] md:w-[450px] aspect-[4/3] rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src={src}
                alt={`Gallery ${index}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
