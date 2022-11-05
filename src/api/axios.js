import axios from 'axios';
import { apiUrl } from '../helpers/environment';

// base config
export const axiosConfig = {
  baseURL: apiUrl + '/api',
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
