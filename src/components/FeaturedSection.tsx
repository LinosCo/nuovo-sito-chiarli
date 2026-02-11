import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

const experiences = [
  {
    id: 1,
    title: "Degustazione Guidata",
    description:
      "Un viaggio sensoriale attraverso i nostri migliori Lambrusco, guidati dai nostri sommelier.",
    image: "/foto/sito/charli-bottiglie-9-scaled.webp",
  },
  {
    id: 2,
    title: "Tour dei Vigneti",
    description:
      "Scopri i segreti delle nostre tenute e il legame tra territorio e vino.",
    image: "/foto/sito/tour_vigneti.webp",
  },
  {
    id: 3,
    title: "Cena in Cantina",
    description:
      "Un'esperienza gastronomica esclusiva abbinata ai nostri vini più pregiati.",
    image: "/foto/sito/eventi_slider.webp",
  },
];

export const FeaturedSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const activeCard = hoveredCard;

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

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <section
      ref={sectionRef}
      id="esperienze"
      className="relative min-h-screen bg-chiarli-text overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {/* Default image when no card selected or hovered */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            activeCard === null ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src="/foto/sito/chiarli.webp"
            alt="Wine Experience"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        {/* Experience images */}
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              activeCard === exp.id ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={exp.image}
              alt={exp.title}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/40 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-20 min-h-screen flex items-center">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-24 w-full">
          <div className="flex flex-col">
            {/* Header */}
            <div className="mb-16">
              <span
                className={`font-sans text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 block transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                Un'Esperienza Unica
              </span>

              <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-8 leading-tight">
                <span
                  className={`block transition-all duration-700 delay-100 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  Dove il tempo
                </span>
                <span
                  className={`block transition-all duration-700 delay-200 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  si ferma
                </span>
                <span
                  className={`italic text-white/80 block transition-all duration-700 delay-300 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  nel bicchiere.
                </span>
              </h2>

              <div className="max-w-4xl">
                <p
                  className={`font-sans text-white/70 text-lg leading-relaxed mb-8 transition-all duration-700 delay-400 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6"
                  }`}
                >
                  Vieni a scoprire dove nasce il mito. Un viaggio attraverso
                  generazioni di passione, tra vigneti secolari e cantine che
                  custodiscono i segreti del Lambrusco più autentico.
                </p>
              </div>
            </div>

            {/* Grid of Experience Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {experiences.map((exp, index) => (
                <a
                  key={exp.id}
                  href="#/esperienze"
                  onMouseEnter={() => setHoveredCard(exp.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`group bg-white/5 backdrop-blur-sm p-6 transition-all duration-500 cursor-pointer flex flex-col active:scale-[0.98] ${
                    activeCard === exp.id
                      ? "bg-chiarli-wine-light/20 scale-[1.02] shadow-lg shadow-chiarli-wine/20"
                      : "hover:bg-white/10"
                  } ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  }`}
                  style={{ transitionDelay: `${500 + index * 100}ms` }}
                >
                  <div className="flex items-start justify-end mb-4">
                    <ArrowRight
                      size={18}
                      className={`transition-all ${activeCard === exp.id ? "text-chiarli-wine-light translate-x-1" : "text-white/30 group-hover:text-chiarli-wine-light group-hover:translate-x-1"}`}
                    />
                  </div>
                  <h3
                    className={`font-serif text-xl mb-3 transition-colors ${activeCard === exp.id ? "text-chiarli-wine-light" : "text-white group-hover:text-chiarli-wine-light"}`}
                  >
                    {exp.title}
                  </h3>
                  <p
                    className={`font-sans text-sm leading-relaxed transition-colors ${activeCard === exp.id ? "text-white/70" : "text-white/50"}`}
                  >
                    {exp.description}
                  </p>
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <a
                href="#/esperienze"
                className={`group inline-flex items-center gap-4 bg-chiarli-wine-light text-white px-8 py-4 hover:bg-white hover:text-chiarli-text transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "800ms" }}
              >
                <span className="font-sans text-xs font-bold uppercase tracking-widest">
                  Scopri tutte le esperienze
                </span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
