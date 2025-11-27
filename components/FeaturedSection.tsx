import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export const FeaturedSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
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

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/foto/WhatsApp-Image-2025-06-05-at-09.13.47.jpeg"
          alt="Wine Experience"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      {/* Subtle wine gradient following mouse */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-out z-10"
        style={{
          background: `radial-gradient(circle 400px at ${mousePosition.x}% ${mousePosition.y}%, rgba(87,15,26,0.15) 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-20 min-h-screen flex items-center">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-24 w-full">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

            {/* Left: Main Content */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span
                className={`font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine-light mb-6 block transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Un'Esperienza Unica
              </span>

              <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-8 leading-tight">
                <span
                  className={`block transition-all duration-700 delay-100 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  Dove il tempo
                </span>
                <span
                  className={`block transition-all duration-700 delay-200 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  si ferma
                </span>
                <span
                  className={`italic text-chiarli-wine-light block transition-all duration-700 delay-300 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  nel bicchiere.
                </span>
              </h2>

              <p
                className={`font-sans text-white/70 text-lg leading-relaxed mb-8 max-w-xl transition-all duration-700 delay-400 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                Vieni a scoprire dove nasce il mito. Un viaggio attraverso generazioni di passione,
                tra vigneti secolari e cantine che custodiscono i segreti del Lambrusco più autentico.
              </p>

              <p
                className={`font-serif italic text-xl text-chiarli-wine-light/90 border-l-2 border-chiarli-wine-light pl-6 mb-12 max-w-lg transition-all duration-700 delay-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Ogni visita è un'esperienza personalizzata, guidata dalla famiglia Chiarli.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className={`group flex items-center gap-4 bg-chiarli-wine text-white px-8 py-4 hover:bg-white hover:text-chiarli-text transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: '600ms' }}
                >
                  <span className="font-sans text-xs font-bold uppercase tracking-widest">Prenota una visita</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  className={`group flex items-center gap-4 border border-white/30 text-white px-8 py-4 hover:bg-white/10 transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: '700ms' }}
                >
                  <span className="font-sans text-xs font-bold uppercase tracking-widest">Scopri le esperienze</span>
                </button>
              </div>
            </div>

            {/* Right: Feature Cards */}
            <div className="lg:col-span-5 flex flex-col justify-center gap-6">
              {/* Card 1 */}
              <div
                onClick={() => setSelectedCard(selectedCard === 1 ? null : 1)}
                className={`group bg-white/5 backdrop-blur-sm border p-8 transition-all duration-500 cursor-pointer ${
                  selectedCard === 1
                    ? 'bg-chiarli-wine-light/20 border-chiarli-wine-light scale-[1.02] shadow-lg shadow-chiarli-wine/20'
                    : 'border-white/10 hover:bg-white/10 hover:border-chiarli-wine/50'
                } ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`font-serif text-6xl leading-none transition-all duration-300 ${selectedCard === 1 ? 'text-chiarli-wine-light drop-shadow-[0_0_20px_rgba(180,100,120,0.8)]' : 'text-white/10 group-hover:text-chiarli-wine-light group-hover:drop-shadow-[0_0_25px_rgba(180,100,120,0.9)]'}`}>01</span>
                  <ArrowRight size={20} className={`transition-all ${selectedCard === 1 ? 'text-chiarli-wine-light translate-x-1' : 'text-white/30 group-hover:text-chiarli-wine-light group-hover:translate-x-1'}`} />
                </div>
                <h3 className={`font-serif text-2xl mb-2 transition-colors ${selectedCard === 1 ? 'text-chiarli-wine-light' : 'text-white group-hover:text-chiarli-wine-light'}`}>Degustazione Guidata</h3>
                <p className={`font-sans text-sm transition-colors ${selectedCard === 1 ? 'text-white/70' : 'text-white/50'}`}>Un viaggio sensoriale attraverso i nostri migliori Lambrusco, guidati dai nostri sommelier.</p>
              </div>

              {/* Card 2 */}
              <div
                onClick={() => setSelectedCard(selectedCard === 2 ? null : 2)}
                className={`group bg-white/5 backdrop-blur-sm border p-8 transition-all duration-500 cursor-pointer ${
                  selectedCard === 2
                    ? 'bg-chiarli-wine-light/20 border-chiarli-wine-light scale-[1.02] shadow-lg shadow-chiarli-wine/20'
                    : 'border-white/10 hover:bg-white/10 hover:border-chiarli-wine/50'
                } ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                }`}
                style={{ transitionDelay: '550ms' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`font-serif text-6xl leading-none transition-all duration-300 ${selectedCard === 2 ? 'text-chiarli-wine-light drop-shadow-[0_0_20px_rgba(180,100,120,0.8)]' : 'text-white/10 group-hover:text-chiarli-wine-light group-hover:drop-shadow-[0_0_25px_rgba(180,100,120,0.9)]'}`}>02</span>
                  <ArrowRight size={20} className={`transition-all ${selectedCard === 2 ? 'text-chiarli-wine-light translate-x-1' : 'text-white/30 group-hover:text-chiarli-wine-light group-hover:translate-x-1'}`} />
                </div>
                <h3 className={`font-serif text-2xl mb-2 transition-colors ${selectedCard === 2 ? 'text-chiarli-wine-light' : 'text-white group-hover:text-chiarli-wine-light'}`}>Tour dei Vigneti</h3>
                <p className={`font-sans text-sm transition-colors ${selectedCard === 2 ? 'text-white/70' : 'text-white/50'}`}>Scopri i segreti delle nostre tenute e il legame tra territorio e vino.</p>
              </div>

              {/* Card 3 */}
              <div
                onClick={() => setSelectedCard(selectedCard === 3 ? null : 3)}
                className={`group bg-white/5 backdrop-blur-sm border p-8 transition-all duration-500 cursor-pointer ${
                  selectedCard === 3
                    ? 'bg-chiarli-wine-light/20 border-chiarli-wine-light scale-[1.02] shadow-lg shadow-chiarli-wine/20'
                    : 'border-white/10 hover:bg-white/10 hover:border-chiarli-wine/50'
                } ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                }`}
                style={{ transitionDelay: '700ms' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`font-serif text-6xl leading-none transition-all duration-300 ${selectedCard === 3 ? 'text-chiarli-wine-light drop-shadow-[0_0_20px_rgba(180,100,120,0.8)]' : 'text-white/10 group-hover:text-chiarli-wine-light group-hover:drop-shadow-[0_0_25px_rgba(180,100,120,0.9)]'}`}>03</span>
                  <ArrowRight size={20} className={`transition-all ${selectedCard === 3 ? 'text-chiarli-wine-light translate-x-1' : 'text-white/30 group-hover:text-chiarli-wine-light group-hover:translate-x-1'}`} />
                </div>
                <h3 className={`font-serif text-2xl mb-2 transition-colors ${selectedCard === 3 ? 'text-chiarli-wine-light' : 'text-white group-hover:text-chiarli-wine-light'}`}>Cena in Cantina</h3>
                <p className={`font-sans text-sm transition-colors ${selectedCard === 3 ? 'text-white/70' : 'text-white/50'}`}>Un'esperienza gastronomica esclusiva abbinata ai nostri vini più pregiati.</p>
              </div>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
