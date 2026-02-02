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
  mapPosition: { x: number; y: number };
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
    mapPosition: { x: 52, y: 58 }
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
    mapPosition: { x: 48, y: 42 }
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
    mapPosition: { x: 50, y: 48 }
  }
];

// Emilia-Romagna map component with interactive pins
const EmiliaRomagnaMapLight: React.FC<{
  activeIndex: number;
  hoveredIndex: number | null;
  onPinHover: (index: number | null) => void;
  onPinClick: (index: number) => void;
}> = ({ activeIndex, hoveredIndex, onPinHover, onPinClick }) => {
  // Posizioni delle tenute sulla mappa aggiornata
  // La regione grande occupa la maggior parte dello spazio a destra
  const mapPositions = [
    { x: 66, y: 52 },   // Castelvetro - poco più a sinistra di Spilamberto
    { x: 73, y: 30 },   // Bomporto - più a destra di Modena e più alto
    { x: 70, y: 46 },   // Spilamberto - leggermente a destra di Modena
  ];

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full -translate-x-[5%]">
        {/* Map image */}
        <img
          src="/maps.png"
          alt="Emilia-Romagna"
          className="w-full h-full object-contain opacity-70 scale-125"
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
              <div className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full border-2 border-chiarli-text/30 animate-ping" />
            )}

            {/* Outer glow */}
            <div
              className={`absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full transition-all duration-300 ${
                isActive || isHovered ? 'bg-chiarli-text/30 scale-100' : 'bg-chiarli-text/15 scale-75'
              }`}
            />

            {/* Inner circle */}
            <div
              className={`absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full transition-all duration-300 ${
                isActive || isHovered ? 'bg-chiarli-text scale-100' : 'bg-chiarli-text/70 scale-75'
              }`}
            />

            {/* Center dot */}
            <div className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-white" />

            {/* Location label */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 top-full mt-3 whitespace-nowrap transition-all duration-300 ${
                isActive || isHovered ? 'opacity-100' : 'opacity-70'
              }`}
            >
              <span className={`font-sans text-xs uppercase tracking-wider ${
                isActive ? 'text-chiarli-text font-bold' : 'text-chiarli-text/60'
              }`}>
                {tenute[index].location}
              </span>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export const TenuteSectionLight: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const activeTenuta = tenute[activeIndex];

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

  const goToSlide = (index: number) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(prev => (prev + 1) % tenute.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(prev => (prev - 1 + tenute.length) % tenute.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <section ref={sectionRef} id="tenute" data-section="tenute" data-content-type="tenute" className="bg-chiarli-stone py-24 md:py-32 overflow-hidden">

      <div className="max-w-[1800px] mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-xl">
            <span
              className={`font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-text/60 mb-4 block transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Le Nostre Tenute
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-chiarli-text leading-tight overflow-hidden">
              <span
                className={`block transition-all duration-700 delay-100 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Tre territori,
              </span>
              <span
                className={`italic text-chiarli-wine block transition-all duration-700 delay-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                un'anima
              </span>
            </h2>
          </div>
          <p
            className={`font-sans text-base text-chiarli-text/60 leading-relaxed max-w-md mt-6 md:mt-0 transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Passa sopra i pin sulla mappa per scoprire le nostre tenute.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Left: Map */}
          <div
            className={`relative h-[500px] md:h-[650px] transition-all duration-700 delay-500 ml-8 md:ml-12 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <EmiliaRomagnaMapLight
              activeIndex={activeIndex}
              hoveredIndex={hoveredIndex}
              onPinHover={setHoveredIndex}
              onPinClick={goToSlide}
            />
          </div>

          {/* Right: Tenuta Details */}
          <div
            className={`transition-all duration-700 delay-600 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            {/* Tenuta Name */}
            <h3
              key={`name-${activeIndex}`}
              className="font-serif text-4xl md:text-5xl text-chiarli-text mb-3 leading-none animate-fade-in-up"
            >
              {activeTenuta.name}
            </h3>

            {/* Location */}
            <p
              key={`loc-${activeIndex}`}
              className="flex items-center gap-2 text-chiarli-text/60 mb-6 animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              <MapPin size={16} />
              <span className="font-sans text-sm uppercase tracking-widest">{activeTenuta.location}</span>
            </p>

            {/* Description */}
            <p
              key={`desc-${activeIndex}`}
              className="font-sans text-chiarli-text/70 text-lg leading-relaxed max-w-lg mb-10 animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              {activeTenuta.description}
            </p>

            {/* Stats Grid */}
            <div
              key={`stats-${activeIndex}`}
              className="grid grid-cols-3 gap-6 mb-10 animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <div className="border-l-2 border-chiarli-text/20 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Grape size={16} className="text-chiarli-text/50" />
                  <span className="font-sans text-[10px] uppercase tracking-widest text-chiarli-text/40">Vitigno</span>
                </div>
                <span className="font-serif text-xl text-chiarli-text">{activeTenuta.grape}</span>
              </div>
              <div className="border-l-2 border-chiarli-text/20 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mountain size={16} className="text-chiarli-text/50" />
                  <span className="font-sans text-[10px] uppercase tracking-widest text-chiarli-text/40">Altitudine</span>
                </div>
                <span className="font-serif text-xl text-chiarli-text">{activeTenuta.altitude}</span>
              </div>
              <div className="border-l-2 border-chiarli-text/20 pl-4">
                <span className="font-sans text-[10px] uppercase tracking-widest text-chiarli-text/40 block mb-2">Ettari</span>
                <span className="font-serif text-xl text-chiarli-text">{activeTenuta.hectares}</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center">
              {/* Arrow Controls */}
              <div className="flex gap-3">
                <button
                  onClick={goPrev}
                  className="w-12 h-12 flex items-center justify-center text-chiarli-text hover:text-chiarli-wine transition-all duration-300 group"
                >
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={goNext}
                  className="w-12 h-12 flex items-center justify-center text-chiarli-text hover:text-chiarli-wine transition-all duration-300 group"
                >
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

          </div>

        </div>

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
          animation: fade-in-up 0.5s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
};
