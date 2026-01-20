import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ArrowRight, ArrowLeft, Grape, Mountain } from 'lucide-react';
import { useTenute, useHomeContent } from '../hooks/useContent';

// Emilia-Romagna map component with interactive pins - Dark version
const EmiliaRomagnaMapDark: React.FC<{
  tenute: any[];
  activeIndex: number;
  hoveredIndex: number | null;
  onPinHover: (index: number | null) => void;
  onPinClick: (index: number) => void;
}> = ({ tenute, activeIndex, hoveredIndex, onPinHover, onPinClick }) => {
  // Posizioni delle tenute sulla mappa aggiornata
  // La regione grande occupa la maggior parte dello spazio a destra
  // Modena è nel centro-ovest della regione mostrata
  const mapPositions = [
    { x: 66, y: 52, labelPosition: 'bottom' as const },   // Castelvetro - poco più a sinistra di Spilamberto
    { x: 73, y: 30, labelPosition: 'top' as const },      // Bomporto - più a destra di Modena e più alto
    { x: 70, y: 46, labelPosition: 'left' as const },     // Spilamberto - leggermente a destra di Modena
  ];

  const getLabelClasses = (position: 'top' | 'bottom' | 'left' | 'right') => {
    switch (position) {
      case 'top':
        return 'left-1/2 -translate-x-1/2 bottom-full mb-3';
      case 'bottom':
        return 'left-1/2 -translate-x-1/2 top-full mt-3';
      case 'left':
        return 'right-full mr-3 top-1/2 -translate-y-1/2';
      case 'right':
        return 'left-full ml-3 top-1/2 -translate-y-1/2';
    }
  };

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full translate-x-[8%]">
        {/* Map image */}
        <img
          src="/maps.png"
          alt="Emilia-Romagna"
          className="w-full h-full object-contain opacity-60 scale-125"
        />

        {/* Pin on regional map showing Modena city location */}
        <div
          className="absolute cursor-default transition-all duration-500"
          style={{
            left: '67%',
            top: '39%',
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
          }}
        >
          {/* Pulse effect */}
          <div className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full border-2 border-black/50 animate-ping" />

          {/* Outer glow */}
          <div className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-black/40" />

          {/* Pin dot */}
          <div className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-black" />
          <div className="absolute w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-white" />

          {/* Label */}
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap">
            <span className="font-sans text-xs uppercase tracking-wider text-black font-bold">
              Modena
            </span>
          </div>
        </div>

        {/* Pin markers with labels */}
        {mapPositions.map((pos, index) => {
        const isActive = index === activeIndex;
        const isHovered = index === hoveredIndex;

        return (
          <div
            key={index}
            className="absolute cursor-pointer transition-all duration-500"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: isActive || isHovered ? 20 : 10,
            }}
            onMouseEnter={() => onPinHover(index)}
            onMouseLeave={() => onPinHover(null)}
            onClick={() => onPinClick(index)}
          >
            {/* Pulse ring - only on active/hovered */}
            {(isActive || isHovered) && (
              <div className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full border-2 border-chiarli-wine-light/50 animate-ping" />
            )}

            {/* Outer glow */}
            <div
              className={`absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full transition-all duration-300 ${
                isActive || isHovered ? 'bg-chiarli-wine-light/40 scale-100' : 'bg-chiarli-wine-light/20 scale-75'
              }`}
            />

            {/* Inner circle */}
            <div
              className={`absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full transition-all duration-300 ${
                isActive || isHovered ? 'bg-chiarli-wine-light scale-100' : 'bg-chiarli-wine-light/60 scale-75'
              }`}
            />

            {/* Center dot */}
            <div className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-white" />

            {/* Location label */}
            <div
              className={`absolute whitespace-nowrap transition-all duration-300 ${getLabelClasses(pos.labelPosition)} ${
                isActive || isHovered ? 'opacity-100' : 'opacity-70'
              }`}
            >
              <span className={`font-sans text-xs uppercase tracking-wider ${
                isActive ? 'text-chiarli-wine-light font-bold' : 'text-white/70'
              }`}>
                {tenute[index]?.location}
              </span>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export const TenuteSection: React.FC = () => {
  const { tenute } = useTenute();
  const homeContent = useHomeContent();

  // Per il loop infinito, usiamo un indice interno che include le slide duplicate
  const [slideIndex, setSlideIndex] = useState(1); // Iniziamo da 1 perché 0 è la slide duplicata
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Creiamo array con slide duplicate: [ultima, ...originali, prima]
  const extendedTenute = tenute.length > 0 ? [tenute[tenute.length - 1], ...tenute, tenute[0]] : [];

  // L'indice reale per i dati (0, 1, 2)
  const realIndex = tenute.length > 0
    ? (slideIndex === 0
        ? tenute.length - 1
        : slideIndex === extendedTenute.length - 1
          ? 0
          : slideIndex - 1)
    : 0;

  const activeTenuta = tenute[realIndex];

  // Guard per tenute vuote
  if (tenute.length === 0) {
    return null;
  }

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
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/35 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/25" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center max-w-[1800px] mx-auto px-6 md:px-12 py-24">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Left: Text Content */}
          <div className="order-2 lg:order-1">
            {/* Section Label */}
            <span
              className={`font-sans text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 block transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Le Nostre Tenute
            </span>

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
              className="flex items-center gap-2 text-white/70 mb-8 animate-fade-in-up"
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
              <div className="border-l-2 border-white/30 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Grape size={16} className="text-white/50" />
                  <span className="font-sans text-[10px] uppercase tracking-widest text-white/40">Vitigno</span>
                </div>
                <span className="font-serif text-xl text-white">{activeTenuta.grape}</span>
              </div>
              <div className="border-l-2 border-white/30 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mountain size={16} className="text-white/50" />
                  <span className="font-sans text-[10px] uppercase tracking-widest text-white/40">Altitudine</span>
                </div>
                <span className="font-serif text-xl text-white">{activeTenuta.altitude}</span>
              </div>
              <div className="border-l-2 border-white/30 pl-4">
                <span className="font-sans text-[10px] uppercase tracking-widest text-white/40 block mb-2">Ettari</span>
                <span className="font-serif text-xl text-white">{activeTenuta.hectares}</span>
              </div>
            </div>

            {/* CTA */}
            <a
              href={`#/tenute/${activeTenuta.slug}`}
              className="group inline-flex items-center gap-4 bg-chiarli-wine text-white px-8 py-4 hover:bg-white hover:text-chiarli-text transition-all duration-500 mb-6"
            >
              <span className="font-sans text-xs font-bold uppercase tracking-widest">Scopri la tenuta</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Arrow Controls */}
            <div className="flex gap-4">
              <button
                onClick={goPrev}
                className="w-14 h-14 flex items-center justify-center text-white hover:text-chiarli-wine-light transition-all duration-300 group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={goNext}
                className="w-14 h-14 flex items-center justify-center text-white hover:text-chiarli-wine-light transition-all duration-300 group"
              >
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right: Empty column for balance */}
          <div className="order-1 lg:order-2"></div>

        </div>

        {/* Interactive Map - Centered */}
        <div
          key={`map-${realIndex}`}
          className="absolute bottom-1/2 translate-y-1/2 left-1/2 -translate-x-[15%] w-96 h-64 md:w-[700px] md:h-[400px] animate-fade-in"
        >
          <EmiliaRomagnaMapDark
            tenute={tenute}
            activeIndex={realIndex}
            hoveredIndex={hoveredIndex}
            onPinHover={setHoveredIndex}
            onPinClick={goToSlide}
          />
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
