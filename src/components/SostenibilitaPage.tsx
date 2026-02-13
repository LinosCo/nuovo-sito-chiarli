import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Droplet } from "lucide-react";
import { useSostenibilitaContent } from "../hooks/useContent";

interface SostenibilitaPageProps {
  onBack?: () => void;
}

export const SostenibilitaPage: React.FC<SostenibilitaPageProps> = ({
  onBack,
}) => {
  const content = useSostenibilitaContent();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-chiarli-text overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/foto/sito/hero-sostenibilita.webp"
            alt="Sostenibilità Chiarli"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay - More intense */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/55" />
          {/* Additional center vignette */}
          <div className="absolute inset-0 bg-radial-gradient-center" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-32 text-center">
          {/* Label */}
          <span
            className="font-sans text-[10px] font-bold uppercase tracking-widest text-white mb-6 block animate-fade-in"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
          >
            {content.hero.label}
          </span>

          {/* Title with text shadow */}
          <h1
            className="font-serif text-4xl md:text-6xl lg:text-8xl text-white mb-8 leading-none animate-fade-in-up"
            style={{
              textShadow:
                "0 4px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            {content.hero.title.split("Equilibrio")[0]}
            <span className="italic text-chiarli-wine-light">Equilibrio</span>
          </h1>

          {/* Subtitle */}
          <p
            className="font-sans text-lg md:text-xl lg:text-2xl text-white max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
            style={{
              animationDelay: "200ms",
              textShadow:
                "0 2px 12px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.7)",
            }}
          >
            {content.hero.subtitle}
          </p>
        </div>

        <style>{`
          .bg-radial-gradient-center {
            background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%);
          }
        `}</style>
      </section>

      {/* Section 1: Portainnesti - Image Left */}
      <div
        ref={sectionRef}
        className="relative min-h-screen bg-chiarli-text overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left: Full height image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden">
            <img
              src="/foto/sito/portainnesti.webp"
              alt="Portainnesti differenziati"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-chiarli-text/20 lg:bg-gradient-to-r lg:from-transparent lg:to-chiarli-text/20" />
          </div>

          {/* Right: Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 block">
                {content.portainnesti.label}
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
                <span className="block">{content.portainnesti.titleLine1}</span>
                <span className="italic text-chiarli-wine-light block">
                  {content.portainnesti.titleLine2}
                </span>
              </h2>

              <p className="font-sans text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                {content.portainnesti.description}
              </p>

              <p className="font-serif italic text-xl text-white/70 border-l-2 border-white/30 pl-6 mb-10">
                {content.portainnesti.quote}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Agricoltura 4.0 - Image Right - LIGHT */}
      <div className="relative min-h-screen bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left: Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-text/60 mb-6 block">
                {content.agricoltura40.label}
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
                <span className="block">
                  {content.agricoltura40.titleLine1}
                </span>
                <span className="italic text-chiarli-wine block">
                  {content.agricoltura40.titleLine2}
                </span>
              </h2>

              <p className="font-sans text-chiarli-text/70 text-lg leading-relaxed mb-8 max-w-lg">
                {content.agricoltura40.description}
              </p>

              <p className="font-serif italic text-xl text-chiarli-text/70 border-l-2 border-chiarli-wine/30 pl-6 mb-10">
                {content.agricoltura40.quote}
              </p>
            </div>
          </div>

          {/* Right: Full height image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden">
            <img
              src="/foto/sito/sostenibilita-agricoltura40.webp"
              alt="Tecnologia nei vigneti"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-white/20" />
          </div>
        </div>
      </div>

      {/* Section 3: Biologico - Image Left */}
      <div className="relative min-h-screen bg-chiarli-text overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left: Full height image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden">
            <img
              src="/foto/sito/sozzigalli-29.webp"
              alt="Coltivazione biologica"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-chiarli-text/20 lg:bg-gradient-to-r lg:from-transparent lg:to-chiarli-text/20" />
          </div>

          {/* Right: Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 block">
                {content.biologico.label}
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
                <span className="block">{content.biologico.titleLine1}</span>
                <span className="italic text-chiarli-wine-light block">
                  {content.biologico.titleLine2}
                </span>
              </h2>

              <p className="font-sans text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                {content.biologico.description}
              </p>

              <p className="font-serif italic text-xl text-white/70 border-l-2 border-white/30 pl-6 mb-10">
                {content.biologico.quote}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Certificazione - Image Right - LIGHT */}
      <div className="relative min-h-screen bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left: Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-text/60 mb-6 block">
                {content.certificazione.label}
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
                <span className="block">
                  {content.certificazione.titleLine1}
                </span>
                <span className="italic text-chiarli-wine block">
                  {content.certificazione.titleLine2}
                </span>
              </h2>

              <p className="font-sans text-chiarli-text/70 text-lg leading-relaxed mb-8 max-w-lg">
                {content.certificazione.description}
              </p>

              <p className="font-serif italic text-xl text-chiarli-text/70 border-l-2 border-chiarli-wine/30 pl-6 mb-10">
                {content.certificazione.quote}
              </p>
            </div>
          </div>

          {/* Right: Full height image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden">
            <img
              src="/foto/sito/certificazione_equitas.webp"
              alt="Certificazione Equalitas"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-white/20" />
          </div>
        </div>
      </div>

      {/* Story Section */}
      <section className="relative bg-chiarli-text py-24 md:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                <img
                  src="/foto/sito/a001-scaled.webp"
                  alt="Vigneti Chiarli"
                  className="w-full h-[500px] object-cover shadow-2xl"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 border-4 border-chiarli-wine-light/30 transform translate-x-6 translate-y-6 -z-10" />
              </div>
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 block">
                {content.filosofia.label}
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
                {content.filosofia.title.split("storia familiare")[0]}
                <span className="italic text-chiarli-wine-light">
                  storia familiare
                </span>
              </h2>

              <p className="font-sans text-white/80 text-lg leading-relaxed mb-6">
                {content.filosofia.description1}
              </p>

              <p className="font-sans text-white/80 text-lg leading-relaxed mb-8">
                {content.filosofia.description2}
              </p>

              <a
                href="#/metodo"
                className="inline-flex items-center gap-3 text-chiarli-wine-light font-sans text-sm font-bold uppercase tracking-widest group cursor-pointer hover:text-white transition-colors duration-300"
              >
                <span>{content.filosofia.ctaText}</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-2 transition-transform duration-300"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
