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

  const wines = [
    {
      name: "Lambrusco di Sorbara",
      description: "Colore unico tra rosso e rosa, frutto scintillante e acidità elevata.",
      details: "Varietà difficile da coltivare con grappolo spargolo. Prodotto con Metodo Ancestrale, Charmat e Classico.",
      image: "/foto/001-uai-720x1080.png"
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
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

          {/* Wines Section */}
          <div className="mb-32">
            <h2
              className={`font-serif text-5xl md:text-6xl text-chiarli-text mb-20 transition-all duration-700 ${
                isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              I Nostri <span className="italic text-chiarli-wine">Vini</span>
            </h2>

            {wines.map((wine, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24 transition-all duration-700 ${
                  isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${300 + index * 150}ms` }}
              >
                {/* Bottiglia */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-chiarli-wine/5 to-transparent rounded-full blur-3xl"></div>
                  <div className="relative p-12 flex items-center justify-center">
                    <img
                      src={wine.image}
                      alt={wine.name}
                      className="h-[500px] w-auto object-contain transition-all duration-700 hover:scale-105"
                    />
                  </div>
                </div>

                {/* Contenuto */}
                <div>
                  <div className="border-l-4 border-chiarli-wine pl-8">
                    <h3 className="font-serif text-4xl md:text-5xl text-chiarli-wine mb-6">
                      {wine.name}
                    </h3>
                    <p className="font-serif italic text-2xl text-chiarli-text/70 mb-8 leading-relaxed">
                      {wine.description}
                    </p>
                    <p className="font-sans text-chiarli-text/60 text-lg leading-relaxed">
                      {wine.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Galleria Immagini */}
          <div>
            <h2
              className={`font-serif text-5xl md:text-6xl text-chiarli-text mb-20 transition-all duration-700 ${
                isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              La <span className="italic text-chiarli-wine">Tenuta</span>
            </h2>

            <div className="grid grid-cols-12 gap-6">
              <div
                className={`col-span-12 md:col-span-5 overflow-hidden transition-all duration-700 ${
                  isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                <div className="relative group">
                  <img
                    src="/foto/close-up-41.jpg"
                    alt="Dettaglio Vigneto"
                    className="w-full h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
              <div
                className={`col-span-12 md:col-span-7 overflow-hidden transition-all duration-700 ${
                  isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: '500ms' }}
              >
                <div className="relative group">
                  <img
                    src="/foto/sozzigalli-29.jpg"
                    alt="Vigneto Sozzigalli"
                    className="w-full h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
