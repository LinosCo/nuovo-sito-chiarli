import React, { useState, useEffect } from "react";
import { ArrowRight, Wine } from "lucide-react";

interface CollezionePremiumPageProps {
  onBack?: () => void;
  onWineClick?: (slug: string) => void;
}

interface WineData {
  id: number;
  slug: string;
  name: string;
  denomination: string;
  family: string;
  description: string;
  image: string | null;
  isActive: boolean;
}

export const CollezionePremiumPage: React.FC<CollezionePremiumPageProps> = ({
  onBack,
  onWineClick,
}) => {
  const [wines, setWines] = useState<WineData[]>([]);
  const [hoveredWine, setHoveredWine] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadWines = async () => {
      try {
        const response = await fetch("/content/wines.json");
        const data = await response.json();
        const premiumWines = data.wines.filter(
          (w: WineData) => w.family === "Premium" && w.isActive,
        );
        setWines(premiumWines);
      } catch (error) {
        console.error("Error loading wines:", error);
      }
    };

    loadWines();
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleWineClick = (slug: string) => {
    if (onWineClick) {
      onWineClick(slug);
    } else {
      history.pushState(null, "", `/vino/${slug}`);
      window.dispatchEvent(new Event("pushstate"));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] bg-chiarli-text overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/foto/sito/close-up-26-scaled.webp"
            alt="Collezione Premium"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-24 text-center">
          <span
            className={`font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine-light mb-6 block transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Selezione Premium
          </span>

          <h1
            className={`font-serif text-4xl md:text-7xl lg:text-8xl text-white mb-6 leading-none transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Collezione{" "}
            <span className="italic text-chiarli-wine-light">Premium</span>
          </h1>

          <p
            className={`font-sans text-lg md:text-xl text-white/80 mb-4 transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            Dove la storia osa evolversi
          </p>

          <p
            className={`font-serif text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            Sono i vini che parlano per noi e la nostra uva unica - decisi,
            espressivi e inconfondibilmente Chiarli.
          </p>
        </div>
      </section>

      {/* Wines Grid Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-chiarli-text mb-4">
              I nostri <span className="italic text-chiarli-wine">vini</span>
            </h2>
            <p className="font-sans text-sm text-chiarli-text/60 uppercase tracking-wider">
              {wines.length} {wines.length === 1 ? "vino" : "vini"}
            </p>
          </div>

          {/* Wines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
            {wines.map((wine) => (
              <div
                key={wine.slug}
                className="group cursor-pointer flex flex-col h-full"
                onClick={() => handleWineClick(wine.slug)}
                onMouseEnter={() => setHoveredWine(wine.slug)}
                onMouseLeave={() => setHoveredWine(null)}
              >
                {/* Wine Image */}
                <div className="relative mb-6">
                  {wine.image ? (
                    <img
                      src={wine.image}
                      alt={wine.name}
                      className="w-full h-80 md:h-96 object-contain p-4 transform transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-80 md:h-96 flex items-center justify-center">
                      <Wine size={80} className="text-chiarli-text/20" />
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-chiarli-wine/40 to-transparent transition-opacity duration-500 pointer-events-none ${
                      hoveredWine === wine.slug ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>

                {/* Wine Info */}
                <div className="flex-1 flex flex-col">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine/60 mb-2 block">
                    Premium
                  </span>

                  <h3 className="font-serif text-2xl text-chiarli-text mb-2 group-hover:text-chiarli-wine transition-colors leading-tight">
                    {wine.name}
                  </h3>

                  <p className="font-sans text-xs uppercase tracking-wider text-chiarli-text/50 mb-4">
                    {wine.denomination}
                  </p>

                  <div className="mt-auto">
                    {/* Separator line */}
                    <div
                      className={`h-[1px] bg-chiarli-wine/30 mb-4 transition-all duration-500 ${
                        hoveredWine === wine.slug ? "w-20" : "w-12"
                      }`}
                    />

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-chiarli-wine">
                      <span className="font-sans text-xs font-bold uppercase tracking-widest">
                        Scopri
                      </span>
                      <ArrowRight
                        size={14}
                        className={`transition-transform duration-300 ${
                          hoveredWine === wine.slug ? "translate-x-1" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {wines.length === 0 && (
            <div className="text-center py-20">
              <Wine size={80} className="mx-auto text-chiarli-text/20 mb-6" />
              <p className="font-serif text-xl text-chiarli-text/60">
                Nessun vino disponibile al momento
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
