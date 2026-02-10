import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Users, Grape, Home, Calendar, Eye } from 'lucide-react';

interface ExperiencesPageProps {
  onBack?: () => void;
}

const experienceCategories = [
  {
    id: 1,
    icon: Eye,
    title: "Visita",
    subtitle: "Visita alla culla del Lambrusco",
    description: "Tour guidati tra vigneti e cantine, degustazioni curate, visite esclusive alla Galleria Chiarli.",
    image: "/foto/vasche-3.jpg"
  },
  {
    id: 2,
    icon: Calendar,
    title: "Eventi",
    subtitle: "Eventi aziendali e prenotazioni private",
    description: "Attività di team building, eventi riservati, lanci prodotto, cene di lavoro.",
    image: "/foto/close-up-9-scaled.jpeg"
  },
  {
    id: 3,
    icon: Home,
    title: "La Galleria Chiarli",
    subtitle: "La nostra storia in mostra",
    description: "Un viaggio immersivo in oltre 165 anni di passione per il vino.",
    image: "/foto/vasche-4.jpg"
  }
];

const highlights = [
  {
    icon: Users,
    label: "5 generazioni",
    description: ""
  },
  {
    icon: Grape,
    label: "Uve 100% di proprietà",
    description: ""
  },
  {
    icon: Home,
    label: "Tenuta Cialdini",
    description: ""
  }
];

export const ExperiencesPage: React.FC<ExperiencesPageProps> = ({ onBack }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const villaRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isStoryVisible, setIsStoryVisible] = useState(false);
  const [isVillaVisible, setIsVillaVisible] = useState(false);
  const [isCardsVisible, setIsCardsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroRef.current && entry.isIntersecting) {
            setIsHeroVisible(true);
          }
          if (entry.target === storyRef.current && entry.isIntersecting) {
            setIsStoryVisible(true);
          }
          if (entry.target === villaRef.current && entry.isIntersecting) {
            setIsVillaVisible(true);
          }
          if (entry.target === cardsRef.current && entry.isIntersecting) {
            setIsCardsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (storyRef.current) observer.observe(storyRef.current);
    if (villaRef.current) observer.observe(villaRef.current);
    if (cardsRef.current) observer.observe(cardsRef.current);

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-chiarli-text overflow-hidden"
      onMouseMove={handleMouseMove}
    >

      {/* Hero Section */}
      <div ref={heroRef} className="relative min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/foto/1.jpg"
            alt="Esperienze Chiarli"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-[1800px] mx-auto px-6 md:px-12 py-24 w-full">
          <div className="max-w-4xl mx-auto text-center">
            <span
              className={`font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine-light mb-6 block transition-all duration-700 ${
                isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Il nostro invito
            </span>

            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight">
              <span
                className={`block transition-all duration-700 delay-100 ${
                  isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Da degustare
              </span>
              <span
                className={`italic text-chiarli-wine-light block transition-all duration-700 delay-200 ${
                  isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                e scoprire
              </span>
            </h1>


            <a
              href="https://shop.chiarli.it/esperienze/"
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-3 bg-chiarli-wine hover:bg-chiarli-wine-light text-white font-sans text-sm font-bold uppercase tracking-widest px-8 py-4 transition-all duration-300 ${
                isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              Prenota esperienze
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Story Section - Un'immersione nella storia familiare */}
      <div ref={storyRef} className="relative bg-chiarli-stone py-32">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <span
              className={`font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine mb-6 block transition-all duration-700 ${
                isStoryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Tenuta Cialdini
            </span>

            <h2
              className={`font-serif text-5xl md:text-6xl text-chiarli-text mb-12 leading-tight transition-all duration-700 delay-100 ${
                isStoryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Un'immersione nella <span className="italic text-chiarli-wine">storia familiare</span>
            </h2>

            <p
              className={`font-sans text-chiarli-text/80 text-lg leading-relaxed mb-16 transition-all duration-700 delay-200 ${
                isStoryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Scoprire Chiarli significa andare oltre la degustazione: è un'immersione nella storia e nell'identità di una famiglia che vive il vino da generazioni.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {highlights.map((highlight, index) => {
                return (
                  <div
                    key={index}
                    className={`group relative transition-all duration-700 ${
                      isStoryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
                    style={{ transitionDelay: `${300 + index * 100}ms` }}
                  >
                    {/* Large decorative number */}
                    <span className="font-serif italic text-9xl text-chiarli-wine/10 absolute -top-8 -left-4 leading-none select-none group-hover:text-chiarli-wine/20 transition-colors duration-500">
                      {index + 1}
                    </span>

                    <div className="relative pt-16">
                      <h3 className="font-serif text-3xl md:text-4xl text-chiarli-text leading-tight group-hover:text-chiarli-wine transition-colors duration-300">
                        {highlight.label}
                      </h3>

                      {/* Subtle underline that expands on hover */}
                      <div className="mt-6 h-px w-12 bg-chiarli-text/30 group-hover:w-full group-hover:bg-chiarli-wine transition-all duration-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Villa Cialdini Section */}
      <div ref={villaRef} className="relative min-h-screen bg-chiarli-text overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

          {/* Right: Full height image */}
          <div
            className={`relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden order-1 lg:order-2 transition-all duration-1000 ${
              isVillaVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src="/foto/DSC04010.jpg"
              alt="Villa Cialdini"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20 lg:bg-gradient-to-r lg:from-chiarli-text/20 lg:to-transparent" />
          </div>

          {/* Left: Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0 order-2 lg:order-1">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">

              <span
                className={`font-sans text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 block transition-all duration-700 ${
                  isVillaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Nel fascino di Villa Cialdini
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
                <span
                  className={`block transition-all duration-700 delay-100 ${
                    isVillaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  Lambrusco
                </span>
                <span
                  className={`italic text-chiarli-wine-light block transition-all duration-700 delay-200 ${
                    isVillaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  e la sua storia
                </span>
              </h2>

              <p
                className={`font-sans text-white/70 text-lg leading-relaxed mb-8 max-w-lg transition-all duration-700 delay-300 ${
                  isVillaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                Villa Cialdini è il cuore pulsante della nostra azienda, un luogo dove storia e tradizione
                si fondono per creare esperienze indimenticabili.
              </p>

              <p
                className={`font-serif italic text-xl text-white/70 border-l-2 border-white/30 pl-6 mb-10 transition-all duration-700 delay-400 ${
                  isVillaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Tra le mura di questa storica dimora, ogni visita diventa un viaggio nel tempo attraverso
                generazioni di passione per il Lambrusco.
              </p>

            </div>
          </div>

        </div>
      </div>

      {/* Experience Categories Section */}
      <div ref={cardsRef} className="relative bg-chiarli-stone py-32">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">

          <div className="text-center mb-20">
            <span
              className={`font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-text/60 mb-6 block transition-all duration-700 ${
                isCardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Scegli la tua esperienza
            </span>

            <h2
              className={`font-serif text-5xl md:text-6xl text-chiarli-text leading-tight transition-all duration-700 delay-100 ${
                isCardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Vivi <span className="italic text-chiarli-wine">la tradizione</span>
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experienceCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <a
                  key={category.id}
                  href="https://shop.chiarli.it/esperienze/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredCard(category.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`group bg-white border-2 transition-all duration-500 cursor-pointer block ${
                    hoveredCard === category.id
                      ? 'border-chiarli-wine shadow-xl -translate-y-2'
                      : 'border-chiarli-text/10 hover:border-chiarli-wine/30'
                  } ${
                    isCardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  {/* Card Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Icon overlay */}
                    <div className="absolute top-6 left-6">
                      <div className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                        hoveredCard === category.id
                          ? 'bg-chiarli-wine text-white'
                          : 'bg-white/90 text-chiarli-wine'
                      }`}>
                        <Icon size={24} />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-8">
                    <h3
                      className={`font-serif text-3xl mb-2 transition-colors duration-300 ${
                        hoveredCard === category.id ? 'text-chiarli-wine' : 'text-chiarli-text'
                      }`}
                    >
                      {category.title}
                    </h3>

                    <p className="font-sans text-xs uppercase tracking-widest text-chiarli-text/50 mb-4">
                      {category.subtitle}
                    </p>

                    <p className="font-sans text-chiarli-text/70 leading-relaxed mb-6">
                      {category.description}
                    </p>

                    <div className={`flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${
                      hoveredCard === category.id ? 'text-chiarli-wine' : 'text-chiarli-text/60'
                    }`}>
                      <span>Scopri di più</span>
                      <ArrowRight
                        size={16}
                        className={`transition-transform duration-300 ${
                          hoveredCard === category.id ? 'translate-x-2' : ''
                        }`}
                      />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
