import React, { useState, useEffect, useRef } from 'react';
import { useWines, useHomeContent } from '../hooks/useContent';

type FilterType = 'all' | 'Metodo Classico' | 'Premium';

interface BottleShowcaseProps {
  onWineClick?: (slug: string) => void;
}

export const BottleShowcase: React.FC<BottleShowcaseProps> = ({ onWineClick }) => {
  const { wines } = useWines();
  const homeContent = useHomeContent();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredBottle, setHoveredBottle] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredWines = activeFilter === 'all'
    ? wines.slice(0, 4)
    : wines.filter(wine => wine.family === activeFilter);

  return (
    <section ref={sectionRef} id="vini" className="py-24 md:py-32 bg-white relative overflow-hidden">

      {/* Wine gradient that follows mouse */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(ellipse 50% 40% at ${hoveredBottle !== null ? 20 + hoveredBottle * 20 : 50}% 50%, rgba(87,15,26,0.08) 0%, transparent 70%)`,
        }}
      />

      {/* Wine bubbles floating up - fine and delicate */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 4) * 1.5}px`,
              height: `${2 + (i % 4) * 1.5}px`,
              left: `${2 + (i * 2) % 96}%`,
              bottom: `-${10 + (i % 3) * 5}%`,
              background: `radial-gradient(circle at 30% 30%, rgba(87,15,26,${0.25 + (i % 4) * 0.08}), rgba(87,15,26,${0.12 + (i % 3) * 0.04}))`,
              boxShadow: `inset 0 0 ${1 + i % 2}px rgba(255,255,255,0.15)`,
              animation: `bubble-rise ${10 + (i % 8) * 2}s ease-in-out infinite`,
              animationDelay: `${(i * 0.25) % 10}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative z-10">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-xl">
             <span
               className={`font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-text/60 mb-4 block transition-all duration-700 ${
                 isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
               }`}
             >
                {homeContent.winesSection.label}
             </span>
             <h2 className="font-serif text-4xl md:text-5xl text-chiarli-text leading-tight overflow-hidden">
                <span
                  className={`block transition-all duration-700 delay-100 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  {homeContent.winesSection.titleLine1}
                </span>
                <span
                  className={`italic text-chiarli-wine block transition-all duration-700 delay-300 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  {homeContent.winesSection.titleLine2}
                </span>
             </h2>
          </div>
        </div>

        {/* Filters - Animated */}
        <div
          className={`flex gap-8 mb-16 border-b border-chiarli-text/10 pb-4 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={() => setActiveFilter('Metodo Classico')}
            className={`font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 pb-4 -mb-4 border-b-2 hover:scale-105 ${
              activeFilter === 'Metodo Classico'
                ? 'text-chiarli-text border-chiarli-wine'
                : 'text-chiarli-text/40 border-transparent hover:text-chiarli-text'
            }`}
          >
            Metodo Classico
          </button>
          <button
            onClick={() => setActiveFilter('Premium')}
            className={`font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 pb-4 -mb-4 border-b-2 hover:scale-105 ${
              activeFilter === 'Premium'
                ? 'text-chiarli-text border-chiarli-wine'
                : 'text-chiarli-text/40 border-transparent hover:text-chiarli-text'
            }`}
          >
            Premium
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {filteredWines.map((wine, index) => (
            <div
              key={wine.id}
              className={`group cursor-pointer transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${500 + index * 150}ms` }}
              onMouseEnter={() => setHoveredBottle(index)}
              onMouseLeave={() => setHoveredBottle(null)}
              onClick={() => onWineClick?.(wine.slug)}
            >
               {/* Image Container */}
               <div className="aspect-[3/4] mb-8 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                     <img
                       src={wine.image}
                       alt={wine.name}
                       className={`h-full w-full object-contain drop-shadow-lg transition-all duration-700 ${
                         hoveredBottle === index ? 'scale-110 -translate-y-2' : ''
                       }`}
                       loading="lazy"
                     />
                  </div>

               </div>

               {/* Text Content */}
               <div className="text-center px-4">
                  <h3 className="font-serif text-2xl text-chiarli-text mb-2 group-hover:text-chiarli-wine transition-colors duration-300">
                     {wine.name}
                  </h3>
                  <span className="block font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-text/40 group-hover:text-chiarli-wine/60 transition-colors duration-300">
                     {wine.denomination}
                  </span>
               </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-16 text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '1000ms' }}
        >
          <button
            onClick={() => window.location.hash = '#/tutti-i-vini'}
            className="border border-chiarli-wine text-chiarli-wine px-8 py-3 font-sans text-xs font-bold uppercase tracking-widest hover:bg-chiarli-wine hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-chiarli-wine/20"
          >
             {homeContent.winesSection.ctaText}
          </button>
        </div>

      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes bubble-rise {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translateY(-50vh) translateX(20px) scale(1.1);
            opacity: 0.8;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-110vh) translateX(-10px) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};
