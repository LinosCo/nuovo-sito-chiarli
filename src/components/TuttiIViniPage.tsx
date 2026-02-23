import React, { useState, useEffect } from "react";
import { ArrowRight, Wine } from "lucide-react";

interface TuttiIViniPageProps {
  onBack?: () => void;
  onWineClick?: (slug: string) => void;
}

interface WineData {
  id: number;
  slug: string;
  name: string;
  denomination: string;
  tagline?: string;
  family: string;
  collection?: string;
  description: string;
  image: string | null;
  isActive: boolean;
  order?: number;
}

export const TuttiIViniPage: React.FC<TuttiIViniPageProps> = ({
  onBack,
  onWineClick,
}) => {
  const [premiumWines, setPremiumWines] = useState<WineData[]>([]);
  const [classicWines, setClassicWines] = useState<WineData[]>([]);
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

        const premium = data.wines
          .filter((w: WineData) => w.family === "Premium" && w.isActive)
          .sort(
            (a: WineData, b: WineData) => (a.order ?? 99) - (b.order ?? 99),
          );
        const classic = data.wines
          .filter(
            (w: WineData) =>
              (w.family === "Metodo Classico" ||
                w.family === "Classica" ||
                w.collection === "Metodo Classico" ||
                w.collection === "Collezione Classica") &&
              w.isActive,
          )
          .sort(
            (a: WineData, b: WineData) => (a.order ?? 99) - (b.order ?? 99),
          );

        setPremiumWines(premium);
        setClassicWines(classic);
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
      window.location.hash = `#/vino/${slug}`;
      window.scrollTo(0, 0);
    }
  };

  const WineCard = ({ wine }: { wine: WineData }) => (
    <div
      key={wine.slug}
      className="group cursor-pointer"
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
      </div>

      {/* Wine Info */}
      <div>
        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine/60 mb-2 block">
          {wine.family}
        </span>

        <h3 className="font-serif text-2xl text-chiarli-text mb-2 group-hover:text-chiarli-wine transition-colors leading-tight">
          {wine.name}
        </h3>

        <p className="font-sans text-xs uppercase tracking-wider text-chiarli-text/50 mb-4">
          {wine.tagline || wine.denomination}
        </p>

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
  );

  const totalWines = premiumWines.length + classicWines.length;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] bg-chiarli-text overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/foto/sito/hero-vini.webp"
            alt="Tutti i Vini"
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
            Le Nostre Collezioni
          </span>

          <h1
            className={`font-serif text-4xl md:text-7xl lg:text-8xl text-white mb-6 leading-none transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Tutti i <span className="italic text-chiarli-wine-light">Vini</span>
          </h1>

          <p
            className={`font-sans text-lg md:text-xl text-white/80 mb-4 transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            Dal 1860, tradizione ed eleganza
          </p>

          <p
            className={`font-serif text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            Scopri l'intera gamma dei nostri Lambrusco: dalle etichette Premium
            alle più classiche e radicate nel territorio.
          </p>
        </div>
      </section>

      {/* Premium Collection Section */}
      {premiumWines.length > 0 && (
        <section className="py-16 md:py-24 bg-chiarli-stone">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            {/* Section Header */}
            <div className="mb-12">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine mb-4 block">
                Collezione Premium
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-chiarli-text mb-4">
                L'eccellenza della{" "}
                <span className="italic text-chiarli-wine">tradizione</span>
              </h2>
              <p className="font-sans text-sm text-chiarli-text/60 uppercase tracking-wider">
                {premiumWines.length}{" "}
                {premiumWines.length === 1 ? "vino" : "vini"}
              </p>
            </div>

            {/* Wines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
              {premiumWines.map((wine) => (
                <WineCard key={wine.slug} wine={wine} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Classic Collection Section */}
      {classicWines.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            {/* Section Header */}
            <div className="mb-12 max-w-3xl">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine mb-4 block">
                Collezione Classica
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-chiarli-text mb-6 leading-tight">
                Una collezione che cattura
                <br />
                l'essenza della nostra terra —<br />
                <span className="italic text-chiarli-wine">
                  energia e anima.
                </span>
              </h2>
              <p className="font-serif text-base md:text-lg text-chiarli-text/70 leading-relaxed mb-4">
                La Collezione Classica di Villa Cialdini nasce dove tutto è più
                vicino: la terra, la famiglia, i gesti quotidiani. È
                l'espressione più domestica e autentica dello stile Cleto
                Chiarli, legata alle uve coltivate intorno alla storica tenuta e
                a una tradizione che non ha bisogno di essere celebrata per
                essere riconosciuta. Ciascun spumante racconta il "classico"
                come continuità, equilibrio e appartenenza: vini pensati per la
                tavola, per il territorio, per chi conosce il valore delle cose
                fatte bene.
              </p>
              <p className="font-sans text-sm text-chiarli-text/60 uppercase tracking-wider">
                {classicWines.length}{" "}
                {classicWines.length === 1 ? "vino" : "vini"}
              </p>
            </div>

            {/* Wines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
              {classicWines.map((wine) => (
                <WineCard key={wine.slug} wine={wine} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {totalWines === 0 && (
        <section className="py-24 bg-white">
          <div className="text-center">
            <Wine size={80} className="mx-auto text-chiarli-text/20 mb-6" />
            <p className="font-serif text-xl text-chiarli-text/60">
              Nessun vino disponibile al momento
            </p>
          </div>
        </section>
      )}
    </div>
  );
};
