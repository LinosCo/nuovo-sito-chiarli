import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface TentuaCialdiniPageProps {
  onBack?: () => void;
}

export const TentuaCialdiniPage: React.FC<TentuaCialdiniPageProps> = ({ onBack }) => {
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
      name: "Lambrusco Grasparossa",
      subtitle: "Il più classico dei Lambruschi di Modena",
      description: "Il più classico dei Lambruschi di Modena, da scoprire la sua ricchezza aromatica che ne fa un grande vino. Un gusto perfetto per il moderno stile di vita che cerca intensità e leggerezza.",
      intro: "Il Grasparossa è un vitigno di antichissime origini coltivato nella zona che si estende attorno al paese di Castelvetro a Sud di Modena dove si incontrano le prime colline dell'Appennino.",
      details: "I terreni si sviluppano su antichi depositi alluvionali del torrente Guerro misti a ghiaie talora affioranti. Le uve, di un colore rosso intenso e con elevata presenza di tannini, danno vita a un vino di forte struttura, ricco e polposo. Prodotto storicamente con il metodo ancestrale risultava spesso ruvido e causa anche l'elevata presenza di 'fondo' veniva relegato a un consumo prettamente locale. L'avvento del Metodo Charmat ha fatto scoprire le migliori caratteristiche del Grasparossa rendendo evidente la sua freschezza, i piacevoli aromi e l'armonia del suo frutto.",
      conclusion: `Un grande vino rosso, Equilibrio e Versatilità per un vino veramente "polposo". Inoltre il giusto equilibrio tra una importante acidità e un naturale residuo zuccherino lo rendono un Lambrusco dal gusto trasversale. In breve, grazie alla sua nuova personalità, ha ottenuto importantissimi apprezzamenti dal mercato tanto che oggi il Grasparossa, a buon diritto, è entrato a far parte dell'aristocrazia del vino italiano. Il Grasparossa è vino fondamentale per la Cleto Chiarli: è proprio all'interno della Tenuta Villa Cialdini che si trova un antico vigneto costituito da cloni originari di "Graspa Rossa" in grado di darci uve straordinarie che ci consentono di ottenere il famoso Lambrusco "Vigneto Cialdini" riconosciuto e apprezzato dalla migliore clientela italiana ed estera.`,
      image: "/foto/close-up-87-scaled.jpeg"
    },
    {
      name: "Pignoletto",
      subtitle: "Un vitigno versatile e completo",
      description: "Un vitigno versatile e completo, dalle radici antiche del Grechetto Gentile, che siamo riusciti ad esaltare nella sua versione spumante, rendendolo completo ed equilibrato in un modo difficilmente imitabile.",
      intro: "Come dice il nome, la Grecia è il paese d'origine di questo vitigno, che verrà coltivato in molte parti dell'Italia centro-meridionale. In Emilia, prendendo il nome di Pignoletto troverà un habitat perfetto nella fascia collinare e pedecollinare tra Modena e Bologna, tanto che se ne hanno notizie certe fin dal 1600.",
      details: "Però del Pignoletto ci interessa soprattutto la versatilità, poche uve possono, sullo stesso territorio, dare vini frizzanti di pronta beva, ma anche vini bianchi fermi di bella struttura e longevità, per passare poi ad importanti passiti.",
      conclusion: "Il perfetto bilanciamento tra aromaticità e struttura. Questo perché ci troviamo in presenza di un vitigno che riesce a coniugare una bella parte aromatica, tanto che in passato lo si riteneva derivante dal Riesling o dal Pinot Bianco, con una componente tannica e polifenolica da grande vino. Tutto questo lo ritroviamo nel nostro Pignoletto spumante Modén e in parte anche nel Blanc de Blanc, dove il terroir particolare della zona di Castelvetro, tra pianura e collina, esalta la vena fresca e fruttata, che invita al sorso, mantiene sempre la tensione e rende il vino veramente appagante, nonché aperto a molti abbinamenti che sarebbero difficili per altri spumanti aromatici.",
      image: "/foto/close-up-26-scaled.jpeg"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen bg-chiarli-text overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/foto/DSC04010.jpg"
            alt="Tenuta Cialdini"
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
              Tenuta Cialdini
            </h1>

            <p
              className={`flex items-center gap-2 text-white/70 text-xl mb-8 transition-all duration-700 delay-200 ${
                isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <MapPin size={20} />
              <span className="font-sans uppercase tracking-widest">Castelvetro di Modena</span>
            </p>

            <p
              className={`font-serif italic text-3xl text-chiarli-wine-light mb-8 transition-all duration-700 delay-300 ${
                isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              La culla di Grasparossa, la salvaguardia di Pignoletto
            </p>

            <p
              className={`font-sans text-white/70 text-xl leading-relaxed transition-all duration-700 delay-400 ${
                isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Oltre 140 anni di storia familiare e 50 ettari di vigneti nel cuore della zona di produzione del Lambrusco Grasparossa.
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
                Di proprietà della famiglia da oltre 140 anni, la Tenuta si trova nel cuore della zona di produzione del Lambrusco Grasparossa, nel comune di Castelvetro. I suoi oltre 50 ettari di vigneti si estendono fino alle prime colline appenniniche, dove i depositi alluvionali dell'antico fiume Guerro hanno modellato i terreni.
              </p>

              <p
                className={`font-sans text-chiarli-text/70 text-lg leading-relaxed mb-6 transition-all duration-700 delay-150 ${
                  isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                Il paesaggio dolcemente ondulato è il risultato del naturale alternarsi di erosione e sedimentazione, e il suolo superficiale — profondo fino a 50–60 cm — presenta una tessitura limosa con tracce di ghiaia.
              </p>

              <p
                className={`font-serif italic text-xl text-chiarli-text/70 border-l-2 border-chiarli-text/30 pl-6 transition-all duration-700 delay-200 ${
                  isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Al centro della tenuta si trova il rinomato vigneto Cialdini, da cui nasce il Grasparossa "Vigneto Cialdini" — un vero cru di Lambrusco, riconoscibile per il suo carattere unico e la sua complessità.
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
                Un microclima unico, ventilazione costante e forti escursioni termiche rendono questo luogo la culla perfetta per un grande Grasparossa.
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
                <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full max-w-3xl">
                  <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-wine mb-4 leading-tight">
                    {vitigno.name}
                  </h2>

                  <p className="font-serif italic text-xl text-chiarli-text/70 mb-8">
                    {vitigno.subtitle}
                  </p>

                  <p className="font-sans text-chiarli-text/80 text-lg leading-relaxed mb-6">
                    {vitigno.description}
                  </p>

                  <p className="font-sans text-chiarli-text/70 text-base leading-relaxed mb-6">
                    {vitigno.intro}
                  </p>

                  <p className="font-sans text-chiarli-text/70 text-base leading-relaxed mb-6">
                    {vitigno.details}
                  </p>

                  <p className="font-sans text-chiarli-text/70 text-base leading-relaxed">
                    {vitigno.conclusion}
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
              src="/foto/DSC04010.jpg"
              alt="Vigneto Cialdini"
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
                Oltre 140 anni di storia familiare nel cuore della zona di produzione del Lambrusco Grasparossa.
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
              src="/foto/close-up-26-scaled.jpeg"
              alt="Dettaglio Vigneto"
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
                50 ettari di vigneti alle pendici dell'Appennino, dove il microclima unico crea le condizioni ideali per una produzione premium.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
