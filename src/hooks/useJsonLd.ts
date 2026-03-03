import { useEffect } from "react";

const SCRIPT_ID = "json-ld-seo";

export function useJsonLd(
  data: Record<string, unknown> | Record<string, unknown>[],
) {
  useEffect(() => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(Array.isArray(data) ? data : data);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [JSON.stringify(data)]);
}
