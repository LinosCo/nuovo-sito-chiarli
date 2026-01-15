import React, { useEffect, useRef, useState } from 'react';
import { Calendar } from 'lucide-react';

interface StoriaPageProps {
  onBack?: () => void;
}

export const StoriaPage: React.FC<StoriaPageProps> = ({ onBack }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);

  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isSection1Visible, setIsSection1Visible] = useState(false);
  const [isSection2Visible, setIsSection2Visible] = useState(false);
  const [isSection3Visible, setIsSection3Visible] = useState(false);
  const [isSection4Visible, setIsSection4Visible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroRef.current && entry.isIntersecting) {
            setIsHeroVisible(true);
          }
          if (entry.target === section1Ref.current && entry.isIntersecting) {
            setIsSection1Visible(true);
          }
          if (entry.target === section2Ref.current && entry.isIntersecting) {
            setIsSection2Visible(true);
          }
          if (entry.target === section3Ref.current && entry.isIntersecting) {
            setIsSection3Visible(true);
          }
          if (entry.target === section4Ref.current && entry.isIntersecting) {
            setIsSection4Visible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (section1Ref.current) observer.observe(section1Ref.current);
    if (section2Ref.current) observer.observe(section2Ref.current);
    if (section3Ref.current) observer.observe(section3Ref.current);
    if (section4Ref.current) observer.observe(section4Ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* Hero Section - DARK */}
      <section ref={heroRef} className="relative min-h-screen bg-chiarli-text overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/foto/charli-bottiglie-9-scaled.jpg"
            alt="Cleto Chiarli Storia"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />
        </div>

        <div className="relative z-20 min-h-screen flex items-center max-w-[1800px] mx-auto px-6 md:px-12 py-24">
          <div className="max-w-4xl">
            <span
              className={`font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine-light mb-6 block transition-all duration-700 ${
                isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Chi Siamo
            </span>

            <h1
              className={`font-serif text-6xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight transition-all duration-700 delay-100 ${
                isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Una storia di famiglia radicata a <span className="italic text-chiarli-wine-light">Modena</span>
            </h1>

            <p
              className={`font-serif italic text-4xl text-chiarli-wine-light mb-12 transition-all duration-700 delay-200 ${
                isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Dal 1860
            </p>

            <p
              className={`font-sans text-white/80 text-xl leading-relaxed max-w-2xl transition-all duration-700 delay-300 ${
                isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Da oltre 165 anni, Cleto Chiarli è una storia di famiglia radicata a Modena, guidata da generazioni di dedizione e costruita su un profondo legame con la terra e le persone.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: Pionieri - LIGHT with split screen */}
      <section ref={section1Ref} className="relative bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* Image Side */}
          <div
            className={`h-[600px] lg:h-auto min-h-[600px] lg:min-h-screen transition-all duration-700 ${
              isSection1Visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <img
              src="/foto/close-up-26-scaled.jpeg"
              alt="Vigneti Chiarli"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Side */}
          <div className="bg-chiarli-stone py-32 px-6 md:px-16 flex items-center">
            <div>
              <h2
                className={`font-serif text-5xl md:text-6xl text-chiarli-text mb-8 transition-all duration-700 delay-100 ${
                  isSection1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Pionieri del <span className="italic text-chiarli-wine">Lambrusco</span>
              </h2>

              <p
                className={`font-sans text-chiarli-text/70 text-xl leading-relaxed mb-8 transition-all duration-700 delay-200 ${
                  isSection1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                Fondata nel 1860, Chiarli è la più antica cantina dell'Emilia-Romagna e pioniera nella produzione del Lambrusco.
              </p>

              <div
                className={`border-l-4 border-chiarli-wine pl-8 transition-all duration-700 delay-300 ${
                  isSection1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <p className="font-serif italic text-2xl text-chiarli-text/70 leading-relaxed">
                  Il vino rappresenta per noi l'espressione di una relazione — con la terra, con il tempo, con chi lo crea.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: 165 anni di storia - DARK */}
      <section ref={section2Ref} className="relative min-h-screen bg-chiarli-text overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/foto/1.jpg"
            alt="Storia Background"
            className="w-full h-full object-cover opacity-15"
          />
        </div>

        <div className="relative z-10 min-h-screen flex items-center max-w-[1800px] mx-auto px-6 md:px-12 py-32">
          <div>
            <h2
              className={`font-serif text-5xl md:text-7xl text-white mb-20 transition-all duration-700 ${
                isSection2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              165 anni di <span className="italic text-chiarli-wine-light">Storia</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { year: "1860", title: "La Fondazione" },
                { year: "1900", title: "L'Espansione" },
                { year: "1950", title: "L'Innovazione" },
                { year: "2025", title: "Il Futuro" }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`group transition-all duration-700 ${
                    isSection2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="border-l-4 border-chiarli-wine-light pl-6 py-4 hover:border-white transition-colors">
                    <span className="font-serif text-6xl text-chiarli-wine-light block mb-4 group-hover:text-white transition-colors">
                      {item.year}
                    </span>
                    <h3 className="font-serif text-2xl text-white">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Una famiglia in crescita - LIGHT with split screen */}
      <section ref={section3Ref} className="relative bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* Text Side */}
          <div className="bg-chiarli-stone py-32 px-6 md:px-16 flex items-center">
            <div>
              <h2
                className={`font-serif text-5xl md:text-6xl text-chiarli-text mb-12 transition-all duration-700 ${
                  isSection3Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Una famiglia in <span className="italic text-chiarli-wine">crescita</span>
              </h2>

              <p
                className={`font-sans text-chiarli-text/70 text-lg leading-relaxed mb-6 transition-all duration-700 delay-100 ${
                  isSection3Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                La quinta generazione della famiglia Chiarli guida oggi l'azienda con la stessa passione dei fondatori. <strong className="text-chiarli-text">Anselmo Chiarli</strong> (CEO) e <strong className="text-chiarli-text">Mauro Chiarli</strong> (Presidente) sono alla guida del gruppo, mentre <strong className="text-chiarli-text">Tommaso Chiarli</strong> segue export, marketing e comunicazione.
              </p>

              <div
                className={`border-l-4 border-chiarli-wine pl-8 mt-8 transition-all duration-700 delay-200 ${
                  isSection3Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <p className="font-serif italic text-2xl text-chiarli-text/70 leading-relaxed">
                  "Rispetto per la tradizione, apertura all'innovazione, e impegno costante per la qualità."
                </p>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div
            className={`h-[600px] lg:h-auto transition-all duration-700 delay-300 ${
              isSection3Visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <img
              src="/foto/2.jpg"
              alt="Famiglia Chiarli"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section 4: Le persone che fanno la differenza - DARK */}
      <section ref={section4Ref} className="relative bg-chiarli-text py-32">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 text-center">
          <h2
            className={`font-serif text-5xl md:text-6xl text-white mb-12 transition-all duration-700 ${
              isSection4Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Le persone che fanno la <span className="italic text-chiarli-wine-light">differenza</span>
          </h2>

          <p
            className={`font-sans text-white/80 text-xl leading-relaxed max-w-3xl mx-auto mb-16 transition-all duration-700 delay-100 ${
              isSection4Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Siamo una grande famiglia che cresce insieme, unita dalla passione per il Lambrusco e dalla dedizione al nostro territorio. Vieni a conoscerci.
          </p>

          {/* Images Gallery */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 transition-all duration-700 delay-200 ${
              isSection4Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <img src="/foto/1.jpg" alt="Team" className="w-full h-64 object-cover" />
            <img src="/foto/close-up-78-scaled.jpeg" alt="Vigneto" className="w-full h-64 object-cover" />
            <img src="/foto/close-up-41.jpg" alt="Dettaglio" className="w-full h-64 object-cover" />
          </div>

          <div
            className={`inline-flex flex-col gap-4 transition-all duration-700 delay-300 ${
              isSection4Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <a
              href="tel:059702761"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-chiarli-wine text-white font-sans text-sm uppercase tracking-widest font-bold hover:bg-chiarli-wine-light transition-all"
            >
              <Calendar size={20} />
              Prenota una Visita: 059 702 761
            </a>
            <p className="font-sans text-white/60 text-sm">
              Villa Cialdini, Castelvetro di Modena | accoglienza.cletochiarli@chiarli.it
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
