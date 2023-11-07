import { useEffect, useState, useCallback, useMemo } from 'react';

import useAxiosWithToken from './useAxiosWithToken';
import { redactJSONObject } from '../helpers/logging';
import { showDebugInfo } from '../helpers/environment';
import { parseAxiosError } from '../helpers/axios';

// get state
type axiosGetStateType<ExpectedResponseType> = {
  responseData: ExpectedResponseType | undefined;
  error:
    | {
        code: number | string;
        message: string;
      }
    | undefined;
};

// func to refresh get data (send get again)
type axiosDoUpdateGetType = () => Promise<void>;

// Hook to query the API and return a state based on the query
const useAxiosGet = <ExpectedResponseType>(
  apiNode: string,
  isResponseDataValidFunc: (
    response: unknown
  ) => response is ExpectedResponseType
): {
  getState: axiosGetStateType<ExpectedResponseType>;
  updateGet: axiosDoUpdateGetType;
} => {
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

      // validate response
      if (!isResponseDataValidFunc(response.data)) {
        throw response;
      }

      setGetState({
        responseData: response.data,
        error: undefined,
      });
    } catch (err: unknown) {
      // done, set error
      const { errorCode, errorMessage } = parseAxiosError(err);

      setGetState({
        responseData: undefined,
        error: {
          code: errorCode,
          message: errorMessage,
        },
      });
    }
  }, [apiNode, axiosInstance, emptyUnloadedState, isResponseDataValidFunc]);

  // do initial load immediately
  useEffect(() => {
    updateGet();
  }, [updateGet]);

  return { getState, updateGet };
};

export default useAxiosGet;
