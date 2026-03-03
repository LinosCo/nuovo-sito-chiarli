import { useEffect } from "react";

const BASE_URL = "https://cletochiarli.cms.voler.ai";
const DEFAULT_TITLE = "Cleto Chiarli | Modena 1860";
const DEFAULT_DESCRIPTION =
  "Dal 1860, la più antica cantina dell'Emilia-Romagna. Scopri i nostri Lambrusco, le tenute storiche e le esperienze.";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

interface SEOConfig {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "product";
}

function setMetaTag(property: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = url;
}

export function useSEO({
  title,
  description,
  path,
  image,
  type = "website",
}: SEOConfig) {
  useEffect(() => {
    const fullTitle = path === "/" ? DEFAULT_TITLE : `${title} | Cleto Chiarli`;
    const fullUrl = `${BASE_URL}${path}`;
    const ogImage = image || DEFAULT_IMAGE;

    document.title = fullTitle;

    setMetaTag("description", description);
    setMetaTag("og:title", fullTitle, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:url", fullUrl, true);
    setMetaTag("og:image", ogImage, true);
    setMetaTag("og:type", type, true);
    setMetaTag("twitter:title", fullTitle);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", ogImage);
    setCanonical(fullUrl);

    return () => {
      document.title = DEFAULT_TITLE;
      setMetaTag("description", DEFAULT_DESCRIPTION);
      setMetaTag("og:title", DEFAULT_TITLE, true);
      setMetaTag("og:description", DEFAULT_DESCRIPTION, true);
      setMetaTag("og:url", BASE_URL, true);
      setMetaTag("og:image", DEFAULT_IMAGE, true);
      setMetaTag("og:type", "website", true);
      setMetaTag("twitter:title", DEFAULT_TITLE);
      setMetaTag("twitter:description", DEFAULT_DESCRIPTION);
      setMetaTag("twitter:image", DEFAULT_IMAGE);
      setCanonical(BASE_URL);
    };
  }, [title, description, path, image, type]);
}
