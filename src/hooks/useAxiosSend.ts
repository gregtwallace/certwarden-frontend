import { type frontendErrorType } from '../types/frontend';

import { useCallback, useState } from 'react';

import { redactJSONObject } from '../helpers/logging';
import { showDebugInfo } from '../helpers/environment';
import { parseAxiosError } from '../helpers/axios';
import useAxiosWithToken from './useAxiosWithToken';

// sending state
type axiosSendStateType = {
  isSending: boolean;
};

// func to actually send data
type axiosDoSendDataType = <ExpectedResponseType>(
  method: 'POST' | 'PUT' | 'DELETE', // 'GET' |
  apiNode: string,
  payloadObj: object,
  isResponseDataValidFunc: (
    response: unknown
  ) => response is ExpectedResponseType
) => Promise<{
  responseData: ExpectedResponseType | undefined;
  error: frontendErrorType | undefined;
}>;

// hook
const useAxiosSend = (): {
  sendState: axiosSendStateType;
  doSendData: axiosDoSendDataType;
} => {
  // send state
  const [sendState, setSendState] = useState(<axiosSendStateType>{
    isSending: false,
    error: undefined,
  });

  // axios instance
  const { axiosInstance } = useAxiosWithToken();

  // Send data to the node using the specified method and a payload from the specified event
  // return true if success and no error, return false if something goes wrong
  const doSendData: axiosDoSendDataType = useCallback(
    async (method, apiNode, payloadObj, isResponseDataValidFunc) => {
      // set state to sending
      setSendState({
        isSending: true,
      });

      // debugging
      if (showDebugInfo) {
        console.log(method, ':', apiNode, redactJSONObject(payloadObj));
      }

      try {
        const response = await axiosInstance({
          method: method,
          url: apiNode,
          data: JSON.stringify(payloadObj),
        });

        // dev log response
        if (showDebugInfo) {
          // try to turn config payload into an actual object
          try {
            if (response.config) {
              response.config.data = JSON.parse(response.config.data);
            }
          } catch {
            // ignore failed, leave as-is
          }

          console.log(
            method,
            ':',
            apiNode,
            'reply:',
            redactJSONObject(response)
          );
        }

        // validate response
        if (!isResponseDataValidFunc(response.data)) {
          throw response;
        }

        // success, return
        setSendState({
          isSending: false,
        });

        return { responseData: response.data, error: undefined };
      } catch (err: unknown) {
        // done & return error
        setSendState({
          isSending: false,
        });

        return { responseData: undefined, error: parseAxiosError(err) };
      }
    },
    [axiosInstance]
  );

  return { sendState, doSendData };
};

export default useAxiosSend;
