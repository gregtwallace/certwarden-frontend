import { useEffect } from 'react';

import { axiosPrivate } from '../api/axios';

import useRefreshToken from './useRefreshToken';
import useAuth from './useAuth';

const NO_RETRY_HEADER = 'x-no-retry'

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    // add the Authorization header to all Private requests
    const requestIntercept = axiosPrivate.interceptors.request.use(
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
    // also add a retry header so this won't endlessly loop (i.e. 
    // if it retries a second time, it won't proceed because the flag
    // already shows a retry)
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        var prevRequest = error?.config;
        if (error?.response?.status === 401 && prevRequest?.headers[NO_RETRY_HEADER] == null) {
          // get new token, return error if refresh errors
          try {
            const newAccessToken = await refresh();

            // retry with new token
            prevRequest.headers[NO_RETRY_HEADER] = 'true';
            prevRequest.headers['Authorization'] = newAccessToken;
            return axiosPrivate(prevRequest);

          } catch (error) {/* no-op */}
        }
        return Promise.reject(error);
      }
    );

    return (() => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    })
  },[auth.accessToken, refresh])

  return axiosPrivate;
};

export default useAxiosPrivate;
