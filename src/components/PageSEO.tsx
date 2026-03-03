import React from "react";
import { useSEO } from "../hooks/useSEO";
import { useJsonLd } from "../hooks/useJsonLd";

const BASE_URL = "https://cletochiarli.cms.voler.ai";

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cleto Chiarli",
  url: BASE_URL,
  logo: `${BASE_URL}/foto/cletochiarli-2-01.svg`,
  foundingDate: "1860",
  description:
    "La più antica cantina dell'Emilia-Romagna, dal 1860 produttrice di Lambrusco di eccellenza.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Modena",
    addressRegion: "Emilia-Romagna",
    addressCountry: "IT",
  },
  sameAs: [],
};

interface PageSEOProps {
  page: string;
}

const PAGE_SEO: Record<
  string,
  { title: string; description: string; path: string }
> = {
  home: {
    title: "Cleto Chiarli | Modena 1860",
    description:
      "Dal 1860, la più antica cantina dell'Emilia-Romagna. Scopri i nostri Lambrusco, le tenute storiche e le esperienze enogastronomiche.",
    path: "/",
  },
  experiences: {
    title: "Esperienze Enogastronomiche",
    description:
      "Degustazioni, visite in cantina e tour dei vigneti nelle tenute storiche di Cleto Chiarli a Modena. Prenota la tua esperienza.",
    path: "/esperienze",
  },
  storia: {
    title: "La Nostra Storia dal 1860",
    description:
      "Dal 1860 ad oggi: la storia di Cleto Chiarli, la più antica cantina dell'Emilia-Romagna. Cinque generazioni di passione per il Lambrusco.",
    path: "/storia",
  },
  tenute: {
    title: "Le Tenute Storiche",
    description:
      "Scopri le tenute storiche di Cleto Chiarli: Villa Cialdini, Sozzigalli e Belvedere. Vigneti tra Modena e Bologna.",
    path: "/tenute",
  },
  sostenibilita: {
    title: "Sostenibilità e Rispetto per il Territorio",
    description:
      "L'impegno di Cleto Chiarli per la sostenibilità: viticoltura responsabile, energia rinnovabile e rispetto per il territorio emiliano.",
    path: "/sostenibilita",
  },
  metodo: {
    title: "Il Metodo Chiarli",
    description:
      "Scopri il metodo di vinificazione Cleto Chiarli: dalla selezione delle uve alla rifermentazione tradizionale del Lambrusco.",
    path: "/metodo",
  },
  blog: {
    title: "Blog e Notizie",
    description:
      "Notizie, eventi e approfondimenti dal mondo Cleto Chiarli. Scopri le ultime novità sulla cantina e i nostri Lambrusco.",
    path: "/blog",
  },
  "collezione-classica": {
    title: "Collezione Classica - Lambrusco Tradizionale",
    description:
      "La Collezione Classica Cleto Chiarli: Lambrusco Grasparossa, Pignoletto e Rosé. Vini della tradizione emiliana dal 1860.",
    path: "/collezione-classica",
  },
  "collezione-premium": {
    title: "Collezione Premium - I Migliori Lambrusco",
    description:
      "La Collezione Premium Cleto Chiarli: Vecchia Modena, Metodo del Fondatore, Pruno Nero. I migliori Lambrusco per l'alta ristorazione.",
    path: "/collezione-premium",
  },
  "tutti-i-vini": {
    title: "Tutti i Vini - Catalogo Completo Lambrusco",
    description:
      "Catalogo completo dei vini Cleto Chiarli: Lambrusco di Sorbara, Grasparossa di Castelvetro, Pignoletto e Spumanti. Scopri tutta la gamma.",
    path: "/tutti-i-vini",
  },
  "tenuta-cialdini": {
    title: "Tenuta Villa Cialdini - Castelvetro di Modena",
    description:
      "Villa Cialdini a Castelvetro di Modena: la tenuta storica di Cleto Chiarli dove nasce il Lambrusco Grasparossa di Castelvetro DOC.",
    path: "/tenute/cialdini",
  },
  "tenuta-sozzigalli": {
    title: "Tenuta Sozzigalli - Sorbara",
    description:
      "Tenuta Sozzigalli a Sorbara: il cuore del Lambrusco di Sorbara DOC. Vigneti storici di Cleto Chiarli dal 1860.",
    path: "/tenute/sozzigalli",
  },
  "tenuta-belvedere": {
    title: "Tenuta Belvedere - Colli Bolognesi",
    description:
      "Tenuta Belvedere nei Colli Bolognesi: Pignoletto DOCG e vini bianchi d'eccellenza dalla cantina Cleto Chiarli.",
    path: "/tenute/belvedere",
  },
};

export const PageSEO: React.FC<PageSEOProps> = ({ page }) => {
  const seo = PAGE_SEO[page] || PAGE_SEO.home;

  useSEO(seo);
  useJsonLd(
    page === "home"
      ? ORGANIZATION_SCHEMA
      : {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: seo.title,
          description: seo.description,
          url: `https://cletochiarli.cms.voler.ai${seo.path}`,
        },
  );

  return null;
};
