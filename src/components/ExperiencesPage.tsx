import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Users,
  Grape,
  Home,
  Calendar,
  Eye,
} from "lucide-react";

interface ExperiencesPageProps {
  onBack?: () => void;
}

const experienceCategories = [
  {
    id: 1,
    icon: Eye,
    title: "Visita",
    subtitle: "Visita alla culla del Lambrusco",
    description:
      "Tour guidati tra vigneti e cantine, degustazioni curate, visite esclusive alla Galleria Chiarli.",
    image: "/foto/sito/visita_slider.webp",
  },
  {
    id: 2,
    icon: Calendar,
    title: "Eventi",
    subtitle: "Eventi aziendali e prenotazioni private",
    description:
      "Attività di team building, eventi riservati, lanci prodotto, cene di lavoro.",
    image: "/foto/sito/eventi_slider.webp",
  },
];

const highlights = [
  {
    icon: Users,
    label: "5 generazioni",
    description: "",
  },
  {
    icon: Grape,
    label: "Uve 100% di proprietà",
    description: "",
  },
  {
    icon: Home,
    label: "Tenuta Cialdini",
    description: "",
  },
];

export const ExperiencesPage: React.FC<ExperiencesPageProps> = ({ onBack }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const villaRef = useRef<HTMLDivElement>(null);
  const galleriaRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isStoryVisible, setIsStoryVisible] = useState(false);
  const [isVillaVisible, setIsVillaVisible] = useState(false);
  const [isGalleriaVisible, setIsGalleriaVisible] = useState(false);
  const [isCardsVisible, setIsCardsVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [villaImageIndex, setVillaImageIndex] = useState(0);

  const villaImages = [
    "/foto/sito/esperienze-lambrusco-storia.webp",
    "/foto/sito/esperienze-lambrusco-storia-2.webp",
    "/foto/sito/esperienze-lambrusco-storia-3.webp",
  ];

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
          if (entry.target === galleriaRef.current && entry.isIntersecting) {
            setIsGalleriaVisible(true);
          }
          if (entry.target === cardsRef.current && entry.isIntersecting) {
            setIsCardsVisible(true);
          }
        });
      },
      { threshold: 0.2 },
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (storyRef.current) observer.observe(storyRef.current);
    if (villaRef.current) observer.observe(villaRef.current);
    if (galleriaRef.current) observer.observe(galleriaRef.current);
    if (cardsRef.current) observer.observe(cardsRef.current);

    return () => observer.disconnect();
  }, []);

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) =>
        prev === experienceCategories.length - 1 ? 0 : prev + 1,
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlide]);

  // Auto-play villa images
  useEffect(() => {
    const timer = setInterval(() => {
      setVillaImageIndex((prev) => (prev + 1) % villaImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [villaImageIndex, villaImages.length]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-chiarli-text overflow-hidden"
    >
      {/* Hero Section */}
      <div ref={heroRef} className="relative min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/foto/sito/chiarli.webp"
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
                isHeroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              Il nostro invito
            </span>

            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight">
              <span
                className={`block transition-all duration-700 delay-100 ${
                  isHeroVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Da degustare
              </span>
              <span
                className={`italic text-chiarli-wine-light block transition-all duration-700 delay-200 ${
                  isHeroVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
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
                isHeroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              Prenota esperienze
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
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
                isStoryVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              Tenuta Cialdini
            </span>

            <h2
              className={`font-serif text-5xl md:text-6xl text-chiarli-text mb-12 leading-tight transition-all duration-700 delay-100 ${
                isStoryVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Un'immersione nella{" "}
              <span className="italic text-chiarli-wine">storia familiare</span>
            </h2>

            <p
              className={`font-sans text-chiarli-text/80 text-lg leading-relaxed mb-16 transition-all duration-700 delay-200 ${
                isStoryVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              Scoprire Chiarli significa andare oltre la degustazione: è
              un'immersione nella storia e nell'identità di una famiglia che
              vive il vino da generazioni.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {highlights.map((highlight, index) => {
                return (
                  <div
                    key={index}
                    className={`group relative transition-all duration-700 ${
                      isStoryVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
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
      <div
        ref={villaRef}
        className="relative min-h-screen bg-chiarli-text overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Right: Image slider */}
          <div
            className={`relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden order-1 lg:order-2 transition-all duration-1000 ${
              isVillaVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {villaImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Villa Cialdini"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  i === villaImageIndex ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
                decoding="async"
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20 lg:bg-gradient-to-r lg:from-chiarli-text/20 lg:to-transparent" />
          </div>

          {/* Left: Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0 order-2 lg:order-1">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span
                className={`font-sans text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 block transition-all duration-700 ${
                  isVillaVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                Nel fascino di Villa Cialdini
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
                <span
                  className={`block transition-all duration-700 delay-100 ${
                    isVillaVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  Lambrusco
                </span>
                <span
                  className={`italic text-chiarli-wine-light block transition-all duration-700 delay-200 ${
                    isVillaVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  e la sua storia
                </span>
              </h2>

              <p
                className={`font-sans text-white/70 text-lg leading-relaxed mb-8 max-w-lg transition-all duration-700 delay-300 ${
                  isVillaVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                Villa Cialdini è il cuore pulsante della nostra azienda, un
                luogo dove storia e tradizione si fondono per creare esperienze
                indimenticabili.
              </p>

              <p
                className={`font-serif italic text-xl text-white/70 border-l-2 border-white/30 pl-6 mb-10 transition-all duration-700 delay-400 ${
                  isVillaVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                Tra le mura di questa storica dimora, ogni visita diventa un
                viaggio nel tempo attraverso generazioni di passione per il
                Lambrusco.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Categories Fullscreen Slider */}
      <div ref={cardsRef} className="relative h-screen overflow-hidden">
        {/* Slides */}
        {experienceCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <div
              key={category.id}
              className={`absolute inset-0 transition-all duration-[1.2s] ease-in-out ${
                index === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Background image with ken burns */}
              <img
                src={category.image}
                alt={category.title}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] ease-out ${
                  index === activeSlide ? "scale-110" : "scale-100"
                }`}
                loading="lazy"
                decoding="async"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 z-10 flex items-end">
                <div className="w-full px-8 md:px-16 lg:px-24 pb-24 md:pb-32">
                  <div className="max-w-3xl">
                    {/* Icon */}
                    <div
                      className={`mb-6 transition-all duration-700 delay-300 ${
                        index === activeSlide
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      }`}
                    >
                      <div className="w-14 h-14 flex items-center justify-center border border-white/30">
                        <Icon size={24} className="text-white/80" />
                      </div>
                    </div>

                    {/* Subtitle */}
                    <span
                      className={`font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine-light block mb-4 transition-all duration-700 delay-[400ms] ${
                        index === activeSlide
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      }`}
                    >
                      {category.subtitle}
                    </span>

                    {/* Title */}
                    <h3
                      className={`font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-none transition-all duration-700 delay-500 ${
                        index === activeSlide
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-8"
                      }`}
                    >
                      {category.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`font-sans text-white/60 text-lg leading-relaxed max-w-xl mb-8 transition-all duration-700 delay-[600ms] ${
                        index === activeSlide
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      }`}
                    >
                      {category.description}
                    </p>

                    {/* CTA */}
                    <a
                      href="https://shop.chiarli.it/esperienze/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group inline-flex items-center gap-3 bg-chiarli-wine hover:bg-chiarli-wine-light text-white font-sans text-sm font-bold uppercase tracking-widest px-8 py-4 transition-all duration-500 delay-700 ${
                        index === activeSlide
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      }`}
                    >
                      Scopri di più
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation arrows */}
        <div className="absolute bottom-24 md:bottom-32 right-8 md:right-16 lg:right-24 z-20 flex items-center gap-4">
          <button
            onClick={() =>
              setActiveSlide((prev) =>
                prev === 0 ? experienceCategories.length - 1 : prev - 1,
              )
            }
            className="w-12 h-12 flex items-center justify-center border border-white/30 hover:border-white hover:bg-white/10 transition-all duration-300"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <button
            onClick={() =>
              setActiveSlide((prev) =>
                prev === experienceCategories.length - 1 ? 0 : prev + 1,
              )
            }
            className="w-12 h-12 flex items-center justify-center border border-white/30 hover:border-white hover:bg-white/10 transition-all duration-300"
          >
            <ArrowRight size={20} className="text-white" />
          </button>
        </div>

        {/* Slide indicator */}
        <div className="absolute bottom-10 left-8 md:left-16 lg:left-24 z-20 flex items-center gap-6">
          {experienceCategories.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className="flex items-center gap-3 group"
            >
              <div className="relative h-px w-12 bg-white/20 overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 bg-white transition-all ${
                    index === activeSlide
                      ? "w-full duration-[5000ms] ease-linear"
                      : "w-0 duration-300"
                  }`}
                />
              </div>
              <span
                className={`font-sans text-xs uppercase tracking-widest transition-colors duration-300 ${
                  index === activeSlide ? "text-white" : "text-white/30"
                }`}
              >
                {experienceCategories[index].title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Galleria Chiarli Section */}
      <div
        ref={galleriaRef}
        className="relative bg-chiarli-stone overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Image */}
          <div
            className={`relative h-[50vh] lg:h-auto lg:min-h-[80vh] overflow-hidden transition-all duration-1000 ${
              isGalleriaVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src="/foto/sito/close-up-9-scaled.webp"
              alt="Galleria Chiarli"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Right: Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0 lg:min-h-[80vh]">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span
                className={`font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine mb-6 block transition-all duration-700 ${
                  isGalleriaVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                La Galleria Chiarli
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
                <span
                  className={`block transition-all duration-700 delay-100 ${
                    isGalleriaVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  La nostra storia
                </span>
                <span
                  className={`italic text-chiarli-wine block transition-all duration-700 delay-200 ${
                    isGalleriaVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  in mostra
                </span>
              </h2>

              <p
                className={`font-sans text-chiarli-text/70 text-lg leading-relaxed mb-4 max-w-lg transition-all duration-700 delay-300 ${
                  isGalleriaVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                Un viaggio immersivo in oltre 165 anni di passione per il vino.
                Oggetti, immagini, bottiglie storiche e documenti d'archivio
                raccontano la storia del Lambrusco, dell'impresa familiare e
                della cultura del territorio.
              </p>

              <p
                className={`font-sans text-chiarli-text/50 text-base leading-relaxed max-w-lg transition-all duration-700 delay-400 ${
                  isGalleriaVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                Uno spazio aperto a tutti — dove la memoria incontra il
                presente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
