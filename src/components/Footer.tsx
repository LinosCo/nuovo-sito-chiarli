import React from "react";
import { Phone, MessageCircle, Mail } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer
      id="contatti"
      className="bg-white text-chiarli-text pt-12 md:pt-24 pb-8 md:pb-12 border-t border-chiarli-text/10"
    >
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {/* Indirizzo */}
          <div>
            <h4 className="font-serif text-2xl mb-8">Indirizzo</h4>

            <div className="mb-8">
              <h5 className="font-sans text-sm font-bold mb-2">
                Villa Cialdini
              </h5>
              <p className="font-sans text-sm text-chiarli-text/60">
                41014 Castelvetro di Modena MO
              </p>
            </div>

            <div>
              <h5 className="font-sans text-sm font-bold mb-2">Sede Legale</h5>
              <p className="font-sans text-sm text-chiarli-text/60">
                Via Belvedere 8
              </p>
              <p className="font-sans text-sm text-chiarli-text/60">
                41014 Castelvetro di Modena ( Mo )
              </p>
            </div>
          </div>

          {/* Contatti */}
          <div>
            <h4 className="font-serif text-2xl mb-8">Contatti</h4>

            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <Phone size={20} className="text-chiarli-text/60" />
                <a
                  href="tel:059702761"
                  className="font-sans text-sm hover:text-chiarli-wine transition-colors"
                >
                  059 702761
                </a>
              </li>
              <li className="flex items-center gap-4">
                <MessageCircle size={20} className="text-chiarli-text/60" />
                <a
                  href="https://wa.me/39348928141"
                  className="font-sans text-sm hover:text-chiarli-wine transition-colors"
                >
                  348 9281419
                </a>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={20} className="text-chiarli-text/60" />
                <a
                  href="mailto:accoglienza.cletochiarli@chiarli.it"
                  className="font-sans text-sm hover:text-chiarli-wine transition-colors"
                >
                  accoglienza.cletochiarli@chiarli.it
                </a>
              </li>
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h4 className="font-serif text-2xl mb-8">Policy</h4>

            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="font-sans text-sm hover:text-chiarli-wine transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-sans text-sm hover:text-chiarli-wine transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-chiarli-text/10 pt-8">
          <p className="font-sans text-sm text-chiarli-text/40">
            © 2026 Cleto Chiarli. Tutti i diritti riservati
          </p>
        </div>
      </div>
    </footer>
  );
};
