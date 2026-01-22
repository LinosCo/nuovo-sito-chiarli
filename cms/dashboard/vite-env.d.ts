/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CMS_API_URL: string;
  readonly VITE_SITE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
