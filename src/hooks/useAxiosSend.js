import { useCallback, useState } from 'react';
import { redactJSONObject } from '../helpers/logging';

import { showDebugInfo } from '../helpers/environment';
import { parseAxiosError } from '../helpers/axios-error';
import { axiosNoToken } from '../api/axios';
import useAxiosWithToken from './useAxiosWithToken';

const useAxiosSend = () => {
  const [state, setState] = useState({
    isSending: false,
    errorCode: null,
    errorMessage: null,
  });

  const axiosWithToken = useAxiosWithToken();

  // Send data to the node using the specified method and a payload from the specified event
  // return true if success and no error, return false if something goes wrong
  const sendData = useCallback(
    async (
      apiNode,
      method,
      payloadObj,
      withAccessToken = false,
      responseType = 'json'
    ) => {
      // select instance based on if route is secured
      var axiosInstance;
      if (withAccessToken) {
        axiosInstance = axiosWithToken;
      } else {
        axiosInstance = axiosNoToken;
      }

      // set state to sending
      setState({
        isSending: true,
        errorCode: null,
        errorMessage: null,
      });

      // debugging
      if (showDebugInfo) {
        console.log(redactJSONObject(payloadObj));
      }

      try {
        let response = await axiosInstance({
          method: method,
          url: apiNode,
          data: JSON.stringify(payloadObj),
          responseType: responseType,
        });

        // dev log response
        if (showDebugInfo) {
          console.log(redactJSONObject(response));
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
        const [errCode, errMessage] = await parseAxiosError(err, showDebugInfo);

        // done, set error
        setState({
          isSending: false,
          errorCode: errCode,
          errorMessage: errMessage,
        });
        return false;
      }
    },
    [axiosWithToken, setState]
  );

  return [state, sendData];
};

export default useAxiosSend;
