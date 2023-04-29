import { useEffect, useState, useCallback } from 'react';

import { devMode } from '../helpers/environment';
import { parseAxiosError } from '../helpers/axios-error';
import axios from '../api/axios';
import useAxiosPrivate from './useAxiosPrivate';

// Hook to query the API and return a state based on the query
const useAxiosGet = (apiNode, expectedJsonName, withCredentials = false) => {
  const axiosPrivate = useAxiosPrivate();

  // select instance based on if route is secured
  var axiosInstance;
  if (withCredentials) {
    axiosInstance = axiosPrivate;
  } else {
    axiosInstance = axios;
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
      if (devMode) {
        console.log(response);
      }

      setState({
        [expectedJsonName]: response?.data[expectedJsonName],
        isLoaded: true,
        errorCode: null,
        errorMessage: null,
      });
    } catch (err) {
      // use common axios error parser
      const [errCode, errMessage] = await parseAxiosError(err, devMode);

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
