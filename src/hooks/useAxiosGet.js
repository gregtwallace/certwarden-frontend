import { useEffect, useState, useCallback } from 'react';
import { redactJSONObject } from '../helpers/logging';

import { showDebugInfo } from '../helpers/environment';
import { parseAxiosError } from '../helpers/axios-error';
import { axiosNoToken } from '../api/axios';
import useAxiosWithToken from './useAxiosWithToken';

// Hook to query the API and return a state based on the query
const useAxiosGet = (apiNode, expectedJsonName, withAccessToken = false) => {
  const axiosWithToken = useAxiosWithToken();

  // select instance based on if route is secured
  var axiosInstance;
  if (withAccessToken) {
    axiosInstance = axiosWithToken;
  } else {
    axiosInstance = axiosNoToken;
  }

  const [state, setState] = useState({
    [expectedJsonName]: {},
    isLoaded: false,
    errorCode: null,
    errorMessage: null,
  });

  const updateGet = useCallback(async () => {
    setState({
      [expectedJsonName]: {},
      isLoaded: false,
      errorCode: null,
      errorMessage: null,
    });

    try {
      let response = await axiosInstance({
        method: 'GET',
        url: apiNode,
      });

      // dev log response
      if (showDebugInfo) {
        console.log(redactJSONObject(response));
      }

      setState({
        [expectedJsonName]: response?.data[expectedJsonName],
        isLoaded: true,
        errorCode: null,
        errorMessage: null,
      });
    } catch (err) {
      // use common axios error parser
      const [errCode, errMessage] = await parseAxiosError(err, showDebugInfo);

      setState({
        [expectedJsonName]: {},
        isLoaded: true,
        errorCode: errCode,
        errorMessage: errMessage,
      });
    }
  }, [axiosInstance, apiNode, expectedJsonName]);

  useEffect(() => {
    updateGet();
  }, [updateGet]);

  return [state, updateGet];
};

export default useAxiosGet;
