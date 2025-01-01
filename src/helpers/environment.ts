declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    env: {
      API_URL: string;
      SHOW_DEBUG_INFO: string;
    };
  }
}

// environment file variables
// use process.env in dev and window.env (env.js) in prod
const useFile = import.meta.env.PROD === true;

// api url  API_URL: '__API_URL__',
export const apiUrl: string = useFile
  ? window.env.API_URL
  : import.meta.env['VITE_API_URL'];

// debug logging - SHOW_DEBUG_INFO: '__SHOW_DEBUG_INFO__',
// Note: This is SAFE to run in production, it just provides extra info to users
// Changes:
// - provides some extra console.log() information
// - provides some additional information on various pages (such as IDs)
export const showDebugInfo: boolean = useFile
  ? window.env.SHOW_DEBUG_INFO
  : import.meta.env['VITE_SHOW_DEBUG_INFO'];
