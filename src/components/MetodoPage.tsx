import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Droplet, Snowflake, Sparkles, Wine } from "lucide-react";
import { useMetodoContent } from "../hooks/useContent";

interface MetodoPageProps {
  onBack?: () => void;
}

export const MetodoPage: React.FC<MetodoPageProps> = ({ onBack }) => {
  const content = useMetodoContent();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [currentFreschezzaSlide, setCurrentFreschezzaSlide] = useState(0);

  const freschezzaImages = [
    "/foto/sito/freschezza-1.webp",
    "/foto/sito/freschezza-2.webp",
    "/foto/sito/freschezza-3.webp",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFreschezzaSlide((prev) => (prev + 1) % freschezzaImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [freschezzaImages.length]);

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
            src="/foto/sito/a021-scaled.webp"
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
          <span
            className="font-sans text-[10px] font-bold uppercase tracking-widest text-white mb-6 block animate-fade-in"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
          >
            {content.hero.label}
          </span>

          {/* Title */}
          <h1
            className="font-serif text-6xl md:text-8xl text-white mb-8 leading-none animate-fade-in-up"
            style={{
              textShadow:
                "0 4px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            {content.hero.title.split("Lambrusco")[0]}
            <span className="italic text-chiarli-wine-light">Lambrusco</span>
          </h1>

          {/* Subtitle */}
          <p
            className="font-sans text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
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

      {/* Section 1: L'Innovazione anni '50 - Image Right */}
      <div className="relative min-h-screen bg-chiarli-text overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left: Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 block">
                {content.innovazione.label}
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
                <span className="block">{content.innovazione.titleLine1}</span>
                <span className="italic text-chiarli-wine-light block">
                  {content.innovazione.titleLine2}
                </span>
              </h2>

              <p className="font-sans text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                {content.innovazione.description}
              </p>

              <p className="font-serif italic text-xl text-white/70 border-l-2 border-white/30 pl-6 mb-10">
                {content.innovazione.quote}
              </p>
            </div>
          </div>

          {/* Right: Full height image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden">
            <img
              src="/foto/sito/innovazione-anni50.webp"
              alt="Innovazione anni '50"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
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
              src="/foto/sito/processo-vinificazione.webp"
              alt="Processo di vinificazione"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-white/20" />
          </div>

          {/* Right: Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0 order-2 lg:order-2">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-text/60 mb-6 block">
                {content.vinificazione.label}
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
                <span className="block">
                  {content.vinificazione.titleLine1}
                </span>
                <span className="italic text-chiarli-wine block">
                  {content.vinificazione.titleLine2}
                </span>
              </h2>

              <p className="font-sans text-chiarli-text/70 text-lg leading-relaxed mb-8 max-w-lg">
                {content.vinificazione.description}
              </p>

              <p className="font-serif italic text-xl text-chiarli-text/70 border-l-2 border-chiarli-wine/30 pl-6 mb-10">
                {content.vinificazione.quote}
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
                {content.freschezza.label}
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
                <span className="block">{content.freschezza.titleLine1}</span>
                <span className="italic text-chiarli-wine-light block">
                  {content.freschezza.titleLine2}
                </span>
              </h2>

              <p className="font-sans text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                {content.freschezza.description}
              </p>

              <p className="font-serif italic text-xl text-white/70 border-l-2 border-white/30 pl-6 mb-10">
                {content.freschezza.quote}
              </p>
            </div>
          </div>

          {/* Right: Slider images */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden">
            {freschezzaImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Freschezza e autenticità ${index + 1}`}
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentFreschezzaSlide ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
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
              src="/foto/sito/unicita-metodo-chiarli.webp"
              alt="L'unicità del metodo Chiarli"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20 lg:bg-gradient-to-r lg:from-transparent lg:to-white/20" />
          </div>

          {/* Right: Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-text/60 mb-6 block">
                {content.unicita.label}
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
                <span className="block">{content.unicita.titleLine1}</span>
                <span className="italic text-chiarli-wine block">
                  {content.unicita.titleLine2}
                </span>
              </h2>

              <p className="font-sans text-chiarli-text/70 text-lg leading-relaxed mb-8 max-w-lg">
                {content.unicita.description1}
              </p>

              <p className="font-sans text-chiarli-text/70 text-lg leading-relaxed mb-8 max-w-lg">
                {content.unicita.description2}
              </p>

              <p className="font-serif italic text-xl text-chiarli-text/70 border-l-2 border-chiarli-wine/30 pl-6 mb-10">
                {content.unicita.quote}
              </p>

              <a
                href="#vini"
                className="inline-flex items-center gap-3 text-chiarli-wine font-sans text-sm font-bold uppercase tracking-widest group"
              >
                <span>{content.unicita.ctaText}</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-2 transition-transform duration-300"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Process Steps Section - INTERACTIVE */}
      <section className="relative min-h-screen bg-chiarli-text overflow-hidden flex items-center py-24">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/foto/sito/sozzigalli-29.webp"
            alt="Le Fasi del Metodo"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/60" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 w-full">
          <div className="text-center mb-20">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 block">
              {content.fasi.label}
            </span>
            <h2 className="font-serif text-5xl md:text-6xl text-white mb-6">
              {content.fasi.title.split("Metodo")[0]}
              <span className="italic text-chiarli-wine-light">Metodo</span>
            </h2>
            <p className="font-sans text-white/70 text-lg max-w-2xl mx-auto">
              {content.fasi.subtitle}
            </p>
          </div>

          {/* Interactive Steps with Timeline */}
          <div className="relative">
            {/* Horizontal Timeline - Hidden on mobile, visible on lg */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 mx-24">
              <div className="absolute inset-0 bg-white/20" />
              <div
                className="absolute inset-0 bg-gradient-to-r from-chiarli-wine-light to-chiarli-wine transition-all duration-1000"
                style={{
                  width:
                    activeStep !== null ? `${(activeStep / 3) * 100}%` : "0%",
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {/* Step 1 - Pressatura */}
              <div
                className={`group relative cursor-pointer transition-all duration-500 ${
                  activeStep === 1 ? "scale-105" : ""
                }`}
                onMouseEnter={() => setActiveStep(1)}
                onMouseLeave={() => setActiveStep(null)}
                style={{ animationDelay: "0ms" }}
              >
                <div
                  className={`
                  bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-8
                  border transition-all duration-500 relative overflow-hidden
                  ${
                    activeStep === 1
                      ? "border-chiarli-wine-light shadow-2xl shadow-chiarli-wine-light/30 bg-white/15"
                      : "border-white/10 hover:border-white/30 hover:bg-white/10"
                  }
                `}
                >
                  {/* Animated Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-chiarli-wine-light/20 to-transparent opacity-0 transition-opacity duration-500 ${
                      activeStep === 1 ? "opacity-100" : ""
                    }`}
                  />

                  {/* Icon Circle with animated icon */}
                  <div
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
                      activeStep === 1
                        ? "bg-chiarli-wine-light shadow-lg shadow-chiarli-wine-light/50"
                        : "bg-chiarli-wine-light/20"
                    }`}
                  >
                    <Droplet
                      className={`transition-all duration-500 ${
                        activeStep === 1
                          ? "text-white scale-110"
                          : "text-chiarli-wine-light"
                      }`}
                      size={32}
                    />
                  </div>

                  {/* Number Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`font-serif text-5xl transition-all duration-300 ${
                        activeStep === 1
                          ? "text-chiarli-wine-light"
                          : "text-white/20"
                      }`}
                    >
                      1
                    </span>
                  </div>

                  <h3 className="relative font-serif text-2xl text-white mb-4 transition-transform duration-300 group-hover:translate-x-1">
                    {content.fasi.steps[0].title}
                  </h3>

                  <p
                    className={`relative font-sans text-white/70 leading-relaxed transition-all duration-500 ${
                      activeStep === 1 ? "text-white" : ""
                    }`}
                  >
                    {content.fasi.steps[0].description}
                  </p>

                  {/* Expanded Content */}
                  <div
                    className={`relative overflow-hidden transition-all duration-500 ${
                      activeStep === 1
                        ? "max-h-40 opacity-100 mt-4"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pt-4 border-t border-white/20">
                      <p className="font-sans text-sm text-white/80 leading-relaxed">
                        {content.fasi.steps[0].detail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 - Refrigerazione */}
              <div
                className={`group relative cursor-pointer transition-all duration-500 ${
                  activeStep === 2 ? "scale-105" : ""
                }`}
                onMouseEnter={() => setActiveStep(2)}
                onMouseLeave={() => setActiveStep(null)}
                style={{ animationDelay: "150ms" }}
              >
                <div
                  className={`
                  bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-8
                  border transition-all duration-500 relative overflow-hidden
                  ${
                    activeStep === 2
                      ? "border-chiarli-wine-light shadow-2xl shadow-chiarli-wine-light/30 bg-white/15"
                      : "border-white/10 hover:border-white/30 hover:bg-white/10"
                  }
                `}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-chiarli-wine-light/20 to-transparent opacity-0 transition-opacity duration-500 ${
                      activeStep === 2 ? "opacity-100" : ""
                    }`}
                  />

                  <div
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
                      activeStep === 2
                        ? "bg-chiarli-wine-light shadow-lg shadow-chiarli-wine-light/50"
                        : "bg-chiarli-wine-light/20"
                    }`}
                  >
                    <Snowflake
                      className={`transition-all duration-500 ${
                        activeStep === 2
                          ? "text-white scale-110 animate-spin-slow"
                          : "text-chiarli-wine-light"
                      }`}
                      size={32}
                    />
                  </div>

                  <div className="absolute top-4 right-4">
                    <span
                      className={`font-serif text-5xl transition-all duration-300 ${
                        activeStep === 2
                          ? "text-chiarli-wine-light"
                          : "text-white/20"
                      }`}
                    >
                      2
                    </span>
                  </div>

                  <h3 className="relative font-serif text-2xl text-white mb-4 transition-transform duration-300 group-hover:translate-x-1">
                    {content.fasi.steps[1].title}
                  </h3>

                  <p
                    className={`relative font-sans text-white/70 leading-relaxed transition-all duration-500 ${
                      activeStep === 2 ? "text-white" : ""
                    }`}
                  >
                    {content.fasi.steps[1].description}
                  </p>

                  <div
                    className={`relative overflow-hidden transition-all duration-500 ${
                      activeStep === 2
                        ? "max-h-40 opacity-100 mt-4"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pt-4 border-t border-white/20">
                      <p className="font-sans text-sm text-white/80 leading-relaxed">
                        {content.fasi.steps[1].detail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 - Presa di Spuma */}
              <div
                className={`group relative cursor-pointer transition-all duration-500 ${
                  activeStep === 3 ? "scale-105" : ""
                }`}
                onMouseEnter={() => setActiveStep(3)}
                onMouseLeave={() => setActiveStep(null)}
                style={{ animationDelay: "300ms" }}
              >
                <div
                  className={`
                  bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-8
                  border transition-all duration-500 relative overflow-hidden
                  ${
                    activeStep === 3
                      ? "border-chiarli-wine-light shadow-2xl shadow-chiarli-wine-light/30 bg-white/15"
                      : "border-white/10 hover:border-white/30 hover:bg-white/10"
                  }
                `}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-chiarli-wine-light/20 to-transparent opacity-0 transition-opacity duration-500 ${
                      activeStep === 3 ? "opacity-100" : ""
                    }`}
                  />

                  <div
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
                      activeStep === 3
                        ? "bg-chiarli-wine-light shadow-lg shadow-chiarli-wine-light/50"
                        : "bg-chiarli-wine-light/20"
                    }`}
                  >
                    <Sparkles
                      className={`transition-all duration-500 ${
                        activeStep === 3
                          ? "text-white scale-110 animate-pulse"
                          : "text-chiarli-wine-light"
                      }`}
                      size={32}
                    />
                  </div>

                  <div className="absolute top-4 right-4">
                    <span
                      className={`font-serif text-5xl transition-all duration-300 ${
                        activeStep === 3
                          ? "text-chiarli-wine-light"
                          : "text-white/20"
                      }`}
                    >
                      3
                    </span>
                  </div>

                  <h3 className="relative font-serif text-2xl text-white mb-4 transition-transform duration-300 group-hover:translate-x-1">
                    {content.fasi.steps[2].title}
                  </h3>

                  <p
                    className={`relative font-sans text-white/70 leading-relaxed transition-all duration-500 ${
                      activeStep === 3 ? "text-white" : ""
                    }`}
                  >
                    {content.fasi.steps[2].description}
                  </p>

                  <div
                    className={`relative overflow-hidden transition-all duration-500 ${
                      activeStep === 3
                        ? "max-h-40 opacity-100 mt-4"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pt-4 border-t border-white/20">
                      <p className="font-sans text-sm text-white/80 leading-relaxed">
                        {content.fasi.steps[2].detail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 - Imbottigliamento */}
              <div
                className={`group relative cursor-pointer transition-all duration-500 ${
                  activeStep === 4 ? "scale-105" : ""
                }`}
                onMouseEnter={() => setActiveStep(4)}
                onMouseLeave={() => setActiveStep(null)}
                style={{ animationDelay: "450ms" }}
              >
                <div
                  className={`
                  bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-8
                  border transition-all duration-500 relative overflow-hidden
                  ${
                    activeStep === 4
                      ? "border-chiarli-wine-light shadow-2xl shadow-chiarli-wine-light/30 bg-white/15"
                      : "border-white/10 hover:border-white/30 hover:bg-white/10"
                  }
                `}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-chiarli-wine-light/20 to-transparent opacity-0 transition-opacity duration-500 ${
                      activeStep === 4 ? "opacity-100" : ""
                    }`}
                  />

                  <div
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
                      activeStep === 4
                        ? "bg-chiarli-wine-light shadow-lg shadow-chiarli-wine-light/50"
                        : "bg-chiarli-wine-light/20"
                    }`}
                  >
                    <Wine
                      className={`transition-all duration-500 ${
                        activeStep === 4
                          ? "text-white scale-110"
                          : "text-chiarli-wine-light"
                      }`}
                      size={32}
                    />
                  </div>

                  <div className="absolute top-4 right-4">
                    <span
                      className={`font-serif text-5xl transition-all duration-300 ${
                        activeStep === 4
                          ? "text-chiarli-wine-light"
                          : "text-white/20"
                      }`}
                    >
                      4
                    </span>
                  </div>

                  <h3 className="relative font-serif text-2xl text-white mb-4 transition-transform duration-300 group-hover:translate-x-1">
                    {content.fasi.steps[3].title}
                  </h3>

                  <p
                    className={`relative font-sans text-white/70 leading-relaxed transition-all duration-500 ${
                      activeStep === 4 ? "text-white" : ""
                    }`}
                  >
                    {content.fasi.steps[3].description}
                  </p>

                  <div
                    className={`relative overflow-hidden transition-all duration-500 ${
                      activeStep === 4
                        ? "max-h-40 opacity-100 mt-4"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pt-4 border-t border-white/20">
                      <p className="font-sans text-sm text-white/80 leading-relaxed">
                        {content.fasi.steps[3].detail}
                      </p>
                    </div>
                  </div>
                </div>
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
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};
