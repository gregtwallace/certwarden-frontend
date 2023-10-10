import axios from 'axios';
import { apiUrl } from '../helpers/environment';

// base config (always allow cookies)
export const axiosConfig = {
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
};

// axios instance which will not be modified to add access_token and refresh
export const axiosNoToken = axios.create(axiosConfig);

// axios instance to modify with access_token functionality
export const axiosWithToken = axios.create(axiosConfig);
