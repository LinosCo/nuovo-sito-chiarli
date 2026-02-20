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

  const scrollSpeedRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Smooth continuous scroll driven by requestAnimationFrame
  useEffect(() => {
    const tick = () => {
      const el = timelineRef.current;
      if (el && scrollSpeedRef.current !== 0) {
        el.scrollLeft += scrollSpeedRef.current;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const ratio = x / width; // 0 = left edge, 1 = right edge
    const deadZone = 0.15; // 15% from center = no scroll
    const center = 0.5;
    const maxSpeed = 5;

    if (ratio < center - deadZone) {
      // Left zone: scroll left, faster near edge
      const intensity = (center - deadZone - ratio) / (center - deadZone);
      scrollSpeedRef.current = -maxSpeed * intensity;
    } else if (ratio > center + deadZone) {
      // Right zone: scroll right, faster near edge
      const intensity = (ratio - center - deadZone) / (center - deadZone);
      scrollSpeedRef.current = maxSpeed * intensity;
    } else {
      scrollSpeedRef.current = 0;
    }
  };

  const handleMouseLeave = () => {
    scrollSpeedRef.current = 0;
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
      title: "Apertura della Trattoria dell'Artigliere, Modena",
      description:
        "Prima di diventare vignaiolo, Cleto Chiarli si trasferisce con la moglie Lucia e i figli a Modena, dove apre una trattoria con camere e bottega nel centro storico. Qui il suo Lambrusco, prodotto nell'adiacente cantina, conquista rapidamente l'apprezzamento locale.",
      details: "",
      curiosity: "",
      image: "/foto-timeline/apertura-trattoria.webp",
    },
    {
      year: "1860",
      title: "Introduzione del Tappo a Fungo",
      description:
        "Per conservare al meglio la vivacità del Lambrusco, Cleto introduce il tappo a fungo, una novità assoluta per i tempi che anticipa lo spirito spumeggiante del vino modenese.",
      details: "Una tradizione ancora viva oggi.",
      curiosity: "",
      image: "/foto-timeline/tappo-a-fungo.webp",
    },
    {
      year: "1885",
      title: "Prime Esportazioni del Lambrusco Chiarli",
      description:
        "Il Lambrusco Chiarli varca i confini italiani, accompagnando gli emigranti modenesi e italiani nel mondo. Il vino diventa simbolo dell'Emilia anche all'estero.",
      details: "",
      curiosity: "",
      image: "/foto-timeline/prime-esportazioni.webp",
    },
    {
      year: "1898",
      title: "Acquisizione di Villa Cialdini",
      description:
        "La famiglia Chiarli acquisisce Villa Cialdini, storica residenza del Generale Enrico Cialdini — figura centrale del Risorgimento italiano — e i suoi terreni, ponendo le basi di una delle tenute più rappresentative del Grasparossa di Castelvetro e del futuro progetto Cleto Chiarli Tenute Agricole.",
      details: "",
      curiosity: "",
      image: "/foto-timeline/acquisizione-cialdini.webp",
    },
    {
      year: "1900",
      title: '"Mention Honorable" all\'Esposizione Universale di Parigi',
      description:
        "Chiarli viene premiata all'Expo di Parigi con la \"Mention Honorable\", un riconoscimento che consacra il Lambrusco modenese sulla scena internazionale. Nello stesso periodo, la produzione annua supera le 100.000 bottiglie: un traguardo straordinario per l'epoca, soprattutto per un vino delicato e complesso come il Lambrusco.",
      details:
        "È proprio questo storico riconoscimento a ispirare, ancora oggi, Vecchia Modena Premium Mention Honorable, il vino iconico che porta nel nome e nello spirito l'ambizione, l'orgoglio e la visione internazionale di quella tappa fondamentale.",
      curiosity: "",
      image: "/foto-timeline/parigi.webp",
    },
    {
      year: "1952",
      title: "Prime Autoclavi in Emilia-Romagna",
      description:
        "Chiarli è la prima azienda a introdurre le autoclavi in regione, adottando il Metodo Martinotti per produrre vini frizzanti in modo controllato e con risultati di qualità superiore.",
      details:
        "È qui che inizia il perfezionamento del Metodo: un percorso di ricerca e messa a punto tecnica che porterà a una gestione sempre più precisa delle fermentazioni, dell'espressione aromatica e dell'equilibrio del Lambrusco, segnando un passaggio decisivo verso uno stile moderno, rigoroso e riconoscibile.",
      curiosity: "",
      image: "/foto-timeline/prime-autoclavi.webp",
    },
    {
      year: "1970",
      title: "Inizio dello Studio sulla Selezione Massale",
      description:
        "Inizia il lavoro di recupero e selezione dei cloni storici del Sorbara e del Grasparossa, per preservare l'identità e la qualità autentica del Lambrusco.",
      details: "",
      curiosity: "",
      image: "/foto-timeline/selezione-massale.webp",
    },
    {
      year: "1972",
      title: "Nuovi Impianti con Sistema GDC",
      description:
        "Si adottano i moderni sistemi di allevamento a GDC (Geneva Double Curtain), che garantiscono uve più sane e maturazioni più equilibrate nei vigneti emiliani.",
      details: "",
      curiosity: "",
      image: "/foto-timeline/145.webp",
    },
    {
      year: "1968–1975",
      title: "Mauro e Anselmo Chiarli",
      description:
        "Con la quarta generazione in azienda, si apre una fase di rinnovamento: viene avviata la selezione massale delle varietà di Lambrusco e si introducono nuove tecniche di gestione dei vigneti.",
      details: "",
      curiosity: "",
      image: "/foto-timeline/mauro-e-anselmo-chiarli.webp",
      imagePosition: "top-quarter",
    },
    {
      year: "1980",
      title: "Lancio del Vecchia Modena Brut",
      description:
        "Durante il Congresso Nazionale Assoenologi, viene presentato Vecchia Modena, un Lambrusco Sorbara Brut dallo stile raffinato e moderno, simbolo di un nuovo corso per il Lambrusco di qualità. Questo Lambrusco Dry, si è posizionato nell'HORECA e sui migliori tavoli al livello internazionale.",
      details:
        "Segna l'inizio di un progetto che culminerà con la creazione del Vecchia Modena Premium nel 2002.",
      curiosity: "",
      image: "/foto-timeline/lancio-vecchia-modena.webp",
      imagePosition: "center",
    },
    {
      year: "2002",
      title: "Inaugurazione di Tenuta Cialdini, Castelvetro",
      description: "",
      details: "",
      curiosity: "",
      image: "/foto-timeline/inaugurazione-tenuta-cialdini.webp",
    },
    {
      year: "2017",
      title: "Tommaso Chiarli",
      description:
        "La quinta generazione porta avanti il sogno di famiglia. Tommaso Chiarli entra nel ruolo del direttore di Comunicazione e Marketing di Cleto Chiarli nel 2017 ed è ambasciatore per il brand in Italia e all'estero.",
      details: "",
      curiosity: "",
      image: "/foto-timeline/tommaso-chiarli.webp",
    },
    {
      year: "2025",
      title: "Apertura dell'Archivio e della Galleria Chiarli",
      description:
        "A Villa Cialdini apre la Galleria Chiarli, nuovo spazio espositivo che ospita una selezione curata dello storico Archivio Chiarli, riconosciuto di rilevanza storica nazionale.",
      details: "",
      curiosity: "",
      image: "/foto-timeline/apertura-galleria.webp",
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

        <div className="relative z-10">
          <h2
            className={`font-serif text-4xl md:text-5xl lg:text-7xl text-center text-white mb-12 md:mb-24 px-6 md:px-12 transition-all duration-700 ${
              isSection2Visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            165 anni di{" "}
            <span className="italic text-chiarli-wine-light">Storia</span>
          </h2>

          {/* Horizontal Timeline */}
          <div
            className="relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Timeline scroll container */}
            <div className="relative">
              <div
                ref={timelineRef}
                className="overflow-x-auto overflow-y-visible pb-8 pt-4 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div className="relative min-w-max px-2 md:px-4">
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
                          <span
                            className={`font-serif font-bold text-chiarli-wine-light ${item.year.length > 5 ? "text-[10px] md:text-sm leading-tight text-center" : "text-sm md:text-xl"}`}
                          >
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
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              style={{
                                objectPosition:
                                  (item as any).imagePosition === "top-quarter"
                                    ? "center 25%"
                                    : (item as any).imagePosition === "center"
                                      ? "center center"
                                      : "center top",
                              }}
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

              {timelineItems[lightboxCard].description && (
                <p className="font-sans text-white/80 text-base md:text-lg leading-relaxed">
                  {timelineItems[lightboxCard].description}
                </p>
              )}

              {timelineItems[lightboxCard].details && (
                <p className="font-sans text-white/70 text-sm md:text-base leading-relaxed">
                  {timelineItems[lightboxCard].details}
                </p>
              )}

              {timelineItems[lightboxCard].curiosity && (
                <div className="bg-chiarli-wine/20 p-4 rounded-lg">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-chiarli-wine-light block mb-2">
                    Curiosità
                  </span>
                  <p className="font-serif italic text-white/70 text-sm md:text-base">
                    {timelineItems[lightboxCard].curiosity}
                  </p>
                </div>
              )}
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
