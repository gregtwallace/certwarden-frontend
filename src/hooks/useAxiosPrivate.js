import { useEffect } from 'react';

import axios from '../api/axios';

import useRefreshToken from './useRefreshToken';
import useAuth from './useAuth';

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    // add the Authorization header to all Private requests
    const requestIntercept = axios.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = auth?.accessToken;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  
    // if response is 401, try refreshing access token and then retry
    // original request again
    // also add a "retried" flag so this won't endlessly loop (i.e. 
    // if it retries a second time, it won't proceed because the flag
    // already shows a retry)
    const responseIntercept = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.retried) {
          prevRequest.retried = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = newAccessToken;
          return axios(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return (() => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    })
  })


  return axios;
};

export default useAxiosPrivate;
