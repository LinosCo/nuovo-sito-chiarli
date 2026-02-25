import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTenuteOpen, setIsTenuteOpen] = useState(false);
  const [isViniOpen, setIsViniOpen] = useState(false);

  const navItems = [
    {
      label: "Vini",
      href: "/tutti-i-vini",
      submenu: [
        { label: "Collezione Classica", href: "/collezione-classica" },
        { label: "Collezione Premium", href: "/collezione-premium" },
      ],
    },
    {
      label: "Tenute",
      href: "/tenute",
      submenu: [
        { label: "Tenuta Cialdini", href: "/tenute/cialdini" },
        { label: "Tenuta Sozzigalli", href: "/tenute/sozzigalli" },
        { label: "Tenuta Belvedere", href: "/tenute/belvedere" },
      ],
    },
    { label: "Esperienze", href: "/esperienze" },
    { label: "Storia", href: "/storia" },
    { label: "Metodo", href: "/metodo" },
    { label: "Sostenibilità", href: "/sostenibilita" },
    { label: "Blog", href: "/blog" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateTo = (path: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    history.pushState(null, "", path);
    window.dispatchEvent(new Event("pushstate"));
  };

  const scrollToContatti = () => {
    setIsMenuOpen(false);
    if (window.location.pathname === "/") {
      document
        .getElementById("contatti")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      history.pushState(null, "", "/");
      window.dispatchEvent(new Event("pushstate"));
      setTimeout(() => {
        document
          .getElementById("contatti")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-chiarli-stone/95 backdrop-blur-md py-4 shadow-sm text-chiarli-text"
            : "bg-transparent py-6 text-white"
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo Area */}
          <a href="/" onClick={(e) => navigateTo("/", e)} className="group">
            <img
              src="/foto/cletochiarli-2-01.svg"
              alt="Cleto Chiarli"
              className={`h-10 md:h-12 w-auto transition-all ${isScrolled ? "brightness-0" : "brightness-0 invert"}`}
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-12">
            {navItems.map((item) => {
              const isOpen =
                item.label === "Vini"
                  ? isViniOpen
                  : item.label === "Tenute"
                    ? isTenuteOpen
                    : false;
              const setIsOpen =
                item.label === "Vini"
                  ? setIsViniOpen
                  : item.label === "Tenute"
                    ? setIsTenuteOpen
                    : () => {};

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.submenu && setIsOpen(true)}
                  onMouseLeave={() => item.submenu && setIsOpen(false)}
                >
                  <a
                    href={item.href}
                    onClick={(e) => navigateTo(item.href, e)}
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
                            onClick={(e) => navigateTo(subitem.href, e)}
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
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>

            <button
              onClick={scrollToContatti}
              className="hidden md:block px-6 py-2 hover:text-chiarli-wine-light font-sans text-xs font-bold uppercase tracking-widest transition-all"
            >
              Contatti
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Outside header to avoid stacking context issues on iOS */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-chiarli-stone text-chiarli-text z-[9999] flex flex-col md:hidden">
          <button
            className="absolute top-6 right-6"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={24} />
          </button>
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center space-y-6 py-20 px-6">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center space-y-3"
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    navigateTo(item.href, e);
                    if (!item.submenu) setIsMenuOpen(false);
                  }}
                  className="font-serif text-2xl italic"
                >
                  {item.label}
                </a>
                {item.submenu && (
                  <div className="flex flex-col items-center space-y-2">
                    {item.submenu.map((subitem) => (
                      <a
                        key={subitem.label}
                        href={subitem.href}
                        onClick={(e) => {
                          navigateTo(subitem.href, e);
                          setIsMenuOpen(false);
                        }}
                        className="font-sans text-sm uppercase tracking-widest text-chiarli-text/70 hover:text-chiarli-wine"
                      >
                        {subitem.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={scrollToContatti}
              className="font-serif text-2xl italic mt-2"
            >
              Contatti
            </button>
          </div>
        </div>
      )}
    </>
  );
};
