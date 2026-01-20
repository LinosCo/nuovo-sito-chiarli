import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface TenutaSozzigalliPageProps {
  onBack?: () => void;
}

export const TenutaSozzigalliPage: React.FC<TenutaSozzigalliPageProps> = ({ onBack }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroRef.current && entry.isIntersecting) {
            setIsHeroVisible(true);
          }
          if (entry.target === contentRef.current && entry.isIntersecting) {
            setIsContentVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (contentRef.current) observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, []);

  const vitigni = [
    {
      name: "Lambrusco di Sorbara",
      description: "Vitigno autoctono dal colore unico tra rosso e rosa.",
      details: "Varietà difficile da coltivare con grappolo lungo e spargolo. Acini di media grandezza e buccia sottile. Selezione massale proprietaria di cloni pre-fillossera.",
      image: "/foto/close-up-78-scaled.jpeg"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen bg-chiarli-text overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/foto/sozzigalli-29.jpg"
            alt="Tenuta Sozzigalli"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />
        </div>

        <div className="relative z-20 min-h-screen flex items-center max-w-[1800px] mx-auto px-6 md:px-12 py-24">
          <div className="max-w-3xl">
            <span
              className={`font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine-light mb-6 block transition-all duration-700 ${
                isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Le Nostre Tenute
            </span>

            <h1
              className={`font-serif text-6xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight transition-all duration-700 delay-100 ${
                isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Tenuta Sozzigalli
            </h1>

            <p
              className={`flex items-center gap-2 text-white/70 text-xl mb-8 transition-all duration-700 delay-200 ${
                isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <MapPin size={20} />
              <span className="font-sans uppercase tracking-widest">Bomporto</span>
            </p>

            <p
              className={`font-serif italic text-3xl text-chiarli-wine-light mb-8 transition-all duration-700 delay-300 ${
                isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Suoli alluvionali di Sorbara
            </p>

            <p
              className={`font-sans text-white/70 text-xl leading-relaxed transition-all duration-700 delay-400 ${
                isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              30 ettari di vigneto senza irrigazione, dove i fiumi Panaro e Secchia hanno creato terreni unici ideali per il Lambrusco di Sorbara.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section ref={contentRef} className="relative bg-chiarli-stone py-32">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            {/* Left Column */}
            <div>
              <h2
                className={`font-serif text-4xl md:text-5xl text-chiarli-text mb-8 transition-all duration-700 ${
                  isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                La Storia
              </h2>

              <p
                className={`font-sans text-chiarli-text/70 text-lg leading-relaxed mb-6 transition-all duration-700 delay-100 ${
                  isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                La tenuta si trova in un'area dove i cicli di piena dei fiumi Panaro e Secchia, insieme ai loro antichi affluenti, hanno depositato strati di limo fine, sabbia e sali creando terreni unici.
              </p>

              <p
                className={`font-serif italic text-xl text-chiarli-text/70 border-l-2 border-chiarli-text/30 pl-6 transition-all duration-700 delay-200 ${
                  isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Le brezze notturne fluviali mantengono il suolo fresco, ben drenante e al tempo stesso silenziosamente fertile.
              </p>
            </div>

            {/* Right Column */}
            <div>
              <h2
                className={`font-serif text-4xl md:text-5xl text-chiarli-text mb-8 transition-all duration-700 ${
                  isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Il Territorio
              </h2>

              <p
                className={`font-sans text-chiarli-text/70 text-lg leading-relaxed transition-all duration-700 delay-100 ${
                  isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                Selezione massale proprietaria di cloni pre-fillossera. Terreni freschi e ben drenanti grazie alle brezze notturne fluviali. Assenza di calcare attivo, ideale per conservazione di cloni antichi espressivi.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Vitigni Full Split Sections */}
      {vitigni.map((vitigno, index) => {
        const isEven = index % 2 === 0;
        return (
          <section key={index} className={`relative min-h-screen ${isEven ? 'bg-white' : 'bg-chiarli-stone'} overflow-hidden`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
              {/* Image */}
              <div className={`relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <img
                  src={vitigno.image}
                  alt={vitigno.name}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 ${isEven ? 'bg-gradient-to-r from-transparent to-white/20 lg:bg-gradient-to-l lg:from-white/20 lg:to-transparent' : 'bg-gradient-to-l from-transparent to-chiarli-stone/20 lg:bg-gradient-to-r lg:from-chiarli-stone/20 lg:to-transparent'}`} />
              </div>

              {/* Content */}
              <div className={`flex items-center py-16 md:py-24 lg:py-0 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
                  <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-wine mb-8 leading-tight">
                    {vitigno.name}
                  </h2>

                  <p className="font-serif italic text-2xl text-chiarli-text/70 mb-8 leading-relaxed border-l-4 border-chiarli-wine pl-8">
                    {vitigno.description}
                  </p>

                  <p className="font-sans text-chiarli-text/60 text-lg leading-relaxed max-w-lg">
                    {vitigno.details}
                  </p>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Galleria Immagini - Full Split */}
      <section className="relative min-h-screen bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden lg:order-1">
            <img
              src="/foto/close-up-41.jpg"
              alt="Dettaglio Vigneto"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 lg:bg-gradient-to-l lg:from-white/20 lg:to-transparent" />
          </div>

          {/* Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0 lg:order-2">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
                La <span className="italic text-chiarli-wine">Tenuta</span>
              </h2>
              <p className="font-serif italic text-xl text-chiarli-text/70 leading-relaxed max-w-lg">
                L'eccellenza del Lambrusco di Sorbara nelle terre bagnate dal fiume Secchia.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-screen bg-chiarli-stone overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden lg:order-2">
            <img
              src="/foto/sozzigalli-29.jpg"
              alt="Vigneto Sozzigalli"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-chiarli-stone/20 lg:bg-gradient-to-r lg:from-chiarli-stone/20 lg:to-transparent" />
          </div>

          {/* Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0 lg:order-1">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
                Il <span className="italic text-chiarli-wine">Territorio</span>
              </h2>
              <p className="font-serif italic text-xl text-chiarli-text/70 leading-relaxed max-w-lg">
                Selezione massale proprietaria di cloni pre-fillossera. Terreni freschi e ben drenanti grazie alle brezze notturne fluviali.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
