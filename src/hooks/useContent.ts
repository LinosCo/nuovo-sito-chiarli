import { useState, useEffect } from 'react';

// Import diretto dei JSON (Vite li include nel bundle)
import winesData from '../content/wines.json';
import tenuteData from '../content/tenute.json';
import experiencesData from '../content/experiences.json';
import homeData from '../content/pages/home.json';
import storiaData from '../content/pages/storia.json';
import settingsData from '../content/settings.json';
import newsData from '../content/news.json';

// Re-export dei tipi
export type { Wine, Tenuta, Experience, NewsArticle } from '../content/types';

/**
 * Hook per caricare i vini
 */
export function useWines() {
  const [wines, setWines] = useState(winesData.wines);
  const [loading, setLoading] = useState(false);

  return {
    wines: wines.filter(w => w.isActive).sort((a, b) => a.order - b.order),
    allWines: wines,
    loading,
  };
}

/**
 * Hook per caricare le tenute
 */
export function useTenute() {
  const [tenute, setTenute] = useState(tenuteData.tenute);
  const [loading, setLoading] = useState(false);

  return {
    tenute: tenute.filter(t => t.isActive).sort((a, b) => a.order - b.order),
    loading,
  };
}

/**
 * Hook per caricare le esperienze
 */
export function useExperiences() {
  const [experiences, setExperiences] = useState(experiencesData.experiences);
  const [loading, setLoading] = useState(false);

  return {
    experiences: experiences.filter(e => e.isActive).sort((a, b) => a.order - b.order),
    loading,
  };
}

/**
 * Hook per caricare le news
 */
export function useNews() {
  const [news, setNews] = useState(newsData.news);
  const [loading, setLoading] = useState(false);

  return {
    news: news.filter((n: any) => n.isPublished).sort((a: any, b: any) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    ),
    allNews: news,
    loading,
  };
}

/**
 * Hook per caricare i contenuti della homepage
 */
export function useHomeContent() {
  return homeData;
}

/**
 * Hook per caricare i contenuti della pagina storia
 */
export function useStoriaContent() {
  return storiaData;
}

/**
 * Hook per caricare le impostazioni del sito
 */
export function useSettings() {
  return settingsData;
}

/**
 * Hook per caricare un vino specifico per slug
 */
export function useWineBySlug(slug: string) {
  const { allWines, loading } = useWines();
  const wine = allWines.find(w => w.slug === slug);

  return { wine, loading };
}

/**
 * Hook per caricare una tenuta specifica per slug
 */
export function useTenutaBySlug(slug: string) {
  const { tenute, loading } = useTenute();
  const tenuta = tenute.find(t => t.slug === slug);

  return { tenuta, loading };
}
