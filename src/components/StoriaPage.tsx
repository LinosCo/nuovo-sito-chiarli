import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

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
  const [lightboxCard, setLightboxCard] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = timelineRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scrollTimeline = (direction: "left" | "right") => {
    const el = timelineRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -500 : 500,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const timelineItems = [
    {
      year: "1860",
      title: "La Trattoria dell'Artigliere",
      description:
        "Cleto Chiarli si trasferisce con la moglie Lucia e i figli a Modena, dove apre una trattoria con camere e bottega nel centro storico.",
      details:
        "Qui il suo Lambrusco, prodotto nell'adiacente cantina, conquista rapidamente l'apprezzamento locale. È l'inizio di una storia che dura da oltre 165 anni.",
      curiosity:
        "La trattoria era un punto di ritrovo per artigiani, commercianti e intellettuali modenesi, dove il Lambrusco genuino di Cleto era la vera attrazione.",
      image: "/foto-timeline/apertura-trattoria.webp",
    },
    {
      year: "1860",
      title: "La Cantina dell'Artigliere",
      description:
        "Cleto ottiene l'autorizzazione ufficiale per costruire una cantina a servizio della trattoria, così da rispondere alle crescenti richieste dei suoi vini.",
      details:
        "È l'inizio di Chiarli come produttore e della storia moderna del Lambrusco. Per conservare al meglio la vivacità del vino, Cleto introduce il tappo a fungo: una novità assoluta per i tempi.",
      curiosity:
        "Il tappo a fungo anticipa lo spirito spumeggiante del vino modenese — una tradizione ancora viva oggi.",
      image: "/foto-timeline/apertura-cantina.webp",
    },
    {
      year: "1860",
      title: "Introduzione del Tappo a Fungo",
      description:
        "Per conservare al meglio la vivacità del Lambrusco, Cleto introduce il tappo a fungo, una novità assoluta per i tempi.",
      details:
        "Questa innovazione anticipa lo spirito spumeggiante del vino modenese e diventa un segno distintivo della produzione Chiarli.",
      curiosity:
        "Il tappo a fungo è una tradizione ancora viva oggi, simbolo dell'identità frizzante del Lambrusco.",
      image: "/foto-timeline/tappo-a-fungo.webp",
    },
    {
      year: "1880",
      title: "Anselmo Chiarli, Seconda Generazione",
      description:
        "Con Anselmo, figlio di Cleto, l'azienda cresce e si struttura.",
      details:
        "È il periodo in cui la famiglia inizia a collaborare con le prime Cantine Sociali della provincia, contribuendo al tessuto vitivinicolo del territorio modenese.",
      curiosity:
        "Anselmo consolida le basi gettate dal padre, trasformando un'attività familiare in una vera impresa vinicola.",
      image: "/foto-timeline/anselmo-chiarli-1.webp",
    },
    {
      year: "1885",
      title: "Prime Esportazioni",
      description:
        "Il Lambrusco Chiarli varca i confini italiani, accompagnando gli emigranti modenesi e italiani nel mondo.",
      details:
        "Il vino diventa simbolo dell'Emilia anche all'estero, portando un pezzo di casa a chi era lontano dalla propria terra.",
      curiosity:
        "Le prime bottiglie di Lambrusco Chiarli raggiungono l'America seguendo le rotte dell'emigrazione italiana.",
      image: "/foto-timeline/prime-esportazioni.webp",
    },
    {
      year: "1888",
      title: "Cantina Via Poletti",
      description:
        "Per far fronte alla crescente domanda, Chiarli costruisce una nuova cantina, più ampia, in Via Poletti.",
      details:
        "Un passaggio che segna l'espansione e la modernizzazione dell'azienda, con una capacità produttiva notevolmente aumentata.",
      curiosity:
        "Via Poletti diventa il nuovo cuore produttivo di Chiarli, simbolo di una crescita inarrestabile.",
      image: "/foto-timeline/famiglia-chiarli.webp",
    },
    {
      year: "1898",
      title: "Acquisizione di Villa Cialdini",
      description:
        "La famiglia Chiarli acquisisce Villa Cialdini, storica residenza del Generale Enrico Cialdini, figura centrale del Risorgimento italiano.",
      details:
        "Con i suoi terreni a Castelvetro, la villa pone le basi di una delle tenute più rappresentative del Grasparossa e del futuro progetto Cleto Chiarli Tenute Agricole.",
      curiosity:
        "Villa Cialdini, edificata nel Seicento, fu luogo natale del generale Enrico Cialdini nel 1811. La sua storia è intrecciata con quella del Risorgimento.",
      image: "/foto-timeline/acquisizione-cialdini.webp",
    },
    {
      year: "1900",
      title: "Le Prime Macchine per il Tappo",
      description:
        "L'azienda si dota di tecnologie d'avanguardia per l'epoca, introducendo le prime macchine per la legatura dei tappi.",
      details:
        "Nasce una produzione più moderna e sicura, che permette di garantire la qualità del Lambrusco in ogni bottiglia.",
      curiosity:
        "L'introduzione delle macchine per la legatura segna il passaggio da produzione artigianale a industriale, mantenendo però l'anima familiare.",
      image: "/foto-timeline/645.webp",
    },
    {
      year: "1900",
      title: '"Mention Honorable" a Parigi',
      description:
        'Chiarli viene premiata all\'Expo di Parigi con la "Mention Honorable" e la produzione annua supera le 100.000 bottiglie.',
      details:
        "Un riconoscimento che consacra il Lambrusco modenese sulla scena internazionale. Un traguardo straordinario per l'epoca, soprattutto per un vino delicato e complesso come il Lambrusco.",
      curiosity:
        "È proprio questo storico riconoscimento a ispirare, ancora oggi, Vecchia Modena Premium Mention Honorable — il vino iconico che porta nel nome l'ambizione e la visione di quella tappa fondamentale.",
      image: "/foto-timeline/642.webp",
    },
    {
      year: "1924",
      title: "Cantina Via Manin",
      description:
        "A Modena, in Via Manin, viene inaugurato un nuovo stabilimento all'avanguardia.",
      details:
        "Destinato a rimanere sede e cuore produttivo dell'azienda per generazioni, attraversando momenti di gloria e di difficoltà.",
      curiosity:
        "La cantina di Via Manin fu progettata con criteri innovativi per l'epoca, includendo sistemi di refrigerazione avanzati.",
      image: "/foto-timeline/img-20160725-wa0003.webp",
    },
    {
      year: "1944",
      title: "Il Bombardamento",
      description:
        "Durante la Seconda Guerra Mondiale, la cantina di Via Manin subisce gravi danni a causa dei bombardamenti.",
      details:
        "Alcuni giovani dipendenti partiti per il fronte non hanno fatto ritorno: un momento drammatico nella storia dell'azienda e della città.",
      curiosity:
        "Nonostante la devastazione, la famiglia salvaguardò i documenti storici e le ricette, non perdendo mai la speranza nella ricostruzione.",
      image: "/foto/sito/DSC04010.webp",
    },
    {
      year: "1946",
      title: "Giovanni e Giorgio, Terza Generazione",
      description:
        "Nel dopoguerra, i fratelli Giovanni e Giorgio rilanciano l'azienda con coraggio e visione.",
      details:
        "Portano avanti la tradizione di famiglia e aprono la strada ai grandi numeri del boom economico, modernizzando processi e strutture.",
      curiosity:
        "Giovanni e Giorgio incarnano lo spirito della rinascita italiana: dalla devastazione della guerra alla costruzione di un futuro migliore.",
      image: "/foto-timeline/dott-giorgio-famiglia.webp",
    },
    {
      year: "1947",
      title: "La Ricostruzione",
      description:
        "Lo stabilimento di Via Manin viene ricostruito e ammodernato, segnando una rinascita importante per Chiarli e per Modena.",
      details:
        "La ricostruzione fu completata grazie all'impegno di tutta la famiglia e dei dipendenti fedeli, diventando simbolo di resilienza.",
      curiosity:
        "Il nuovo stabilimento fu progettato per essere più efficiente e moderno dell'originale, trasformando la difficoltà in opportunità.",
      image: "/foto-timeline/909.webp",
    },
    {
      year: "1952",
      title: "Le Prime Autoclavi",
      description:
        "Chiarli è la prima azienda a introdurre le autoclavi in Emilia-Romagna, adottando il Metodo Martinotti.",
      details:
        "È qui che inizia il perfezionamento del Metodo: un percorso di ricerca che porterà a una gestione sempre più precisa delle fermentazioni, dell'espressione aromatica e dell'equilibrio del Lambrusco.",
      curiosity:
        "Questo passaggio segna l'inizio di uno stile moderno, rigoroso e riconoscibile che distingue ancora oggi i vini Chiarli.",
      image: "/foto-timeline/636.webp",
    },
    {
      year: "1968",
      title: "Mauro e Anselmo, Quarta Generazione",
      description:
        "Con la quarta generazione in azienda, si apre una fase di profondo rinnovamento.",
      details:
        "Viene avviata la selezione massale delle varietà di Lambrusco e si introducono nuove tecniche di gestione dei vigneti, guardando al futuro con rispetto per la tradizione.",
      curiosity:
        "Mauro e Anselmo combinano la sapienza familiare con un approccio scientifico alla viticoltura, una visione che trasformerà il Lambrusco.",
      image: "/foto-timeline/mauro-e-anselmo-chiarli.webp",
    },
    {
      year: "1970",
      title: "Selezione Massale",
      description:
        "Inizia il lavoro di recupero e selezione dei cloni storici del Sorbara e del Grasparossa.",
      details:
        "Un investimento nel patrimonio genetico per preservare l'identità e la qualità autentica del Lambrusco, salvaguardando i vitigni storici.",
      curiosity:
        "Alcuni dei cloni studiati risalgono a prima della fillossera, rappresentando un tesoro genetico inestimabile per il territorio.",
      image: "/foto-timeline/maurochiarli.webp",
    },
    {
      year: "1972",
      title: "Nuovi Impianti GDC",
      description:
        "Si adottano i moderni sistemi di allevamento a GDC (Geneva Double Curtain).",
      details:
        "Il sistema garantisce uve più sane e maturazioni più equilibrate nei vigneti emiliani, migliorando significativamente la qualità delle uve.",
      curiosity:
        "Il GDC, sviluppato alla Cornell University, trova nei vigneti Chiarli una delle prime applicazioni italiane su larga scala.",
      image: "/foto-timeline/145.webp",
    },
    {
      year: "1980",
      title: "Vecchia Modena Brut",
      description:
        "Durante il Congresso Nazionale Assoenologi, viene presentato Vecchia Modena: un Lambrusco Sorbara Brut dallo stile raffinato e moderno.",
      details:
        "Questo Lambrusco Dry si posiziona nell'HORECA e sui migliori tavoli a livello internazionale. Segna l'inizio di un progetto che culminerà con la creazione del Vecchia Modena Premium nel 2002.",
      curiosity:
        "Vecchia Modena fu il primo Lambrusco Brut di alta qualità, simbolo di un nuovo corso per il Lambrusco e per l'intera denominazione.",
      image: "/foto-timeline/65.webp",
    },
    {
      year: "2002",
      title: "Tenuta Cialdini",
      description:
        "La storica tenuta acquisita nel 1898 diventa sede di una nuova cantina dedicata alla produzione premium delle uve dalle tre tenute di proprietà.",
      details:
        "I vini vengono presentati con il nuovo marchio Cleto Chiarli, omaggio al fondatore. Nasce un progetto dedicato al mondo della ristorazione, dei bar e degli hotel.",
      curiosity:
        "La cantina separata a Castelvetro permette di vinificare le uve delle tenute con una cura artigianale, esaltando il terroir del Grasparossa.",
      image: "/foto-timeline/chiarli-2011-113.webp",
    },
    {
      year: "2014",
      title: "Quintopasso Metodo Classico",
      description:
        "Quintopasso debutta con il Rosé Brut, 100% Sorbara con lunga sosta sui lieviti.",
      details:
        "Un Metodo Classico che dimostra quanto anche il Lambrusco possa essere nobile, elegante e sorprendente. L'espressione più alta del Sorbara.",
      curiosity:
        "Quintopasso richiede almeno 36 mesi di affinamento sui lieviti, come i migliori Champagne — una sperimentazione coraggiosa nata dieci anni prima.",
      image: "/foto/sito/sozzigalli-29.webp",
    },
    {
      year: "2017",
      title: "Tommaso Chiarli, Quinta Generazione",
      description:
        "La quinta generazione porta avanti il sogno di famiglia. Tommaso Chiarli entra come direttore Comunicazione e Marketing di Cleto Chiarli.",
      details:
        "Ambasciatore del brand in Italia e all'estero, Tommaso rappresenta il futuro dell'azienda, unendo tradizione e visione contemporanea.",
      curiosity:
        "Con Tommaso, Chiarli abbraccia una comunicazione moderna e internazionale, portando il Lambrusco nelle capitali del gusto mondiale.",
      image: "/foto-timeline/chiarli-108.webp",
    },
    {
      year: "2025",
      title: "Archivio e Galleria Chiarli",
      description:
        "A Villa Cialdini apre la Galleria Chiarli, nuovo spazio espositivo che ospita una selezione curata dello storico Archivio Chiarli.",
      details:
        "L'Archivio è riconosciuto di rilevanza storica nazionale e raccoglie documenti, etichette e fotografie di oltre 165 anni di storia familiare.",
      curiosity:
        "L'archivio custodisce etichette originali del 1860, fotografie d'epoca e testimonianze uniche della storia del Lambrusco modenese.",
      image: "/foto-timeline/458.webp",
    },
  ];

  // Lock body scroll & handle Escape when lightbox is open
  useEffect(() => {
    if (lightboxCard !== null) {
      document.body.style.overflow = "hidden";
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setLightboxCard(null);
        if (e.key === "ArrowLeft" && lightboxCard > 0)
          setLightboxCard(lightboxCard - 1);
        if (e.key === "ArrowRight" && lightboxCard < timelineItems.length - 1)
          setLightboxCard(lightboxCard + 1);
      };
      window.addEventListener("keydown", handleKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKey);
      };
    }
    document.body.style.overflow = "";
  }, [lightboxCard, timelineItems.length]);

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
              className={`font-serif text-4xl md:text-7xl lg:text-8xl text-white mb-6 md:mb-8 leading-tight transition-all duration-700 delay-100 ${
                isHeroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Una storia di famiglia radicata a{" "}
              <span className="italic text-chiarli-wine-light">Modena</span>
            </h1>

            <p
              className={`font-serif italic text-2xl md:text-4xl text-chiarli-wine-light mb-8 md:mb-12 transition-all duration-700 delay-200 ${
                isHeroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              Dal 1860
            </p>

            <p
              className={`font-sans text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto transition-all duration-700 delay-300 ${
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
            className={`h-[50vh] md:h-[600px] lg:h-auto lg:min-h-screen transition-all duration-700 ${
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
          <div className="bg-chiarli-stone py-16 md:py-32 px-6 md:px-16 flex items-center">
            <div>
              <h2
                className={`font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 transition-all duration-700 delay-100 ${
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
        className="relative bg-chiarli-text overflow-hidden py-16 md:py-32"
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
            className={`font-serif text-4xl md:text-5xl lg:text-7xl text-center text-white mb-12 md:mb-24 transition-all duration-700 ${
              isSection2Visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            165 anni di{" "}
            <span className="italic text-chiarli-wine-light">Storia</span>
          </h2>

          {/* Horizontal Timeline */}
          <div className="relative flex items-center gap-2 md:gap-4">
            {/* Left Arrow */}
            <button
              onClick={() => scrollTimeline("left")}
              className={`hidden md:flex flex-shrink-0 w-12 h-12 rounded-full border border-white/20 hover:border-chiarli-wine-light hover:bg-chiarli-wine/30 items-center justify-center transition-all duration-300 ${
                canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-label="Scorri a sinistra"
            >
              <ChevronLeft size={22} className="text-white/70" />
            </button>

            {/* Timeline scroll container */}
            <div className="relative flex-1 min-w-0">
              <div
                ref={timelineRef}
                onScroll={updateScrollState}
                className="overflow-x-auto overflow-y-visible pb-8 pt-4 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div className="relative min-w-max px-4 md:px-8">
                  {/* Horizontal Line */}
                  <div className="absolute left-0 right-0 top-[32px] md:top-[48px] h-0.5 bg-chiarli-wine-light/30" />

                  {/* Timeline Items */}
                  <div className="flex gap-0">
                    {timelineItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center w-[80vw] md:w-[550px] flex-shrink-0 cursor-pointer group transition-transform duration-300 hover:scale-[1.03] hover:z-10"
                        onClick={() => setLightboxCard(index)}
                      >
                        {/* Year Circle */}
                        <div className="relative z-10 w-16 h-16 md:w-24 md:h-24 rounded-full bg-chiarli-text border-[3px] md:border-4 border-chiarli-wine-light group-hover:border-white group-hover:scale-105 flex items-center justify-center transition-all duration-300">
                          <span className="font-serif text-sm md:text-xl font-bold text-chiarli-wine-light">
                            {item.year}
                          </span>
                        </div>

                        {/* Connector line */}
                        <div className="w-0.5 h-4 md:h-6 bg-chiarli-wine-light/30" />

                        {/* Card */}
                        <div className="w-full group-hover:bg-white/5 transition-all duration-500 p-4 md:p-5">
                          {/* Image */}
                          <div className="relative overflow-hidden mb-4 md:mb-5 h-64 md:h-96">
                            <img
                              src={item.image}
                              alt={item.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          </div>

                          <h3 className="font-serif text-lg md:text-2xl mb-2 md:mb-3 text-white group-hover:text-chiarli-wine-light transition-colors duration-300">
                            {item.title}
                          </h3>

                          <p className="font-sans text-white/60 text-sm md:text-base leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollTimeline("right")}
              className={`hidden md:flex flex-shrink-0 w-12 h-12 rounded-full border border-white/20 hover:border-chiarli-wine-light hover:bg-chiarli-wine/30 items-center justify-center transition-all duration-300 ${
                canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-label="Scorri a destra"
            >
              <ChevronRight size={22} className="text-white/70" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 3: Una famiglia in crescita - LIGHT with split screen */}
      <section ref={section3Ref} className="relative bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Text Side */}
          <div className="bg-chiarli-stone py-16 md:py-32 px-6 md:px-16 flex items-center">
            <div>
              <h2
                className={`font-serif text-4xl md:text-5xl lg:text-6xl text-chiarli-text mb-8 md:mb-12 transition-all duration-700 ${
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
            className={`h-[50vh] md:h-[600px] lg:h-auto transition-all duration-700 delay-300 ${
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

      {/* Lightbox Modal */}
      {lightboxCard !== null && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 md:p-8"
          onClick={() => setLightboxCard(null)}
        >
          <div
            className="relative bg-chiarli-text max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxCard(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
              aria-label="Chiudi"
            >
              <X size={20} className="text-white" />
            </button>

            {/* Image */}
            <div className="w-full">
              <img
                src={timelineItems[lightboxCard].image}
                alt={timelineItems[lightboxCard].title}
                className="w-full max-h-[50vh] object-contain bg-black/30"
              />
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-serif text-2xl md:text-3xl font-bold text-chiarli-wine-light">
                  {timelineItems[lightboxCard].year}
                </span>
                <h3 className="font-serif text-xl md:text-2xl text-white">
                  {timelineItems[lightboxCard].title}
                </h3>
              </div>

              <p className="font-sans text-white/80 text-base md:text-lg leading-relaxed">
                {timelineItems[lightboxCard].description}
              </p>

              <p className="font-sans text-white/70 text-sm md:text-base leading-relaxed">
                {timelineItems[lightboxCard].details}
              </p>

              <div className="bg-chiarli-wine/20 p-4 rounded-lg">
                <span className="font-sans text-[10px] uppercase tracking-widest text-chiarli-wine-light block mb-2">
                  Curiosità
                </span>
                <p className="font-serif italic text-white/70 text-sm md:text-base">
                  {timelineItems[lightboxCard].curiosity}
                </p>
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="flex justify-between px-6 pb-6">
              <button
                onClick={() => setLightboxCard(Math.max(0, lightboxCard - 1))}
                disabled={lightboxCard === 0}
                className="flex items-center gap-2 font-sans text-sm text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
                Precedente
              </button>
              <button
                onClick={() =>
                  setLightboxCard(
                    Math.min(timelineItems.length - 1, lightboxCard + 1),
                  )
                }
                disabled={lightboxCard === timelineItems.length - 1}
                className="flex items-center gap-2 font-sans text-sm text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Successivo
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

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
