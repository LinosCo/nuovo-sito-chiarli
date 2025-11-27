import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HistorySection } from './components/HistorySection';
import { TenuteSection } from './components/TenuteSection';
import { BottleShowcase } from './components/BottleShowcase';
import { FeaturedSection } from './components/FeaturedSection';
import { Footer } from './components/Footer';
import { WineDetailPage } from './components/WineDetailPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'wine-detail'>('home');
  const [isLoading, setIsLoading] = useState(true);

  // Initial loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Simple hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/vino/metodo-del-fondatore') {
        setCurrentPage('wine-detail');
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToWine = () => {
    window.location.hash = '#/vino/metodo-del-fondatore';
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    window.location.hash = '';
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

  if (currentPage === 'wine-detail') {
    return (
      <div className="min-h-screen bg-chiarli-stone font-sans text-chiarli-text selection:bg-chiarli-wine selection:text-white">
        <div className="bg-grain opacity-50 fixed inset-0 pointer-events-none z-0"></div>
        <div className="relative z-10">
          <WineDetailPage onBack={navigateToHome} />
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chiarli-stone font-sans text-chiarli-text selection:bg-chiarli-wine selection:text-white">
      <div className="bg-grain opacity-50 fixed inset-0 pointer-events-none z-0"></div>
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <BottleShowcase onWineClick={navigateToWine} />
          <TenuteSection />
          <HistorySection />
          <FeaturedSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;