import { useEffect, useState, useCallback } from 'react';

import { devMode } from '../helpers/environment';
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
    errorMessage: null,
  });

  const updateGet = useCallback(async () => {
    setState({
      [expectedJsonName]: {},
      isLoaded: false,
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
        errorMessage: null,
      });
    } catch (errorOutter) {
      // dev log error
      if (devMode) {
        console.log(errorOutter);
      }

      // set error to the error code
      let errorMessage = `Status: ${errorOutter.response.status}`;

      // try to append an error message, if present
      try {
        // if response data doesn't have an error text object (e.g. a blob), try to make it text
        if (!errorOutter.response.data.error) {
          let errorDataText = await errorOutter.response.data.text();
          let jsonError = JSON.parse(errorDataText);

          // update the data with the new json data
          errorOutter.response.data = jsonError;
        }

        errorMessage =
          errorMessage +
          `, Message: ${errorOutter.response.data.error.message}`;
      } catch (errorInner) {
        // log inner error if in devmode
        if (devMode) {
          console.log(errorInner);
        }
      }

      setState({
        [expectedJsonName]: {},
        isLoaded: true,
        errorMessage: errorMessage,
      });
    }
  }, [axiosInstance, apiNode, expectedJsonName]);

  useEffect(() => {
    updateGet();
  }, [updateGet]);

  return [state, updateGet];
};

export default useAxiosGet;
