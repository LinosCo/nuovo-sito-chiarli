import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();

  const navItems = isDark
    ? ['Vini', 'Tenute', 'Storia', 'Esperienze', 'Blog']
    : ['Vini', 'Tenute', 'Esperienze', 'Storia', 'Blog'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-chiarli-stone/95 backdrop-blur-md py-4 shadow-sm text-chiarli-text'
          : isDark
            ? 'bg-transparent py-6 text-white'
            : 'bg-chiarli-stone/90 backdrop-blur-sm py-6 text-chiarli-text'
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex items-center justify-between">

        {/* Logo Area */}
        <a href="#" className="group">
          <img
            src="/foto/cletochiarli-2-01.svg"
            alt="Cleto Chiarli"
            className={`h-10 md:h-12 w-auto transition-all ${isScrolled ? 'brightness-0' : isDark ? 'brightness-0 invert' : 'brightness-0'}`}
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-12">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-sans text-xs font-bold uppercase tracking-widest hover:text-chiarli-wine transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Theme Switch - Elegant minimal */}
          <button
            onClick={toggleTheme}
            className="relative w-8 h-8 flex items-center justify-center outline-none focus:outline-none"
            title={isDark ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
          >
            {/* Moon icon - show in light mode (to switch to dark) */}
            <Moon
              size={18}
              className={`absolute transition-all duration-500 ${
                isDark
                  ? 'opacity-0 -rotate-90 scale-0'
                  : 'opacity-100 rotate-0 scale-100'
              } ${isScrolled ? 'text-chiarli-text hover:text-chiarli-wine' : isDark ? 'text-white hover:text-white/70' : 'text-chiarli-text hover:text-chiarli-wine'}`}
            />

            {/* Sun icon - show in dark mode (to switch to light) */}
            <Sun
              size={18}
              className={`absolute transition-all duration-500 ${
                isDark
                  ? 'opacity-100 rotate-0 scale-100'
                  : 'opacity-0 rotate-90 scale-0'
              } ${isScrolled ? 'text-chiarli-text hover:text-chiarli-wine' : isDark ? 'text-white hover:text-white/70' : 'text-chiarli-text hover:text-chiarli-wine'}`}
            />
          </button>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>

          <a href="#contatti" className={`hidden md:block px-6 py-2 ${isDark ? 'hover:text-chiarli-wine-light' : 'hover:text-chiarli-wine'} font-sans text-xs font-bold uppercase tracking-widest transition-all`}>
            Contatti
          </a>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-chiarli-stone text-chiarli-text z-40 flex flex-col items-center justify-center space-y-8">
          <button
            className="absolute top-6 right-6"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={24} />
          </button>
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setIsMenuOpen(false)}
              className="font-serif text-4xl italic"
            >
              {item}
            </a>
          ))}
          {/* Theme toggle in mobile menu */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 mt-8 text-chiarli-text/70 outline-none focus:outline-none"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-sans text-sm uppercase tracking-widest">
              {isDark ? 'Tema Chiaro' : 'Tema Scuro'}
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
