import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer id="contatti" className="bg-chiarli-stone text-chiarli-text pt-24 pb-12 border-t border-chiarli-text/10">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
           <div className="md:col-span-1">
              <img
                src="/foto/cletochiarli-2-01.svg"
                alt="Cleto Chiarli"
                className="h-10 w-auto mb-6 brightness-0"
              />
              <p className="font-sans text-xs leading-relaxed opacity-60 max-w-xs">
                 Modena 1860. La più antica cantina produttrice di Vini dell'Emilia-Romagna.
              </p>
           </div>

           <div>
              <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest mb-6 opacity-40">Esplora</h4>
              <ul className="space-y-3 font-serif text-sm opacity-80">
                 <li><a href="#vini" className="hover:text-chiarli-wine transition-colors">I Vini</a></li>
                 <li><a href="#tenute" className="hover:text-chiarli-wine transition-colors">Le Tenute</a></li>
                 <li><a href="#storia" className="hover:text-chiarli-wine transition-colors">Storia</a></li>
                 <li><a href="#esperienze" className="hover:text-chiarli-wine transition-colors">Visite</a></li>
              </ul>
           </div>

           <div>
              <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest mb-6 opacity-40">Contatti</h4>
              <ul className="space-y-3 font-serif text-sm opacity-80">
                 <li>Via Manin 15, Modena</li>
                 <li>+39 059 3163311</li>
                 <li>info@chiarli.it</li>
              </ul>
           </div>

           <div>
              <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest mb-6 opacity-40">Newsletter</h4>
              <div className="flex border-b border-chiarli-text/20 pb-2">
                 <input
                    type="email"
                    placeholder="La tua email"
                    className="bg-transparent border-none outline-none w-full font-serif text-sm placeholder:opacity-40"
                 />
                 <button className="text-xs font-bold uppercase tracking-widest hover:text-chiarli-wine">Invia</button>
              </div>
           </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-chiarli-text/5 pt-8">
           <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-40">
              © 2025 Cleto Chiarli Tenute Agricole
           </p>
           <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100">Privacy</a>
              <a href="#" className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100">Credits</a>
           </div>
        </div>

      </div>
    </footer>
  );
};