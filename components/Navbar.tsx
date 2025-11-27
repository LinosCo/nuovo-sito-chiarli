import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = ['Vini', 'Tenute', 'Esperienze', 'Storia', 'Sostenibilità'];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        isScrolled ? 'bg-chiarli-stone/95 backdrop-blur-md py-4 shadow-sm text-chiarli-text' : 'bg-transparent py-6 text-white'
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex items-center justify-between">

        {/* Logo Area */}
        <a href="#" className="group">
          <img
            src="/foto/cletochiarli-2-01.svg"
            alt="Cleto Chiarli"
            className={`h-10 md:h-12 w-auto transition-all ${isScrolled ? 'brightness-0' : 'brightness-0 invert'}`}
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
        <div className="flex items-center gap-6">
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>

          <a href="#contatti" className={`hidden md:block px-6 py-2 border ${isScrolled ? 'border-chiarli-text hover:bg-chiarli-text hover:text-white' : 'border-white hover:bg-white hover:text-chiarli-text'} font-sans text-xs font-bold uppercase tracking-widest transition-all`}>
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
        </div>
      )}
    </header>
  );
};