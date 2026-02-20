import React, { useState, useEffect, useRef } from "react";
import { MapPin, ArrowRight, ArrowLeft, Grape, Mountain } from "lucide-react";
import { useTenute } from "../hooks/useContent";

interface TenutePageProps {
  onBack?: () => void;
}

// Emilia-Romagna map component - Same as TenuteSection
const EmiliaRomagnaMapDark: React.FC<{
  tenute: any[];
  activeIndex: number;
  hoveredIndex: number | null;
  onPinHover: (index: number | null) => void;
  onPinClick: (index: number) => void;
}> = ({ tenute, activeIndex, hoveredIndex, onPinHover, onPinClick }) => {
  const mapPositions = [
    { x: 74, y: 60, labelPosition: "bottom" as const }, // Castelvetro
    { x: 83, y: 18, labelPosition: "top" as const }, // Bomporto
    { x: 80, y: 50, labelPosition: "left" as const }, // Spilamberto
  ];

  const getLabelClasses = (position: "top" | "bottom" | "left" | "right") => {
    switch (position) {
      case "top":
        return "left-1/2 -translate-x-1/2 bottom-full mb-3";
      case "bottom":
        return "left-1/2 -translate-x-1/2 top-full mt-3";
      case "left":
        return "right-full mr-3 top-1/2 -translate-y-1/2";
      case "right":
        return "left-full ml-3 top-1/2 -translate-y-1/2";
    }
  };

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full translate-x-[8%]">
        <img
          src="/maps.png"
          alt="Emilia-Romagna"
          className="w-full h-full object-contain opacity-60 scale-125"
        />

        {/* River labels */}
        <div
          className="absolute whitespace-nowrap pointer-events-none"
          style={{ left: "68%", top: "3%" }}
        >
          <span
            className="text-[11px] font-black tracking-widest uppercase"
            style={{
              color: "#1e40af",
              textShadow:
                "1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 2px 2px 4px rgba(255,255,255,0.8)",
            }}
          >
            Fiume Secchia
          </span>
        </div>
        <div
          className="absolute whitespace-nowrap pointer-events-none"
          style={{ left: "65%", top: "75%" }}
        >
          <span
            className="text-[11px] font-black tracking-widest uppercase"
            style={{
              color: "#1e40af",
              textShadow:
                "1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 2px 2px 4px rgba(255,255,255,0.8)",
            }}
          >
            Fiume Panaro
          </span>
        </div>

        {/* Pin on regional map showing Modena city location */}
        <div
          className="absolute cursor-default transition-all duration-500"
          style={{
            left: "76%",
            top: "39%",
            transform: "translate(-50%, -50%)",
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

        {/* Pin on small Italy map (left side) showing Modena province */}
        <div
          className="absolute cursor-default transition-all duration-500"
          style={{
            left: "14%",
            top: "24%",
            transform: "translate(-50%, -50%)",
            zIndex: 5,
          }}
        >
          {/* Pulse effect */}
          <div className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full border-2 border-chiarli-wine-light/60 animate-ping" />

          {/* Outer glow */}
          <div className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-chiarli-wine-light/40" />

          {/* Pin dot */}
          <div className="absolute w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-chiarli-wine-light border border-white" />
          <div className="absolute w-1 h-1 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-white" />

          {/* Label */}
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="font-sans text-[10px] uppercase tracking-wider text-white/70 font-bold drop-shadow-lg">
              Provincia di Modena
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
                transform: "translate(-50%, -50%)",
                zIndex: isActive || isHovered ? 20 : 10,
              }}
              onMouseEnter={() => onPinHover(index)}
              onMouseLeave={() => onPinHover(null)}
              onClick={() => onPinClick(index)}
            >
              {(isActive || isHovered) && (
                <div className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full border-2 border-chiarli-wine-light/50 animate-ping" />
              )}

              <div
                className={`absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full transition-all duration-300 ${
                  isActive || isHovered
                    ? "bg-chiarli-wine-light/40 scale-100"
                    : "bg-chiarli-wine-light/20 scale-75"
                }`}
              />

              <div
                className={`absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full transition-all duration-300 ${
                  isActive || isHovered
                    ? "bg-chiarli-wine-light scale-100"
                    : "bg-chiarli-wine-light/60 scale-75"
                }`}
              />

              <div className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-white" />

              <div
                className={`absolute whitespace-nowrap transition-all duration-300 ${getLabelClasses(pos.labelPosition)} ${
                  isActive || isHovered ? "opacity-100" : "opacity-70"
                }`}
              >
                <span
                  className={`font-sans text-xs uppercase tracking-wider ${
                    isActive
                      ? "text-chiarli-wine-light font-bold"
                      : "text-white/70"
                  }`}
                >
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

export const TenutePage: React.FC<TenutePageProps> = ({ onBack }) => {
  const { tenute } = useTenute();

  const [slideIndex, setSlideIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Detailed content for each tenuta - focus on vitigni
  const tenuteDetails = [
    {
      name: "Tenuta Cialdini",
      subtitle: "Nel cuore del Lambrusco Grasparossa",
      location: "Castelvetro di Modena",
      description:
        "Oltre 140 anni di storia familiare e 50 ettari di vigneti nel cuore della zona di produzione del Lambrusco Grasparossa.",
      landscape:
        "Il microclima unico è caratterizzato da ventilazione costante e variazioni di temperatura significative, ideali per una produzione premium.",
      vitigni: [
        {
          name: "Lambrusco Grasparossa",
          description:
            "Il più classico dei Lambrusco modenesi. Vitigno autoctono a bacca nera con grappoli di medio-grandi dimensioni e buccia pruinosa.",
        },
        {
          name: "Pignoletto",
          description:
            "Vitigno autoctono a bacca bianca coltivato dal 1600. Grappoli compatti con acini piccoli e carattere aromatico.",
        },
      ],
      image: "/foto/sito/close-up-87-scaled.webp",
    },
    {
      name: "Tenuta Sozzigalli",
      subtitle: "Suoli alluvionali di Sorbara",
      location: "Bomporto",
      description:
        "30 ettari di vigneto senza irrigazione, dove i fiumi Panaro e Secchia hanno creato terreni unici ideali per il Lambrusco di Sorbara.",
      landscape:
        "Selezione massale proprietaria di cloni pre-fillossera. Terreni freschi e ben drenanti grazie alle brezze notturne fluviali.",
      vitigni: [
        {
          name: "Lambrusco di Sorbara",
          description:
            "Vitigno autoctono dal colore unico tra rosso e rosa. Grappolo lungo e spargolo con acini di media grandezza e buccia sottile.",
        },
      ],
      image: "/foto/sito/close-up-78-scaled.webp",
    },
    {
      name: "Tenuta Belvedere",
      subtitle: "Intensità e profondità",
      location: "Spilamberto",
      description:
        "25 ettari di vigneti su suoli alluvionali profondi alle pendici dell'Appennino modenese.",
      landscape:
        "Alta densità di impianto e gestione rigorosa per uve con rese naturalmente basse e alta concentrazione di antociani.",
      vitigni: [
        {
          name: "Lambrusco Grasparossa",
          description:
            "Selezione esclusiva di Tenuta Belvedere. Grappoli con buccia spessa e ricca di antociani per uve di grande struttura e intensità.",
        },
      ],
      image: "/foto/sito/close-up-26-scaled.webp",
    },
  ];

  const extendedTenute =
    tenute.length > 0 ? [tenute[tenute.length - 1], ...tenute, tenute[0]] : [];

  const realIndex =
    tenute.length > 0
      ? slideIndex === 0
        ? tenute.length - 1
        : slideIndex === extendedTenute.length - 1
          ? 0
          : slideIndex - 1
      : 0;

  const activeTenuta = tenute[realIndex];

  if (tenute.length === 0) {
    return null;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-advance slides every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goNext();
    }, 12000);

    return () => clearInterval(interval);
  }, [slideIndex, isAnimating]);

  useEffect(() => {
    if (!transitionEnabled) {
      const timer = setTimeout(() => setTransitionEnabled(true), 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled]);

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTransitionEnabled(true);
    setSlideIndex(index + 1);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const goNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTransitionEnabled(true);
    setSlideIndex((prev) => prev + 1);

    setTimeout(() => {
      setIsAnimating(false);
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
    setSlideIndex((prev) => prev - 1);

    setTimeout(() => {
      setIsAnimating(false);
      if (slideIndex - 1 === 0) {
        setTransitionEnabled(false);
        setSlideIndex(tenute.length);
      }
    }, 800);
  };

  const navigateToTenuta = (slug: string) => {
    window.location.hash = `#/tenute/${slug}`;
    window.scrollTo(0, 0);
  };

  return (
    <div ref={sectionRef}>
      {/* Hero Slider Section */}
      <section className="relative min-h-screen bg-chiarli-text overflow-hidden">
        {/* Fullscreen Background Image - Horizontal Slide */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`flex h-full ${transitionEnabled ? "transition-transform duration-1000 ease-out" : ""}`}
            style={{
              transform: `translateX(-${slideIndex * 100}%)`,
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              willChange: "transform",
            }}
          >
            {extendedTenute.map((tenuta, idx) => (
              <div
                key={`slide-${idx}`}
                className="min-w-full h-full flex-shrink-0"
                style={{
                  WebkitBackfaceVisibility: "hidden",
                  backfaceVisibility: "hidden",
                }}
              >
                <img
                  src={tenuta.image}
                  alt={tenuta.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/35 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/25" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center max-w-[1800px] mx-auto px-6 md:px-12 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Left: Text Content */}
            <div className="order-2 lg:order-1">
              <span
                className={`font-sans text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 block transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                Le Nostre Tenute
              </span>

              <h2
                key={`name-${realIndex}`}
                className="font-serif text-4xl md:text-5xl lg:text-7xl text-white mb-4 leading-none animate-fade-in-up"
              >
                {activeTenuta.name}
              </h2>

              <p
                key={`loc-${realIndex}`}
                className="flex items-center gap-2 text-white/70 mb-8 animate-fade-in-up"
                style={{ animationDelay: "100ms" }}
              >
                <MapPin size={16} />
                <span className="font-sans text-sm uppercase tracking-widest">
                  {activeTenuta.location}
                </span>
              </p>

              <p
                key={`desc-${realIndex}`}
                className="font-sans text-white/70 text-lg leading-relaxed max-w-lg mb-12 animate-fade-in-up"
                style={{ animationDelay: "200ms" }}
              >
                {activeTenuta.description}
              </p>

              {/* Stats Grid */}
              <div
                key={`stats-${realIndex}`}
                className="grid grid-cols-3 gap-4 md:gap-8 mb-12 animate-fade-in-up"
                style={{ animationDelay: "300ms" }}
              >
                <div className="border-l-2 border-white/30 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Grape size={16} className="text-white/50" />
                    <span className="font-sans text-[10px] uppercase tracking-widest text-white/40">
                      Vitigno
                    </span>
                  </div>
                  <span className="font-serif text-xl text-white">
                    {activeTenuta.grape}
                  </span>
                </div>
                <div className="border-l-2 border-white/30 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mountain size={16} className="text-white/50" />
                    <span className="font-sans text-[10px] uppercase tracking-widest text-white/40">
                      Altitudine
                    </span>
                  </div>
                  <span className="font-serif text-xl text-white">
                    {activeTenuta.altitude}
                  </span>
                </div>
                <div className="border-l-2 border-white/30 pl-4">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                    Ettari
                  </span>
                  <span className="font-serif text-xl text-white">
                    {activeTenuta.hectares}
                  </span>
                </div>
              </div>

              {/* Arrow Controls */}
              <div className="flex gap-4">
                <button
                  onClick={goPrev}
                  className="w-14 h-14 flex items-center justify-center text-white hover:text-chiarli-wine-light transition-all duration-300 group"
                >
                  <ArrowLeft
                    size={20}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                </button>
                <button
                  onClick={goNext}
                  className="w-14 h-14 flex items-center justify-center text-white hover:text-chiarli-wine-light transition-all duration-300 group"
                >
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>

            {/* Right: Empty column for balance */}
            <div className="order-1 lg:order-2"></div>
          </div>

          {/* Interactive Map */}
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

      {/* Tenuta Cialdini - Image Right - DARK */}
      <div className="relative min-h-screen bg-chiarli-text overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left: Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 block">
                Castelvetro di Modena
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
                <span className="block">Tenuta</span>
                <span className="italic text-chiarli-wine-light block">
                  Cialdini
                </span>
              </h2>

              <p className="font-serif italic text-xl text-chiarli-wine-light mb-8">
                Nel cuore del Lambrusco Grasparossa
              </p>

              <p className="font-sans text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                Oltre 140 anni di storia familiare e 50 ettari di vigneti nel
                cuore della zona di produzione del Lambrusco Grasparossa.
              </p>

              <p className="font-serif italic text-xl text-white/70 border-l-2 border-white/30 pl-6 mb-10">
                Il microclima unico è caratterizzato da ventilazione costante e
                variazioni di temperatura significative, ideali per una
                produzione premium.
              </p>

              <a
                href="#/tenute/cialdini"
                className="inline-flex items-center gap-3 bg-chiarli-wine hover:bg-chiarli-wine-light text-white font-sans text-sm font-bold uppercase tracking-widest px-8 py-4 transition-all duration-300 group"
              >
                <span>Scopri la tenuta</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-2 transition-transform duration-300"
                />
              </a>
            </div>
          </div>

          {/* Right: Full height image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden">
            <img
              src="/foto/sito/cialdini-tenuta.webp"
              alt="Tenuta Cialdini"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-chiarli-text/20 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-chiarli-text/20" />
          </div>
        </div>
      </div>

      {/* Tenuta Sozzigalli - Image Left - LIGHT */}
      <div className="relative min-h-screen bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left: Full height image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden">
            <img
              src="/foto/sito/sozzigalli-10.webp"
              alt="Uve Lambrusco di Sorbara"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-white/20" />
          </div>

          {/* Right: Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-text/60 mb-6 block">
                Bomporto
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
                <span className="block">Tenuta</span>
                <span className="italic text-chiarli-wine block">
                  Sozzigalli
                </span>
              </h2>

              <p className="font-serif italic text-xl text-chiarli-wine mb-8">
                Suoli alluvionali di Sorbara
              </p>

              <p className="font-sans text-chiarli-text/70 text-lg leading-relaxed mb-8 max-w-lg">
                30 ettari di vigneto senza irrigazione, dove i fiumi Panaro e
                Secchia hanno creato terreni unici ideali per il Lambrusco di
                Sorbara.
              </p>

              <p className="font-serif italic text-xl text-chiarli-text/70 border-l-2 border-chiarli-wine/30 pl-6 mb-10">
                Selezione massale proprietaria di cloni pre-fillossera. Terreni
                freschi e ben drenanti grazie alle brezze notturne fluviali.
              </p>

              <a
                href="#/tenute/sozzigalli"
                className="inline-flex items-center gap-3 bg-chiarli-wine hover:bg-chiarli-text text-white font-sans text-sm font-bold uppercase tracking-widest px-8 py-4 transition-all duration-300 group"
              >
                <span>Scopri la tenuta</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-2 transition-transform duration-300"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tenuta Belvedere - Image Right - DARK */}
      <div className="relative min-h-screen bg-chiarli-text overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left: Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 block">
                Spilamberto
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
                <span className="block">Tenuta</span>
                <span className="italic text-chiarli-wine-light block">
                  Belvedere
                </span>
              </h2>

              <p className="font-serif italic text-xl text-chiarli-wine-light mb-8">
                Intensità e profondità
              </p>

              <p className="font-sans text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                25 ettari di vigneti su suoli alluvionali profondi alle pendici
                dell'Appennino modenese.
              </p>

              <p className="font-serif italic text-xl text-white/70 border-l-2 border-white/30 pl-6 mb-10">
                Alta densità di impianto e gestione rigorosa per uve con rese
                naturalmente basse e alta concentrazione di antociani.
              </p>

              <a
                href="#/tenute/belvedere"
                className="inline-flex items-center gap-3 bg-chiarli-wine hover:bg-chiarli-wine-light text-white font-sans text-sm font-bold uppercase tracking-widest px-8 py-4 transition-all duration-300 group"
              >
                <span>Scopri la tenuta</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-2 transition-transform duration-300"
                />
              </a>
            </div>
          </div>

          {/* Right: Full height image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden">
            <img
              src="/foto/sito/grasparossa-vigneto.webp"
              alt="Vigneto Grasparossa Belvedere"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-chiarli-text/20 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-chiarli-text/20" />
          </div>
        </div>
      </div>
    </div>
  );
};
