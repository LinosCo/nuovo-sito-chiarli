import React, { useEffect, useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

interface TentuaCialdiniPageProps {
  onBack?: () => void;
}

export const TentuaCialdiniPage: React.FC<TentuaCialdiniPageProps> = () => {
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    storia: false,
    grasparossa: false,
    pignoletto: false,
  });

  useEffect(() => {
    setIsHeroVisible(true);
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen bg-chiarli-text overflow-hidden">
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
              Di proprietà della famiglia da oltre 140 anni, nel cuore della zona di produzione del Lambrusco Grasparossa.
            </p>
          </div>
        </div>
      </section>

      {/* Storia e Territorio - Split Full Screen */}
      <section className="relative min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden">
            <img
              src="/foto/2.jpg"
              alt="Territorio"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-chiarli-stone/20 lg:bg-gradient-to-l lg:from-chiarli-stone/20 lg:to-transparent" />
          </div>

          {/* Content */}
          <div className="flex items-center justify-center py-20 md:py-32 lg:py-20 bg-chiarli-stone">
            <div className="w-full max-w-xl mx-auto px-8 md:px-12 lg:px-16">
              <h2 className="font-serif text-4xl md:text-5xl text-chiarli-text mb-8 leading-tight">
                La Storia e il <span className="italic text-chiarli-wine">Territorio</span>
              </h2>

              <p className="font-sans text-chiarli-text/80 text-lg leading-relaxed mb-8">
                Di proprietà della famiglia da oltre 140 anni, la Tenuta si trova nel cuore della zona di produzione del Lambrusco Grasparossa, nel comune di Castelvetro. I suoi oltre 50 ettari di vigneti si estendono fino alle prime colline appenniniche, dove i depositi alluvionali dell'antico fiume Guerro hanno modellato i terreni.
              </p>

              <div className={`overflow-hidden transition-all duration-500 ${expandedSections.storia ? 'max-h-[2000px] opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}`}>
                <p className="font-sans text-chiarli-text/80 text-lg leading-relaxed mb-6">
                  Il paesaggio dolcemente ondulato è il risultato del naturale alternarsi di erosione e sedimentazione, e il suolo superficiale — profondo fino a 50–60 cm — presenta una tessitura limosa con tracce di ghiaia.
                </p>

                <p className="font-serif italic text-xl text-chiarli-text/80 border-l-4 border-chiarli-wine pl-6 mb-6">
                  Al centro della tenuta si trova il rinomato vigneto Cialdini, da cui nasce il Grasparossa "Vigneto Cialdini" — un vero cru di Lambrusco, riconoscibile per il suo carattere unico e la sua complessità.
                </p>

                <p className="font-sans text-chiarli-text/80 text-lg leading-relaxed">
                  Un microclima unico, ventilazione costante e forti escursioni termiche rendono questo luogo la culla perfetta per un grande Grasparossa.
                </p>
              </div>

              <button
                onClick={() => toggleSection('storia')}
                className="flex items-center gap-2 text-chiarli-wine hover:text-chiarli-wine/80 transition-colors group"
              >
                <span className="font-sans text-sm uppercase tracking-widest">
                  {expandedSections.storia ? 'Mostra meno' : 'Leggi di più'}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${expandedSections.storia ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lambrusco Grasparossa - Split Full Screen */}
      <section className="relative min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Content */}
          <div className="flex items-center justify-center py-20 md:py-32 lg:py-20 bg-white lg:order-1">
            <div className="w-full max-w-xl mx-auto px-8 md:px-12 lg:px-16">
              <h2 className="font-serif text-4xl md:text-5xl text-chiarli-wine mb-6 leading-tight">
                Lambrusco Grasparossa
              </h2>

              <p className="font-serif italic text-2xl text-chiarli-text/70 mb-8 leading-relaxed">
                Il più classico dei Lambruschi di Modena, da scoprire la sua ricchezza aromatica che ne fa un grande vino.
              </p>

              <p className="font-sans text-chiarli-text/80 text-lg leading-relaxed mb-8">
                Il Grasparossa è un vitigno di antichissime origini coltivato nella zona che si estende attorno al paese di Castelvetro a Sud di Modena dove si incontrano le prime colline dell'Appennino.
              </p>

              <div className={`overflow-hidden transition-all duration-500 ${expandedSections.grasparossa ? 'max-h-[2000px] opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}`}>
                <p className="font-sans text-chiarli-text/80 text-lg leading-relaxed mb-6">
                  I terreni si sviluppano su antichi depositi alluvionali del torrente Guerro misti a ghiaie talora affioranti. Le uve, di un colore rosso intenso e con elevata presenza di tannini, danno vita a un vino di forte struttura, ricco e polposo. Prodotto storicamente con il metodo ancestrale risultava spesso ruvido e causa anche l'elevata presenza di 'fondo' veniva relegato a un consumo prettamente locale. L'avvento del Metodo Charmat ha fatto scoprire le migliori caratteristiche del Grasparossa rendendo evidente la sua freschezza, i piacevoli aromi e l'armonia del suo frutto.
                </p>

                <div className="border-l-4 border-chiarli-wine pl-6 mb-6">
                  <p className="font-serif italic text-xl text-chiarli-text/80">
                    Un grande vino rosso, Equilibrio e Versatilità per un vino veramente "polposo"
                  </p>
                </div>

                <p className="font-sans text-chiarli-text/80 text-lg leading-relaxed">
                  Inoltre il giusto equilibrio tra una importante acidità e un naturale residuo zuccherino lo rendono un Lambrusco dal gusto trasversale. In breve, grazie alla sua nuova personalità, ha ottenuto importantissimi apprezzamenti dal mercato tanto che oggi il Grasparossa, a buon diritto, è entrato a far parte dell'aristocrazia del vino italiano. Il Grasparossa è vino fondamentale per la Cleto Chiarli: è proprio all'interno della Tenuta Villa Cialdini che si trova un antico vigneto costituito da cloni originari di "Graspa Rossa" in grado di darci uve straordinarie che ci consentono di ottenere il famoso Lambrusco "Vigneto Cialdini" riconosciuto e apprezzato dalla migliore clientela italiana ed estera.
                </p>
              </div>

              <button
                onClick={() => toggleSection('grasparossa')}
                className="flex items-center gap-2 text-chiarli-wine hover:text-chiarli-wine/80 transition-colors group"
              >
                <span className="font-sans text-sm uppercase tracking-widest">
                  {expandedSections.grasparossa ? 'Mostra meno' : 'Leggi di più'}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${expandedSections.grasparossa ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden lg:order-2">
            <img
              src="/foto/close-up-87-scaled.jpeg"
              alt="Lambrusco Grasparossa"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20 lg:bg-gradient-to-r lg:from-white/20 lg:to-transparent" />
          </div>
        </div>
      </section>

      {/* Pignoletto - Split Full Screen */}
      <section className="relative min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden">
            <img
              src="/foto/close-up-26-scaled.jpeg"
              alt="Pignoletto"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-chiarli-stone/20 lg:bg-gradient-to-l lg:from-chiarli-stone/20 lg:to-transparent" />
          </div>

          {/* Content */}
          <div className="flex items-center justify-center py-20 md:py-32 lg:py-20 bg-chiarli-stone">
            <div className="w-full max-w-xl mx-auto px-8 md:px-12 lg:px-16">
              <h2 className="font-serif text-4xl md:text-5xl text-chiarli-wine mb-6 leading-tight">
                Pignoletto
              </h2>

              <p className="font-serif italic text-2xl text-chiarli-text/70 mb-8 leading-relaxed">
                Un vitigno versatile e completo, dalle radici antiche del Grechetto Gentile.
              </p>

              <p className="font-sans text-chiarli-text/80 text-lg leading-relaxed mb-8">
                Come dice il nome, la Grecia è il paese d'origine di questo vitigno, che verrà coltivato in molte parti dell'Italia centro-meridionale. In Emilia, prendendo il nome di Pignoletto troverà un habitat perfetto nella fascia collinare e pedecollinare tra Modena e Bologna, tanto che se ne hanno notizie certe fin dal 1600.
              </p>

              <div className={`overflow-hidden transition-all duration-500 ${expandedSections.pignoletto ? 'max-h-[2000px] opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}`}>
                <p className="font-sans text-chiarli-text/80 text-lg leading-relaxed mb-6">
                  Però del Pignoletto ci interessa soprattutto la versatilità, poche uve possono, sullo stesso territorio, dare vini frizzanti di pronta beva, ma anche vini bianchi fermi di bella struttura e longevità, per passare poi ad importanti passiti.
                </p>

                <div className="border-l-4 border-chiarli-wine pl-6 mb-6">
                  <p className="font-serif italic text-xl text-chiarli-text/80">
                    Il perfetto bilanciamento tra aromaticità e struttura
                  </p>
                </div>

                <p className="font-sans text-chiarli-text/80 text-lg leading-relaxed">
                  Questo perché ci troviamo in presenza di un vitigno che riesce a coniugare una bella parte aromatica, tanto che in passato lo si riteneva derivante dal Riesling o dal Pinot Bianco, con una componente tannica e polifenolica da grande vino. Tutto questo lo ritroviamo nel nostro Pignoletto spumante Modén e in parte anche nel Blanc de Blanc, dove il terroir particolare della zona di Castelvetro, tra pianura e collina, esalta la vena fresca e fruttata, che invita al sorso, mantiene sempre la tensione e rende il vino veramente appagante, nonché aperto a molti abbinamenti che sarebbero difficili per altri spumanti aromatici.
                </p>
              </div>

              <button
                onClick={() => toggleSection('pignoletto')}
                className="flex items-center gap-2 text-chiarli-wine hover:text-chiarli-wine/80 transition-colors group"
              >
                <span className="font-sans text-sm uppercase tracking-widest">
                  {expandedSections.pignoletto ? 'Mostra meno' : 'Leggi di più'}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${expandedSections.pignoletto ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final Gallery Section */}
      <section className="relative min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Content */}
          <div className="flex items-center justify-center py-20 md:py-32 lg:py-20 bg-white lg:order-1">
            <div className="w-full max-w-xl mx-auto px-8 md:px-12 lg:px-16">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
                La <span className="italic text-chiarli-wine">Tenuta</span>
              </h2>
              <p className="font-serif italic text-xl text-chiarli-text/70 leading-relaxed">
                Oltre 140 anni di storia familiare nel cuore della zona di produzione del Lambrusco Grasparossa.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden lg:order-2">
            <img
              src="/foto/DSC04010.jpg"
              alt="Tenuta"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20 lg:bg-gradient-to-r lg:from-white/20 lg:to-transparent" />
          </div>
        </div>
      </section>

      <section className="relative min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden">
            <img
              src="/foto/galleria-chiarli-136.jpeg"
              alt="Vigneto"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-chiarli-stone/20 lg:bg-gradient-to-l lg:from-chiarli-stone/20 lg:to-transparent" />
          </div>

          {/* Content */}
          <div className="flex items-center justify-center py-20 md:py-32 lg:py-20 bg-chiarli-stone">
            <div className="w-full max-w-xl mx-auto px-8 md:px-12 lg:px-16">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
                Il <span className="italic text-chiarli-wine">Territorio</span>
              </h2>
              <p className="font-serif italic text-xl text-chiarli-text/70 leading-relaxed">
                50 ettari di vigneti alle pendici dell'Appennino, dove il microclima unico crea le condizioni ideali per una produzione premium.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
