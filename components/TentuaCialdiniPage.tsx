import React, { useEffect, useState } from 'react';
import { MapPin, TrendingUp, Calendar, Grape } from 'lucide-react';

interface TentuaCialdiniPageProps {
  onBack?: () => void;
}

export const TentuaCialdiniPage: React.FC<TentuaCialdiniPageProps> = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { icon: Calendar, value: "140+", label: "Anni di storia" },
    { icon: TrendingUp, value: "50", label: "Ettari di vigneti" },
    { icon: Grape, value: "2", label: "Vitigni principali" },
  ];

  return (
    <div className="bg-white">

      {/* Hero Section - Full Screen */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <img
            src="/foto/DSC04010.jpg"
            alt="Tenuta Cialdini"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end pb-20 max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex items-center gap-2 text-white/60 mb-6">
            <MapPin size={20} />
            <span className="font-sans text-sm uppercase tracking-widest">Castelvetro di Modena</span>
          </div>

          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-white mb-6 leading-none">
            Tenuta<br />
            <span className="italic text-chiarli-wine-light">Cialdini</span>
          </h1>

          <p className="font-serif text-2xl md:text-3xl text-white/90 max-w-3xl leading-relaxed">
            La culla di Grasparossa, la salvaguardia di Pignoletto
          </p>
        </div>
      </section>

      {/* Stats Section - Visual Numbers */}
      <section className="py-20 bg-chiarli-text">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="mx-auto mb-4 text-chiarli-wine-light" size={40} />
                <div className="font-serif text-5xl md:text-6xl text-white mb-2">{stat.value}</div>
                <div className="font-sans text-sm uppercase tracking-widest text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro Section - Short and Visual */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-12 leading-tight">
            Nel cuore del <span className="italic text-chiarli-wine">Lambrusco Grasparossa</span>
          </h2>

          <p className="font-sans text-xl text-chiarli-text/70 leading-relaxed mb-8">
            Di proprietà della famiglia da oltre 140 anni, la Tenuta si trova nel cuore della zona di produzione del Lambrusco Grasparossa. I suoi oltre 50 ettari di vigneti si estendono fino alle prime colline appenniniche, dove i depositi alluvionali dell'antico fiume Guerro hanno modellato i terreni.
          </p>

          <div className="w-24 h-1 bg-chiarli-wine mx-auto" />
        </div>
      </section>

      {/* Split Image/Text - Territorio */}
      <section className="relative h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Image */}
          <div className="relative h-[50vh] lg:h-full">
            <img
              src="/foto/2.jpg"
              alt="Territorio"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex items-center justify-center bg-chiarli-stone h-[50vh] lg:h-full">
            <div className="px-8 md:px-16 max-w-xl">
              <span className="font-sans text-xs uppercase tracking-widest text-chiarli-wine mb-4 block">Il Territorio</span>
              <h3 className="font-serif text-4xl md:text-5xl text-chiarli-text mb-8 leading-tight">
                Un microclima <span className="italic text-chiarli-wine">unico</span>
              </h3>
              <div className="space-y-4 text-chiarli-text/70">
                <p className="flex items-start gap-3">
                  <span className="text-chiarli-wine mt-1">•</span>
                  <span>Paesaggio dolcemente ondulato tra pianura e collina</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-chiarli-wine mt-1">•</span>
                  <span>Suolo limoso profondo 50-60 cm con tracce di ghiaia</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-chiarli-wine mt-1">•</span>
                  <span>Ventilazione costante e forti escursioni termiche</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-chiarli-wine mt-1">•</span>
                  <span>Condizioni ideali per un grande Grasparossa</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vigneto Cialdini - Feature Highlight */}
      <section className="relative py-32 bg-chiarli-text overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/foto/close-up-87-scaled.jpeg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-12 leading-tight">
            Vigneto <span className="italic text-chiarli-wine-light">Cialdini</span>
          </h2>

          <p className="font-serif text-2xl md:text-3xl text-white/90 leading-relaxed italic">
            "Un vero cru di Lambrusco, riconoscibile per il suo carattere unico e la sua complessità"
          </p>

          <div className="mt-12 flex justify-center">
            <div className="w-32 h-1 bg-chiarli-wine-light" />
          </div>
        </div>
      </section>

      {/* Vitigni Cards */}
      <section className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <h2 className="font-serif text-4xl md:text-5xl text-chiarli-text mb-4 text-center">
            I Nostri <span className="italic text-chiarli-wine">Vitigni</span>
          </h2>
          <p className="text-center text-chiarli-text/60 mb-20 max-w-2xl mx-auto">
            Due grandi protagonisti del territorio emiliano, custoditi e valorizzati con passione
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Lambrusco Grasparossa Card */}
            <div className="group relative overflow-hidden bg-chiarli-stone hover:shadow-2xl transition-all duration-500">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/foto/close-up-87-scaled.jpeg"
                  alt="Lambrusco Grasparossa"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8 md:p-12">
                <h3 className="font-serif text-3xl md:text-4xl text-chiarli-wine mb-3">
                  Lambrusco Grasparossa
                </h3>
                <p className="font-serif italic text-xl text-chiarli-text/70 mb-6">
                  Il più classico dei Lambruschi di Modena
                </p>
                <p className="font-sans text-chiarli-text/70 leading-relaxed mb-6">
                  Vitigno di antichissime origini coltivato nella zona di Castelvetro. Le uve, di un colore rosso intenso e con elevata presenza di tannini, danno vita a un vino di forte struttura, ricco e polposo.
                </p>
                <div className="border-l-4 border-chiarli-wine pl-6">
                  <p className="font-serif italic text-chiarli-text/80">
                    "Un grande vino rosso, equilibrio e versatilità per un vino veramente polposo"
                  </p>
                </div>
              </div>
            </div>

            {/* Pignoletto Card */}
            <div className="group relative overflow-hidden bg-chiarli-stone hover:shadow-2xl transition-all duration-500">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/foto/close-up-26-scaled.jpeg"
                  alt="Pignoletto"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8 md:p-12">
                <h3 className="font-serif text-3xl md:text-4xl text-chiarli-wine mb-3">
                  Pignoletto
                </h3>
                <p className="font-serif italic text-xl text-chiarli-text/70 mb-6">
                  Un vitigno versatile e completo
                </p>
                <p className="font-sans text-chiarli-text/70 leading-relaxed mb-6">
                  Dalle radici antiche del Grechetto Gentile. Coltivato dal 1600 nella fascia collinare tra Modena e Bologna, è un vitigno che riesce a coniugare aromaticità e struttura polifenolica.
                </p>
                <div className="border-l-4 border-chiarli-wine pl-6">
                  <p className="font-serif italic text-chiarli-text/80">
                    "Il perfetto bilanciamento tra aromaticità e struttura"
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Final Full Width Image */}
      <section className="relative h-[70vh]">
        <img
          src="/foto/galleria-chiarli-136.jpeg"
          alt="Tenuta Cialdini"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center px-6">
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-6">
              Vieni a trovarci
            </h2>
            <p className="font-sans text-xl text-white/90 max-w-2xl mx-auto">
              Scopri la nostra tenuta e degusta i nostri vini nel cuore del territorio del Lambrusco
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
