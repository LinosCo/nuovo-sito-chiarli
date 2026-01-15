import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HeroLight } from './components/HeroLight';
import { HistorySection } from './components/HistorySection';
import { HistorySectionLight } from './components/HistorySectionLight';
import { BottleShowcase } from './components/BottleShowcase';
import { BottleShowcaseLight } from './components/BottleShowcaseLight';
import { FeaturedSection } from './components/FeaturedSection';
import { FeaturedSectionLight } from './components/FeaturedSectionLight';
import { BlogSection } from './components/BlogSection';
import { BlogSectionLight } from './components/BlogSectionLight';
import { TenuteSection } from './components/TenuteSection';
import { Footer } from './components/Footer';
import { WineDetailPage } from './components/WineDetailPage';
import { ExperiencesPage } from './components/ExperiencesPage';
import { StoriaPage } from './components/StoriaPage';
import { TenutePage } from './components/TenutePage';
import { TentuaCialdiniPage } from './components/TentuaCialdiniPage';
import { TenutaSozzigalliPage } from './components/TenutaSozzigalliPage';
import { TenutaBelvederePage } from './components/TenutaBelvederePage';
// import { WineDetailPageLight } from './components/WineDetailPageLight';
import { MouseGradient } from './components/MouseGradient';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

function AppContent() {
  // Blog section enabled
  const [currentPage, setCurrentPage] = useState<'home' | 'wine-detail' | 'experiences' | 'storia' | 'tenute' | 'tenuta-detail'>('home');
  const [wineSlug, setWineSlug] = useState<string | null>(null);
  const [tenutaSlug, setTenutaSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isDark } = useTheme();

  // Initial loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Simple hash-based routing con supporto per slug dinamici
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      // Controlla se è una pagina vino: #/vino/[slug]
      const wineMatch = hash.match(/^#\/vino\/([^/]+)$/);
      // Controlla se è una pagina tenuta: #/tenute/[slug]
      const tenutaMatch = hash.match(/^#\/tenute\/([^/]+)$/);

      if (wineMatch) {
        setWineSlug(wineMatch[1]);
        setCurrentPage('wine-detail');
        setTenutaSlug(null);
      } else if (tenutaMatch) {
        setTenutaSlug(tenutaMatch[1]);
        setCurrentPage('tenuta-detail');
        setWineSlug(null);
      } else if (hash === '#/esperienze') {
        setCurrentPage('experiences');
        setWineSlug(null);
        setTenutaSlug(null);
      } else if (hash === '#/storia') {
        setCurrentPage('storia');
        setWineSlug(null);
        setTenutaSlug(null);
      } else if (hash === '#/tenute') {
        setCurrentPage('tenute');
        setWineSlug(null);
        setTenutaSlug(null);
      } else {
        setWineSlug(null);
        setTenutaSlug(null);
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToWine = (slug: string = 'metodo-del-fondatore') => {
    window.location.hash = `#/vino/${slug}`;
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    window.location.hash = '';
    window.scrollTo(0, 0);
  };

  const navigateToExperiences = () => {
    window.location.hash = '#/esperienze';
    window.scrollTo(0, 0);
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
                left: `${5 + (i * 5) % 90}%`,
                top: `${10 + (i * 4) % 80}%`,
                background: `radial-gradient(circle at 30% 30%, rgba(180,60,80,${0.3 + (i % 4) * 0.1}), rgba(120,30,50,${0.2}))`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Logo and loading animation */}
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <h1 className="font-serif text-5xl md:text-6xl text-white mb-2">
              <span className="italic text-chiarli-wine-light">Cleto</span> Chiarli
            </h1>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
              Dal 1860
            </p>
          </div>

          {/* Loading bar */}
          <div className="w-48 h-[2px] bg-white/10 mx-auto overflow-hidden">
            <div
              className="h-full bg-chiarli-wine-light animate-loading-bar"
              style={{
                animation: 'loading-bar 2s ease-in-out',
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

  if (currentPage === 'wine-detail' && wineSlug) {
    return (
      <div className={`min-h-screen font-sans selection:bg-chiarli-wine selection:text-white transition-colors duration-500 ${
        isDark ? 'bg-chiarli-stone text-chiarli-text' : 'bg-white text-chiarli-text'
      }`}>
        <MouseGradient />
        <div className="bg-grain opacity-50 fixed inset-0 pointer-events-none z-0"></div>
        <div className="relative z-10">
          <WineDetailPage slug={wineSlug} onBack={navigateToHome} />
          <Footer />
        </div>
      </div>
    );
  }

  if (currentPage === 'experiences') {
    return (
      <div className={`min-h-screen font-sans selection:bg-chiarli-wine selection:text-white transition-colors duration-500 ${
        isDark ? 'bg-chiarli-stone text-chiarli-text' : 'bg-white text-chiarli-text'
      }`}>
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

  if (currentPage === 'storia') {
    return (
      <div className={`min-h-screen font-sans selection:bg-chiarli-wine selection:text-white transition-colors duration-500 ${
        isDark ? 'bg-chiarli-stone text-chiarli-text' : 'bg-white text-chiarli-text'
      }`}>
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

  if (currentPage === 'tenute') {
    return (
      <div className={`min-h-screen font-sans selection:bg-chiarli-wine selection:text-white transition-colors duration-500 ${
        isDark ? 'bg-chiarli-stone text-chiarli-text' : 'bg-white text-chiarli-text'
      }`}>
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

  if (currentPage === 'tenuta-detail' && tenutaSlug) {
    let TenetaComponent;
    switch(tenutaSlug) {
      case 'cialdini':
        TenetaComponent = TentuaCialdiniPage;
        break;
      case 'sozzigalli':
        TenetaComponent = TenutaSozzigalliPage;
        break;
      case 'belvedere':
        TenetaComponent = TenutaBelvederePage;
        break;
      default:
        TenetaComponent = null;
    }

    if (!TenetaComponent) {
      setCurrentPage('tenute');
      return null;
    }

    return (
      <div className={`min-h-screen font-sans selection:bg-chiarli-wine selection:text-white transition-colors duration-500 ${
        isDark ? 'bg-chiarli-stone text-chiarli-text' : 'bg-white text-chiarli-text'
      }`}>
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
    <div className={`min-h-screen font-sans selection:bg-chiarli-wine selection:text-white transition-colors duration-500 ${
      isDark ? 'bg-chiarli-stone text-chiarli-text' : 'bg-white text-chiarli-text'
    }`}>
      <MouseGradient />
      <div className="bg-grain opacity-50 fixed inset-0 pointer-events-none z-0"></div>
      <div className="relative z-10">
        <Navbar />
        <main>
          {isDark ? <Hero /> : <HeroLight />}
          {isDark ? <BottleShowcase onWineClick={navigateToWine} /> : <BottleShowcaseLight onWineClick={navigateToWine} />}
          <TenuteSection />
          {isDark ? (
            <>
              <HistorySection />
              <FeaturedSection />
              <BlogSection />
            </>
          ) : (
            <>
              <FeaturedSectionLight />
              <HistorySectionLight />
              <BlogSectionLight />
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
