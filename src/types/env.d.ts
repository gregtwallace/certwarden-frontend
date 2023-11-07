// environment from window (used in prod - set by public/env.js)
interface Window {
  env: {
    readonly API_URL: string;
    readonly SHOW_DEBUG_INFO: boolean;
  };
}

// environment from .env file (used in dev)
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SHOW_DEBUG_INFO: boolean;
}

interface ImportMeta {
  env: readonly ImportMetaEnv;
}
