import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useHomeContent } from '../hooks/useContent';

const heroImages = [
  '/foto/close-up-78-scaled.jpeg',
  '/foto/vasche-3.jpg',
  '/foto/a001-scaled.jpg',
  '/foto/galleria-chiarli-136.jpeg',
];

export const Hero: React.FC = () => {
  const homeContent = useHomeContent();

  // Per il loop infinito: array esteso con prima immagine duplicata alla fine
  const [slideIndex, setSlideIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  // Array esteso: [...originali, prima] per loop seamless
  const extendedImages = [...heroImages, heroImages[0]];

  useEffect(() => {
    setIsLoaded(true);

    // Auto-advance slides every 5 seconds
    const interval = setInterval(() => {
      setTransitionEnabled(true);
      setSlideIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Gestisce il salto quando arriviamo alla slide duplicata
  useEffect(() => {
    if (slideIndex === heroImages.length) {
      // Siamo sulla slide duplicata, dopo la transizione saltiamo alla prima vera
      const timer = setTimeout(() => {
        setTransitionEnabled(false);
        setSlideIndex(0);
      }, 1000); // Aspetta che finisca la transizione
      return () => clearTimeout(timer);
    }
  }, [slideIndex]);

  // Riabilita la transizione dopo il salto istantaneo
  useEffect(() => {
    if (!transitionEnabled) {
      const timer = setTimeout(() => setTransitionEnabled(true), 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled]);

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-chiarli-text">

       {/* Image Slider - Horizontal */}
       <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className={`flex h-full ${transitionEnabled ? 'transition-transform duration-1000 ease-out' : ''}`}
            style={{ transform: `translateX(-${slideIndex * 100}%)` }}
          >
            {extendedImages.map((image, index) => (
              <div
                key={`hero-slide-${index}`}
                className="min-w-full h-full flex-shrink-0"
              >
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Overlays */}
          <div className="absolute inset-0 bg-black/25 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 z-10"></div>
       </div>

       {/* Content */}
       <div className="relative z-20 h-full max-w-[1800px] mx-auto px-6 md:px-12 flex flex-col justify-end pb-24 md:pb-32">

          <div className="max-w-4xl">
             {/* Title */}
             <h1 className="flex flex-col leading-none text-white mb-8 overflow-hidden">
                <span
                  className={`font-sans font-light text-7xl md:text-9xl tracking-tight transition-all duration-1000 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                >
                  {homeContent.hero.titleLine1}
                </span>
                <span
                  className={`font-serif italic text-7xl md:text-9xl ml-12 md:ml-24 transition-all duration-1000 delay-300 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                >
                  {homeContent.hero.titleLine2}
                </span>
             </h1>

             <div className="flex flex-col md:flex-row md:items-end gap-12">
                <p
                  className={`font-serif text-lg md:text-xl text-white/80 max-w-lg leading-relaxed border-l-2 border-chiarli-wine-light pl-6 transition-all duration-1000 delay-500 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                   Dal 1860, ridefiniamo l'identità del Lambrusco. Un dialogo costante tra l'eleganza del passato e la visione del futuro.
                </p>
             </div>
          </div>
       </div>


       {/* Scroll Indicator */}
       <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 transition-all duration-1000 delay-1000 ${
         isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
       }`}>
          <span className="font-sans text-[10px] font-bold tracking-widest text-white/40 uppercase">Scroll</span>
          <ChevronDown size={20} className="text-white/60 animate-bounce" />
       </div>

    </section>
  );
};
