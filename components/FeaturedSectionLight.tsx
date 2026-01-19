import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Clock, Users, Wine } from 'lucide-react';

const experiences = [
  {
    id: 1,
    title: "Degustazione Guidata",
    subtitle: "Un viaggio sensoriale",
    description: "Scopri i segreti del Lambrusco attraverso una degustazione esclusiva guidata dai nostri sommelier.",
    image: "/foto/vasche-3.jpg",
    duration: "2 ore",
    people: "2-10",
    includes: "5 vini"
  },
  {
    id: 2,
    title: "Tour dei Vigneti",
    subtitle: "Nel cuore delle colline",
    description: "Passeggia tra i filari delle nostre tenute e scopri il legame unico tra territorio e vino.",
    image: "/foto/vasche-4.jpg",
    duration: "3 ore",
    people: "4-15",
    includes: "Tour + degustazione"
  },
  {
    id: 3,
    title: "Cena in Cantina",
    subtitle: "Gastronomia e tradizione",
    description: "Un'esperienza gastronomica esclusiva nella suggestiva atmosfera della cantina storica.",
    image: "/foto/CHIARLI-1860_WEBSITE-IMAGES_03_09_257467_16x9-scaled.jpeg",
    duration: "4 ore",
    people: "8-20",
    includes: "Menu + vini"
  }
];

export const FeaturedSectionLight: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  const AUTOPLAY_DURATION = 6000; // 6 secondi per slide

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Autoplay
  useEffect(() => {
    if (!isVisible) return;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / (AUTOPLAY_DURATION / 50));
      });
    }, 50);

    const slideInterval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % experiences.length);
      setProgress(0);
    }, AUTOPLAY_DURATION);

    return () => {
      clearInterval(progressInterval);
      clearInterval(slideInterval);
    };
  }, [isVisible, activeIndex]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setProgress(0);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(prev => (prev + 1) % experiences.length);
    setProgress(0);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(prev => (prev - 1 + experiences.length) % experiences.length);
    setProgress(0);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const activeExperience = experiences[activeIndex];

  return (
    <section ref={sectionRef} id="esperienze" className="relative h-screen overflow-hidden">

      {/* Fullscreen Background Images */}
      {experiences.map((exp, index) => (
        <div
          key={exp.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={exp.image}
            alt={exp.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-20 w-full">

          <div className="max-w-2xl">

            {/* Label */}
            <span
              className={`font-sans text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 block transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Esperienze
            </span>

            {/* Title */}
            <h3
              key={`title-${activeIndex}`}
              className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-4 leading-tight animate-fade-in-up"
            >
              {activeExperience.title}
            </h3>

            {/* Subtitle */}
            <p
              key={`sub-${activeIndex}`}
              className="font-sans text-sm font-medium uppercase tracking-[0.2em] text-chiarli-wine-light mb-8 animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              {activeExperience.subtitle}
            </p>

            {/* Description */}
            <p
              key={`desc-${activeIndex}`}
              className="font-sans text-lg text-white/80 leading-relaxed mb-10 max-w-lg animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              {activeExperience.description}
            </p>

            {/* Details */}
            <div
              key={`details-${activeIndex}`}
              className="flex gap-8 mb-10 animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-white/50" />
                <span className="font-sans text-sm text-white/70">{activeExperience.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-white/50" />
                <span className="font-sans text-sm text-white/70">{activeExperience.people}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wine size={18} className="text-white/50" />
                <span className="font-sans text-sm text-white/70">{activeExperience.includes}</span>
              </div>
            </div>

            {/* CTA */}
            <a
              href="#/esperienze"
              className="group inline-flex items-center gap-3 bg-white text-chiarli-text px-8 py-4 hover:bg-chiarli-wine hover:text-white transition-all duration-300"
            >
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em]">Scopri le esperienze</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>

          </div>

        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-20 py-8">
          <div className="flex items-center justify-between">

            {/* Progress Indicators */}
            <div className="flex gap-4">
              {experiences.map((exp, index) => (
                <button
                  key={exp.id}
                  onClick={() => goToSlide(index)}
                  className="group flex flex-col items-start gap-2"
                >
                  <span className={`font-sans text-xs uppercase tracking-wider transition-colors ${
                    index === activeIndex ? 'text-white' : 'text-white/40 group-hover:text-white/70'
                  }`}>
                    {exp.title}
                  </span>
                  <div className="w-32 h-[2px] bg-white/20 overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-100"
                      style={{
                        width: index === activeIndex ? `${progress}%` : index < activeIndex ? '100%' : '0%'
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Arrow Controls */}
            <div className="flex gap-3">
              <button
                onClick={goPrev}
                className="w-12 h-12 flex items-center justify-center text-white hover:text-chiarli-wine-light transition-all duration-300 group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={goNext}
                className="w-12 h-12 flex items-center justify-center text-white hover:text-chiarli-wine-light transition-all duration-300 group"
              >
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};
