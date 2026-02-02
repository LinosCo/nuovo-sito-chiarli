import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export const HistorySectionLight: React.FC = () => {
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
    <section ref={sectionRef} id="storia" data-section="storia" data-content-type="pages" className="bg-white">

      {/* Split Layout - Text Left, Image Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

        {/* Left: Text Content */}
        <div className="flex items-center bg-chiarli-stone px-8 md:px-16 lg:px-20 py-24">
          <div className="max-w-xl">

            {/* Small label */}
            <span
              className={`font-sans text-[10px] font-medium uppercase tracking-[0.4em] text-chiarli-text/40 block mb-8 transition-all duration-1000 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              La Nostra Storia
            </span>

            {/* Large Editorial Title */}
            <h2
              className={`mb-8 transition-all duration-1000 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <span className="font-serif text-[10vw] lg:text-[4vw] text-chiarli-text block leading-[0.9] tracking-tight">
                Non seguiamo
              </span>
              <span className="font-serif text-[10vw] lg:text-[4vw] text-chiarli-text block leading-[0.9] tracking-tight">
                la tradizione.
              </span>
              <span className="font-serif italic text-[10vw] lg:text-[4vw] text-chiarli-wine block leading-[0.9] tracking-tight mt-2">
                La scriviamo.
              </span>
            </h2>

            {/* Description */}
            <p
              className={`font-sans text-base lg:text-lg text-chiarli-text/70 leading-relaxed max-w-lg mb-12 transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Cleto Chiarli non è solo una cantina. È il capitolo più importante nella storia del Lambrusco.
              Siamo stati i primi a credere che questo vino potesse sedere alle tavole più prestigiose del mondo.
            </p>

            {/* Stats Row */}
            <div
              className={`flex gap-10 mb-12 transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div>
                <span className="font-serif text-4xl lg:text-5xl text-chiarli-text block leading-none">160+</span>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-chiarli-text/40 mt-2 block">Anni</span>
              </div>
              <div className="w-px bg-chiarli-text/10" />
              <div>
                <span className="font-serif text-4xl lg:text-5xl text-chiarli-text block leading-none">5</span>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-chiarli-text/40 mt-2 block">Generazioni</span>
              </div>
              <div className="w-px bg-chiarli-text/10" />
              <div>
                <span className="font-serif text-4xl lg:text-5xl text-chiarli-text block leading-none">100+</span>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-chiarli-text/40 mt-2 block">Ettari</span>
              </div>
            </div>

            {/* CTA */}
            <a
              href="#"
              className={`group inline-flex items-center gap-3 text-chiarli-text hover:text-chiarli-wine transition-all duration-1000 delay-400 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="font-sans text-xs font-medium uppercase tracking-[0.2em]">Scopri la nostra storia</span>
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </a>

          </div>
        </div>

        {/* Right: Image */}
        <div className="relative h-[50vh] lg:h-auto overflow-hidden">
          <img
            src="/foto/DSC04010.jpg"
            alt="Vigneti Chiarli"
            className={`w-full h-full object-cover transition-all duration-1000 ${
              isVisible ? 'scale-100' : 'scale-105'
            }`}
          />
        </div>

      </div>

      {/* Quote section on white */}
      <div className="border-t border-chiarli-text/10">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-20 py-24 md:py-32">
          <blockquote
            className={`font-serif text-2xl md:text-3xl lg:text-4xl text-chiarli-text/80 leading-relaxed max-w-4xl italic transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            "Dalla bottiglia Anfora ai moderni Cru, ogni etichetta è un manifesto di qualità
            <span className="not-italic text-chiarli-wine"> senza compromessi.</span>"
          </blockquote>
        </div>
      </div>

    </section>
  );
};
