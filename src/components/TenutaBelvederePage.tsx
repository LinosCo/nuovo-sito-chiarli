import React, { useEffect, useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";

interface TenutaBelvederePageProps {
  onBack?: () => void;
}

export const TenutaBelvederePage: React.FC<TenutaBelvederePageProps> = () => {
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    storia: false,
    grasparossa: false,
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setIsHeroVisible(true);
  }, []);

  const slides = [
    {
      image: "/foto/sito/belvedere-aerea.webp",
      title: "La Tenuta",
      description:
        "25 ettari di vigneti su suoli alluvionali profondi alle pendici dell'Appennino modenese.",
    },
    {
      image: "/foto/sito/belvedere-uva.webp",
      title: "Il Territorio",
      description:
        "Elevata densità di impianto e gestione rigorosa per un Lambrusco strutturato e di carattere.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen bg-chiarli-text overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/foto/sito/belvedere-aerea.webp"
            alt="Vigneto Tenuta Belvedere"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />
        </div>

        <div className="relative z-20 min-h-screen flex items-end md:items-center max-w-[1800px] mx-auto px-6 md:px-12 pb-20 pt-32 md:py-24">
          <div className="max-w-3xl">
            <span
              className={`font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine-light mb-6 block transition-all duration-700 ${
                isHeroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              Le Nostre Tenute
            </span>

            <h1
              className={`font-serif text-4xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight transition-all duration-700 delay-100 ${
                isHeroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Tenuta Belvedere
            </h1>

            <p
              className={`flex items-center gap-2 text-white/70 text-xl mb-8 transition-all duration-700 delay-200 ${
                isHeroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <MapPin size={20} />
              <span className="font-sans uppercase tracking-widest">
                Spilamberto
              </span>
            </p>

            <p
              className={`font-serif italic text-3xl text-chiarli-wine-light mb-8 transition-all duration-700 delay-300 ${
                isHeroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              Un vigneto moderno, eclettico
            </p>

            <p
              className={`font-sans text-white/70 text-xl leading-relaxed transition-all duration-700 delay-400 ${
                isHeroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              25 ettari di vigneti su suoli alluvionali profondi alle pendici
              dell'Appennino modenese, fonte esclusiva del nostro Prunonero
              Grasparossa.
            </p>
          </div>
        </div>
      </section>

      {/* Storia e Territorio - Split Full Screen - CHIARA */}
      <section className="relative min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden">
            <img
              src="/foto/sito/belvedere-uva.webp"
              alt="Uva Grasparossa Tenuta Belvedere"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 lg:bg-gradient-to-l lg:from-white/20 lg:to-transparent" />
          </div>

          {/* Content */}
          <div className="flex items-center justify-center py-20 md:py-32 lg:py-20 bg-white">
            <div className="w-full max-w-xl mx-auto px-8 md:px-12 lg:px-16">
              <h2 className="font-serif text-4xl md:text-5xl text-chiarli-text mb-8 leading-tight">
                La Storia e il{" "}
                <span className="italic text-chiarli-wine">Territorio</span>
              </h2>

              <p className="font-sans text-chiarli-text/80 text-lg leading-relaxed mb-8">
                La Tenuta Belvedere si trova a Spilamberto, vicino alle prime
                colline dell'Appennino modenese. I suoi 25 ettari di vigneti si
                estendono su un terreno pianeggiante con suoli profondi e
                fertili di origine alluvionale, particolarmente adatti a una
                viticoltura vigorosa ma ben gestita.
              </p>

              <div
                className={`overflow-hidden transition-all duration-500 ${expandedSections.storia ? "max-h-[2000px] opacity-100 mb-8" : "max-h-0 opacity-0 mb-0"}`}
              >
                <p className="font-serif italic text-xl text-chiarli-text/80 border-l-4 border-chiarli-wine pl-6 mb-6">
                  L'elevata densità di impianto, combinata con una potatura
                  rigorosa e un'attenta gestione del verde, produce uve
                  Grasparossa con rese naturalmente basse.
                </p>

                <p className="font-sans text-chiarli-text/80 text-lg leading-relaxed mb-6">
                  Le uve presentano struttura tannica marcata e un'elevata
                  concentrazione di antociani, caratteristiche ideali per la
                  produzione di Lambrusco di alta qualità.
                </p>

                <p className="font-sans text-chiarli-text/80 text-lg leading-relaxed">
                  Questa tenuta è la fonte esclusiva del nostro Prunonero
                  Grasparossa, prodotto sia in versione frizzante che spumante —
                  due interpretazioni della varietà che condividono intensità,
                  freschezza e profondità, esaltando al tempo stesso il
                  potenziale del sito per un Lambrusco strutturato e di
                  carattere.
                </p>
              </div>

              <button
                onClick={() => toggleSection("storia")}
                className="flex items-center gap-2 text-chiarli-wine hover:text-chiarli-wine/80 transition-colors group"
              >
                <span className="font-sans text-sm uppercase tracking-widest">
                  {expandedSections.storia ? "Mostra meno" : "Leggi di più"}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${expandedSections.storia ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lambrusco Grasparossa - Split Full Screen - SCURA */}
      <section className="relative min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Content */}
          <div className="flex items-center justify-center py-20 md:py-32 lg:py-20 bg-chiarli-text lg:order-1">
            <div className="w-full max-w-xl mx-auto px-8 md:px-12 lg:px-16">
              <h2 className="font-serif text-4xl md:text-5xl text-chiarli-wine-light mb-6 leading-tight">
                Lambrusco Grasparossa
              </h2>

              <p className="font-serif italic text-2xl text-white/80 mb-8 leading-relaxed">
                Un vitigno di grande struttura e intensità, coltivato con rese
                naturalmente basse per esprimere tutto il suo potenziale.
              </p>

              <p className="font-sans text-white/70 text-lg leading-relaxed mb-8">
                Grappoli con buccia spessa e ricca di antociani, che
                conferiscono al vino il suo colore intenso e la sua marcata
                struttura tannica.
              </p>

              <div
                className={`overflow-hidden transition-all duration-500 ${expandedSections.grasparossa ? "max-h-[2000px] opacity-100 mb-8" : "max-h-0 opacity-0 mb-0"}`}
              >
                <div className="border-l-4 border-chiarli-wine-light pl-6 mb-6">
                  <p className="font-serif italic text-xl text-white/80">
                    Il Prunonero Grasparossa nasce esclusivamente da queste uve,
                    sia in versione frizzante che spumante.
                  </p>
                </div>

                <p className="font-sans text-white/70 text-lg leading-relaxed mb-6">
                  Due interpretazioni della varietà che condividono intensità,
                  freschezza e profondità. L'alta densità di impianto e la
                  gestione rigorosa della chioma permettono di ottenere uve
                  concentrate e ricche di estratto.
                </p>

                <p className="font-sans text-white/70 text-lg leading-relaxed">
                  Il risultato è un Lambrusco strutturato e di carattere, che
                  esalta il potenziale unico di questo sito viticolo alle
                  pendici dell'Appennino.
                </p>
              </div>

              <button
                onClick={() => toggleSection("grasparossa")}
                className="flex items-center gap-2 text-chiarli-wine-light hover:text-chiarli-wine-light/80 transition-colors group"
              >
                <span className="font-sans text-sm uppercase tracking-widest">
                  {expandedSections.grasparossa
                    ? "Mostra meno"
                    : "Leggi di più"}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${expandedSections.grasparossa ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden lg:order-2">
            <img
              src="/foto/sito/belvedere-grasparossa.webp"
              alt="Lambrusco Grasparossa"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-chiarli-text/20 lg:bg-gradient-to-r lg:from-chiarli-text/20 lg:to-transparent" />
          </div>
        </div>
      </section>

      {/* Gallery Slider Full Screen */}
      <section className="relative h-screen overflow-hidden">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-16 md:px-24 max-w-4xl">
                <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl text-white mb-6 leading-tight">
                  {slide.title.split(" ")[0]}{" "}
                  <span className="italic text-chiarli-wine-light">
                    {slide.title.split(" ").slice(1).join(" ")}
                  </span>
                </h2>
                <p className="font-serif italic text-lg md:text-2xl text-white/90 leading-relaxed">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-0 md:right-0 md:translate-x-0 md:px-6 z-20 flex items-center gap-4 md:justify-between md:pointer-events-none">
          <button
            onClick={() =>
              setCurrentSlide(
                (prev) => (prev - 1 + slides.length) % slides.length,
              )
            }
            className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all group md:pointer-events-auto"
            aria-label="Slide precedente"
          >
            <ChevronDown
              size={24}
              className="text-white rotate-90 group-hover:scale-110 transition-transform"
            />
          </button>

          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % slides.length)
            }
            className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all group md:pointer-events-auto"
            aria-label="Slide successiva"
          >
            <ChevronDown
              size={24}
              className="text-white -rotate-90 group-hover:scale-110 transition-transform"
            />
          </button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 80% at 50% 50%, rgba(180,100,120,0.05) 0%, transparent 70%)`,
          }}
        />

        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center relative z-10">
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine mb-4 block">
            Resta aggiornato
          </span>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-chiarli-text mb-4">
            Iscriviti alla nostra
            <span className="italic text-chiarli-wine block">Newsletter</span>
          </h2>

          <p className="font-serif text-base text-chiarli-text/50 mb-10 max-w-lg mx-auto">
            Scopri in anteprima le novità, gli eventi e le storie dal mondo
            Chiarli.
          </p>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col sm:flex-row gap-0 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="La tua email"
                className="flex-1 px-6 py-4 bg-chiarli-text/5 border border-chiarli-text/20 text-chiarli-text placeholder-chiarli-text/40 focus:outline-none focus:border-chiarli-wine focus:bg-chiarli-text/10 transition-all font-sans text-sm"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-chiarli-wine text-white font-sans text-xs font-bold uppercase tracking-widest hover:bg-chiarli-text transition-all duration-300"
              >
                Iscriviti
              </button>
            </div>

            <label className="flex items-center justify-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 appearance-none border border-chiarli-text/30 bg-transparent checked:bg-chiarli-wine checked:border-chiarli-wine transition-all cursor-pointer"
              />
              <span className="font-sans text-xs text-chiarli-text/40 group-hover:text-chiarli-text/60 transition-colors">
                Accetto i termini e le condizioni della Privacy Policy.
              </span>
            </label>
          </form>
        </div>
      </section>
    </div>
  );
};
