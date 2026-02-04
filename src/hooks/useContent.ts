import { useState, useEffect } from 'react';

// Import diretto dei JSON (Vite li include nel bundle)
import winesData from '../content/wines.json';
import tenuteData from '../content/tenute.json';
import experiencesData from '../content/experiences.json';
import homeData from '../content/pages/home.json';
import storiaData from '../content/pages/storia.json';
import metodoData from '../content/pages/metodo.json';
import sostenibilitaData from '../content/pages/sostenibilita.json';
import settingsData from '../content/settings.json';
import newsData from '../content/news.json';

// Re-export dei tipi
export type { Wine, Tenuta, Experience, NewsArticle } from '../content/types';

// Controlla se siamo in modalità preview CMS
const isCmsPreview = () => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('cms_preview') === 'true';
};

// URL dell'API CMS
const CMS_API_URL = import.meta.env.VITE_CMS_API_URL || 'https://nuovo-sito-chiarli-production.up.railway.app';

/**
 * Hook per caricare i vini
 */
export function useWines() {
  const [wines, setWines] = useState(winesData.wines);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isCmsPreview()) {
      setLoading(true);
      fetch(`${CMS_API_URL}/api/content/wines`)
        .then(res => res.json())
        .then(data => {
          if (data.wines) setWines(data.wines);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, []);

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

  useEffect(() => {
    if (isCmsPreview()) {
      setLoading(true);
      fetch(`${CMS_API_URL}/api/content/tenute`)
        .then(res => res.json())
        .then(data => {
          if (data.tenute) setTenute(data.tenute);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, []);

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

  useEffect(() => {
    if (isCmsPreview()) {
      setLoading(true);
      fetch(`${CMS_API_URL}/api/content/experiences`)
        .then(res => res.json())
        .then(data => {
          if (data.experiences) setExperiences(data.experiences);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, []);

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

  useEffect(() => {
    if (isCmsPreview()) {
      setLoading(true);
      fetch(`${CMS_API_URL}/api/content/news`)
        .then(res => res.json())
        .then(data => {
          if (data.news) setNews(data.news);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, []);

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
  const [content, setContent] = useState(homeData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const preview = isCmsPreview();
    console.log('[useHomeContent] cms_preview:', preview, 'CMS_API_URL:', CMS_API_URL);

    if (preview) {
      setLoading(true);
      console.log('[useHomeContent] Fetching from:', `${CMS_API_URL}/api/content/pages/home`);

      fetch(`${CMS_API_URL}/api/content/pages/home`)
        .then(res => {
          console.log('[useHomeContent] Response status:', res.status);
          return res.json();
        })
        .then(data => {
          console.log('[useHomeContent] Data received:', data?.hero?.subtitle);
          if (data) setContent(data);
        })
        .catch(err => {
          console.error('[useHomeContent] Error:', err);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  return content;
}

/**
 * Hook per caricare i contenuti della pagina storia
 */
export function useStoriaContent() {
  const [content, setContent] = useState(storiaData);

  useEffect(() => {
    if (isCmsPreview()) {
      fetch(`${CMS_API_URL}/api/content/pages/storia`)
        .then(res => res.json())
        .then(data => {
          if (data) setContent(data);
        })
        .catch(console.error);
    }
  }, []);

  return content;
}

/**
 * Hook per caricare i contenuti della pagina metodo
 */
export function useMetodoContent() {
  const [content, setContent] = useState(metodoData);

  useEffect(() => {
    if (isCmsPreview()) {
      fetch(`${CMS_API_URL}/api/content/pages/metodo`)
        .then(res => res.json())
        .then(data => {
          if (data) setContent(data);
        })
        .catch(console.error);
    }
  }, []);

  return content;
}

/**
 * Hook per caricare i contenuti della pagina sostenibilita
 */
export function useSostenibilitaContent() {
  const [content, setContent] = useState(sostenibilitaData);

  useEffect(() => {
    if (isCmsPreview()) {
      fetch(`${CMS_API_URL}/api/content/pages/sostenibilita`)
        .then(res => res.json())
        .then(data => {
          if (data) setContent(data);
        })
        .catch(console.error);
    }
  }, []);

  return content;
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
