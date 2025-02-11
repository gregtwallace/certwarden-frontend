declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    env: {
      API_URL: string;
    };
  }
}

// environment file variables
// use process.env in dev and window.env (env.js) in prod
const useFile = import.meta.env.PROD;

// api url  API_URL: '__API_URL__',
export const apiUrl: string = useFile
  ? window.env.API_URL
  : import.meta.env['VITE_API_URL'];
