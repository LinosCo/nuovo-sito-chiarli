import React, { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useHomeContent } from "../hooks/useContent";

export const Hero: React.FC = () => {
  const homeContent = useHomeContent();
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-chiarli-text">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/foto/sito/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/25 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full max-w-[1800px] mx-auto px-6 md:px-12 flex flex-col justify-end pb-24 md:pb-32">
        <div className="max-w-4xl">
          {/* Title */}
          <h1 className="flex flex-col leading-none text-white mb-8">
            <span
              className={`font-sans font-light text-[28px] md:text-7xl lg:text-8xl tracking-tight transition-all duration-1000 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              {homeContent.hero.titleLine1}
            </span>
            <span
              className={`font-serif italic text-[28px] md:text-7xl lg:text-8xl ml-4 md:ml-16 transition-all duration-1000 delay-300 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              {homeContent.hero.titleLine2}
            </span>
          </h1>

          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
            <p
              className={`font-serif text-base md:text-xl text-white/80 max-w-lg leading-relaxed border-l-2 border-chiarli-wine-light pl-6 transition-all duration-1000 delay-500 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {homeContent.hero.subtitle ||
                "Dal 1860, ridefiniamo l'identità del Lambrusco. Un dialogo costante tra l'eleganza del passato e la visione del futuro."}
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 transition-all duration-1000 delay-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <span className="font-sans text-[10px] font-bold tracking-widest text-white/40 uppercase">
          Scroll
        </span>
        <ChevronDown size={20} className="text-white/60 animate-bounce" />
      </div>
    </section>
  );
};
