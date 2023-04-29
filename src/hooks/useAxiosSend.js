import { useCallback, useState } from 'react';

import { devMode } from '../helpers/environment';
import { parseAxiosError } from '../helpers/axios-error';
import axios from '../api/axios';
import useAxiosPrivate from './useAxiosPrivate';

const useAxiosSend = () => {
  const [state, setState] = useState({
    isSending: false,
    errorCode: null,
    errorMessage: null,
  });

  const axiosPrivate = useAxiosPrivate();

  // Send data to the node using the specified method and a payload from the specified event
  // return true if success and no error, return false if something goes wrong
  const sendData = useCallback(
    async (
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
        errorCode: null,
        errorMessage: null,
      });

      // debugging
      if (devMode) {
        if (payloadObj === null) {
          console.log('send payload is null');
        } else {
          console.log(payloadObj);
        }
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
          errorCode: null,
          errorMessage: null,
        });
        return response;
      } catch (err) {
        // use common axios error parser
        const [errCode, errMessage] = await parseAxiosError(err, devMode);

        // done, set error
        setState({
          isSending: false,
          errorCode: errCode,
          errorMessage: errMessage,
        });
        return false;
      }
    },
    [axiosPrivate, setState]
  );

  return [state, sendData];
};

export default useAxiosSend;
