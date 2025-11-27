import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wine, Thermometer, Award, ChevronDown, ArrowRight } from 'lucide-react';

interface WineDetailPageProps {
  onBack?: () => void;
}

export const WineDetailPage: React.FC<WineDetailPageProps> = ({ onBack }) => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredAward, setHoveredAward] = useState<number | null>(null);
  const [isHoveringBottle, setIsHoveringBottle] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setMousePosition({ x, y });
  };

  const awards = [
    { name: "Gambero Rosso", score: "Tre Bicchieri", years: "2019-2021" },
    { name: "Falstaff", score: "91-93/100", years: "2022" },
    { name: "Vitae AIS", score: "4 Viti", years: "2021" },
    { name: "Bibenda", score: "5 Grappoli", years: "2020" },
  ];

  const tastingNotes = [
    { title: "Aspetto", description: "Colore chiaro e vivace, con riflessi rosati. Spuma fine ed evanescente." },
    { title: "Profumo", description: "Bouquet floreale con note di viola e rosa canina. Sentori di lievito e crosta di pane." },
    { title: "Gusto", description: "Secco e sapido, freschezza vibrante. Finale lungo e persistente, di grande eleganza." },
  ];

  return (
    <div className="min-h-screen bg-white" onMouseMove={handleMouseMove}>

      {/* Global animated gradient that follows mouse */}
      <div
        className="fixed inset-0 pointer-events-none z-50 transition-all duration-500"
        style={{
          background: `radial-gradient(ellipse 40% 40% at ${mousePosition.x}% ${mousePosition.y}%, rgba(120,40,60,0.12) 0%, transparent 50%)`,
        }}
      />

      {/* Hero Section - Dark background with split layout */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-chiarli-text">

        {/* Red wine bubbles floating up */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(35)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${6 + (i % 5) * 4}px`,
                height: `${6 + (i % 5) * 4}px`,
                left: `${3 + (i * 2.8) % 94}%`,
                bottom: `-${8 + (i % 4) * 4}%`,
                background: `radial-gradient(circle at 30% 30%, rgba(180,60,80,${0.5 + (i % 4) * 0.1}), rgba(120,30,50,${0.3 + (i % 3) * 0.1}))`,
                boxShadow: `inset 0 0 ${3 + i % 4}px rgba(255,150,150,0.3), 0 0 ${6 + i % 5}px rgba(180,60,80,0.2)`,
                animation: `bubble-rise ${9 + (i % 6) * 2}s ease-in-out infinite`,
                animationDelay: `${(i * 0.35) % 9}s`,
              }}
            />
          ))}
        </div>

        {/* Back button */}
        <button
          onClick={onBack}
          className={`absolute top-6 left-4 md:top-8 md:left-8 z-50 flex items-center gap-2 text-white/60 hover:text-chiarli-wine-light transition-all duration-300 group ${
            isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
          }`}
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-sans text-xs font-bold uppercase tracking-widest hidden sm:inline">Torna ai vini</span>
        </button>

        {/* Split layout container */}
        <div className="w-full min-h-screen flex flex-col lg:flex-row relative z-10">

          {/* Mobile bottle - shown only on mobile at top */}
          <div className="lg:hidden w-full flex justify-center pt-24 pb-8">
            <div className="relative">
              {/* Decorative circles for mobile */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-white/5" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full border border-chiarli-wine-light/10" />
              <img
                src="/foto/003-uai-720x720.png"
                alt="Metodo del Fondatore"
                className="relative z-10 h-[35vh] w-auto object-contain"
                style={{
                  filter: `drop-shadow(0 0 60px rgba(60,20,35,0.8)) drop-shadow(0 0 30px rgba(80,30,45,0.6))`,
                }}
              />
            </div>
          </div>

          {/* Left side - Content */}
          <div className="w-full lg:w-1/2 flex items-center px-6 md:px-16 lg:px-20 py-8 lg:py-32">
            <div className="max-w-xl mx-auto lg:mx-0">
              <span
                className={`font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine-light mb-4 block transition-all duration-700 delay-300 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Metodo Ancestrale
              </span>

              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight">
                <span
                  className={`block transition-all duration-700 delay-400 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  Metodo del
                </span>
                <span
                  className={`block italic text-chiarli-wine-light transition-all duration-700 delay-500 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  Fondatore
                </span>
              </h1>

              <p
                className={`font-sans text-[11px] font-bold uppercase tracking-widest text-white/40 mb-6 transition-all duration-700 delay-600 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Lambrusco di Sorbara DOC
              </p>

              <p
                className={`font-serif text-base md:text-lg text-white/70 leading-relaxed mb-6 md:mb-8 transition-all duration-700 delay-700 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                Un omaggio alle origini. La tecnica ancestrale della rifermentazione in bottiglia
                che Cleto Chiarli utilizzava nel 1860, riscoperta per catturare l'essenza più pura del Sorbara.
              </p>

              {/* Quick specs in line */}
              <div
                className={`flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8 transition-all duration-700 delay-800 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 md:px-4 py-2 rounded-full hover:border-chiarli-wine-light/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(180,100,120,0.3)] transition-all duration-300 cursor-default">
                  <Wine size={14} className="text-chiarli-wine-light" />
                  <span className="font-sans text-[10px] md:text-xs font-medium text-white/70">11,5% vol.</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 md:px-4 py-2 rounded-full hover:border-chiarli-wine-light/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(180,100,120,0.3)] transition-all duration-300 cursor-default">
                  <Thermometer size={14} className="text-chiarli-wine-light" />
                  <span className="font-sans text-[10px] md:text-xs font-medium text-white/70">12-14°C</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 md:px-4 py-2 rounded-full hover:border-chiarli-wine-light/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(180,100,120,0.3)] transition-all duration-300 cursor-default">
                  <span className="font-sans text-[10px] md:text-xs font-medium text-white/70">Sorbara 100%</span>
                </div>
              </div>

              {/* CTA */}
              <div
                className={`flex flex-wrap gap-4 transition-all duration-700 delay-900 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <button className="bg-chiarli-wine-light text-white px-6 md:px-8 py-3 md:py-4 font-sans text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-chiarli-text hover:shadow-[0_0_30px_rgba(180,100,120,0.5)] transition-all duration-300 hover:scale-105">
                  Acquista Online
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Bottle more to the left */}
          <div className="hidden lg:flex w-1/2 items-center justify-start relative">

            {/* Floating award badge - top right */}
            <div
              className={`absolute top-20 right-8 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 transition-all duration-300 cursor-default hover:border-chiarli-wine-light/50 hover:bg-white/15 hover:shadow-[0_0_25px_rgba(180,100,120,0.4)] ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
              }`}
              style={{
                transform: `translateY(${Math.sin(scrollY * 0.01) * 10}px)`,
              }}
            >
              <div className="flex items-center gap-3">
                <Award size={20} className="text-chiarli-wine-light" />
                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-white/60">Gambero Rosso</p>
                  <p className="font-serif text-sm text-white">Tre Bicchieri</p>
                </div>
              </div>
            </div>

            {/* Floating award badge - bottom right */}
            <div
              className={`absolute bottom-28 right-8 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 transition-all duration-300 cursor-default hover:border-chiarli-wine-light/50 hover:bg-white/15 hover:shadow-[0_0_25px_rgba(180,100,120,0.4)] ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transform: `translateY(${Math.cos(scrollY * 0.01) * 8}px)`,
              }}
            >
              <div className="flex items-center gap-3">
                <Award size={20} className="text-chiarli-wine-light" />
                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-white/60">Falstaff</p>
                  <p className="font-serif text-sm text-white">93/100</p>
                </div>
              </div>
            </div>

            {/* Bottle and circles wrapper - keeps them together */}
            <div className="relative flex items-center justify-center">
              {/* Decorative circles - centered on bottle */}
              <div
                className="absolute w-[500px] h-[500px] rounded-full border border-white/5"
                style={{
                  transform: `rotate(${scrollY * 0.02}deg)`,
                }}
              />
              <div
                className="absolute w-[400px] h-[400px] rounded-full border border-chiarli-wine-light/10"
                style={{
                  transform: `rotate(${-scrollY * 0.03}deg)`,
                }}
              />

              {/* Bottle container */}
              <div
                className={`relative cursor-pointer transition-all duration-700 z-10 ${
                  isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              onMouseEnter={() => setIsHoveringBottle(true)}
              onMouseLeave={() => setIsHoveringBottle(false)}
              style={{
                transform: `
                  perspective(1000px)
                  rotateY(${(mousePosition.x - 50) * 0.08}deg)
                  rotateX(${(mousePosition.y - 50) * -0.04}deg)
                  translateY(${scrollY * 0.02}px)
                  scale(${isHoveringBottle ? 1.03 : 1})
                `,
                transition: 'transform 0.4s ease-out',
              }}
            >
              <img
                src="/foto/003-uai-720x720.png"
                alt="Metodo del Fondatore"
                className="relative z-10 h-[70vh] w-auto object-contain"
                style={{
                  filter: `
                    drop-shadow(0 0 80px rgba(60,20,35,0.8))
                    drop-shadow(0 0 40px rgba(80,30,45,0.6))
                  `,
                }}
              />
              </div>
            </div>

          </div>

          {/* Vintage year - bottom left of entire hero */}
          <div
            className={`absolute bottom-24 left-12 transition-all duration-1000 delay-600 hidden lg:block ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="font-serif text-[120px] font-light text-white/[0.03] leading-none">1860</p>
          </div>

        </div>

        {/* Scroll indicator - centered */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 delay-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white/40">Scopri</span>
          <ChevronDown size={20} className="text-chiarli-wine-light animate-bounce" />
        </div>
      </section>

      {/* Tasting Notes - Dynamic immersive section */}
      <section className="relative min-h-screen bg-chiarli-text overflow-hidden">

        {/* Background image with parallax */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${(scrollY - 800) * 0.15}px)`,
          }}
        >
          <img
            src="/foto/sozzigalli-24-uai-720x1080.jpg"
            alt="Vigneto Sorbara"
            className="w-full h-[120%] object-cover opacity-30"
          />
        </div>

        {/* Dark overlay to blend with previous section */}
        <div className="absolute inset-0 bg-gradient-to-b from-chiarli-text via-transparent to-chiarli-text" />

        {/* Floating bubbles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${4 + (i % 4) * 3}px`,
                height: `${4 + (i % 4) * 3}px`,
                left: `${5 + (i * 5) % 90}%`,
                bottom: `-${5 + (i % 3) * 3}%`,
                background: `radial-gradient(circle at 30% 30%, rgba(180,60,80,${0.4 + (i % 3) * 0.1}), rgba(120,30,50,${0.2}))`,
                animation: `bubble-rise ${10 + (i % 5) * 2}s ease-in-out infinite`,
                animationDelay: `${(i * 0.4) % 10}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 min-h-screen flex items-center py-16 md:py-24 lg:py-32">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 w-full">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

              {/* Left - Title and tabs */}
              <div>
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine-light mb-4 block">
                  Note di Degustazione
                </span>
                <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white mb-6 md:mb-8 leading-tight">
                  Un viaggio
                  <span className="italic text-chiarli-wine-light block">sensoriale</span>
                </h2>

                {/* Vertical tabs */}
                <div className="space-y-3 md:space-y-4">
                  {tastingNotes.map((note, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTab(index)}
                      className={`w-full text-left p-4 md:p-6 border transition-all duration-500 group ${
                        activeTab === index
                          ? 'bg-chiarli-wine-light/20 border-chiarli-wine-light shadow-[0_0_25px_rgba(180,100,120,0.4)]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(180,100,120,0.25)]'
                      }`}
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <span className={`font-serif text-2xl md:text-4xl transition-all duration-300 ${
                          activeTab === index
                            ? 'text-chiarli-wine-light drop-shadow-[0_0_20px_rgba(180,100,120,0.8)]'
                            : 'text-white/20 group-hover:text-white/40'
                        }`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className={`font-sans text-xs md:text-sm font-bold uppercase tracking-widest transition-colors ${
                          activeTab === index ? 'text-chiarli-wine-light' : 'text-white/60 group-hover:text-white'
                        }`}>
                          {note.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right - Content with animation - aligned to tabs */}
              <div className="relative mt-8 lg:mt-[175px]">
                <div className="absolute top-1/2 left-1/2 w-48 md:w-64 h-48 md:h-64 rounded-full border border-chiarli-wine-light/10 hidden md:block"
                  style={{ transform: `translate(-50%, -50%) rotate(${scrollY * 0.02}deg)` }}
                />
                <div className="absolute top-1/2 left-1/2 w-32 md:w-40 h-32 md:h-40 rounded-full border border-white/5 hidden md:block"
                  style={{ transform: `translate(-50%, -50%) rotate(${-scrollY * 0.03}deg)` }}
                />

                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-10 lg:p-12 hover:border-chiarli-wine-light/30 hover:shadow-[0_0_30px_rgba(180,100,120,0.2)] transition-all duration-500">
                  <div className="absolute top-0 left-0 w-12 md:w-20 h-1 bg-chiarli-wine-light" />
                  <div className="absolute top-0 left-0 w-1 h-12 md:h-20 bg-chiarli-wine-light" />

                  <p className="font-serif text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed mb-6 md:mb-8">
                    {tastingNotes[activeTab].description}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-[1px] bg-chiarli-wine-light" />
                    <span className="font-sans text-[10px] uppercase tracking-widest text-white/40">
                      {tastingNotes[activeTab].title}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Heritage Section - Full width split */}
      <section className="relative bg-chiarli-text overflow-hidden">
        <div className="flex flex-col lg:flex-row">

          {/* Left - Image */}
          <div className="w-full lg:w-1/2 h-[40vh] md:h-[50vh] lg:h-[80vh] relative">
            <img
              src="/foto/473621029_9076404249105544_259046815810117743_n-uai-720x1080.jpg"
              alt="Degustazione"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient overlay for text readability on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-chiarli-text via-transparent to-transparent lg:hidden" />
          </div>

          {/* Right - Content */}
          <div className="w-full lg:w-1/2 flex items-center relative bg-white">

            <div className="relative z-10 px-6 md:px-16 lg:px-20 py-12 md:py-16 lg:py-24">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine mb-4 block">
                La Storia
              </span>

              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-chiarli-text mb-6 md:mb-8 leading-tight">
                Il metodo che ha fatto
                <span className="italic text-chiarli-wine block">la storia</span>
              </h2>

              <p className="font-serif text-base md:text-lg text-chiarli-text/70 leading-relaxed mb-4 md:mb-6">
                Nel 1860, quando Cleto Chiarli iniziò la sua avventura nel mondo del vino,
                il Lambrusco veniva prodotto esclusivamente con la rifermentazione in bottiglia.
              </p>

              <p className="font-serif text-base md:text-lg text-chiarli-text/70 leading-relaxed mb-6 md:mb-8">
                Abbiamo riscoperto questa tecnica ancestrale per offrire un Lambrusco che unisce
                la freschezza e l'eleganza del Sorbara con le note di lievito tipiche
                della rifermentazione tradizionale.
              </p>

              <div className="border-l-2 border-chiarli-wine pl-4 md:pl-6">
                <p className="font-serif italic text-lg md:text-xl text-chiarli-wine">
                  "Un vino che racconta 160 anni di storia in ogni bollicina."
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Technical Specs - Dark dynamic section */}
      <section className="py-12 md:py-20 lg:py-28 bg-chiarli-text relative overflow-hidden">

        {/* Floating bubbles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${4 + (i % 4) * 3}px`,
                height: `${4 + (i % 4) * 3}px`,
                left: `${8 + (i * 9) % 84}%`,
                bottom: `-${5 + (i % 3) * 3}%`,
                background: `radial-gradient(circle at 30% 30%, rgba(180,60,80,${0.4 + (i % 3) * 0.1}), rgba(120,30,50,${0.2}))`,
                animation: `bubble-rise ${11 + (i % 5) * 2}s ease-in-out infinite`,
                animationDelay: `${(i * 0.5) % 11}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-12 relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">

            {/* Left: Title with decorative elements */}
            <div className="relative">
              {/* Decorative circle - hidden on mobile */}
              <div
                className="absolute -left-10 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-chiarli-wine-light/10 hidden lg:block"
                style={{ transform: `translateY(-50%) rotate(${scrollY * 0.02}deg)` }}
              />
              <div
                className="absolute -left-6 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-white/5 hidden lg:block"
                style={{ transform: `translateY(-50%) rotate(${-scrollY * 0.03}deg)` }}
              />

              <div className="relative z-10">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine-light mb-4 block">
                  Scheda Tecnica
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
                  I <span className="italic text-chiarli-wine-light">dettagli</span>
                  <span className="block">che fanno</span>
                  <span className="block">la differenza</span>
                </h2>

                {/* Decorative line */}
                <div className="mt-6 md:mt-8 flex items-center gap-4">
                  <div className="w-12 md:w-16 h-[1px] bg-chiarli-wine-light/50" />
                  <span className="font-sans text-[10px] uppercase tracking-widest text-white/30">Dal 1860</span>
                </div>
              </div>
            </div>

            {/* Right: Specs list */}
            <div className="space-y-4 md:space-y-6">
              {[
                { label: "Vitigno", value: "Lambrusco di Sorbara 100%" },
                { label: "Metodo", value: "Rifermentazione naturale in bottiglia" },
                { label: "Affinamento", value: "6 mesi sui lieviti" },
                { label: "Gradazione", value: "11,5% vol." },
                { label: "Temperatura di servizio", value: "12-14°C" },
                { label: "Formato", value: "0,75L" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-white/10 pb-3 md:pb-4 group hover:border-chiarli-wine-light/50 hover:shadow-[0_4px_15px_-5px_rgba(180,100,120,0.3)] transition-all duration-300 cursor-default"
                >
                  <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-chiarli-wine-light transition-colors mb-1 sm:mb-0">
                    {item.label}
                  </span>
                  <span className="font-serif text-base md:text-lg text-white group-hover:text-chiarli-wine-light transition-colors">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Awards - Dark dynamic section */}
      <section className="py-12 md:py-16 lg:py-20 bg-chiarli-text relative overflow-hidden">

        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-12 relative z-10">

          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine-light mb-4 block">
              Riconoscimenti
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white">
              Premiato dalla <span className="italic text-chiarli-wine-light">critica</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-8">
            {awards.map((award, index) => (
              <div
                key={index}
                className="text-center p-4 md:p-6 lg:p-8 bg-white/5 border border-white/10 hover:border-chiarli-wine-light/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(180,100,120,0.35)] transition-all duration-500 group cursor-default"
                onMouseEnter={() => setHoveredAward(index)}
                onMouseLeave={() => setHoveredAward(null)}
              >
                <Award
                  size={24}
                  className={`mx-auto mb-3 md:mb-4 transition-all duration-300 ${
                    hoveredAward === index ? 'text-chiarli-wine-light scale-110 drop-shadow-[0_0_15px_rgba(180,100,120,0.8)]' : 'text-white/30'
                  }`}
                />
                <h3 className="font-serif text-sm md:text-lg lg:text-xl text-white mb-1 group-hover:text-chiarli-wine-light transition-colors">
                  {award.name}
                </h3>
                <p className="font-sans text-[10px] md:text-xs font-bold text-chiarli-wine-light">
                  {award.score}
                </p>
                <p className="font-sans text-[9px] md:text-[10px] text-white/40 mt-1">
                  {award.years}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Food Pairing - Full width split like Heritage */}
      <section className="relative bg-white overflow-hidden">
        <div className="flex flex-col lg:flex-row">

          {/* Left - Full height image */}
          <div className="w-full lg:w-1/2 h-[40vh] md:h-[50vh] lg:h-[80vh] relative">
            <img
              src="/foto/ravioli-2063535_1280-uai-540x810.jpg"
              alt="Abbinamento gastronomico"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Right - Content */}
          <div className="w-full lg:w-1/2 flex items-center relative bg-white">

            <div className="relative z-10 px-6 md:px-16 lg:px-20 py-10 md:py-16 lg:py-24">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine mb-4 block">
                Abbinamenti
              </span>

              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-chiarli-text mb-6 md:mb-8 leading-tight">
                Il compagno ideale della
                <span className="italic text-chiarli-wine block">cucina emiliana</span>
              </h2>

              <p className="font-serif text-base md:text-lg text-chiarli-text/70 leading-relaxed mb-6 md:mb-8">
                La freschezza e la sapidità di questo Lambrusco lo rendono perfetto
                per accompagnare i piatti della tradizione.
              </p>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {[
                  "Tortellini in brodo",
                  "Prosciutto di Parma",
                  "Parmigiano Reggiano",
                  "Gnocco fritto",
                  "Tigelle e crescentine",
                  "Cotechino"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 md:gap-3 group cursor-default p-2 -m-2 rounded hover:bg-chiarli-wine/5 transition-all duration-300">
                    <div className="w-2 h-2 rounded-full bg-chiarli-wine/40 group-hover:bg-chiarli-wine group-hover:shadow-[0_0_10px_rgba(180,100,120,0.6)] transition-all duration-300 flex-shrink-0" />
                    <span className="font-sans text-xs md:text-sm text-chiarli-text/70 group-hover:text-chiarli-text transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-chiarli-text relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(180,100,120,0.15) 0%, transparent 60%)`,
          }}
        />

        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4 md:mb-6">
            Pronto a scoprire il
            <span className="italic text-chiarli-wine-light block">Metodo del Fondatore?</span>
          </h2>

          <p className="font-serif text-base md:text-lg text-white/60 mb-8 md:mb-10 max-w-xl mx-auto">
            Acquista online e ricevi direttamente a casa tua.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="group flex items-center gap-2 md:gap-3 bg-chiarli-wine-light text-white px-6 md:px-10 py-3 md:py-4 font-sans text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-chiarli-text hover:shadow-[0_0_35px_rgba(180,100,120,0.5)] transition-all duration-300 hover:scale-105">
              <span>Acquista Online</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* CSS for animations */}
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
