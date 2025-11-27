import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ArrowRight, ArrowLeft, Grape, Mountain } from 'lucide-react';

interface Tenuta {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  hectares: number;
  altitude: string;
  grape: string;
  year: string;
  mapPosition: { x: number; y: number }; // Position on the stylized map (percentage)
}

const tenute: Tenuta[] = [
  {
    id: 1,
    name: "Tenuta Cialdini",
    location: "Castelvetro di Modena",
    description: "Nel cuore delle colline modenesi, dove il Lambrusco Grasparossa trova la sua massima espressione. Terreni argillosi e calcarei regalano struttura e complessità unica ai nostri vini più prestigiosi.",
    image: "/foto/close-up-26-scaled.jpeg",
    hectares: 45,
    altitude: "200-350m",
    grape: "Grasparossa",
    year: "1860",
    mapPosition: { x: 52, y: 58 } // Castelvetro - sud di Modena, colline
  },
  {
    id: 2,
    name: "Tenuta Sorbara",
    location: "Bomporto",
    description: "La pianura del Secchia, terra d'elezione del Lambrusco di Sorbara. Suoli sabbiosi e limosi per vini di straordinaria freschezza, fragranza e florealità.",
    image: "/foto/close-up-78-scaled.jpeg",
    hectares: 60,
    altitude: "25-40m",
    grape: "Sorbara",
    year: "1920",
    mapPosition: { x: 48, y: 42 } // Bomporto - nord di Modena, pianura
  },
  {
    id: 3,
    name: "Tenuta Modena",
    location: "Modena",
    description: "Alle porte della città, dove tradizione e innovazione si incontrano. Vigneti storici che raccontano oltre 160 anni di passione per il Lambrusco.",
    image: "/foto/DSC04010.jpg",
    hectares: 35,
    altitude: "40-80m",
    grape: "Salamino",
    year: "1950",
    mapPosition: { x: 50, y: 48 } // Modena città
  }
];

// Stylized Emilia-Romagna map component - using real map image
const EmiliaRomagnaMap: React.FC<{ activePosition: { x: number; y: number } }> = ({ activePosition }) => {
  // Posizioni delle tenute sulla mappa (in percentuale)
  // Modena è circa al 38-40% da sinistra nella mappa
  const mapPositions: { [key: string]: { x: number; y: number } } = {
    '52-58': { x: 40, y: 70 },   // Castelvetro - colline sud di Modena
    '48-42': { x: 38, y: 40 },   // Bomporto - pianura nord di Modena
    '50-48': { x: 39, y: 55 },   // Modena città
  };

  const posKey = `${activePosition.x}-${activePosition.y}`;
  const markerPos = mapPositions[posKey] || { x: 39, y: 55 };

  return (
    <div className="relative w-full h-full">
      {/* Map image - PNG with transparent background and white lines */}
      <img
        src="/Mappa_regione_emilia_romagna.png"
        alt="Emilia-Romagna"
        className="w-full h-full object-contain opacity-50"
      />

      {/* Marker overlay */}
      <div
        className="absolute transition-all duration-700 ease-out"
        style={{
          left: `${markerPos.x}%`,
          top: `${markerPos.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Pulse ring */}
        <div className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-chiarli-wine-light/50 animate-ping" />
        {/* Outer glow */}
        <div className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-chiarli-wine-light/40" />
        {/* Inner circle */}
        <div className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-chiarli-wine-light" />
        {/* Center dot */}
        <div className="absolute w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </div>
    </div>
  );
};

export const TenuteSection: React.FC = () => {
  // Per il loop infinito, usiamo un indice interno che include le slide duplicate
  const [slideIndex, setSlideIndex] = useState(1); // Iniziamo da 1 perché 0 è la slide duplicata
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  // Creiamo array con slide duplicate: [ultima, ...originali, prima]
  const extendedTenute = [tenute[tenute.length - 1], ...tenute, tenute[0]];

  // L'indice reale per i dati (0, 1, 2)
  const realIndex = slideIndex === 0
    ? tenute.length - 1
    : slideIndex === extendedTenute.length - 1
      ? 0
      : slideIndex - 1;

  const activeTenuta = tenute[realIndex];

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

  // Gestisce il "salto" quando si arriva alle slide duplicate
  useEffect(() => {
    if (!transitionEnabled) {
      // Riabilita la transizione dopo il salto istantaneo
      const timer = setTimeout(() => setTransitionEnabled(true), 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled]);

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTransitionEnabled(true);
    setSlideIndex(index + 1); // +1 perché abbiamo una slide duplicata all'inizio
    setTimeout(() => setIsAnimating(false), 800);
  };

  const goNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTransitionEnabled(true);
    setSlideIndex(prev => prev + 1);

    setTimeout(() => {
      setIsAnimating(false);
      // Se siamo arrivati alla slide duplicata finale, saltiamo alla prima reale
      if (slideIndex + 1 === extendedTenute.length - 1) {
        setTransitionEnabled(false);
        setSlideIndex(1);
      }
    }, 800);
  };

  const goPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTransitionEnabled(true);
    setSlideIndex(prev => prev - 1);

    setTimeout(() => {
      setIsAnimating(false);
      // Se siamo arrivati alla slide duplicata iniziale, saltiamo all'ultima reale
      if (slideIndex - 1 === 0) {
        setTransitionEnabled(false);
        setSlideIndex(tenute.length);
      }
    }, 800);
  };

  return (
    <section ref={sectionRef} id="tenute" className="relative min-h-screen bg-chiarli-text overflow-hidden">

      {/* Fullscreen Background Image - Horizontal Slide */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`flex h-full ${transitionEnabled ? 'transition-transform duration-1000 ease-out' : ''}`}
          style={{ transform: `translateX(-${slideIndex * 100}%)` }}
        >
          {extendedTenute.map((tenuta, idx) => (
            <div
              key={`slide-${idx}`}
              className="min-w-full h-full flex-shrink-0"
            >
              <img
                src={tenuta.image}
                alt={tenuta.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center max-w-[1800px] mx-auto px-6 md:px-12 py-24">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Left: Text Content */}
          <div className="order-2 lg:order-1">
            {/* Section Label */}
            <span
              className={`font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine-light mb-6 block transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Le Nostre Tenute
            </span>

            {/* Counter */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="font-serif text-8xl md:text-9xl text-white/10 leading-none">
                {String(realIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-white/30 text-2xl">/</span>
              <span className="text-white/30">{String(tenute.length).padStart(2, '0')}</span>
            </div>

            {/* Tenuta Name */}
            <h2
              key={`name-${realIndex}`}
              className="font-serif text-5xl md:text-7xl text-white mb-4 leading-none animate-fade-in-up"
            >
              {activeTenuta.name}
            </h2>

            {/* Location */}
            <p
              key={`loc-${realIndex}`}
              className="flex items-center gap-2 text-chiarli-wine-light mb-8 animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              <MapPin size={16} />
              <span className="font-sans text-sm uppercase tracking-widest">{activeTenuta.location}</span>
            </p>

            {/* Description */}
            <p
              key={`desc-${realIndex}`}
              className="font-sans text-white/70 text-lg leading-relaxed max-w-lg mb-12 animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              {activeTenuta.description}
            </p>

            {/* Stats Grid */}
            <div
              key={`stats-${realIndex}`}
              className="grid grid-cols-3 gap-8 mb-12 animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <div className="border-l-2 border-chiarli-wine-light/50 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Grape size={16} className="text-chiarli-wine-light" />
                  <span className="font-sans text-[10px] uppercase tracking-widest text-white/40">Vitigno</span>
                </div>
                <span className="font-serif text-xl text-white">{activeTenuta.grape}</span>
              </div>
              <div className="border-l-2 border-chiarli-wine-light/50 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mountain size={16} className="text-chiarli-wine-light" />
                  <span className="font-sans text-[10px] uppercase tracking-widest text-white/40">Altitudine</span>
                </div>
                <span className="font-serif text-xl text-white">{activeTenuta.altitude}</span>
              </div>
              <div className="border-l-2 border-chiarli-wine-light/50 pl-4">
                <span className="font-sans text-[10px] uppercase tracking-widest text-white/40 block mb-2">Ettari</span>
                <span className="font-serif text-xl text-white">{activeTenuta.hectares}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              className="group flex items-center gap-4 bg-chiarli-wine text-white px-8 py-4 hover:bg-white hover:text-chiarli-text transition-all duration-500"
            >
              <span className="font-sans text-xs font-bold uppercase tracking-widest">Scopri la tenuta</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right: Navigation and Visual */}
          <div className="order-1 lg:order-2 flex flex-col items-end">

            {/* Year Badge */}
            <div
              key={`year-${realIndex}`}
              className="bg-white/10 backdrop-blur-sm px-6 py-4 mb-8 animate-fade-in"
            >
              <span className="font-sans text-[10px] uppercase tracking-widest text-white/60 block">Fondata</span>
              <span className="font-serif text-4xl text-white">{activeTenuta.year}</span>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-4 mb-8">
              {tenute.map((tenuta, index) => (
                <button
                  key={tenuta.id}
                  onClick={() => goToSlide(index)}
                  className={`relative w-20 h-20 md:w-24 md:h-24 overflow-hidden transition-all duration-500 ${
                    index === realIndex
                      ? 'ring-2 ring-chiarli-wine-light ring-offset-2 ring-offset-transparent scale-110'
                      : 'opacity-50 hover:opacity-100 grayscale hover:grayscale-0'
                  }`}
                >
                  <img
                    src={tenuta.image}
                    alt={tenuta.name}
                    className="w-full h-full object-cover"
                  />
                  {index === realIndex && (
                    <div className="absolute inset-0 border-2 border-chiarli-wine-light" />
                  )}
                </button>
              ))}
            </div>

            {/* Arrow Controls */}
            <div className="flex gap-4">
              <button
                onClick={goPrev}
                className="w-14 h-14 border border-white/30 flex items-center justify-center text-white hover:bg-chiarli-wine-light hover:border-chiarli-wine-light transition-all duration-300 group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={goNext}
                className="w-14 h-14 border border-white/30 flex items-center justify-center text-white hover:bg-chiarli-wine-light hover:border-chiarli-wine-light transition-all duration-300 group"
              >
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

        {/* Mini Map - Centered horizontally and vertically */}
        <div
          key={`map-${realIndex}`}
          className="absolute bottom-1/2 translate-y-1/2 left-1/2 -translate-x-1/2 w-80 h-40 md:w-[450px] md:h-56 animate-fade-in pointer-events-none"
        >
          <EmiliaRomagnaMap activePosition={activeTenuta.mapPosition} />
        </div>

      </div>

      {/* Side Dots */}
      <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
        {tenute.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === realIndex
                ? 'bg-chiarli-wine-light scale-125'
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};
