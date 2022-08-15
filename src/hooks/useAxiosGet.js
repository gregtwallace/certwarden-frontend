import { useEffect, useState, useCallback } from 'react';

import axios from '../api/axios';
import useAxiosPrivate from './useAxiosPrivate';

// Hook to query the API and return a state based on the query
const useAxiosGet = (apiNode, expectedJsonName, secureRoute = false) => {
  const axiosPrivate = useAxiosPrivate();

  // select instance based on if route is secured
  var axiosInstance;
  if (secureRoute) {
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

      // debugging
      console.log(response?.data);

      setState({
        [expectedJsonName]: response?.data[expectedJsonName],
        isLoaded: true,
        errorMessage: null,
      });
    } catch (error) {
      // if received a response error, set that in error state
      // otherwise use Axios' error
      // check for response errors
      let errorMessage;
      if (error?.response?.data?.error != null) {
        errorMessage = `Status: ${error?.response?.status}, Message: ${error?.response?.data?.error?.message}`;
      } else {
        errorMessage = error.toString();
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
