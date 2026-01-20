import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Droplet, Snowflake, Sparkles, Wine } from 'lucide-react';

interface MetodoPageProps {
  onBack?: () => void;
}

export const MetodoPage: React.FC<MetodoPageProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-chiarli-text overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/foto/sozzigalli-29.jpg"
            alt="Il metodo Chiarli"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/55" />
          {/* Additional center vignette */}
          <div className="absolute inset-0 bg-radial-gradient-center" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-32 text-center">
          {/* Label */}
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white mb-6 block animate-fade-in" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            Il Nostro Metodo
          </span>

          {/* Title */}
          <h1 className="font-serif text-6xl md:text-8xl text-white mb-8 leading-none animate-fade-in-up" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)' }}>
            Preservare l'identità del <span className="italic text-chiarli-wine-light">Lambrusco</span>
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms', textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.7)' }}>
            Il metodo Charmat: l'evoluzione del Lambrusco
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

      {/* Section 1: L'Innovazione anni '50 - Image Right */}
      <div className="relative min-h-screen bg-chiarli-text overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left: Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 block">
                L'Innovazione
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
                <span className="block">L'Innovazione</span>
                <span className="italic text-chiarli-wine-light block">degli Anni '50</span>
              </h2>

              <p className="font-sans text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                Negli anni '50, la famiglia Chiarli ha rivoluzionato la produzione installando i primi autoclavi per il metodo Charmat, conferendo al Lambrusco una nuova identità.
              </p>

              <p className="font-serif italic text-xl text-white/70 border-l-2 border-white/30 pl-6 mb-10">
                I vini risultavano più freschi e puliti, con una scarsa attitudine all'invecchiamento dovuta ai pochi tannini naturali del Lambrusco, ma con un'espressione aromatica senza precedenti.
              </p>
            </div>
          </div>

          {/* Right: Full height image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden">
            <img
              src="/foto/a001-scaled.jpg"
              alt="Innovazione anni '50"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-chiarli-text/20 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-chiarli-text/20" />
          </div>
        </div>
      </div>

      {/* Section 2: Il Processo - Image Left - LIGHT */}
      <div className="relative min-h-screen bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left: Full height image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden order-1 lg:order-1">
            <img
              src="/foto/DSC04010.jpg"
              alt="Processo di vinificazione"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-white/20" />
          </div>

          {/* Right: Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0 order-2 lg:order-2">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-text/60 mb-6 block">
                La Vinificazione
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
                <span className="block">Il Processo di</span>
                <span className="italic text-chiarli-wine block">Vinificazione</span>
              </h2>

              <p className="font-sans text-chiarli-text/70 text-lg leading-relaxed mb-8 max-w-lg">
                Il metodo Charmat prevede due fermentazioni: la prima alcolica dopo la pigiatura, seguita da conservazione fino alla presa di spuma.
              </p>

              <p className="font-serif italic text-xl text-chiarli-text/70 border-l-2 border-chiarli-wine/30 pl-6 mb-10">
                Dopo un breve affinamento, il vino procede all'imbottigliamento, pronto per esprimere al meglio le caratteristiche del vitigno e del territorio.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Freschezza - Image Right */}
      <div className="relative min-h-screen bg-chiarli-text overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left: Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 block">
                L'Autenticità
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
                <span className="block">Freschezza e</span>
                <span className="italic text-chiarli-wine-light block">Autenticità</span>
              </h2>

              <p className="font-sans text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                I vini imbottigliati subito dopo la vendemmia restituivano l'identità più autentica del Lambrusco.
              </p>

              <p className="font-serif italic text-xl text-white/70 border-l-2 border-white/30 pl-6 mb-10">
                La famiglia Chiarli ha perfezionato la vinificazione per ottenere un vino che sembrasse appena fermentato durante tutto l'anno, estendendone conservabilità e apprezzamento mondiale.
              </p>
            </div>
          </div>

          {/* Right: Full height image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden">
            <img
              src="/foto/2.jpg"
              alt="Freschezza e autenticità"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-chiarli-text/20 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-chiarli-text/20" />
          </div>
        </div>
      </div>

      {/* Uniqueness Section - Full Screen Split - LIGHT */}
      <div className="relative min-h-screen bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left: Full height image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden">
            <img
              src="/foto/1.jpg"
              alt="L'unicità del metodo Chiarli"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20 lg:bg-gradient-to-r lg:from-transparent lg:to-white/20" />
          </div>

          {/* Right: Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-text/60 mb-6 block">
                L'Unicità
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
                <span className="block">L'Unicità del</span>
                <span className="italic text-chiarli-wine block">Metodo Chiarli</span>
              </h2>

              <p className="font-sans text-chiarli-text/70 text-lg leading-relaxed mb-8 max-w-lg">
                Il metodo richiede grande competenza. Le uve vengono pressate e macerate brevemente a freddo sulle bucce.
              </p>

              <p className="font-sans text-chiarli-text/70 text-lg leading-relaxed mb-8 max-w-lg">
                Il mosto non fermentato viene raffreddato in serbatoi refrigerati preservando gli zuccheri naturali.
              </p>

              <p className="font-serif italic text-xl text-chiarli-text/70 border-l-2 border-chiarli-wine/30 pl-6 mb-10">
                La presa di spuma avviene in autoclave utilizzando mosto fresco non fermentato, garantendo <strong className="text-chiarli-wine">freschezza, profumi e ricchezza aromatica</strong> nel tempo.
              </p>

              <a href="#vini" className="inline-flex items-center gap-3 text-chiarli-wine font-sans text-sm font-bold uppercase tracking-widest group">
                <span>Scopri i nostri vini</span>
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Process Steps Section */}
      <section className="relative min-h-screen bg-chiarli-text overflow-hidden flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/foto/sozzigalli-29.jpg"
            alt="Le Fasi del Metodo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/50 to-black/55" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-24 w-full">

          <div className="text-center mb-20">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 block">
              Il Processo
            </span>
            <h2 className="font-serif text-5xl md:text-6xl text-white mb-6">
              Le Fasi del <span className="italic text-chiarli-wine-light">Metodo</span>
            </h2>
            <p className="font-sans text-white/70 text-lg max-w-2xl mx-auto">
              Un processo studiato nei minimi dettagli per esaltare le caratteristiche del Lambrusco
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Step 1 */}
            <div className="bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-chiarli-wine-light/50">
              <div className="w-20 h-20 bg-chiarli-wine-light/20 rounded-full flex items-center justify-center mb-6">
                <span className="font-serif text-3xl text-chiarli-wine-light">1</span>
              </div>
              <h3 className="font-serif text-2xl text-white mb-4">Pressatura</h3>
              <p className="font-sans text-white/70 leading-relaxed">
                Le uve vengono pressate e macerate brevemente a freddo sulle bucce
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-chiarli-wine-light/50">
              <div className="w-20 h-20 bg-chiarli-wine-light/20 rounded-full flex items-center justify-center mb-6">
                <span className="font-serif text-3xl text-chiarli-wine-light">2</span>
              </div>
              <h3 className="font-serif text-2xl text-white mb-4">Refrigerazione</h3>
              <p className="font-sans text-white/70 leading-relaxed">
                Il mosto viene raffreddato in serbatoi preservando gli zuccheri naturali
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-chiarli-wine-light/50">
              <div className="w-20 h-20 bg-chiarli-wine-light/20 rounded-full flex items-center justify-center mb-6">
                <span className="font-serif text-3xl text-chiarli-wine-light">3</span>
              </div>
              <h3 className="font-serif text-2xl text-white mb-4">Presa di Spuma</h3>
              <p className="font-sans text-white/70 leading-relaxed">
                Fermentazione in autoclave con mosto fresco non fermentato
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-chiarli-wine-light/50">
              <div className="w-20 h-20 bg-chiarli-wine-light/20 rounded-full flex items-center justify-center mb-6">
                <span className="font-serif text-3xl text-chiarli-wine-light">4</span>
              </div>
              <h3 className="font-serif text-2xl text-white mb-4">Imbottigliamento</h3>
              <p className="font-sans text-white/70 leading-relaxed">
                Breve affinamento seguito dall'imbottigliamento per preservare la freschezza
              </p>
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
