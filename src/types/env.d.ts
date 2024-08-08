// environment from window (used in prod - set by public/env.js)
type Window = {
  env: {
    readonly API_URL: string;
    readonly SHOW_DEBUG_INFO: boolean;
  };
};

// environment from .env file (used in dev)
type ImportMetaEnv = {
  readonly VITE_API_URL: string;
  readonly VITE_SHOW_DEBUG_INFO: boolean;
};

type ImportMeta = {
  env: readonly ImportMetaEnv;
};
