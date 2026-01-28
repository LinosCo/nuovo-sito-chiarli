import React, { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, X, ArrowRight } from 'lucide-react';

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

  // Image carousel states
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [section4ImageIndex, setSection4ImageIndex] = useState(0);
  const [ctaImageIndex, setCtaImageIndex] = useState(0);

  const heroImages = [
    '/foto/galleria-chiarli-136.jpeg',
    '/foto/close-up-78-scaled.jpeg',
    '/foto/a001-scaled.jpg',
    '/foto/sozzigalli-29.jpg'
  ];

  const section4Images = [
    '/foto/close-up-78-scaled.jpeg',
    '/foto/close-up-41.jpg',
    '/foto/close-up-26-scaled.jpeg',
    '/foto/sozzigalli-10.jpg'
  ];

  const ctaImages = [
    '/foto/a001-scaled.jpg',
    '/foto/galleria-chiarli-136.jpeg',
    '/foto/close-up-87-scaled.jpeg',
    '/foto/vasche-3.jpg'
  ];
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

  // Auto-rotate images for Hero section
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Auto-rotate images for Section 4
  useEffect(() => {
    const interval = setInterval(() => {
      setSection4ImageIndex((prev) => (prev + 1) % section4Images.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [section4Images.length]);

  // Auto-rotate images for CTA section
  useEffect(() => {
    const interval = setInterval(() => {
      setCtaImageIndex((prev) => (prev + 1) % ctaImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [ctaImages.length]);

  return (
    <div>
      {/* Hero Section - DARK */}
      <section ref={heroRef} className="relative min-h-screen bg-chiarli-text overflow-hidden">
        <div className="absolute inset-0">
          <img
            key={heroImageIndex}
            src={heroImages[heroImageIndex]}
            alt="Famiglia Chiarli"
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/45 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30" />
        </div>

        <div className="relative z-20 min-h-screen flex items-center justify-center max-w-[1800px] mx-auto px-6 md:px-12 py-24">
          <div className="max-w-4xl mx-auto text-center">
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
              className={`font-sans text-white/80 text-xl leading-relaxed max-w-2xl mx-auto transition-all duration-700 delay-300 ${
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
      <section ref={section2Ref} className="relative bg-chiarli-text overflow-hidden py-32">
        {/* Animated Sparkling Bubbles - Red Rising */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${12 + (i % 4) * 8}px`,
                height: `${12 + (i % 4) * 8}px`,
                left: `${5 + (i * 3.2) % 90}%`,
                bottom: `${-20 + (i * 13) % 120}%`,
                background: `radial-gradient(circle at 30% 30%, rgba(214,69,80,${0.4 + (i % 3) * 0.15}), rgba(150,30,40,${0.2 + (i % 3) * 0.1}))`,
                boxShadow: `0 0 ${10 + i % 5}px rgba(214,69,80,0.5), inset 0 0 ${5 + i % 3}px rgba(255,150,160,0.3)`,
                animation: `bubble-rise-continuous ${12 + (i % 5) * 3}s linear infinite`,
                animationDelay: `${-((i * 2) % 24)}s`,
              }}
            />
          ))}
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
                    className={`relative transition-all duration-700 opacity-100`}
                    style={{
                      transitionDelay: `${index * 150}ms`
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

      {/* Section 4: Header - Le persone che fanno la differenza */}
      <section ref={section4Ref} className="relative min-h-screen bg-chiarli-text overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            key={section4ImageIndex}
            src={section4Images[section4ImageIndex]}
            alt="Vigneto"
            className="w-full h-full object-cover transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/45 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-32 text-center">
          <h2
            className={`font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight transition-all duration-700 ${
              isSection4Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Le persone che fanno la <span className="italic text-chiarli-wine-light">differenza</span>
          </h2>

          <p
            className={`font-sans text-white/70 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto transition-all duration-700 delay-100 ${
              isSection4Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Siamo una grande famiglia che cresce insieme, unita dalla passione per il Lambrusco e dalla dedizione al nostro territorio.
          </p>

          {/* Slider indicators - minimal style */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
            {section4Images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSection4ImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === section4ImageIndex
                    ? 'bg-chiarli-wine-light scale-125'
                    : 'bg-white/40 hover:bg-white/60 hover:scale-110'
                }`}
                aria-label={`Vai all'immagine ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Card 1: Storia e Tradizione - Full Screen */}
      <section className="relative min-h-screen bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden lg:order-1">
            <img
              src="/foto/1.jpg"
              alt="Storia e Tradizione"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 lg:bg-gradient-to-l lg:from-white/20 lg:to-transparent" />
          </div>

          {/* Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0 lg:order-2">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine mb-6 block">
                Dal 1860
              </span>

              <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
                Storia e <span className="italic text-chiarli-wine">Tradizione</span>
              </h3>

              <p className="font-serif italic text-2xl text-chiarli-text/70 mb-8 leading-relaxed">
                Dal 1860 custodiamo la memoria del Lambrusco
              </p>

              <p className="font-sans text-chiarli-text/60 text-lg leading-relaxed max-w-lg">
                Generazione dopo generazione, trasmettiamo la passione per il Lambrusco, custodendo i segreti della tradizione e innovando con rispetto per il territorio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Card 2: Le Nostre Terre - Full Screen */}
      <section className="relative min-h-screen bg-chiarli-stone overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden lg:order-2">
            <img
              src="/foto/close-up-78-scaled.jpeg"
              alt="Le Nostre Terre"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-chiarli-stone/20 lg:bg-gradient-to-r lg:from-chiarli-stone/20 lg:to-transparent" />
          </div>

          {/* Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0 lg:order-1">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine mb-6 block">
                3 Tenute Storiche
              </span>

              <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
                Le Nostre <span className="italic text-chiarli-wine">Terre</span>
              </h3>

              <p className="font-serif italic text-2xl text-chiarli-text/70 mb-8 leading-relaxed">
                195 ettari di vigneti nelle terre d'origine
              </p>

              <p className="font-sans text-chiarli-text/60 text-lg leading-relaxed max-w-lg">
                Tre tenute storiche dove il Lambrusco trova la sua massima espressione: Villa Cialdini, Sozzigalli e Belvedere. Terroir unici che raccontano la diversità del nostro territorio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Card 3: Le Nostre Cantine - Full Screen */}
      <section className="relative min-h-screen bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Image */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-screen overflow-hidden lg:order-1">
            <img
              src="/foto/close-up-41.jpg"
              alt="Le Nostre Cantine"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 lg:bg-gradient-to-l lg:from-white/20 lg:to-transparent" />
          </div>

          {/* Content */}
          <div className="flex items-center py-16 md:py-24 lg:py-0 lg:order-2">
            <div className="px-6 md:px-12 lg:px-16 xl:px-24 w-full">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine mb-6 block">
                Innovazione e Qualità
              </span>

              <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 leading-tight">
                Le Nostre <span className="italic text-chiarli-wine">Cantine</span>
              </h3>

              <p className="font-serif italic text-2xl text-chiarli-text/70 mb-8 leading-relaxed">
                Tecnologia e passione al servizio della qualità
              </p>

              <p className="font-sans text-chiarli-text/60 text-lg leading-relaxed max-w-lg">
                Impianti all'avanguardia e metodi tradizionali si fondono per preservare l'autenticità del Lambrusco, rispettando i ritmi naturali dell'uva e del territorio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="relative min-h-screen bg-chiarli-text overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            key={ctaImageIndex}
            src={ctaImages[ctaImageIndex]}
            alt="Villa Cialdini"
            className="w-full h-full object-cover opacity-30 transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-chiarli-text/70 via-chiarli-text/80 to-chiarli-text" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-32 text-center">
          <p className="font-serif italic text-3xl md:text-4xl text-white/70 mb-12">
            Vieni a conoscerci
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <a
              href="tel:059702761"
              className="group relative inline-flex items-center gap-3 px-12 py-6 bg-chiarli-wine text-white font-sans text-sm uppercase tracking-widest font-bold overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-chiarli-wine/50 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-chiarli-wine-light to-chiarli-wine opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Calendar size={20} className="relative z-10" />
              <span className="relative z-10">Prenota una Visita</span>
            </a>

            <a
              href="mailto:accoglienza.cletochiarli@chiarli.it"
              className="group inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300"
            >
              <span className="font-sans text-sm">o scrivici via email</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>

          <div className="pt-12 border-t border-white/10 max-w-2xl mx-auto">
            <p className="font-sans text-white/50 text-base mb-3">Villa Cialdini, Castelvetro di Modena</p>
            <p className="font-sans text-white/40 text-sm">059 702 761 • accoglienza.cletochiarli@chiarli.it</p>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style>{`
        @keyframes bubble-rise-continuous {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          5% {
            opacity: 0.5;
          }
          50% {
            transform: translateY(-50vh) translateX(15px) scale(1.08);
            opacity: 0.6;
          }
          95% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-110vh) translateX(-10px) scale(0.95);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
