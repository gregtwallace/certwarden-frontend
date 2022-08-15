import { useState } from 'react';

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
  const sendData = async (apiNode, method, payloadObj, withCredentials = false) => {
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
    console.log(payloadObj);

    try {
      let response = await axiosInstance({
        method: method,
        url: apiNode,
        data: JSON.stringify(payloadObj),
      });

      // debugging
      console.log(response?.data);

      // done sending, success
      setState({
        isSending: false,
        errorMessage: null,
      });
      return response?.data?.response;

    } catch (error) {
      // debugging
      console.log(error);

      // if received a response error, set that in error state
      // otherwise use Axios' error
      // check for response errors
      let errorMessage;
      if (error?.response?.data?.error != null) {
        errorMessage = `Status: ${error?.response?.status}, Message: ${error?.response?.data?.error?.message}`;
      } else {
        errorMessage = error.toString();
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
