import axios from 'axios';

// base config
export const axiosConfig = {
  baseURL: process.env.REACT_APP_API_NODE + "/api",
  headers: { 'Content-Type': 'application/json'},
}

// insecure axios (no token sent)
// default, insecure
export default axios.create({
  ...axiosConfig
});

// with credentials (cookies)
export const axiosPrivate = axios.create({
  ...axiosConfig,
  withCredentials: true,
});
