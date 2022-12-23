import { useEffect } from 'react';

import { axiosPrivate } from '../api/axios';
import useRefreshToken from './useRefreshToken';

// name of anti-retry header
const NO_RETRY_HEADER = 'x-no-retry';

// var to monitor of an api call is already trying to refresh the
// access_token. Used to skip refresh attempt if another call tried it.
var isRefreshing = false;

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();

  useEffect(() => {
    // add the Authorization header to all Private requests
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] =
            sessionStorage.getItem('access_token');
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
        // if the error was 401 & not already a retry, try refresh
        if (
          error?.response?.status === 401 &&
          prevRequest?.headers[NO_RETRY_HEADER] == null
        ) {
          // if refresh is already taking place, don't call refresh multiple times, just wait
          // and then retry original request again
          if (isRefreshing) {
            while (isRefreshing) {
              // sleep before checking isRefreshing again
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
            // try new access token, don't allow retry
            prevRequest.headers[NO_RETRY_HEADER] = 'true';
            prevRequest.headers['Authorization'] =
              sessionStorage.getItem('access_token');
            return axiosPrivate(prevRequest);
          }
          // no already refreshing - get new token, return error if refresh errors
          try {
            isRefreshing = true;
            const newAccessToken = await refresh();
            isRefreshing = false;

            // retry with new token
            prevRequest.headers[NO_RETRY_HEADER] = 'true';
            prevRequest.headers['Authorization'] = newAccessToken;
            return axiosPrivate(prevRequest);
          } catch (error) {
            /* no-op */
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
