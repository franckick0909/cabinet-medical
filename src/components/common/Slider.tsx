"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation, Pagination, Parallax } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/parallax";

interface SlideItem {
  id: number;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface SliderProps {
  slides: SlideItem[];
  onSlideChange?: (index: number) => void;
}

export function Slider({ slides, onSlideChange }: SliderProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  const handleSlideChange = (swiper: SwiperType) => {
    const realIndex = swiper.realIndex;
    onSlideChange?.(realIndex);
  };

  return (
    <div className="w-full relative">
      {/* Slider container - Format portrait comme MyHealthPrac */}
      <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] overflow-hidden">
        <div className="relative h-[92vh] min-h-[500px] flex items-center justify-center py-8 px-3">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Autoplay, Navigation, Pagination, Parallax]}
            spaceBetween={10}
            centeredSlides={true}
            loop={true}
            speed={2500}
            parallax={{
              enabled: true,
            }}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
              reverseDirection: false,
            }}
            grabCursor={true}
            touchRatio={1}
            touchAngle={45}
            resistance={true}
            resistanceRatio={0.85}
            breakpoints={{
              450: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1440: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1536: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            onSlideChange={handleSlideChange}
            className="h-full w-full px-2"
          >
            {slides.map((slide, index) => {
              return (
                <SwiperSlide
                  key={slide.id}
                  className="h-full flex items-center justify-center z-10 overflow-hidden rounded-2xl"
                >
                  <div className="relative w-full h-full max-w-full mx-auto">
                    {/* Image de fond - Format portrait avec effet parallax */}
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        sizes="(max-width: 450px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover scale-150"
                        priority={index < 3}
                        data-swiper-parallax="100"
                      />
                    </div>
                    {/* Overlay avec texte positionné comme MyHealthPrac avec effet parallax */}
                    <div className="absolute inset-0 rounded-2xl bg-black/30">
                      {/* Texte en haut à droite avec effet parallax et animation d'opacité */}
                      {slide.title && (
                        <div
                          className="absolute top-4 right-4 bg-primary backdrop-blur-sm rounded-lg px-3 py-2 max-w-[60%] opacity-100 transition-all duration-1000 ease-out"
                          data-swiper-parallax="-100"
                          data-swiper-parallax-opacity="0"
                        >
                          <p className="text-sm sm:text-base md:text-lg font-normal text-background leading-tight">
                            {slide.title}
                          </p>
                        </div>
                      )}

                      {/* Texte en bas à gauche avec effet parallax et animation d'opacité */}
                      {slide.description && (
                        <div
                          className="absolute bottom-4 left-4 px-3 py-2 max-w-[70%] opacity-100 transition-all duration-1200 ease-out"
                          data-swiper-parallax="200"
                          data-swiper-parallax-opacity="0"
                        >
                          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-2xl text-white leading-tight">
                            {slide.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
