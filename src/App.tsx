import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { HistorySection } from "./components/HistorySection";
import { BottleShowcase } from "./components/BottleShowcase";
import { FeaturedSection } from "./components/FeaturedSection";
import { BlogSection } from "./components/BlogSection";
import { TenuteSection } from "./components/TenuteSection";
import { Footer } from "./components/Footer";
import { WineDetailPage } from "./components/WineDetailPage";
import { ExperiencesPage } from "./components/ExperiencesPage";
import { StoriaPage } from "./components/StoriaPage";
import { TenutePage } from "./components/TenutePage";
import { TentuaCialdiniPage } from "./components/TentuaCialdiniPage";
import { TenutaSozzigalliPage } from "./components/TenutaSozzigalliPage";
import { TenutaBelvederePage } from "./components/TenutaBelvederePage";
import { SostenibilitaPage } from "./components/SostenibilitaPage";
import { MetodoPage } from "./components/MetodoPage";
import { BlogPage } from "./components/BlogPage";
import { CollezioneClassicaPage } from "./components/CollezioneClassicaPage";
import { CollezionePremiumPage } from "./components/CollezionePremiumPage";
import { TuttiIViniPage } from "./components/TuttiIViniPage";
import { MouseGradient } from "./components/MouseGradient";

function AppContent() {
  // Blog section enabled
  const [currentPage, setCurrentPage] = useState<
    | "home"
    | "wine-detail"
    | "experiences"
    | "storia"
    | "tenute"
    | "tenuta-detail"
    | "sostenibilita"
    | "metodo"
    | "blog"
    | "collezione-classica"
    | "collezione-premium"
    | "tutti-i-vini"
  >("home");
  const [wineSlug, setWineSlug] = useState<string | null>(null);
  const [tenutaSlug, setTenutaSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Clean URL routing con supporto per slug dinamici
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;

      // Controlla se è una pagina vino: /vino/[slug]
      const wineMatch = path.match(/^\/vino\/([^/]+)$/);
      // Controlla se è una pagina tenuta: /tenute/[slug]
      const tenutaMatch = path.match(/^\/tenute\/([^/]+)$/);

      if (wineMatch) {
        setWineSlug(wineMatch[1]);
        setCurrentPage("wine-detail");
        setTenutaSlug(null);
      } else if (tenutaMatch) {
        setTenutaSlug(tenutaMatch[1]);
        setCurrentPage("tenuta-detail");
        setWineSlug(null);
      } else if (path === "/esperienze") {
        setCurrentPage("experiences");
        setWineSlug(null);
        setTenutaSlug(null);
      } else if (path === "/storia") {
        setCurrentPage("storia");
        setWineSlug(null);
        setTenutaSlug(null);
      } else if (path === "/tenute") {
        setCurrentPage("tenute");
        setWineSlug(null);
        setTenutaSlug(null);
      } else if (path === "/sostenibilita") {
        setCurrentPage("sostenibilita");
        setWineSlug(null);
        setTenutaSlug(null);
      } else if (path === "/metodo") {
        setCurrentPage("metodo");
        setWineSlug(null);
        setTenutaSlug(null);
      } else if (path === "/blog") {
        setCurrentPage("blog");
        setWineSlug(null);
        setTenutaSlug(null);
      } else if (path === "/collezione-classica") {
        setCurrentPage("collezione-classica");
        setWineSlug(null);
        setTenutaSlug(null);
      } else if (path === "/collezione-premium") {
        setCurrentPage("collezione-premium");
        setWineSlug(null);
        setTenutaSlug(null);
      } else if (path === "/tutti-i-vini") {
        setCurrentPage("tutti-i-vini");
        setWineSlug(null);
        setTenutaSlug(null);
      } else {
        setWineSlug(null);
        setTenutaSlug(null);
        setCurrentPage("home");
      }

      // Scroll to top ogni volta che cambia pagina
      window.scrollTo(0, 0);
    };

    handleRouteChange();
    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("pushstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("pushstate", handleRouteChange);
    };
  }, []);

  const navigateToWine = (slug: string = "metodo-del-fondatore") => {
    history.pushState(null, "", `/vino/${slug}`);
    window.dispatchEvent(new Event("pushstate"));
  };

  const navigateToHome = () => {
    history.pushState(null, "", "/");
    window.dispatchEvent(new Event("pushstate"));
  };

  const navigateToAllWines = () => {
    history.pushState(null, "", "/tutti-i-vini");
    window.dispatchEvent(new Event("pushstate"));
  };

  const navigateToExperiences = () => {
    history.pushState(null, "", "/esperienze");
    window.dispatchEvent(new Event("pushstate"));
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-chiarli-text flex items-center justify-center z-[100]">
        {/* Animated bubbles in background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: `${6 + (i % 5) * 4}px`,
                height: `${6 + (i % 5) * 4}px`,
                left: `${5 + ((i * 5) % 90)}%`,
                top: `${10 + ((i * 4) % 80)}%`,
                background: `radial-gradient(circle at 30% 30%, rgba(180,60,80,${0.3 + (i % 4) * 0.1}), rgba(120,30,50,${0.2}))`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Logo and loading animation */}
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <img
              src="/foto/cletochiarli-2-01.svg"
              alt="Cleto Chiarli"
              className="h-16 md:h-20 mx-auto"
            />
          </div>

          {/* Loading bar */}
          <div className="w-48 h-[2px] bg-white/10 mx-auto overflow-hidden">
            <div
              className="h-full bg-chiarli-wine-light animate-loading-bar"
              style={{
                animation: "loading-bar 2s ease-in-out",
              }}
            />
          </div>
        </div>

        <style>{`
          @keyframes loading-bar {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  if (currentPage === "wine-detail" && wineSlug) {
    return (
      <div className="min-h-screen font-sans selection:bg-chiarli-wine selection:text-white bg-chiarli-stone text-chiarli-text">
        <MouseGradient />
        <div className="bg-grain opacity-50 fixed inset-0 pointer-events-none z-0"></div>
        <div className="relative z-10">
          <WineDetailPage slug={wineSlug} onBack={navigateToAllWines} />
          <Footer />
        </div>
      </div>
    );
  }

  if (currentPage === "experiences") {
    return (
      <div className="min-h-screen font-sans selection:bg-chiarli-wine selection:text-white bg-chiarli-stone text-chiarli-text">
        <MouseGradient />
        <div className="bg-grain opacity-50 fixed inset-0 pointer-events-none z-0"></div>
        <div className="relative z-10">
          <Navbar />
          <ExperiencesPage onBack={navigateToHome} />
          <Footer />
        </div>
      </div>
    );
  }

  if (currentPage === "storia") {
    return (
      <div className="min-h-screen font-sans selection:bg-chiarli-wine selection:text-white bg-chiarli-stone text-chiarli-text">
        <MouseGradient />
        <div className="bg-grain opacity-50 fixed inset-0 pointer-events-none z-0"></div>
        <div className="relative z-10">
          <Navbar />
          <StoriaPage onBack={navigateToHome} />
          <Footer />
        </div>
      </div>
    );
  }

  if (currentPage === "tenute") {
    return (
      <div className="min-h-screen font-sans selection:bg-chiarli-wine selection:text-white bg-chiarli-stone text-chiarli-text">
        <MouseGradient />
        <div className="bg-grain opacity-50 fixed inset-0 pointer-events-none z-0"></div>
        <div className="relative z-10">
          <Navbar />
          <TenutePage onBack={navigateToHome} />
          <Footer />
        </div>
      </div>
    );
  }

  if (currentPage === "sostenibilita") {
    return (
      <div className="min-h-screen font-sans selection:bg-chiarli-wine selection:text-white bg-chiarli-stone text-chiarli-text">
        <MouseGradient />
        <div className="bg-grain opacity-50 fixed inset-0 pointer-events-none z-0"></div>
        <div className="relative z-10">
          <Navbar />
          <SostenibilitaPage onBack={navigateToHome} />
          <Footer />
        </div>
      </div>
    );
  }

  if (currentPage === "metodo") {
    return (
      <div className="min-h-screen font-sans selection:bg-chiarli-wine selection:text-white bg-chiarli-stone text-chiarli-text">
        <MouseGradient />
        <div className="bg-grain opacity-50 fixed inset-0 pointer-events-none z-0"></div>
        <div className="relative z-10">
          <Navbar />
          <MetodoPage onBack={navigateToHome} />
          <Footer />
        </div>
      </div>
    );
  }

  if (currentPage === "blog") {
    return (
      <div className="min-h-screen font-sans selection:bg-chiarli-wine selection:text-white bg-chiarli-stone text-chiarli-text">
        <MouseGradient />
        <div className="bg-grain opacity-50 fixed inset-0 pointer-events-none z-0"></div>
        <div className="relative z-10">
          <Navbar />
          <BlogPage onBack={navigateToHome} />
          <Footer />
        </div>
      </div>
    );
  }

  if (currentPage === "collezione-classica") {
    return (
      <div className="min-h-screen font-sans selection:bg-chiarli-wine selection:text-white bg-chiarli-stone text-chiarli-text">
        <MouseGradient />
        <div className="bg-grain opacity-50 fixed inset-0 pointer-events-none z-0"></div>
        <div className="relative z-10">
          <Navbar />
          <CollezioneClassicaPage
            onBack={navigateToHome}
            onWineClick={navigateToWine}
          />
          <Footer />
        </div>
      </div>
    );
  }

  if (currentPage === "collezione-premium") {
    return (
      <div className="min-h-screen font-sans selection:bg-chiarli-wine selection:text-white bg-chiarli-stone text-chiarli-text">
        <MouseGradient />
        <div className="bg-grain opacity-50 fixed inset-0 pointer-events-none z-0"></div>
        <div className="relative z-10">
          <Navbar />
          <CollezionePremiumPage
            onBack={navigateToHome}
            onWineClick={navigateToWine}
          />
          <Footer />
        </div>
      </div>
    );
  }

  if (currentPage === "tutti-i-vini") {
    return (
      <div className="min-h-screen font-sans selection:bg-chiarli-wine selection:text-white bg-chiarli-stone text-chiarli-text">
        <MouseGradient />
        <div className="bg-grain opacity-50 fixed inset-0 pointer-events-none z-0"></div>
        <div className="relative z-10">
          <Navbar />
          <TuttiIViniPage
            onBack={navigateToHome}
            onWineClick={navigateToWine}
          />
          <Footer />
        </div>
      </div>
    );
  }

  if (currentPage === "tenuta-detail" && tenutaSlug) {
    let TenetaComponent: React.FC<{ onBack?: () => void }> | null;
    switch (tenutaSlug) {
      case "cialdini":
        TenetaComponent = TentuaCialdiniPage;
        break;
      case "sozzigalli":
        TenetaComponent = TenutaSozzigalliPage;
        break;
      case "belvedere":
        TenetaComponent = TenutaBelvederePage;
        break;
      default:
        TenetaComponent = null;
    }

    if (!TenetaComponent) {
      setCurrentPage("tenute");
      return null;
    }

    return (
      <div className="min-h-screen font-sans selection:bg-chiarli-wine selection:text-white bg-chiarli-stone text-chiarli-text">
        <MouseGradient />
        <div className="bg-grain opacity-50 fixed inset-0 pointer-events-none z-0"></div>
        <div className="relative z-10">
          <Navbar />
          <TenetaComponent onBack={navigateToHome} />
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans selection:bg-chiarli-wine selection:text-white bg-chiarli-stone text-chiarli-text">
      <MouseGradient />
      <div className="bg-grain opacity-50 fixed inset-0 pointer-events-none z-0"></div>
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <BottleShowcase onWineClick={navigateToWine} />
          <TenuteSection />
          <HistorySection />
          <FeaturedSection />
          <BlogSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
