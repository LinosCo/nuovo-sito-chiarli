import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export const HistorySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="storia" className="relative min-h-screen bg-chiarli-stone overflow-hidden">

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

        {/* Left: Full height image */}
        <div
          className={`relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden transition-all duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src="/foto/chiarli.jpg"
            alt="Villa Chiarli"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 lg:bg-gradient-to-l lg:from-chiarli-stone/20 lg:to-transparent" />
        </div>

        {/* Right: Content */}
        <div className="flex items-center py-16 md:py-24 lg:py-0">
          <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">

            <span
              className={`font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-text/60 mb-6 block transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              La Nostra Storia
            </span>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
              <span
                className={`block transition-all duration-700 delay-100 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Non seguiamo
              </span>
              <span
                className={`block transition-all duration-700 delay-200 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                la tradizione.
              </span>
              <span
                className={`italic text-chiarli-wine block transition-all duration-700 delay-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                La scriviamo.
              </span>
            </h2>

            <p
              className={`font-sans text-chiarli-text/70 text-lg leading-relaxed mb-8 max-w-lg transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Cleto Chiarli non è solo una cantina. È il capitolo più importante nella storia del Lambrusco.
              Siamo stati i primi a credere che questo vino potesse sedere alle tavole più prestigiose del mondo.
            </p>

            {/* Stats row */}
            <div
              className={`flex flex-wrap gap-8 md:gap-10 mb-10 transition-all duration-700 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="border-l-2 border-chiarli-text/20 pl-4">
                <span className="font-serif text-4xl text-chiarli-text block">160+</span>
                <span className="font-sans text-[10px] uppercase tracking-widest text-chiarli-text/50">Anni di storia</span>
              </div>
              <div className="border-l-2 border-chiarli-text/20 pl-4">
                <span className="font-serif text-4xl text-chiarli-text block">5</span>
                <span className="font-sans text-[10px] uppercase tracking-widest text-chiarli-text/50">Generazioni</span>
              </div>
              <div className="border-l-2 border-chiarli-text/20 pl-4">
                <span className="font-serif text-4xl text-chiarli-text block">100+</span>
                <span className="font-sans text-[10px] uppercase tracking-widest text-chiarli-text/50">Ettari</span>
              </div>
            </div>

            <a
              href="#/storia"
              className={`group inline-flex items-center gap-4 bg-chiarli-wine text-white px-8 py-4 hover:bg-chiarli-text transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <span className="font-sans text-xs font-bold uppercase tracking-widest">Scopri la nostra storia</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

          </div>
        </div>

      </div>

    </section>
  );
};
