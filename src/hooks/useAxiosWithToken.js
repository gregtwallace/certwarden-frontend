import { useEffect } from 'react';

import { axiosWithToken } from '../api/axios';
import useRefreshAccessToken from './useRefreshAccessToken';

// name of anti-retry header
const NO_RETRY_HEADER = 'x-no-retry';

// var to globally monitor if an api call is already trying to refresh the
// access_token. Used to skip refresh attempt if another call tried it or
// is actively trying it.
var isRefreshing = false;

const useAxiosWithToken = () => {
  const refreshAccessToken = useRefreshAccessToken();

  useEffect(() => {
    // add the Authorization header to all Private requests
    const requestIntercept = axiosWithToken.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] =
            sessionStorage.getItem('access_token');
        }
        return config;
      },
      (error) => error
    );

    // if response is 401, try refreshing access token and then retry
    // original request again
    // also add a retry header so this won't endlessly loop (i.e.
    // if it retries a second time, it won't proceed because the flag
    // already shows a retry)
    const responseIntercept = axiosWithToken.interceptors.response.use(
      (response) => response,
      async (error) => {
        var prevRequest = error?.config;

        // if the error was 401 & not already a retry, try refresh
        if (
          error?.response?.status === 401 &&
          prevRequest?.headers[NO_RETRY_HEADER] == null
        ) {
          // do refresh only if not already refreshing, otherwise sleep until the other
          // refresh job is done
          if (!isRefreshing) {
            isRefreshing = true;
            await refreshAccessToken();
            isRefreshing = false;
          } else {
            while (isRefreshing) {
              // sleep before checking isRefreshing again
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          }

          // don't retry if token appears invalid
          const newAccessToken = sessionStorage.getItem('access_token');
          if (newAccessToken == null || newAccessToken === '') {
            // new token doesn't look valid, return original error
            return error;
          }

          // new token seemed ok, retry with it & no retry header
          prevRequest.headers[NO_RETRY_HEADER] = 'true';
          prevRequest.headers['Authorization'] = newAccessToken;
          return axiosWithToken(prevRequest);
        }

        // any other error or if error ocurred during refresh
        // return original error
        return error;
      }
    );

    return () => {
      axiosWithToken.interceptors.request.eject(requestIntercept);
      axiosWithToken.interceptors.response.eject(responseIntercept);
    };
  }, [refreshAccessToken]);

  return axiosWithToken;
};

export default useAxiosWithToken;
