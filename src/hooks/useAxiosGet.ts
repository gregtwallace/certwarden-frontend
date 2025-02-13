import { isAxiosError } from 'axios';
import { type frontendErrorType } from '../types/frontend';

import { useEffect, useState, useCallback, useMemo } from 'react';

import useAxiosWithToken from './useAxiosWithToken';
import { redactJSONObject } from '../helpers/logging';
import { parseAxiosError } from '../helpers/axios';

import useClientSettings from './useClientSettings';

// get state
type axiosGetStateType<ExpectedResponseType> = {
  responseData: ExpectedResponseType | undefined;
  error: frontendErrorType | undefined;
};

// func to refresh get data (send get again)
type axiosDoUpdateGetType = () => Promise<void>;

// Hook to query the API and return a state based on the query
const useAxiosGet = <ExpectedResponseType>(
  apiNode: string,
  parseResponseDataFunc: (response: unknown) => ExpectedResponseType
): {
  getState: axiosGetStateType<ExpectedResponseType>;
  updateGet: axiosDoUpdateGetType;
} => {
  // debug?
  const { showDebugInfo } = useClientSettings();

  //
  // axios instance
  const { axiosInstance } = useAxiosWithToken();

  // initial empty state (not loaded)
  const emptyUnloadedState = useMemo<axiosGetStateType<ExpectedResponseType>>(
    () => ({
      responseData: undefined,
      error: undefined,
    }),
    []
  );

  // set initial state
  const [getState, setGetState] = useState(emptyUnloadedState);

  // function to do the GET api call
  const updateGet = useCallback(async () => {
    // set unloaded / empty
    setGetState(emptyUnloadedState);

    try {
      const response = await axiosInstance({
        method: 'GET',
        url: apiNode,
      });

      // dev log response
      if (showDebugInfo) {
        // no config.data to worry about
        console.log('GET:', apiNode, 'reply:', redactJSONObject(response));
      }

      // if AxiosError, don't try to parse
      if (isAxiosError(response)) {
        throw response;
      }

      // parse (narrows and throws err if not valid)
      const responseData = parseResponseDataFunc(response.data);

      setGetState({
        responseData: responseData,
        error: undefined,
      });
    } catch (err: unknown) {
      // done, set error
      setGetState({
        responseData: undefined,
        error: await parseAxiosError(err),
      });
    }
  }, [
    apiNode,
    axiosInstance,
    emptyUnloadedState,
    parseResponseDataFunc,
    showDebugInfo,
  ]);

  // do initial load immediately
  useEffect(() => {
    updateGet();
  }, [updateGet]);

  return { getState, updateGet };
};

export default useAxiosGet;
