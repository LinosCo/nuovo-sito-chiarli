import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wine, Thermometer, Award, ChevronDown, ArrowRight } from 'lucide-react';

interface WineDetailPageProps {
  slug?: string;
  onBack?: () => void;
}

interface WineData {
  id: number;
  slug: string;
  name: string;
  denomination: string;
  family: string;
  description: string;
  image: string | null;
  format: string;
  tags: string[];
  price: number | null;
  year: number | null;
  alcohol: number | null;
  servingTemp: string | null;
  pairings: string[];
  awards: Array<{ name: string; score: string; years: string }>;
  tastingNotes: {
    aspetto: string | null;
    profumo: string | null;
    gusto: string | null;
  };
  isActive: boolean;
  order: number;
}

export const WineDetailPage: React.FC<WineDetailPageProps> = ({ slug = 'metodo-del-fondatore', onBack }) => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredAward, setHoveredAward] = useState<number | null>(null);
  const [isHoveringBottle, setIsHoveringBottle] = useState(false);
  const [wineData, setWineData] = useState<WineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedWines, setRelatedWines] = useState<WineData[]>([]);

  useEffect(() => {
    const loadWineData = async () => {
      try {
        setLoading(true);
        // Add cache busting to ensure fresh data
        const timestamp = new URL(window.location.href).searchParams.get('t') || Date.now();
        const response = await fetch(`/content/wines.json?t=${timestamp}`);
        const data = await response.json();
        const wine = data.wines.find((w: WineData) => w.slug === slug);

        if (wine) {
          setWineData(wine);

          // Get related wines (same family or denomination, excluding current wine)
          const related = data.wines
            .filter((w: WineData) =>
              w.isActive &&
              w.slug !== slug &&
              (w.family === wine.family || w.denomination === wine.denomination)
            )
            .slice(0, 3);

          setRelatedWines(related);
        } else {
          console.error(`Wine with slug "${slug}" not found`);
        }
      } catch (error) {
        console.error('Error loading wine data:', error);
      } finally {
        setLoading(false);
        setIsLoaded(true);
      }
    };

    loadWineData();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Default fallback data for Metodo del Fondatore
  const defaultWine: WineData = {
    id: 0,
    slug: 'metodo-del-fondatore',
    name: 'Metodo del Fondatore',
    denomination: 'Lambrusco di Sorbara DOC',
    family: 'Metodo Ancestrale',
    description: 'Un omaggio alle origini. La tecnica ancestrale della rifermentazione in bottiglia che Cleto Chiarli utilizzava nel 1860, riscoperta per catturare l\'essenza più pura del Sorbara.',
    image: '/foto/003-uai-720x720.png',
    format: '0.75L',
    tags: ['Sorbara', 'DOC'],
    price: null,
    year: null,
    alcohol: 11.5,
    servingTemp: '12-14°C',
    pairings: [
      'Tortellini in brodo',
      'Prosciutto di Parma',
      'Parmigiano Reggiano',
      'Gnocco fritto',
      'Tigelle e crescentine',
      'Cotechino'
    ],
    awards: [
      { name: "Gambero Rosso", score: "Tre Bicchieri", years: "2019-2021" },
      { name: "Falstaff", score: "91-93/100", years: "2022" },
      { name: "Vitae AIS", score: "4 Viti", years: "2021" },
      { name: "Bibenda", score: "5 Grappoli", years: "2020" },
    ],
    tastingNotes: {
      aspetto: 'Colore chiaro e vivace, con riflessi rosati. Spuma fine ed evanescente.',
      profumo: 'Bouquet floreale con note di viola e rosa canina. Sentori di lievito e crosta di pane.',
      gusto: 'Secco e sapido, freschezza vibrante. Finale lungo e persistente, di grande eleganza.',
    },
    isActive: true,
    order: 0,
  };

  const wine = wineData || defaultWine;

  const tastingNotes = [
    { title: "Aspetto", description: wine.tastingNotes.aspetto || "Non disponibile" },
    { title: "Profumo", description: wine.tastingNotes.profumo || "Non disponibile" },
    { title: "Gusto", description: wine.tastingNotes.gusto || "Non disponibile" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-chiarli-text flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section - Dark background with split layout */}
      <section className="relative min-h-screen flex items-center overflow-x-hidden bg-gradient-to-br from-chiarli-text via-[#2a1f23] to-chiarli-text">

        {/* Background image con effetto "vedo non vedo" */}
        <div className="absolute inset-0">
          <img
            src="/foto/vasche-3.jpg"
            alt="Vigneto"
            className="w-full h-full object-cover opacity-30"
            style={{
              filter: 'blur(5px)',
            }}
          />
        </div>

        {/* Dark overlay per mantenere leggibilità */}
        <div className="absolute inset-0 bg-gradient-to-br from-chiarli-text/80 via-chiarli-text/75 to-chiarli-text/80" />

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
                background: `radial-gradient(circle at 30% 30%, rgba(200,80,100,${0.6 + (i % 4) * 0.15}), rgba(150,50,70,${0.4 + (i % 3) * 0.15}))`,
                boxShadow: `inset 0 0 ${4 + i % 5}px rgba(255,180,180,0.5), 0 0 ${8 + i % 6}px rgba(200,80,100,0.4)`,
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
          {wine.image && (
            <div className="lg:hidden w-full flex justify-center pt-24 pb-8">
              <div className="relative">
                <img
                  src={wine.image}
                  alt={wine.name}
                  className="relative z-10 h-[35vh] w-auto object-contain"
                  style={{
                    filter: `drop-shadow(0 10px 30px rgba(0,0,0,0.3))`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Left side - Content */}
          <div className="w-full lg:w-1/2 flex items-center px-6 md:px-16 lg:px-20 py-8 lg:py-32">
            <div className="max-w-xl mx-auto lg:mx-0">
              <span
                className={`font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine-light mb-4 block transition-all duration-700 delay-300 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {wine.family}
              </span>

              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight">
                {wine.name.split(' ').length > 2 ? (
                  <>
                    <span
                      className={`block transition-all duration-700 delay-400 ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                    >
                      {wine.name.split(' ').slice(0, -1).join(' ')}
                    </span>
                    <span
                      className={`block italic text-chiarli-wine-light transition-all duration-700 delay-500 ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                    >
                      {wine.name.split(' ').slice(-1)[0]}
                    </span>
                  </>
                ) : (
                  <span
                    className={`block transition-all duration-700 delay-400 ${
                      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    {wine.name}
                  </span>
                )}
              </h1>

              <p
                className={`font-sans text-[11px] font-bold uppercase tracking-widest text-white/40 mb-6 transition-all duration-700 delay-600 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {wine.denomination}
              </p>

              <p
                className={`font-serif text-base md:text-lg text-white/70 leading-relaxed mb-6 md:mb-8 transition-all duration-700 delay-700 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                {wine.description}
              </p>

              {/* Elegant info lines */}
              <div
                className={`space-y-4 mb-8 transition-all duration-700 delay-800 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {/* Vitigno */}
                {(wine as any).grape && (
                  <div className="flex items-baseline gap-3 group">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine-light/60 min-w-[100px]">
                      Vitigno
                    </span>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-white/20 to-transparent" />
                    <span className="font-serif text-sm text-white/80 group-hover:text-chiarli-wine-light transition-colors">
                      {(wine as any).grape}
                    </span>
                  </div>
                )}

                {/* Caratteristiche */}
                {wine.tastingNotes.aspetto && (
                  <div className="flex items-baseline gap-3 group">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine-light/60 min-w-[100px]">
                      Aspetto
                    </span>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-white/20 to-transparent" />
                    <span className="font-serif text-sm text-white/80 group-hover:text-chiarli-wine-light transition-colors italic">
                      {wine.tastingNotes.aspetto.split('.')[0]}
                    </span>
                  </div>
                )}

                {/* Gradazione e Temperatura */}
                <div className="flex items-center gap-4 pt-2">
                  {wine.alcohol && (
                    <div className="flex items-center gap-2 group">
                      <Wine size={14} className="text-chiarli-wine-light/60 group-hover:text-chiarli-wine-light transition-colors" />
                      <span className="font-sans text-xs text-white/70 group-hover:text-white transition-colors">{wine.alcohol}% vol.</span>
                    </div>
                  )}
                  {wine.servingTemp && (
                    <div className="flex items-center gap-2 group">
                      <Thermometer size={14} className="text-chiarli-wine-light/60 group-hover:text-chiarli-wine-light transition-colors" />
                      <span className="font-sans text-xs text-white/70 group-hover:text-white transition-colors">{wine.servingTemp}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div
                className={`flex flex-wrap gap-4 transition-all duration-700 delay-1000 ${
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
          {wine.image && (
            <div className="hidden lg:flex w-1/2 items-center justify-start relative overflow-visible">

              {/* Floating award badges - only show if wine has awards */}
              {wine.awards && wine.awards.length > 0 && wine.awards[0] && (
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
                      <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-white/60">{wine.awards[0].name}</p>
                      <p className="font-serif text-sm text-white">{wine.awards[0].score}</p>
                    </div>
                  </div>
                </div>
              )}

              {wine.awards && wine.awards.length > 1 && wine.awards[1] && (
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
                      <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-white/60">{wine.awards[1].name}</p>
                      <p className="font-serif text-sm text-white">{wine.awards[1].score}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottle and circles wrapper - keeps them together */}
              <div className="relative flex items-center justify-center p-12 overflow-visible">
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
                      scale(${isHoveringBottle ? 1.05 : 1})
                    `,
                    transition: 'transform 0.4s ease-out',
                  }}
                >
                  <img
                    src={wine.image}
                    alt={wine.name}
                    className="relative z-10 h-[75vh] w-auto object-contain"
                    style={{
                      filter: `drop-shadow(0 10px 30px rgba(0,0,0,0.3))`,
                    }}
                  />
                </div>
              </div>

            </div>
          )}

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
      <section className="relative min-h-screen bg-chiarli-stone overflow-hidden">

        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/foto/vasche-4.jpg"
            alt="Vigneto"
            className="w-full h-full object-cover"
          />
        </div>

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
                background: `radial-gradient(circle at 30% 30%, rgba(214,69,80,${0.2 + (i % 3) * 0.1}), rgba(180,60,80,${0.1 + (i % 3) * 0.05}))`,
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
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white mb-4 block" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.5)' }}>
                  Note di Degustazione
                </span>
                <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white mb-6 md:mb-8 leading-tight" style={{ textShadow: '0 2px 25px rgba(0,0,0,0.9), 0 0 50px rgba(0,0,0,0.6)' }}>
                  Un viaggio
                  <span className="italic text-chiarli-wine-light block">sensoriale</span>
                </h2>

                {/* Vertical tabs */}
                <div className="space-y-3 md:space-y-4">
                  {tastingNotes.map((note, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTab(index)}
                      className={`w-full text-left p-4 md:p-6 border transition-all duration-500 group backdrop-blur-sm ${
                        activeTab === index
                          ? 'bg-white/60 border-chiarli-wine shadow-[0_0_25px_rgba(214,69,80,0.3)]'
                          : 'bg-white/40 border-chiarli-text/10 hover:bg-white/55 hover:border-chiarli-text/20 hover:shadow-[0_0_20px_rgba(180,100,120,0.2)]'
                      }`}
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <span className={`font-serif text-2xl md:text-4xl transition-all duration-300 ${
                          activeTab === index
                            ? 'text-chiarli-wine drop-shadow-[0_0_15px_rgba(180,100,120,0.5)]'
                            : 'text-chiarli-text/20 group-hover:text-chiarli-text/40'
                        }`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className={`font-sans text-xs md:text-sm font-bold uppercase tracking-widest transition-colors ${
                          activeTab === index ? 'text-chiarli-wine' : 'text-chiarli-text/60 group-hover:text-chiarli-text'
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
                <div className="absolute top-1/2 left-1/2 w-48 md:w-64 h-48 md:h-64 rounded-full border border-chiarli-wine/10 hidden md:block"
                  style={{ transform: `translate(-50%, -50%) rotate(${scrollY * 0.02}deg)` }}
                />
                <div className="absolute top-1/2 left-1/2 w-32 md:w-40 h-32 md:h-40 rounded-full border border-chiarli-text/5 hidden md:block"
                  style={{ transform: `translate(-50%, -50%) rotate(${-scrollY * 0.03}deg)` }}
                />

                <div className="relative bg-white/65 backdrop-blur-sm border border-chiarli-text/15 p-6 md:p-10 lg:p-12 hover:border-chiarli-wine/40 hover:shadow-[0_0_30px_rgba(180,100,120,0.2)] transition-all duration-500">
                  <div className="absolute top-0 left-0 w-12 md:w-20 h-1 bg-chiarli-wine" />
                  <div className="absolute top-0 left-0 w-1 h-12 md:h-20 bg-chiarli-wine" />

                  <p className="font-serif text-xl md:text-2xl lg:text-3xl text-chiarli-text leading-relaxed mb-6 md:mb-8">
                    {tastingNotes[activeTab].description}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-[1px] bg-chiarli-wine" />
                    <span className="font-sans text-[10px] uppercase tracking-widest text-chiarli-text/50">
                      {tastingNotes[activeTab].title}
                    </span>
                  </div>
                </div>
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
                ...(wine.denomination ? [{ label: "Denominazione", value: wine.denomination }] : []),
                ...(wine.alcohol ? [{ label: "Gradazione", value: `${wine.alcohol}% vol.` }] : []),
                ...(wine.servingTemp ? [{ label: "Temperatura di servizio", value: wine.servingTemp }] : []),
                ...(wine.format ? [{ label: "Formato", value: wine.format }] : []),
                ...(wine.year ? [{ label: "Annata", value: wine.year.toString() }] : []),
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col border-b border-white/10 pb-3 md:pb-4 group hover:border-chiarli-wine-light/50 hover:shadow-[0_4px_15px_-5px_rgba(180,100,120,0.3)] transition-all duration-300 cursor-default"
                >
                  <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-chiarli-wine-light transition-colors mb-2">
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
          <div className="w-full lg:w-1/2 lg:min-h-[80vh] flex items-center relative bg-white">

            <div className="relative z-10 px-6 md:px-16 lg:px-20 py-12 md:py-16 lg:py-24">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-text/60 mb-4 block">
                La Storia
              </span>

              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-chiarli-text mb-6 md:mb-8 leading-tight">
                Il metodo che ha fatto
                <span className="italic text-chiarli-text block">la storia</span>
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

              <div className="border-l-2 border-chiarli-text/30 pl-4 md:pl-6">
                <p className="font-serif italic text-lg md:text-xl text-chiarli-text/70">
                  "Un vino che racconta 160 anni di storia in ogni bollicina."
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Awards - Dark dynamic section */}
      {wine.awards && wine.awards.length > 0 && (
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
              {wine.awards.map((award: { name: string; score: string; years: string }, index: number) => (
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
      )}

      {/* Food Pairing - Full width split */}
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
          <div className="w-full lg:w-1/2 lg:min-h-[80vh] flex items-center relative bg-white">

            <div className="relative z-10 px-6 md:px-16 lg:px-20 py-10 md:py-16 lg:py-24">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine mb-4 block">
                Abbinamenti
              </span>

              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-chiarli-text mb-6 md:mb-8 leading-tight">
                Il compagno ideale della
                <span className="italic text-chiarli-wine block">cucina emiliana</span>
              </h2>

              <p className="font-serif text-base md:text-lg text-chiarli-text/70 leading-relaxed mb-6 md:mb-8">
                {wine.pairings && wine.pairings.length > 0
                  ? "Abbinamenti consigliati per questo vino:"
                  : "La freschezza e la sapidità di questo vino lo rendono perfetto per accompagnare diversi piatti."}
              </p>

              {wine.pairings && wine.pairings.length > 0 && (
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {wine.pairings.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 md:gap-3 group cursor-default p-2 -m-2 rounded hover:bg-chiarli-wine/5 transition-all duration-300">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-chiarli-wine/40 group-hover:bg-chiarli-wine group-hover:shadow-[0_0_10px_rgba(180,100,120,0.6)] transition-all duration-300 flex-shrink-0" />
                      <span className="font-sans text-xs md:text-sm text-chiarli-text/70 group-hover:text-chiarli-text transition-colors">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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

      {/* Related Wines Section */}
      {relatedWines.length > 0 && (
        <section className="py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">

            {/* Section Header */}
            <div className="mb-12 md:mb-16">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine mb-4 block">
                Scopri Anche
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-chiarli-text">
                Vini <span className="italic text-chiarli-wine">correlati</span>
              </h2>
            </div>

            {/* Wines Grid - Clean minimal layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 lg:gap-20">
              {relatedWines.map((relatedWine) => (
                <div
                  key={relatedWine.slug}
                  className="group cursor-pointer"
                  onClick={() => {
                    window.location.hash = `#/vino/${relatedWine.slug}`;
                    window.scrollTo(0, 0);
                  }}
                >
                  {/* Wine Image */}
                  <div className="relative mb-6 overflow-hidden">
                    {relatedWine.image ? (
                      <img
                        src={relatedWine.image}
                        alt={relatedWine.name}
                        className="w-full h-80 md:h-96 object-contain transform group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-80 md:h-96 flex items-center justify-center">
                        <Wine size={80} className="text-chiarli-text/20" />
                      </div>
                    )}
                  </div>

                  {/* Wine Info */}
                  <div>
                    <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine/60 mb-2 block">
                      {relatedWine.family}
                    </span>

                    <h3 className="font-serif text-2xl md:text-3xl text-chiarli-text mb-2 group-hover:text-chiarli-wine transition-colors">
                      {relatedWine.name}
                    </h3>

                    <p className="font-sans text-xs uppercase tracking-wider text-chiarli-text/50 mb-4">
                      {relatedWine.denomination}
                    </p>

                    {/* Separator line */}
                    <div className="w-12 h-[1px] bg-chiarli-wine/30 group-hover:w-20 group-hover:bg-chiarli-wine transition-all duration-500 mb-4" />

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-chiarli-wine group-hover:gap-3 transition-all">
                      <span className="font-sans text-xs font-bold uppercase tracking-widest">
                        Scopri
                      </span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

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
