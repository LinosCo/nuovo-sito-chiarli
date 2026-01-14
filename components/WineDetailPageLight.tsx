import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Award, ChevronDown } from 'lucide-react';

interface WineDetailPageLightProps {
  onBack?: () => void;
}

export const WineDetailPageLight: React.FC<WineDetailPageLightProps> = ({ onBack }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const contentRef = useRef<HTMLElement>(null);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setContentVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const tastingNotes = [
    { title: "Aspetto", description: "Colore chiaro e vivace, con riflessi rosati. Spuma fine ed evanescente che invita alla degustazione." },
    { title: "Profumo", description: "Bouquet floreale con note di viola e rosa canina. Sentori di lievito e crosta di pane appena sfornato." },
    { title: "Gusto", description: "Secco e sapido, freschezza vibrante che esplode al palato. Finale lungo e persistente, di grande eleganza." },
  ];

  const specs = [
    { label: "Vitigno", value: "Lambrusco di Sorbara 100%" },
    { label: "Metodo", value: "Rifermentazione naturale" },
    { label: "Affinamento", value: "6 mesi sui lieviti" },
    { label: "Gradazione", value: "11,5% vol." },
    { label: "Temperatura", value: "12-14°C" },
  ];

  const awards = [
    { name: "Gambero Rosso", score: "Tre Bicchieri" },
    { name: "Falstaff", score: "93/100" },
    { name: "Vitae AIS", score: "4 Viti" },
    { name: "Bibenda", score: "5 Grappoli" },
  ];

  const pairings = [
    "Tortellini in brodo",
    "Prosciutto di Parma",
    "Parmigiano Reggiano",
    "Gnocco fritto",
    "Tigelle e crescentine",
    "Cotechino"
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero - Editorial Style with asymmetric grid */}
      <section className="relative min-h-screen">

        <div className="grid grid-cols-12 min-h-screen">

          {/* Left: Bottle display */}
          <div className="col-span-12 lg:col-span-5 relative h-[50vh] lg:h-auto order-1 lg:order-1 flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(165deg, #8B2332 0%, #6B1A26 50%, #4A0D15 100%)' }}>

            {/* Subtle radial glow effect */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 60%)'
            }} />

            {/* Sparkling wine bubbles - brighter and more visible */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(18)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${4 + (i % 3) * 2}px`,
                    height: `${4 + (i % 3) * 2}px`,
                    left: `${5 + (i * 5) % 90}%`,
                    bottom: `-${8 + (i % 4) * 5}%`,
                    background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,${0.5 + (i % 3) * 0.15}), rgba(255,220,230,${0.3 + (i % 3) * 0.1}))`,
                    boxShadow: `0 0 ${8 + i % 4}px rgba(255,255,255,0.4), inset 0 0 ${4 + i % 3}px rgba(255,255,255,0.3)`,
                    animation: `bubble-rise ${10 + (i % 5) * 2}s ease-in-out infinite`,
                    animationDelay: `${(i * 0.4) % 10}s`,
                  }}
                />
              ))}
            </div>

            {/* Decorative circles - bright and visible on dark background */}
            <div className="absolute w-[280px] h-[280px] lg:w-[500px] lg:h-[500px] rounded-full border-2 border-white/20" style={{ boxShadow: '0 0 30px rgba(255,255,255,0.1)' }} />
            <div className="absolute w-[220px] h-[220px] lg:w-[400px] lg:h-[400px] rounded-full border-2 border-chiarli-wine-light/40" style={{ boxShadow: '0 0 20px rgba(214,69,80,0.2)' }} />

            {/* Bottle */}
            <img
              src="/foto/003-uai-720x720.png"
              alt="Metodo del Fondatore"
              className={`relative z-10 h-[40vh] lg:h-[70vh] w-auto object-contain transition-all duration-1000 ${
                isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            />

            {/* Back button */}
            <button
              onClick={onBack}
              className={`absolute top-8 left-8 z-50 flex items-center gap-3 text-white/80 hover:text-white transition-all duration-300 group ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-sans text-xs font-medium uppercase tracking-[0.2em]">Torna ai vini</span>
            </button>
          </div>

          {/* Right: Content on white */}
          <div className="col-span-12 lg:col-span-7 flex items-center order-2 lg:order-2 bg-white">
            <div className="px-8 md:px-16 lg:px-20 xl:px-32 py-16 lg:py-24 max-w-3xl">

              {/* Label */}
              <span
                className={`font-sans text-[10px] font-medium uppercase tracking-[0.4em] text-chiarli-text/40 block mb-8 transition-all duration-1000 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Metodo Ancestrale
              </span>

              {/* Title - Large editorial */}
              <h1
                className={`mb-6 transition-all duration-1000 delay-100 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <span className="font-serif text-[10vw] lg:text-[5vw] text-chiarli-text block leading-[0.9]">
                  Metodo del
                </span>
                <span className="font-serif italic text-[10vw] lg:text-[5vw] text-chiarli-wine block leading-[0.9]">
                  Fondatore
                </span>
              </h1>

              {/* Denomination */}
              <p
                className={`font-sans text-xs font-medium uppercase tracking-[0.3em] text-chiarli-text/40 mb-8 transition-all duration-1000 delay-200 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Lambrusco di Sorbara DOC
              </p>

              {/* Description */}
              <p
                className={`font-sans text-base lg:text-lg text-chiarli-text/70 leading-relaxed mb-12 max-w-lg transition-all duration-1000 delay-300 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Un omaggio alle origini. La tecnica ancestrale della rifermentazione in bottiglia
                che Cleto Chiarli utilizzava nel 1860, riscoperta per catturare l'essenza più pura del Sorbara.
              </p>

              {/* Specs inline */}
              <div
                className={`flex flex-wrap gap-x-8 gap-y-4 mb-12 transition-all duration-1000 delay-400 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-chiarli-text/40 block mb-1">Vitigno</span>
                  <span className="font-serif text-lg text-chiarli-text">Sorbara 100%</span>
                </div>
                <div className="w-px bg-chiarli-text/10" />
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-chiarli-text/40 block mb-1">Gradazione</span>
                  <span className="font-serif text-lg text-chiarli-text">11,5%</span>
                </div>
                <div className="w-px bg-chiarli-text/10" />
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-chiarli-text/40 block mb-1">Servire a</span>
                  <span className="font-serif text-lg text-chiarli-text">12-14°C</span>
                </div>
              </div>

              {/* CTA */}
              <div
                className={`flex items-center gap-8 transition-all duration-1000 delay-500 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <a
                  href="#"
                  className="group flex items-center gap-3 bg-chiarli-wine text-white px-8 py-4 hover:bg-chiarli-text transition-all duration-300"
                >
                  <span className="font-sans text-xs font-medium uppercase tracking-[0.2em]">Acquista Online</span>
                  <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 delay-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="font-sans text-[10px] font-medium tracking-[0.3em] text-chiarli-text/40 uppercase">Scopri</span>
          <ChevronDown size={16} className="text-chiarli-text/40 animate-bounce" />
        </div>

      </section>

      {/* Awards Section */}
      <section className="grid grid-cols-12">

        {/* Left: Awards */}
        <div className="col-span-12 lg:col-span-5 bg-white py-16 md:py-24 px-8 md:px-16 lg:px-20 flex items-center">
          <div>
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.4em] text-chiarli-text/40 block mb-6">
              Riconoscimenti
            </span>
            <h2 className="font-serif text-[8vw] lg:text-[3vw] text-chiarli-text leading-[0.9] mb-10">
              Premiato dalla
              <span className="italic text-chiarli-wine block"> critica</span>
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {awards.map((award, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-3 p-4 bg-chiarli-stone border border-chiarli-text/10 hover:border-chiarli-wine/30 transition-all duration-300"
                >
                  <Award size={24} className="text-chiarli-text/20 group-hover:text-chiarli-wine transition-colors" />
                  <div>
                    <span className="font-serif text-base text-chiarli-text block group-hover:text-chiarli-wine transition-colors">
                      {award.name}
                    </span>
                    <span className="font-sans text-xs font-medium text-chiarli-wine">
                      {award.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Image */}
        <div className="col-span-12 lg:col-span-7 h-[50vh] lg:h-auto relative">
          <img
            src="/foto/close-up-78-scaled.jpeg"
            alt="Vigneto Chiarli"
            className="w-full h-full object-cover"
          />
        </div>

      </section>

      {/* Tasting Notes - Editorial tabs */}
      <section ref={contentRef} className="relative py-24 md:py-32 bg-chiarli-stone overflow-hidden">

        {/* Floating bubbles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${3 + (i % 4) * 1.5}px`,
                height: `${3 + (i % 4) * 1.5}px`,
                left: `${5 + (i * 4.5) % 90}%`,
                bottom: `-${5 + (i % 4) * 3}%`,
                background: `radial-gradient(circle at 30% 30%, rgba(180,60,80,${0.4 + (i % 3) * 0.1}), rgba(120,30,50,${0.25 + (i % 3) * 0.1}))`,
                boxShadow: `0 0 ${4 + i % 3}px rgba(180,60,80,0.2)`,
                animation: `bubble-rise ${10 + (i % 4) * 2}s ease-in-out infinite`,
                animationDelay: `${(i * 0.4) % 10}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-20 relative z-10">

          <div className="grid grid-cols-12 gap-8 lg:gap-16">

            {/* Left: Section header */}
            <div className="col-span-12 lg:col-span-4 relative">

              <span
                className={`font-sans text-[10px] font-medium uppercase tracking-[0.4em] text-chiarli-text/40 block mb-6 transition-all duration-1000 ${
                  contentVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Note di Degustazione
              </span>
              <h2
                className={`font-serif text-[8vw] lg:text-[3.5vw] text-chiarli-text leading-[0.9] mb-8 transition-all duration-1000 delay-100 ${
                  contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Un viaggio
                <span className="italic text-chiarli-wine block">sensoriale</span>
              </h2>

              {/* Tabs */}
              <div className="space-y-2">
                {tastingNotes.map((note, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`w-full text-left py-5 border-l-3 pl-6 transition-all duration-500 group relative ${
                      activeTab === index
                        ? 'border-chiarli-wine text-chiarli-text bg-white/30 shadow-[inset_0_0_30px_rgba(180,60,80,0.1)] scale-[1.02]'
                        : 'border-chiarli-text/10 text-chiarli-text/40 hover:text-chiarli-text hover:border-chiarli-wine/50 hover:bg-white/20 hover:pl-8 hover:scale-[1.01]'
                    }`}
                  >
                    <span className={`font-sans text-xs font-medium uppercase tracking-[0.2em] transition-all duration-500 ${
                      activeTab === index ? 'text-chiarli-wine' : 'group-hover:text-chiarli-wine/80'
                    }`}>
                      {note.title}
                    </span>
                    {/* Indicator line on hover */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-chiarli-wine transition-all duration-500 ${
                      activeTab === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Content */}
            <div className="col-span-12 lg:col-span-8 flex items-center">
              <div
                className={`transition-all duration-1000 delay-200 ${
                  contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <p
                  key={`note-${activeTab}`}
                  className="font-serif text-3xl lg:text-4xl xl:text-5xl text-chiarli-text/80 leading-relaxed"
                >
                  {tastingNotes[activeTab].description}
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Heritage - Full width image with overlay */}
      <section className="relative min-h-[80vh]">
        <div className="absolute inset-0">
          <img
            src="/foto/chiarli.jpg"
            alt="Villa Chiarli"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 min-h-[80vh] flex items-center">
          <div className="w-full px-8 md:px-16 lg:px-20 py-24">
            <div className="max-w-2xl">

              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.4em] text-white/50 block mb-8">
                La Storia
              </span>

              <h2 className="font-serif text-[8vw] lg:text-[4vw] text-white leading-[0.9] mb-8">
                <span className="block">Il metodo</span>
                <span className="block">che ha fatto</span>
                <span className="block italic text-white/90">la storia</span>
              </h2>

              <p className="font-sans text-base lg:text-lg text-white/80 leading-relaxed mb-8 max-w-lg text-left">
                Nel 1860, quando Cleto Chiarli iniziò la sua avventura nel mondo del vino,
                il Lambrusco veniva prodotto esclusivamente con la rifermentazione in bottiglia.
                Abbiamo riscoperto questa tecnica ancestrale per offrire un Lambrusco autentico.
              </p>

              <a
                href="#"
                className="group inline-flex items-center gap-3 text-white hover:text-chiarli-wine transition-colors"
              >
                <span className="font-sans text-xs font-medium uppercase tracking-[0.2em]">Scopri la nostra storia</span>
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </a>

            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs - Clean editorial grid */}
      <section className="relative py-24 md:py-32 bg-white border-t border-chiarli-text/10 overflow-hidden">

        {/* Floating bubbles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${3 + (i % 3) * 1.5}px`,
                height: `${3 + (i % 3) * 1.5}px`,
                left: `${5 + (i * 6) % 90}%`,
                bottom: `-${5 + (i % 3) * 3}%`,
                background: `radial-gradient(circle at 30% 30%, rgba(180,60,80,${0.25 + (i % 3) * 0.1}), rgba(120,30,50,${0.15}))`,
                animation: `bubble-rise ${12 + (i % 4) * 3}s ease-in-out infinite`,
                animationDelay: `${(i * 0.5) % 12}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-20 relative z-10">

          <div className="grid grid-cols-12 gap-8 lg:gap-16">

            <div className="col-span-12 lg:col-span-4">
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.4em] text-chiarli-text/40 block mb-6">
                Scheda Tecnica
              </span>
              <h2 className="font-serif text-[8vw] lg:text-[3.5vw] text-chiarli-text leading-[0.9]">
                I dettagli
                <span className="italic text-chiarli-wine block">che contano</span>
              </h2>
            </div>

            <div className="col-span-12 lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {specs.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-chiarli-text/10 pb-6"
                  >
                    <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-chiarli-text/40 block mb-2">
                      {item.label}
                    </span>
                    <span className="font-serif text-xl text-chiarli-text">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Food Pairing - Split layout */}
      <section className="grid grid-cols-1 lg:grid-cols-2">

        {/* Image */}
        <div className="h-[45vh] lg:h-[70vh] relative">
          <img
            src="/foto/ravioli-2063535_1280-uai-540x810.jpg"
            alt="Abbinamento gastronomico"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex items-center bg-chiarli-stone">
          <div className="px-8 md:px-16 lg:px-20 py-16 lg:py-24">

            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.4em] text-chiarli-text/40 block mb-6">
              Abbinamenti
            </span>

            <h2 className="font-serif text-[8vw] lg:text-[3vw] text-chiarli-text leading-[0.9] mb-8">
              Perfetto con la
              <span className="italic text-chiarli-wine block">cucina emiliana</span>
            </h2>

            <p className="font-sans text-base text-chiarli-text/60 leading-relaxed mb-10 max-w-lg">
              La freschezza e la sapidità di questo Lambrusco lo rendono il compagno ideale per i piatti della tradizione.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {pairings.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-chiarli-wine" />
                  <span className="font-sans text-sm text-chiarli-text/70">{item}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </section>

      {/* CTA - Minimal */}
      <section className="py-24 md:py-32 bg-white border-t border-chiarli-text/10">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-20 text-center">

          <h2 className="font-serif text-[8vw] lg:text-[4vw] text-chiarli-text leading-[0.9] mb-8">
            Pronto a scoprire il
            <span className="italic text-chiarli-wine block">Metodo del Fondatore?</span>
          </h2>

          <a
            href="#"
            className="group inline-flex items-center gap-3 bg-chiarli-wine text-white px-10 py-4 hover:bg-chiarli-text transition-all duration-300"
          >
            <span className="font-sans text-xs font-medium uppercase tracking-[0.2em]">Acquista Online</span>
            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </a>

        </div>
      </section>

      {/* CSS for bubble animations */}
      <style>{`
        @keyframes bubble-rise {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          50% {
            transform: translateY(-50vh) translateX(10px) scale(1.05);
            opacity: 0.3;
          }
          90% {
            opacity: 0.1;
          }
          100% {
            transform: translateY(-110vh) translateX(-5px) scale(0.9);
            opacity: 0;
          }
        }
      `}</style>

    </div>
  );
};
