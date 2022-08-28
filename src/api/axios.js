import axios from 'axios';

// set API URL via env if not in prod, otherwise prod server will
// update env.js appropriately
export const API_URL =
  process.env.NODE_ENV === 'production'
    ? window.env.API_URL
    : process.env.REACT_APP_API_URL;

// base config
export const axiosConfig = {
  baseURL: API_URL + '/api',
  headers: { 'Content-Type': 'application/json' },
};

// insecure axios (no token sent)
// default, insecure
export default axios.create({
  ...axiosConfig,
});

// with credentials (cookies)
export const axiosPrivate = axios.create({
  ...axiosConfig,
  withCredentials: true,
});
