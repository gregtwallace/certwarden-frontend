import { useState } from 'react';

import { devMode } from '../helpers/environment';
import axios from '../api/axios';
import useAxiosPrivate from './useAxiosPrivate';

const useAxiosSend = () => {
  const [state, setState] = useState({
    isSending: false,
    errorMessage: null,
  });

  const axiosPrivate = useAxiosPrivate();

  // Send data to the node using the specified method and a payload from the specified event
  // return true if success and no error, return false if something goes wrong
  const sendData = async (
    apiNode,
    method,
    payloadObj,
    withCredentials = false,
    responseType = 'json'
  ) => {
    // select instance based on if route is secured
    var axiosInstance;
    if (withCredentials) {
      axiosInstance = axiosPrivate;
    } else {
      axiosInstance = axios;
    }

    // set state to sending
    setState({
      isSending: true,
      errorMessage: null,
    });

    // debugging
    if (devMode) {
      console.log(payloadObj);
    }

    try {
      let response = await axiosInstance({
        method: method,
        url: apiNode,
        data: JSON.stringify(payloadObj),
        responseType: responseType,
      });

      // dev log response
      if (devMode) {
        console.log(response);
      }

      // done sending, success
      setState({
        isSending: false,
        errorMessage: null,
      });
      return response;
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

      // done sending, error
      setState({
        isSending: false,
        errorMessage: errorMessage,
      });
      return false;
    }
  };

  return [state, sendData];
};

export default useAxiosSend;
