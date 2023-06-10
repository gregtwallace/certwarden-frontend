// environment file variables
// use process.env in dev and window.env (env.js) in prod
const useFile = import.meta.env.PROD === true;

// api url  API_URL: '__API_URL__',
export const apiUrl = useFile
  ? window.env.API_URL
  : import.meta.env.VITE_API_URL;

// dev mode - DEV_MODE: '__DEV_MODE__',
// devMode changes:
// - Show accoount KID
// - Disable password change complexity validation
// - console.log() a number of things related to Axios
export const devMode = useFile
  ? window.env.DEV_MODE
  : import.meta.env.VITE_DEV_MODE;
