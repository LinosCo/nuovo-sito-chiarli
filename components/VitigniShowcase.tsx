import React, { useState, useEffect, useRef } from 'react';
import { Leaf } from 'lucide-react';

const vitigni = [
  {
    id: 1,
    name: "Lambrusco Grasparossa",
    location: "Tenuta Cialdini",
    description: "Il più classico dei Lambrusco modenesi. Vitigno autoctono a bacca nera con grappoli di medio-grandi dimensioni e buccia pruinosa.",
    image: "/foto/close-up-17-scaled.jpeg",
    characteristics: ["Bacca nera", "Grappolo medio-grande", "Buccia pruinosa"]
  },
  {
    id: 2,
    name: "Lambrusco di Sorbara",
    location: "Tenuta Sozzigalli",
    description: "Vitigno autoctono dal colore unico tra rosso e rosa. Grappolo lungo e spargolo con acini di media grandezza e buccia sottile.",
    image: "/foto/close-up-64-scaled.jpeg",
    characteristics: ["Colore rosso-rosa", "Grappolo spargolo", "Buccia sottile"]
  },
  {
    id: 3,
    name: "Pignoletto",
    location: "Tenuta Cialdini",
    description: "Vitigno autoctono a bacca bianca coltivato dal 1600. Grappoli compatti con acini piccoli e carattere aromatico.",
    image: "/foto/close-up-26-scaled.jpeg",
    characteristics: ["Bacca bianca", "Grappolo compatto", "Profilo aromatico"]
  },
  {
    id: 4,
    name: "Lambrusco Grasparossa",
    location: "Tenuta Belvedere",
    description: "Selezione esclusiva di Tenuta Belvedere. Grappoli con buccia spessa e ricca di antociani per uve di grande struttura.",
    image: "/foto/close-up-9-scaled.jpeg",
    characteristics: ["Buccia spessa", "Ricco di antociani", "Alta struttura"]
  }
];

export const VitigniShowcase: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredVitigno, setHoveredVitigno] = useState<number | null>(null);
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

  return (
    <section ref={sectionRef} id="vini" className="relative">
      {/* Vitigni Full Split Sections */}
      {vitigni.map((vitigno, index) => {
        const isEven = index % 2 === 0;
        const bgColor = index % 2 === 0 ? 'bg-white' : 'bg-chiarli-stone';

        return (
          <div key={vitigno.id} className={`relative min-h-screen ${bgColor} overflow-hidden`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
              {/* Image - alternates left/right */}
              <div className={`relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <img
                  src={vitigno.image}
                  alt={vitigno.name}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 ${isEven ? 'bg-gradient-to-r from-transparent to-white/20 lg:bg-gradient-to-l lg:from-white/20 lg:to-transparent' : 'bg-gradient-to-l from-transparent to-chiarli-stone/20 lg:bg-gradient-to-r lg:from-chiarli-stone/20 lg:to-transparent'}`} />
              </div>

              {/* Content - alternates right/left */}
              <div className={`flex items-center py-16 md:py-24 lg:py-0 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-text/60 mb-6 block">
                    {vitigno.location}
                  </span>

                  <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
                    <span className="italic text-chiarli-wine block">{vitigno.name}</span>
                  </h2>

                  <p className="font-serif italic text-xl text-chiarli-text/70 mb-8 leading-relaxed">
                    {vitigno.description}
                  </p>

                  {/* Characteristics */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {vitigno.characteristics.map((char, idx) => (
                      <span
                        key={idx}
                        className="font-sans text-xs uppercase tracking-wider text-chiarli-text/60 bg-chiarli-text/5 px-4 py-2 border border-chiarli-text/10"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};
