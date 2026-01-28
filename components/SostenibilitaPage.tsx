import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Droplet } from 'lucide-react';

interface SostenibilitaPageProps {
  onBack?: () => void;
}

export const SostenibilitaPage: React.FC<SostenibilitaPageProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLElement>(null);
  const [counters, setCounters] = useState({ years: 0, tenute: 0, ettari: 0, cert: 2000 });

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
              years: Math.floor(160 * progress),
              tenute: Math.floor(3 * progress),
              ettari: Math.floor(195 * progress),
              cert: Math.floor(2000 + 25 * progress)
            });

            if (currentStep >= steps) {
              clearInterval(interval);
              setCounters({ years: 160, tenute: 3, ettari: 195, cert: 2025 });
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
            Il Nostro Impegno
          </span>

          {/* Title with text shadow */}
          <h1 className="font-serif text-6xl md:text-8xl text-white mb-8 leading-none animate-fade-in-up" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)' }}>
            Sostenibilità in <span className="italic text-chiarli-wine-light">Equilibrio</span>
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms', textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.7)' }}>
            Per Cleto Chiarli, la sostenibilità è un percorso che si costruisce nel tempo, con attenzione, competenza e rispetto per il territorio.
          </p>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse" />
            </div>
          </div>
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
                Adattamento
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
                <span className="block">Portainnesti</span>
                <span className="italic text-chiarli-wine-light block">Differenziati</span>
              </h2>

              <p className="font-sans text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                Nei vigneti sotto-collinari utilizziamo portainnesti scelti in funzione della resistenza alla siccità, adattando le piante alle condizioni specifiche del terreno.
              </p>

              <p className="font-serif italic text-xl text-white/70 border-l-2 border-white/30 pl-6 mb-10">
                Questa scelta agronomica permette alle viti di svilupparsi in armonia con l'ambiente, riducendo la necessità di interventi esterni e garantendo la massima espressione del terroir.
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
                Tecnologia
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
                <span className="block">Agricoltura</span>
                <span className="italic text-chiarli-wine block">4.0</span>
              </h2>

              <p className="font-sans text-chiarli-text/70 text-lg leading-relaxed mb-8 max-w-lg">
                Stazioni meteo e sensori guidano le nostre decisioni agronomiche, ottimizzando l'uso delle risorse e riducendo l'impatto ambientale.
              </p>

              <p className="font-serif italic text-xl text-chiarli-text/70 border-l-2 border-chiarli-wine/30 pl-6 mb-10">
                La tecnologia al servizio della tradizione: raccogliamo dati in tempo reale su temperatura, umidità e composizione del suolo per intervenire solo quando necessario.
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
                Sperimentazione
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
                <span className="block">Coltivazione</span>
                <span className="italic text-chiarli-wine-light block">Biologica</span>
              </h2>

              <p className="font-sans text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                Palestre di coltivazione biologica a scala controllata, dove sperimentiamo e perfezioniamo pratiche sostenibili.
              </p>

              <p className="font-serif italic text-xl text-white/70 border-l-2 border-white/30 pl-6 mb-10">
                Ogni parcella diventa un laboratorio a cielo aperto dove testiamo nuove tecniche di gestione organica del vigneto.
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
                Impegno Formale
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
                <span className="block">Certificazione</span>
                <span className="italic text-chiarli-wine block">Equalitas 2025</span>
              </h2>

              <p className="font-sans text-chiarli-text/70 text-lg leading-relaxed mb-8 max-w-lg">
                Percorso di certificazione Equalitas nel 2025 per l'intero Gruppo Chiarli 1860, con focus su buone pratiche economiche, sociali e ambientali.
              </p>

              <p className="font-serif italic text-xl text-chiarli-text/70 border-l-2 border-chiarli-wine/30 pl-6 mb-10">
                Un impegno formale che attesta la nostra dedizione verso la sostenibilità in tutte le sue dimensioni, dalla vigna alla bottiglia.
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
                La Nostra Filosofia
              </span>

              <h2 className="font-serif text-5xl md:text-6xl text-white mb-8 leading-tight">
                Un'immersione nella <span className="italic text-chiarli-wine-light">storia familiare</span>
              </h2>

              <p className="font-sans text-white/80 text-lg leading-relaxed mb-6">
                Dal 1860, la famiglia Chiarli coltiva la vite con dedizione e passione. Ogni generazione ha aggiunto il proprio contributo, innovando nel rispetto della tradizione e del territorio.
              </p>

              <p className="font-sans text-white/80 text-lg leading-relaxed mb-8">
                La sostenibilità non è per noi una moda, ma un impegno concreto che si traduce in scelte quotidiane, investimenti in ricerca e sviluppo, e una costante attenzione all'evoluzione delle migliori pratiche agricole.
              </p>

              <a href="#/metodo" className="inline-flex items-center gap-3 text-chiarli-wine-light font-sans text-sm font-bold uppercase tracking-widest group cursor-pointer hover:text-white transition-colors duration-300">
                <span>Il Metodo Chiarli</span>
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
