import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

export const HeroLight: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen w-full bg-chiarli-stone overflow-hidden">

      {/* Editorial Grid Layout */}
      <div className="grid grid-cols-12 min-h-screen">

        {/* Left Side - Typography */}
        <div className="col-span-12 lg:col-span-5 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-24 lg:py-0 order-2 lg:order-1">

          {/* Small label */}
          <div
            className={`mb-12 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.4em] text-chiarli-text/40">
              Cantina fondata nel 1860
            </span>
          </div>

          {/* Large Editorial Title */}
          <h1
            className={`mb-8 transition-all duration-1000 delay-100 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="font-serif text-[12vw] lg:text-[7vw] xl:text-[6vw] text-chiarli-text block leading-[0.85] tracking-tight">
              Cleto
            </span>
            <span className="font-serif italic text-[12vw] lg:text-[7vw] xl:text-[6vw] text-chiarli-wine block leading-[0.85] tracking-tight">
              Chiarli
            </span>
          </h1>

          {/* Minimal description */}
          <p
            className={`font-sans text-base text-chiarli-text/60 leading-relaxed max-w-sm mb-12 transition-all duration-1000 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Cinque generazioni di passione per il Lambrusco.
            Un'eredità che continua a scrivere la storia.
          </p>

          {/* Minimal CTA */}
          <div
            className={`flex items-center gap-8 transition-all duration-1000 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <a
              href="#vini"
              className="group flex items-center gap-3 text-chiarli-text hover:text-chiarli-wine transition-colors"
            >
              <span className="font-sans text-xs font-medium uppercase tracking-[0.2em]">Scopri i vini</span>
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
            </a>
            <span className="w-px h-4 bg-chiarli-text/20" />
            <a
              href="#storia"
              className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-chiarli-text/50 hover:text-chiarli-text transition-colors"
            >
              La storia
            </a>
          </div>

        </div>

        {/* Right Side - Full Image */}
        <div className="col-span-12 lg:col-span-7 relative order-1 lg:order-2 h-[50vh] lg:h-auto">
          <img
            src="/foto/close-up-26-scaled.jpeg"
            alt="Lambrusco Chiarli"
            className={`w-full h-full object-cover transition-all duration-1000 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />

          {/* Editorial overlay text on image */}
          <div
            className={`absolute bottom-12 right-12 text-right hidden lg:block transition-all duration-1000 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="font-serif text-[100px] xl:text-[120px] text-white/20 leading-none block">
              1860
            </span>
          </div>
        </div>

      </div>

      {/* Scroll indicator - bottom left */}
      <div
        className={`absolute bottom-8 left-8 md:left-16 lg:left-20 flex items-center gap-4 transition-all duration-1000 delay-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ChevronDown size={16} className="text-chiarli-text/40 animate-bounce" />
        <span className="font-sans text-[10px] font-medium tracking-[0.3em] text-chiarli-text/40 uppercase">
          Scroll
        </span>
      </div>

    </section>
  );
};
