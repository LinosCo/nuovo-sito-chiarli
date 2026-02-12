import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface StoriaPageProps {
  onBack?: () => void;
}

export const StoriaPage: React.FC<StoriaPageProps> = ({ onBack }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isSection1Visible, setIsSection1Visible] = useState(false);
  const [isSection2Visible, setIsSection2Visible] = useState(false);
  const [isSection3Visible, setIsSection3Visible] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

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
        });
      },
      { threshold: 0.2 },
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (section1Ref.current) observer.observe(section1Ref.current);
    if (section2Ref.current) observer.observe(section2Ref.current);
    if (section3Ref.current) observer.observe(section3Ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* Hero Section - DARK */}
      <section
        ref={heroRef}
        className="relative min-h-screen bg-chiarli-text overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src="/foto/sito/hero_storia.webp"
            alt="Famiglia Chiarli"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/45 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30" />
        </div>

        <div className="relative z-20 min-h-screen flex items-center justify-center max-w-[1800px] mx-auto px-6 md:px-12 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <span
              className={`font-sans text-[10px] font-bold uppercase tracking-widest text-chiarli-wine-light mb-6 block transition-all duration-700 ${
                isHeroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              Chi Siamo
            </span>

            <h1
              className={`font-serif text-6xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight transition-all duration-700 delay-100 ${
                isHeroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Una storia di famiglia radicata a{" "}
              <span className="italic text-chiarli-wine-light">Modena</span>
            </h1>

            <p
              className={`font-serif italic text-4xl text-chiarli-wine-light mb-12 transition-all duration-700 delay-200 ${
                isHeroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              Dal 1860
            </p>

            <p
              className={`font-sans text-white/80 text-xl leading-relaxed max-w-2xl mx-auto transition-all duration-700 delay-300 ${
                isHeroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              Da oltre 165 anni, Cleto Chiarli è una storia di famiglia radicata
              a Modena, guidata da generazioni di dedizione e costruita su un
              profondo legame con la terra e le persone.
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
              isSection1Visible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <img
              src="/foto/sito/galleria-chiarli-136.webp"
              alt="Vigneti Chiarli"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Text Side */}
          <div className="bg-chiarli-stone py-32 px-6 md:px-16 flex items-center">
            <div>
              <h2
                className={`font-serif text-5xl md:text-6xl text-chiarli-text mb-8 transition-all duration-700 delay-100 ${
                  isSection1Visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Pionieri del{" "}
                <span className="italic text-chiarli-wine">Lambrusco</span>
              </h2>

              <p
                className={`font-sans text-chiarli-text/70 text-xl leading-relaxed mb-8 transition-all duration-700 delay-200 ${
                  isSection1Visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                Fondata nel 1860, Chiarli è la più antica cantina
                dell'Emilia-Romagna e pioniera nella produzione del Lambrusco.
              </p>

              <div
                className={`border-l-4 border-chiarli-wine pl-8 transition-all duration-700 delay-300 ${
                  isSection1Visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                <p className="font-serif italic text-2xl text-chiarli-text/70 leading-relaxed">
                  Il vino rappresenta per noi l'espressione di una relazione —
                  con la terra, con il tempo, con chi lo crea.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: 165 anni di storia - DARK */}
      <section
        ref={section2Ref}
        className="relative bg-chiarli-text overflow-hidden py-32"
      >
        {/* Animated Sparkling Bubbles - Red Rising */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${12 + (i % 4) * 8}px`,
                height: `${12 + (i % 4) * 8}px`,
                left: `${5 + ((i * 3.2) % 90)}%`,
                bottom: `${-20 + ((i * 13) % 120)}%`,
                background: `radial-gradient(circle at 30% 30%, rgba(214,69,80,${0.4 + (i % 3) * 0.15}), rgba(150,30,40,${0.2 + (i % 3) * 0.1}))`,
                boxShadow: `0 0 ${10 + (i % 5)}px rgba(214,69,80,0.5), inset 0 0 ${5 + (i % 3)}px rgba(255,150,160,0.3)`,
                animation: `bubble-rise-continuous ${12 + (i % 5) * 3}s linear infinite`,
                animationDelay: `${-((i * 2) % 24)}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12">
          <h2
            className={`font-serif text-5xl md:text-7xl text-center text-white mb-24 transition-all duration-700 ${
              isSection2Visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            165 anni di{" "}
            <span className="italic text-chiarli-wine-light">Storia</span>
          </h2>

          {/* Horizontal Timeline */}
          <div className="relative">
            {/* Timeline scroll container */}
            <div
              className="overflow-x-auto pb-8 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="relative min-w-max px-8">
                {/* Horizontal Line */}
                <div className="absolute left-0 right-0 top-[40px] h-0.5 bg-chiarli-wine-light/30" />

                {/* Timeline Items */}
                <div className="flex gap-0">
                  {[
                    {
                      year: "1850",
                      title: "La Trattoria dell'Artigliere",
                      description:
                        "Prima di diventare produttore di vino, Cleto Chiarli gestisce una popolare trattoria nel centro storico di Modena.",
                      details:
                        "Il suo Lambrusco fatto in casa conquista rapidamente il favore locale, diventando uno dei punti di riferimento della città per gli amanti del buon vino.",
                      curiosity:
                        "La trattoria era frequentata da intellettuali, artigiani e commercianti modenesi che apprezzavano il Lambrusco genuino di Cleto.",
                      image: "/foto/sito/trattoria_artigliere.webp",
                    },
                    {
                      year: "1860",
                      title: "La Fondazione",
                      description:
                        "Cleto ottiene il permesso ufficiale per espandersi e costruisce la cantina accanto alla trattoria.",
                      details:
                        "Questo segna l'inizio di Chiarli come produttore di vino e la storia moderna del Lambrusco.",
                      curiosity:
                        "Chiarli è stata la prima cantina dell'Emilia-Romagna, pioniera nell'uso del tappo a fungo per i vini spumanti.",
                      image: "/foto/sito/vasche-4.webp",
                    },
                    {
                      year: "1885",
                      title: "Prime Esportazioni",
                      description:
                        "Il Lambrusco Chiarli inizia a raggiungere i mercati internazionali, seguendo le rotte degli emigranti italiani.",
                      details:
                        "Anselmo Chiarli, seconda generazione, guida l'azienda verso una nuova fase rafforzando i legami con le cooperative viticole locali.",
                      curiosity:
                        "Il Lambrusco Chiarli diventa ambasciatore del vino modenese nel mondo, portando un pezzo di casa agli emigrati italiani.",
                      image: "/foto/sito/galleria-chiarli-136.webp",
                    },
                    {
                      year: "1888",
                      title: "Cantina Via Poletti",
                      description:
                        "Per soddisfare la crescente domanda, Chiarli costruisce una nuova e più grande cantina in Via Poletti.",
                      details:
                        "Questo segnala l'espansione e la modernizzazione dell'azienda. La nuova struttura permette di triplicare la produzione.",
                      curiosity:
                        "Via Poletti diventa il nuovo cuore produttivo di Chiarli, simbolo di crescita e innovazione.",
                      image: "/foto/sito/a001-scaled.webp",
                    },
                    {
                      year: "1900",
                      title: "Parigi e i 100.000",
                      description:
                        "Chiarli viene premiata con Menzione d'Onore all'Esposizione Universale di Parigi.",
                      details:
                        "La produzione annuale supera le 100.000 bottiglie – un record straordinario per l'epoca.",
                      curiosity:
                        "L'Expo di Parigi del 1900 attirò oltre 50 milioni di visitatori. Il premio fu un trionfo per il Lambrusco modenese.",
                      image: "/foto/sito/sozzigalli-10.webp",
                    },
                    {
                      year: "1924",
                      title: "Cantina Via Manin",
                      description:
                        "Viene inaugurata una nuova struttura all'avanguardia in Via Manin a Modena.",
                      details:
                        "Questa sede rimarrà il quartier generale dell'azienda per generazioni, attraversando momenti di gloria e di difficoltà.",
                      curiosity:
                        "La cantina di Via Manin fu progettata con criteri innovativi per l'epoca, includendo sistemi di refrigerazione avanzati.",
                      image: "/foto/sito/close-up-87-scaled.webp",
                    },
                    {
                      year: "1944",
                      title: "Il Bombardamento",
                      description:
                        "Durante la Seconda Guerra Mondiale, la cantina di Via Manin subisce gravi danni dai bombardamenti.",
                      details:
                        "Un momento buio nella storia dell'azienda. La famiglia Chiarli salvaguarda i documenti storici e le ricette segrete.",
                      curiosity:
                        "Nonostante i danni, la famiglia non perse mai la speranza e iniziò subito a pianificare la ricostruzione.",
                      image: "/foto/sito/DSC04010.webp",
                    },
                    {
                      year: "1947",
                      title: "La Ricostruzione",
                      description:
                        "Giovanni e Giorgio Chiarli, terza generazione, guidano la ricostruzione della cantina di Via Manin.",
                      details:
                        "Il sito storico viene ricostruito e modernizzato dopo la guerra, segnando una potente rinascita per Chiarli.",
                      curiosity:
                        "La ricostruzione fu completata in tempo record grazie all'impegno di tutta la famiglia e dei dipendenti fedeli.",
                      image: "/foto/sito/a001-scaled.webp",
                    },
                    {
                      year: "1952",
                      title: "Le Prime Autoclavi",
                      description:
                        "Chiarli è pioniera nell'uso delle autoclavi in Emilia-Romagna per la produzione di vini spumanti.",
                      details:
                        "Questa innovazione rivoluziona la fermentazione del Lambrusco, migliorando la qualità del prodotto finale.",
                      curiosity:
                        "Le autoclavi permettevano di produrre Lambrusco di qualità superiore in modo più efficiente e controllato.",
                      image: "/foto/sito/vasche-4.webp",
                    },
                    {
                      year: "1970",
                      title: "Selezione Massale",
                      description:
                        "Chiarli investe nel patrimonio genetico, iniziando studi su cloni antichi.",
                      details:
                        "La ricerca sulla selezione massale mira a salvaguardare l'autenticità del Lambrusco, preservando i vitigni storici pre-fillossera.",
                      curiosity:
                        "Alcuni dei cloni studiati risalgono a prima della fillossera, rappresentando un tesoro genetico inestimabile.",
                      image: "/foto/sito/close-up-41.webp",
                    },
                    {
                      year: "1980",
                      title: "Vecchia Modena",
                      description:
                        "Lancio del Vecchia Modena Lambrusco Sorbara Brut al Congresso Nazionale Assoenologi.",
                      details:
                        "Il vino diventa istantaneamente un punto di riferimento per i moderni vini rossi spumanti.",
                      curiosity:
                        "Vecchia Modena fu il primo Lambrusco Brut di alta qualità, cambiando per sempre la percezione del vitigno.",
                      image: "/foto/sito/galleria-chiarli-136.webp",
                    },
                    {
                      year: "2002",
                      title: "Tenuta Cialdini",
                      description:
                        "Inaugurazione di Tenuta Cialdini a Castelvetro, una storica proprietà nel territorio del Grasparossa.",
                      details:
                        "Con 50 ettari di vigneti, Tenuta Cialdini diventa uno dei vigneti di punta di Cleto Chiarli.",
                      curiosity:
                        "Villa Cialdini è anche sede di eventi e visite guidate, accogliendo migliaia di appassionati ogni anno.",
                      image: "/foto/sito/vasche-4.webp",
                    },
                    {
                      year: "2014",
                      title: "Quintopasso Metodo Classico",
                      description:
                        "Viene rilasciato il primo Quintopasso Rosé – un Metodo Classico da 100% Sorbara.",
                      details:
                        "Questo vino ridefinisce il prestigio del Lambrusco, competendo con i grandi spumanti metodo classico.",
                      curiosity:
                        "Quintopasso richiede almeno 36 mesi di affinamento sui lieviti, come i migliori Champagne.",
                      image: "/foto/sito/sozzigalli-29.webp",
                    },
                    {
                      year: "2025",
                      title: "Archivio e Galleria Chiarli",
                      description:
                        "Apertura dell'Archivio e Galleria Chiarli, nuovo spazio culturale a Modena.",
                      details:
                        "Il museo ospita documenti storici, etichette e opere d'arte di oltre 165 anni di eredità Chiarli.",
                      curiosity:
                        "L'archivio custodisce etichette originali del 1860, fotografie d'epoca e ricette segrete tramandate di generazione in generazione.",
                      image: "/foto/sito/sozzigalli-10.webp",
                    },
                  ].map((item, index) => {
                    const isExpanded = expandedCard === index;
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center w-[420px] flex-shrink-0 cursor-pointer group transition-transform duration-300 hover:scale-105 hover:z-10"
                        onClick={() =>
                          setExpandedCard(isExpanded ? null : index)
                        }
                      >
                        {/* Year Circle */}
                        <div
                          className={`relative z-10 w-20 h-20 rounded-full bg-chiarli-text border-4 flex items-center justify-center transition-all duration-300 ${
                            isExpanded
                              ? "border-white scale-110"
                              : "border-chiarli-wine-light group-hover:border-white group-hover:scale-105"
                          }`}
                        >
                          <span
                            className={`font-serif text-lg font-bold transition-colors ${
                              isExpanded
                                ? "text-white"
                                : "text-chiarli-wine-light"
                            }`}
                          >
                            {item.year}
                          </span>
                        </div>

                        {/* Connector line */}
                        <div className="w-0.5 h-6 bg-chiarli-wine-light/30" />

                        {/* Card */}
                        <div
                          className={`w-full transition-all duration-500 ${
                            isExpanded ? "bg-white/5" : "group-hover:bg-white/5"
                          } p-5`}
                        >
                          {/* Image */}
                          <div className="relative overflow-hidden mb-5 h-56">
                            <img
                              src={item.image}
                              alt={item.title}
                              loading="lazy"
                              decoding="async"
                              className={`w-full h-full object-cover transition-transform duration-700 ${
                                isExpanded
                                  ? "scale-105"
                                  : "group-hover:scale-110"
                              }`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          </div>

                          <h3
                            className={`font-serif text-2xl mb-3 transition-colors duration-300 ${
                              isExpanded
                                ? "text-white"
                                : "text-white group-hover:text-chiarli-wine-light"
                            }`}
                          >
                            {item.title}
                          </h3>

                          <p className="font-sans text-white/60 text-base leading-relaxed mb-4">
                            {item.description}
                          </p>

                          {/* Expanded Content */}
                          <div
                            className={`overflow-hidden transition-all duration-500 ${
                              isExpanded
                                ? "max-h-[400px] opacity-100"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="pt-3 border-t border-chiarli-wine-light/30 space-y-3">
                              <p className="font-sans text-white/80 text-sm leading-relaxed">
                                {item.details}
                              </p>
                              <div className="bg-chiarli-wine/20 p-3 rounded">
                                <span className="font-sans text-[10px] uppercase tracking-widest text-chiarli-wine-light block mb-1">
                                  Curiosità
                                </span>
                                <p className="font-serif italic text-white/70 text-sm">
                                  {item.curiosity}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Expand indicator */}
                          <div
                            className={`mt-3 flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider transition-colors ${
                              isExpanded
                                ? "text-white"
                                : "text-chiarli-wine-light group-hover:text-white"
                            }`}
                          >
                            <span>
                              {isExpanded ? "Chiudi" : "Scopri di più"}
                            </span>
                            {isExpanded ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
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
                  isSection3Visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Una famiglia in{" "}
                <span className="italic text-chiarli-wine">crescita</span>
              </h2>

              <p
                className={`font-sans text-chiarli-text/70 text-lg leading-relaxed mb-6 transition-all duration-700 delay-100 ${
                  isSection3Visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                La quinta generazione della famiglia Chiarli guida oggi
                l'azienda con la stessa passione dei fondatori.{" "}
                <strong className="text-chiarli-text">Anselmo Chiarli</strong>{" "}
                (CEO) e{" "}
                <strong className="text-chiarli-text">Mauro Chiarli</strong>{" "}
                (Presidente) sono alla guida del gruppo, mentre{" "}
                <strong className="text-chiarli-text">Tommaso Chiarli</strong>{" "}
                segue export, marketing e comunicazione.
              </p>

              <div
                className={`border-l-4 border-chiarli-wine pl-8 mt-8 transition-all duration-700 delay-200 ${
                  isSection3Visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                <p className="font-serif italic text-2xl text-chiarli-text/70 leading-relaxed">
                  "Rispetto per la tradizione, apertura all'innovazione, e
                  impegno costante per la qualità."
                </p>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div
            className={`h-[600px] lg:h-auto transition-all duration-700 delay-300 ${
              isSection3Visible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
          >
            <img
              src="/foto/sito/bg-base-uai-1333x1333-2.webp"
              alt="Famiglia Chiarli"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
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
