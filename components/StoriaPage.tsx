import React, { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, X } from 'lucide-react';

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
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [activeTimelineItem, setActiveTimelineItem] = useState<number>(0);

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
            src="/foto/a001-scaled.jpg"
            alt="Famiglia Chiarli"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/45 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30" />
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
              src="/foto/galleria-chiarli-136.jpeg"
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
      <section ref={section2Ref} className="relative bg-black overflow-hidden py-32">
        {/* Bubble Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12">
          <h2
            className={`font-serif text-5xl md:text-7xl text-center text-white mb-24 transition-all duration-700 ${
              isSection2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            165 anni di <span className="italic text-chiarli-wine-light">Storia</span>
          </h2>

          {/* Vertical Timeline */}
          <div className="relative">
            {/* Central Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-chiarli-wine-light/30 hidden md:block" />

            {/* Timeline Items */}
            <div className="space-y-24">
              {[
                {
                  year: "1850",
                  title: "La Trattoria dell'Artigliere",
                  description: "Prima di diventare produttore di vino, Cleto Chiarli gestisce una popolare trattoria nel centro storico di Modena.",
                  details: "Il suo Lambrusco fatto in casa conquista rapidamente il favore locale, diventando uno dei punti di riferimento della città per gli amanti del buon vino.",
                  curiosity: "La trattoria era frequentata da intellettuali, artigiani e commercianti modenesi che apprezzavano il Lambrusco genuino di Cleto.",
                  image: "/foto/1.jpg"
                },
                {
                  year: "1860",
                  title: "La Fondazione",
                  description: "Cleto ottiene il permesso ufficiale per espandersi e costruisce la cantina accanto alla trattoria.",
                  details: "Questo segna l'inizio di Chiarli come produttore di vino e la storia moderna del Lambrusco. Nello stesso anno viene introdotto il tappo a fungo per preservare le bollicine del Lambrusco.",
                  curiosity: "Chiarli è stata la prima cantina dell'Emilia-Romagna, pioniera nell'uso del tappo a fungo per i vini spumanti.",
                  image: "/foto/vasche-4.jpg"
                },
                {
                  year: "1885",
                  title: "Prime Esportazioni",
                  description: "Il Lambrusco Chiarli inizia a raggiungere i mercati internazionali, seguendo le rotte degli emigranti italiani.",
                  details: "Anselmo Chiarli, seconda generazione, guida l'azienda verso una nuova fase rafforzando i legami con le cooperative viticole locali e aprendo nuovi mercati.",
                  curiosity: "Il Lambrusco Chiarli diventa ambasciatore del vino modenese nel mondo, portando un pezzo di casa agli emigrati italiani.",
                  image: "/foto/galleria-chiarli-136.jpeg"
                },
                {
                  year: "1888",
                  title: "Cantina Via Poletti",
                  description: "Per soddisfare la crescente domanda, Chiarli costruisce una nuova e più grande cantina in Via Poletti.",
                  details: "Questo segnala l'espansione e la modernizzazione dell'azienda. La nuova struttura permette di triplicare la produzione.",
                  curiosity: "Via Poletti diventa il nuovo cuore produttivo di Chiarli, simbolo di crescita e innovazione.",
                  image: "/foto/a001-scaled.jpg"
                },
                {
                  year: "1900",
                  title: "Parigi e i 100.000",
                  description: "Chiarli viene premiata con Menzione d'Onore all'Esposizione Universale di Parigi.",
                  details: "La produzione annuale supera le 100.000 bottiglie – un record straordinario per l'epoca. Il riconoscimento internazionale consacra Chiarli tra i grandi produttori italiani.",
                  curiosity: "L'Expo di Parigi del 1900 attirò oltre 50 milioni di visitatori. Il premio fu un trionfo per il Lambrusco modenese.",
                  image: "/foto/2.jpg"
                },
                {
                  year: "1924",
                  title: "Cantina Via Manin",
                  description: "Viene inaugurata una nuova struttura all'avanguardia in Via Manin a Modena.",
                  details: "Questa sede rimarrà il quartier generale dell'azienda per generazioni, attraversando momenti di gloria e di difficoltà.",
                  curiosity: "La cantina di Via Manin fu progettata con criteri innovativi per l'epoca, includendo sistemi di refrigerazione avanzati.",
                  image: "/foto/close-up-87-scaled.jpeg"
                },
                {
                  year: "1944",
                  title: "Il Bombardamento",
                  description: "Durante la Seconda Guerra Mondiale, la cantina di Via Manin subisce gravi danni dai bombardamenti.",
                  details: "Un momento buio nella storia dell'azienda. La famiglia Chiarli salvaguarda i documenti storici e le ricette segrete, proteggendo l'eredità familiare.",
                  curiosity: "Nonostante i danni, la famiglia non perse mai la speranza e iniziò subito a pianificare la ricostruzione.",
                  image: "/foto/DSC04010.jpg"
                },
                {
                  year: "1947",
                  title: "La Ricostruzione",
                  description: "Giovanni e Giorgio Chiarli, terza generazione, guidano la ricostruzione della cantina di Via Manin.",
                  details: "Il sito storico viene ricostruito e modernizzato dopo la guerra, segnando una potente rinascita per Chiarli. L'azienda rinasce più forte di prima.",
                  curiosity: "La ricostruzione fu completata in tempo record grazie all'impegno di tutta la famiglia e dei dipendenti fedeli.",
                  image: "/foto/a001-scaled.jpg"
                },
                {
                  year: "1952",
                  title: "Le Prime Autoclavi",
                  description: "Chiarli è pioniera nell'uso delle autoclavi in Emilia-Romagna per la produzione di vini spumanti.",
                  details: "Questa innovazione rivoluziona la fermentazione del Lambrusco, permettendo di controllare meglio il processo e migliorare la qualità del prodotto finale.",
                  curiosity: "Le autoclavi permettevano di produrre Lambrusco di qualità superiore in modo più efficiente e controllato.",
                  image: "/foto/vasche-4.jpg"
                },
                {
                  year: "1970",
                  title: "Selezione Massale",
                  description: "Chiarli investe nel patrimonio genetico, iniziando studi su cloni antichi.",
                  details: "La ricerca sulla selezione massale mira a salvaguardare l'autenticità del Lambrusco, preservando i vitigni storici pre-fillossera.",
                  curiosity: "Alcuni dei cloni studiati risalgono a prima della fillossera, rappresentando un tesoro genetico inestimabile.",
                  image: "/foto/close-up-41.jpg"
                },
                {
                  year: "1980",
                  title: "Vecchia Modena",
                  description: "Lancio del Vecchia Modena Lambrusco Sorbara Brut al Congresso Nazionale Assoenologi.",
                  details: "Il vino diventa istantaneamente un punto di riferimento per i moderni vini rossi spumanti, elevando il Lambrusco a nuovi standard di eccellenza.",
                  curiosity: "Vecchia Modena fu il primo Lambrusco Brut di alta qualità, cambiando per sempre la percezione del vitigno.",
                  image: "/foto/galleria-chiarli-136.jpeg"
                },
                {
                  year: "2002",
                  title: "Tenuta Cialdini",
                  description: "Inaugurazione di Tenuta Cialdini a Castelvetro, una storica proprietà nel territorio del Grasparossa.",
                  details: "Con 50 ettari di vigneti, Tenuta Cialdini diventa uno dei vigneti di punta di Cleto Chiarli, simbolo di eccellenza e territorio.",
                  curiosity: "Villa Cialdini è anche sede di eventi e visite guidate, accogliendo migliaia di appassionati ogni anno.",
                  image: "/foto/vasche-4.jpg"
                },
                {
                  year: "2014",
                  title: "Quintopasso Metodo Classico",
                  description: "Viene rilasciato il primo Quintopasso Rosé – un Metodo Classico da 100% Sorbara.",
                  details: "Questo vino ridefinisce il prestigio del Lambrusco, dimostrando che può competere con i grandi spumanti metodo classico italiani e internazionali.",
                  curiosity: "Quintopasso richiede almeno 36 mesi di affinamento sui lieviti, come i migliori Champagne.",
                  image: "/foto/sozzigalli-29.jpg"
                },
                {
                  year: "2025",
                  title: "Archivio e Galleria Chiarli",
                  description: "Apertura dell'Archivio e Galleria Chiarli, nuovo spazio culturale a Modena.",
                  details: "Il museo ospita documenti storici, etichette e opere d'arte di oltre 165 anni di eredità Chiarli – aperto agli amanti del vino, agli storici e alle future generazioni.",
                  curiosity: "L'archivio custodisce etichette originali del 1860, fotografie d'epoca e ricette segrete tramandate di generazione in generazione.",
                  image: "/foto/2.jpg"
                }
              ].map((item, index) => {
                const isLeft = index % 2 === 0;
                const isExpanded = expandedCard === index;
                return (
                  <div
                    key={index}
                    className={`relative transition-all duration-700 ${
                      isSection2Visible ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      transitionDelay: `${index * 150}ms`,
                      transform: isSection2Visible ? 'none' : isLeft ? 'translateX(-50px)' : 'translateX(50px)'
                    }}
                  >
                    <div className={`grid md:grid-cols-2 gap-8 items-start ${isLeft ? '' : 'md:grid-flow-dense'}`}>
                      {/* Year Circle on center line */}
                      <div
                        className={`absolute left-1/2 top-8 -translate-x-1/2 hidden md:flex items-center justify-center w-20 h-20 rounded-full bg-chiarli-text border-4 transition-all duration-300 z-10 cursor-pointer ${
                          isExpanded ? 'border-white scale-110' : 'border-chiarli-wine-light hover:border-white hover:scale-105'
                        }`}
                        onClick={() => setExpandedCard(isExpanded ? null : index)}
                      >
                        <span className={`font-serif text-lg font-bold transition-colors ${
                          isExpanded ? 'text-white' : 'text-chiarli-wine-light'
                        }`}>
                          {item.year}
                        </span>
                      </div>

                      {/* Content Card */}
                      <div className={`${isLeft ? 'md:text-right md:pr-16' : 'md:col-start-2 md:pl-16'}`}>
                        <div
                          className="group cursor-pointer"
                          onClick={() => setExpandedCard(isExpanded ? null : index)}
                        >
                          {/* Mobile Year */}
                          <span className="font-serif text-5xl text-chiarli-wine-light block mb-4 md:hidden">
                            {item.year}
                          </span>

                          <h3 className={`font-serif text-3xl mb-4 transition-all duration-300 ${
                            isExpanded ? 'text-white' : 'text-white group-hover:text-chiarli-wine-light'
                          }`}>
                            {item.title}
                          </h3>

                          <p className="font-sans text-white/70 text-lg leading-relaxed mb-4">
                            {item.description}
                          </p>

                          {/* Expanded Content */}
                          <div className={`overflow-hidden transition-all duration-500 ${
                            isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                          }`}>
                            <div className={`pt-4 border-t-2 border-chiarli-wine-light/30 mt-4 space-y-4 ${
                              isLeft ? 'md:text-right' : ''
                            }`}>
                              <p className="font-sans text-white/90 text-base leading-relaxed">
                                {item.details}
                              </p>
                              <div className="bg-chiarli-wine/20 p-4 rounded">
                                <span className="font-sans text-xs uppercase tracking-widest text-chiarli-wine-light block mb-2">
                                  Curiosità
                                </span>
                                <p className="font-serif italic text-white/80 text-base">
                                  {item.curiosity}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Expand/Collapse Indicator */}
                          <div className={`mt-4 flex items-center gap-2 text-sm font-sans uppercase tracking-wider transition-colors ${
                            isExpanded ? 'text-white' : 'text-chiarli-wine-light group-hover:text-white'
                          } ${isLeft ? 'md:justify-end' : ''}`}>
                            <span>{isExpanded ? 'Chiudi' : 'Scopri di più'}</span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                      </div>

                      {/* Image */}
                      <div className={`${isLeft ? 'md:col-start-2 md:pl-16' : 'md:pr-16'}`}>
                        <div
                          className="group relative overflow-hidden shadow-2xl cursor-pointer"
                          onClick={() => setExpandedCard(isExpanded ? null : index)}
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className={`w-full h-64 object-cover transform transition-all duration-700 ${
                              isExpanded ? 'scale-105' : 'group-hover:scale-110'
                            }`}
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-500 ${
                            isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`} />
                          {!isExpanded && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                                <span className="font-sans text-white text-sm uppercase tracking-wider">
                                  Clicca per espandere
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
