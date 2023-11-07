import { type AxiosRequestConfig, isAxiosError } from 'axios';
import { isErrorResponseType } from '../types/api';

import axios from 'axios';
import { apiUrl } from './environment';

// base config (always allow cookies)
export const axiosConfig: AxiosRequestConfig = {
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
};

// common axios instance
export const axiosInstance = axios.create(axiosConfig);

// error parser
export const parseAxiosError = (
  err: unknown
): { errorCode: number | string; errorMessage: string } => {
  // if err is an error response from backend api, use its code and message
  // first possible spot for backend response
  if (
    err &&
    typeof err === 'object' &&
    'data' in err &&
    isErrorResponseType(err.data)
  ) {
    return {
      errorCode: err.data.status_code,
      errorMessage: err.data.message,
    };
  }

  // second possible spot for backend response
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    err.response &&
    typeof err.response === 'object' &&
    'data' in err.response &&
    isErrorResponseType(err.response.data)
  ) {
    return {
      errorCode: err.response.data.status_code,
      errorMessage: err.response.data.message,
    };
  }

  // if axios error, return axios code and message
  if (isAxiosError(err)) {
    const errorCode = err.code;
    const errorMessage = err.message;
    return { errorCode: errorCode || 'unknown', errorMessage };
  }

  return { errorCode: 'unknown', errorMessage: 'unknown' };
};
