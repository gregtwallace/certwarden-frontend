import { type AxiosInstance } from 'axios';

import { useCallback, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { axiosConfig, axiosInstance } from '../helpers/axios';

import { parseAuthorizationResponseType } from '../types/api';
import useAuth from './useAuth';
import useClientSettings from './useClientSettings';

// backend node for refreshing access_token
const REFRESH_NODE = '/v1/app/auth/refresh';

// name of anti-retry header
const NO_RETRY_HEADER = 'x-no-retry';

// var to globally monitor if an api call is already trying to refresh the
// access_token. Used to skip refresh attempt if another call tried it or
// is actively trying it.
let isRefreshing = false;

const useAxiosWithToken = (): { axiosInstance: AxiosInstance } => {
  // debug?
  const { showDebugInfo } = useClientSettings();

  const { getAccessToken, setAuth } = useAuth();

  // refreshAccessToken calls the refresh route and updates session
  // storage and auth state
  const refreshAccessToken = useCallback(async () => {
    try {
      // NOT using an existing axios instance, as could create infinite loop
      const response = await axios({
        ...axiosConfig,
        method: 'POST',
        url: REFRESH_NODE,
      });

      // parse (narrows and throws err if not valid)
      response.data = parseAuthorizationResponseType(response.data);

      // good, set auth
      setAuth(response.data.authorization);

      // debug log
      if (showDebugInfo) {
        console.log('access token successfully refreshed');
      }

      //
    } catch (_: unknown) {
      // any error - set empty auth
      setAuth(undefined);

      // debug log
      if (showDebugInfo) {
        console.log('access token failed refresh');
      }
    }
  }, [setAuth, showDebugInfo]);

  // axios intercepts for injecting auth header and possibly doing refresh
  // of access_token and then retry of request
  useEffect(() => {
    // add the Authorization header to all Private requests
    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = getAccessToken();
        }
        return config;
      },
      (error: AxiosError) => error
    );

    // if response is 401, try refreshing access token and then retry
    // original request again
    // also add a retry header so this won't endlessly loop (i.e.
    // if it retries a second time, it won't proceed because the flag
    // already shows a retry)
    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // get previous request (config)
        if (error.config) {
          const prevRequest = error?.config;
          // if the error was 401 & not already a retry, and not login, try refresh
          if (
            error.response?.status === 401 &&
            prevRequest.headers[NO_RETRY_HEADER] == null &&
            (!error.config.url || !error.config.url.endsWith('/app/auth/login'))
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
            const newAccessToken = getAccessToken();
            if (newAccessToken == null || newAccessToken === '') {
              // new token doesn't look valid, return original error
              return error;
            }

            // new token seemed ok, retry with it & no retry header
            prevRequest.headers[NO_RETRY_HEADER] = 'true';
            prevRequest.headers['Authorization'] = newAccessToken;
            return axiosInstance(prevRequest);
          }
        }

        // any other error or if error ocurred during refresh
        // return original error
        return error;
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.response.eject(responseIntercept);
    };
  }, [getAccessToken, refreshAccessToken]);

  return { axiosInstance };
};

export default useAxiosWithToken;
