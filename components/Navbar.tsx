import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTenuteOpen, setIsTenuteOpen] = useState(false);
  const [isViniOpen, setIsViniOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();

  // TEMPORANEO: Semplificato durante sviluppo dark-only
  const navItems = [
    {
      label: 'Vini',
      href: '#vini',
      submenu: [
        { label: 'Collezione Classica', href: '#/collezione-classica' },
        { label: 'Collezione Premium', href: '#/collezione-premium' }
      ]
    },
    {
      label: 'Tenute',
      href: '#/tenute',
      submenu: [
        { label: 'Tenuta Cialdini', href: '#/tenute/cialdini' },
        { label: 'Tenuta Sozzigalli', href: '#/tenute/sozzigalli' },
        { label: 'Tenuta Belvedere', href: '#/tenute/belvedere' }
      ]
    },
    { label: 'Esperienze', href: '#/esperienze' },
    { label: 'Storia', href: '#/storia' },
    { label: 'Metodo', href: '#/metodo' },
    { label: 'Sostenibilità', href: '#/sostenibilita' },
    { label: 'Blog', href: '#/blog' }
  ];

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
        <a href="" className="group">
          <img
            src="/foto/cletochiarli-2-01.svg"
            alt="Cleto Chiarli"
            className={`h-10 md:h-12 w-auto transition-all ${isScrolled ? 'brightness-0' : isDark ? 'brightness-0 invert' : 'brightness-0'}`}
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-12">
          {navItems.map((item) => {
            const isOpen = item.label === 'Vini' ? isViniOpen : item.label === 'Tenute' ? isTenuteOpen : false;
            const setIsOpen = item.label === 'Vini' ? setIsViniOpen : item.label === 'Tenute' ? setIsTenuteOpen : () => {};

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.submenu && setIsOpen(true)}
                onMouseLeave={() => item.submenu && setIsOpen(false)}
              >
                <a
                  href={item.href}
                  className="font-sans text-xs font-bold uppercase tracking-widest hover:text-chiarli-wine transition-colors"
                >
                  {item.label}
                </a>

                {/* Dropdown Menu */}
                {item.submenu && isOpen && (
                  <div className="absolute top-full left-0 pt-2 w-56">
                    <div className="bg-chiarli-stone shadow-xl border border-chiarli-text/10 overflow-hidden">
                      {item.submenu.map((subitem) => (
                        <a
                          key={subitem.label}
                          href={subitem.href}
                          className="block px-6 py-3 font-sans text-xs font-bold uppercase tracking-widest text-chiarli-text hover:bg-chiarli-wine hover:text-white transition-colors"
                        >
                          {subitem.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* TEMPORANEO: Theme Switch nascosto durante sviluppo */}
          {/* <button
            onClick={toggleTheme}
            className="relative w-8 h-8 flex items-center justify-center outline-none focus:outline-none"
            title={isDark ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
          >
            <Moon
              size={18}
              className={`absolute transition-all duration-500 ${
                isDark
                  ? 'opacity-0 -rotate-90 scale-0'
                  : 'opacity-100 rotate-0 scale-100'
              } ${isScrolled ? 'text-chiarli-text hover:text-chiarli-wine' : isDark ? 'text-white hover:text-white/70' : 'text-chiarli-text hover:text-chiarli-wine'}`}
            />

            <Sun
              size={18}
              className={`absolute transition-all duration-500 ${
                isDark
                  ? 'opacity-100 rotate-0 scale-100'
                  : 'opacity-0 rotate-90 scale-0'
              } ${isScrolled ? 'text-chiarli-text hover:text-chiarli-wine' : isDark ? 'text-white hover:text-white/70' : 'text-chiarli-text hover:text-chiarli-wine'}`}
            />
          </button> */}

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
            <div key={item.label} className="flex flex-col items-center space-y-4">
              <a
                href={item.href}
                onClick={() => !item.submenu && setIsMenuOpen(false)}
                className="font-serif text-4xl italic"
              >
                {item.label}
              </a>
              {item.submenu && (
                <div className="flex flex-col items-center space-y-3">
                  {item.submenu.map((subitem) => (
                    <a
                      key={subitem.label}
                      href={subitem.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="font-sans text-sm uppercase tracking-widest text-chiarli-text/70 hover:text-chiarli-wine"
                    >
                      {subitem.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          {/* TEMPORANEO: Theme toggle nascosto durante sviluppo */}
          {/* <button
            onClick={toggleTheme}
            className="flex items-center gap-3 mt-8 text-chiarli-text/70 outline-none focus:outline-none"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-sans text-sm uppercase tracking-widest">
              {isDark ? 'Tema Chiaro' : 'Tema Scuro'}
            </span>
          </button> */}
        </div>
      )}
    </header>
  );
};
