import { type AxiosRequestConfig, isAxiosError } from 'axios';
import { isErrorResponseType } from '../types/api';
import { type frontendErrorType } from '../types/frontend';

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
export const parseAxiosError = (err: unknown): frontendErrorType => {
  // if err is an error response from backend api, use its code and message
  // first possible spot for backend response
  if (
    err &&
    typeof err === 'object' &&
    'data' in err &&
    isErrorResponseType(err.data)
  ) {
    return {
      statusCode: err.data.status_code,
      message: err.data.message,
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
      statusCode: err.response.data.status_code,
      message: err.response.data.message,
    };
  }

  // if axios error, return axios code and message
  if (isAxiosError(err)) {
    const errorCode = err.code;
    const errorMessage = err.message;
    return { statusCode: errorCode || 'unknown', message: errorMessage };
  }

  return { statusCode: 'unknown', message: 'unknown' };
};
