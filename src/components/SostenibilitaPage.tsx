import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Droplet } from 'lucide-react';
import { useSostenibilitaContent } from '../hooks/useContent';

interface SostenibilitaPageProps {
  onBack?: () => void;
}

export const SostenibilitaPage: React.FC<SostenibilitaPageProps> = ({ onBack }) => {
  const content = useSostenibilitaContent();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLElement>(null);
  const [counters, setCounters] = useState({ years: 0, tenute: 0, ettari: 0, cert: 2000 });
  const targetStats = content.stats;

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

  // Stats counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true);

          // Animate counters
          const duration = 2000; // 2 seconds
          const steps = 60;
          const stepDuration = duration / steps;

          let currentStep = 0;
          const interval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            setCounters({
              years: Math.floor(targetStats.anniStoria * progress),
              tenute: Math.floor(targetStats.tenuteStoriche * progress),
              ettari: Math.floor(targetStats.ettariVigneti * progress),
              cert: Math.floor(2000 + (targetStats.annoCertificazione - 2000) * progress)
            });

            if (currentStep >= steps) {
              clearInterval(interval);
              setCounters({
                years: targetStats.anniStoria,
                tenute: targetStats.tenuteStoriche,
                ettari: targetStats.ettariVigneti,
                cert: targetStats.annoCertificazione
              });
            }
          }, stepDuration);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [statsVisible]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-chiarli-text overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/foto/CHIARLI-1860_WEBSITE-IMAGES_03_09_257467_16x9-scaled.jpeg"
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
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white mb-6 block animate-fade-in" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            {content.hero.label}
          </span>

          {/* Title with text shadow */}
          <h1 className="font-serif text-6xl md:text-8xl text-white mb-8 leading-none animate-fade-in-up" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)' }}>
            {content.hero.title.split('Equilibrio')[0]}<span className="italic text-chiarli-wine-light">Equilibrio</span>
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms', textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.7)' }}>
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
      <div ref={sectionRef} className="relative min-h-screen bg-chiarli-text overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left: Full height image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden">
            <img
              src="/foto/DSC04010.jpg"
              alt="Vigneti sotto-collinari"
              className="w-full h-full object-cover"
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
                <span className="italic text-chiarli-wine-light block">{content.portainnesti.titleLine2}</span>
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
                <span className="block">{content.agricoltura40.titleLine1}</span>
                <span className="italic text-chiarli-wine block">{content.agricoltura40.titleLine2}</span>
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
              src="/foto/sostenibilita-agricoltura40.jpg"
              alt="Tecnologia nei vigneti"
              className="w-full h-full object-cover"
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
              src="/foto/sozzigalli-29.jpg"
              alt="Coltivazione biologica"
              className="w-full h-full object-cover"
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
                <span className="italic text-chiarli-wine-light block">{content.biologico.titleLine2}</span>
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
                <span className="block">{content.certificazione.titleLine1}</span>
                <span className="italic text-chiarli-wine block">{content.certificazione.titleLine2}</span>
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
              src="/foto/2.jpg"
              alt="Certificazione Equalitas"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-white/20" />
          </div>
        </div>
      </div>

      {/* Story Section */}
      <section className="relative bg-chiarli-text py-24 md:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                <img
                  src="/foto/a001-scaled.jpg"
                  alt="Vigneti Chiarli"
                  className="w-full h-[500px] object-cover shadow-2xl"
                />
                <div className="absolute inset-0 border-4 border-chiarli-wine-light/30 transform translate-x-6 translate-y-6 -z-10" />
              </div>
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 block">
                {content.filosofia.label}
              </span>

              <h2 className="font-serif text-5xl md:text-6xl text-white mb-8 leading-tight">
                {content.filosofia.title.split('storia familiare')[0]}<span className="italic text-chiarli-wine-light">storia familiare</span>
              </h2>

              <p className="font-sans text-white/80 text-lg leading-relaxed mb-6">
                {content.filosofia.description1}
              </p>

              <p className="font-sans text-white/80 text-lg leading-relaxed mb-8">
                {content.filosofia.description2}
              </p>

              <a href="#/metodo" className="inline-flex items-center gap-3 text-chiarli-wine-light font-sans text-sm font-bold uppercase tracking-widest group cursor-pointer hover:text-white transition-colors duration-300">
                <span>{content.filosofia.ctaText}</span>
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section - INTERACTIVE */}
      <section ref={statsRef} className="relative bg-chiarli-wine py-24 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">

            {/* Stat 1 - Anni di Storia */}
            <div
              className={`group relative transition-all duration-700 ${
                statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '0ms' }}
            >
              <div className="relative p-8 text-center transform transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Counter */}
                <div className="relative font-serif text-6xl md:text-7xl lg:text-8xl text-white mb-4 font-bold">
                  {counters.years}
                  <span className="text-chiarli-wine-light">+</span>
                </div>

                {/* Label */}
                <div className="relative font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-white/80 group-hover:text-white transition-colors duration-300">
                  Anni di Storia
                </div>

                {/* Decorative line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-white/50 group-hover:w-20 transition-all duration-500" />
              </div>
            </div>

            {/* Stat 2 - Tenute Storiche */}
            <div
              className={`group relative transition-all duration-700 ${
                statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <div className="relative p-8 text-center transform transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative font-serif text-6xl md:text-7xl lg:text-8xl text-white mb-4 font-bold">
                  {counters.tenute}
                </div>

                <div className="relative font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-white/80 group-hover:text-white transition-colors duration-300">
                  Tenute Storiche
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-white/50 group-hover:w-20 transition-all duration-500" />
              </div>
            </div>

            {/* Stat 3 - Ettari di Vigneti */}
            <div
              className={`group relative transition-all duration-700 ${
                statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="relative p-8 text-center transform transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative font-serif text-6xl md:text-7xl lg:text-8xl text-white mb-4 font-bold">
                  {counters.ettari}
                </div>

                <div className="relative font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-white/80 group-hover:text-white transition-colors duration-300">
                  Ettari di Vigneti
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-white/50 group-hover:w-20 transition-all duration-500" />
              </div>
            </div>

            {/* Stat 4 - Certificazione */}
            <div
              className={`group relative transition-all duration-700 ${
                statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '450ms' }}
            >
              <div className="relative p-8 text-center transform transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative font-serif text-6xl md:text-7xl lg:text-8xl text-white mb-4 font-bold">
                  {counters.cert}
                </div>

                <div className="relative font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-white/80 group-hover:text-white transition-colors duration-300">
                  Certificazione Equalitas
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-white/50 group-hover:w-20 transition-all duration-500" />
              </div>
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
