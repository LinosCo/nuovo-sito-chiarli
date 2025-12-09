/**
 * Tipi per i contenuti editabili dal CMS
 *
 * ZONA EDITABILE: Il cliente può modificare questi contenuti via chat
 */

// ============================================
// VINI
// ============================================
export interface Wine {
  id: number;
  slug: string;
  name: string;
  denomination: string;
  family: 'Premium' | 'Metodo Classico' | string;
  description: string;
  image: string;
  format: string;
  tags: string[];
  price: number | null;
  year: number | null;
  alcohol: string | null;
  servingTemp: string | null;
  pairings: string[];
  awards: WineAward[];
  tastingNotes: {
    aspetto: string | null;
    profumo: string | null;
    gusto: string | null;
  };
  isActive: boolean;
  order: number;
}

export interface WineAward {
  name: string;
  score: string;
  year: string;
}

export interface WinesData {
  wines: Wine[];
  _meta: ContentMeta;
}

// ============================================
// TENUTE
// ============================================
export interface Tenuta {
  id: number;
  slug: string;
  name: string;
  location: string;
  description: string;
  image: string;
  hectares: number;
  altitude: string;
  grape: string;
  year: string;
  mapPosition: { x: number; y: number };
  gallery: string[];
  isActive: boolean;
  order: number;
}

export interface TenuteData {
  tenute: Tenuta[];
  _meta: ContentMeta;
}

// ============================================
// ESPERIENZE
// ============================================
export interface Experience {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string | null;
  duration: string | null;
  price: string | null;
  maxParticipants: number | null;
  includes: string[];
  isActive: boolean;
  order: number;
}

export interface ExperiencesData {
  experiences: Experience[];
  _meta: ContentMeta;
}

// ============================================
// NEWS / BLOG
// ============================================
export interface NewsArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string | null;
  author: string;
  publishedAt: string;
  tags: string[];
  isPublished: boolean;
  order: number;
}

export interface NewsData {
  news: NewsArticle[];
  _meta: ContentMeta;
}

// ============================================
// PAGINE
// ============================================
export interface HomePageContent {
  hero: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    images: string[];
  };
  winesSection: {
    label: string;
    titleLine1: string;
    titleLine2: string;
    ctaText: string;
  };
  tenuteSection: {
    label: string;
    ctaText: string;
  };
  experiencesSection: {
    label: string;
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    description: string;
    quote: string;
    ctaPrimary: string;
    ctaSecondary: string;
    backgroundImage: string;
  };
  _meta: ContentMeta;
}

export interface StoriaPageContent {
  storia: {
    label: string;
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    description: string;
    quote: string;
    image: string;
    foundedYear: string;
    stats: Array<{
      value: string;
      label: string;
    }>;
    ctaText: string;
  };
  _meta: ContentMeta;
}

// ============================================
// SETTINGS
// ============================================
export interface SiteSettings {
  site: {
    name: string;
    tagline: string;
    logo: string;
    logoAlt: string;
  };
  navigation: {
    items: Array<{
      label: string;
      href: string;
    }>;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    hours: string | null;
  };
  social: {
    facebook: string | null;
    instagram: string | null;
    linkedin: string | null;
    youtube: string | null;
  };
  footer: {
    links: Array<{
      label: string;
      href: string;
    }>;
    copyright: string;
    privacyLink: string;
    creditsLink: string;
  };
  newsletter: {
    enabled: boolean;
    placeholder: string;
    buttonText: string;
  };
  _meta: ContentMeta;
}

// ============================================
// META & UTILITIES
// ============================================
export interface ContentMeta {
  lastModified: string;
  modifiedBy: string;
  description?: string;
}

// Permessi per il CMS - cosa può modificare il cliente
export type EditableContentType =
  | 'wines'
  | 'tenute'
  | 'experiences'
  | 'news'
  | 'pages/home'
  | 'pages/storia'
  | 'settings';

export interface CMSPermission {
  contentType: EditableContentType;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

// Permessi di default per il cliente
export const CLIENT_PERMISSIONS: CMSPermission[] = [
  { contentType: 'wines', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
  { contentType: 'tenute', canCreate: false, canRead: true, canUpdate: true, canDelete: false },
  { contentType: 'experiences', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
  { contentType: 'news', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
  { contentType: 'pages/home', canCreate: false, canRead: true, canUpdate: true, canDelete: false },
  { contentType: 'pages/storia', canCreate: false, canRead: true, canUpdate: true, canDelete: false },
  { contentType: 'settings', canCreate: false, canRead: true, canUpdate: true, canDelete: false },
];

// Campi protetti (non modificabili dal cliente)
export const PROTECTED_FIELDS = {
  wines: ['id', 'slug'], // slug generato automaticamente
  tenute: ['id', 'slug', 'mapPosition'], // mapPosition richiede sviluppatore
  experiences: ['id', 'slug'],
  news: ['id', 'slug'],
  settings: ['site.logo', 'site.logoAlt'], // logo modificabile solo dallo sviluppatore
};

// Path delle immagini protette (non eliminabili/sostituibili dal cliente)
export const PROTECTED_IMAGES = [
  '/foto/cletochiarli-2-01.svg',  // Logo principale
  '/foto/cletoc-1.svg',           // Logo alternativo
  '/Mappa_regione_emilia_romagna.png', // Mappa
];
