import { isAxiosError } from 'axios';
import { type frontendErrorType } from '../types/frontend';

import { useCallback, useState } from 'react';

import { redactJSONObject } from '../helpers/logging';
import { parseAxiosError } from '../helpers/axios';
import useClientSettings from './useClientSettings';
import useAxiosWithToken from './useAxiosWithToken';

// sending state
type axiosSendStateType = {
  isSending: boolean;
};

// func to do a json api call
type axiosApiCallType = <ExpectedResponseType>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  apiNode: string,
  payloadObj: object,
  isResponseDataValidFunc: (
    response: unknown
  ) => ExpectedResponseType
) => Promise<{
  responseData: ExpectedResponseType | undefined;
  error: frontendErrorType | undefined;
}>;

// func to do a file download
type axiosDownloadFileType = (
  apiNode: string
  // payloadObj: object
) => Promise<{
  error: frontendErrorType | undefined;
}>;

export type useAxiosSendReturnType = {
  axiosSendState: axiosSendStateType;
  apiCall: axiosApiCallType;
  downloadFile: axiosDownloadFileType;
};

// hook
const useAxiosSend = (): useAxiosSendReturnType => {
  // debug?
  const { showDebugInfo } = useClientSettings();

  // state
  const [axiosSendState, setAxiosSendState] = useState({
    isSending: false,
  } as axiosSendStateType);

  // axios instance
  const { axiosInstance } = useAxiosWithToken();

  // download file fetches a blob and then does some wizardy to make the client download it
  const downloadFile: axiosDownloadFileType = useCallback(
    async (apiNode) => {
      //payloadObj
      // set state to sending
      setAxiosSendState({
        isSending: true,
      });

      // debugging
      if (showDebugInfo) {
        console.log('Download:', apiNode); //redactJSONObject(payloadObj)
      }

      try {
        const response = await axiosInstance({
          method: 'GET',
          url: apiNode,
          // data: JSON.stringify(payloadObj),
          responseType: 'blob',
        });

        console.log(response);

        // if AxiosError, don't try to parse
        if (isAxiosError(response)) {
          throw response;
        }

        // error if data is not a blob
        if (!(response.data instanceof Blob)) {
          throw new Error('download is not a blob');
        }

        // do download --
        // create file link in browser's memory
        const href = window.URL.createObjectURL(response.data);

        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;

        // capture the filename from content-disposition
        const filenameRegex = /filename="(.*)"/;
        const contentHeaderVal: unknown =
          response.headers['content-disposition'];
        if (typeof contentHeaderVal === 'string') {
          const filenameMatches = filenameRegex.exec(contentHeaderVal);

          if (filenameMatches !== null && filenameMatches.length >= 2) {
            const filename = filenameMatches[1];
            if (filename) {
              link.setAttribute('download', filename);
            }
          }
        }

        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        // use setTimeout due to potential issue with Firefox
        setTimeout(function () {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(href);
        }, 100);
        // do download -- END

        // success, return
        setAxiosSendState({
          isSending: false,
        });

        return { error: undefined };
      } catch (err: unknown) {
        // done & return error
        setAxiosSendState({
          isSending: false,
        });

        return { error: await parseAxiosError(err) };
      }
    },
    [axiosInstance, showDebugInfo]
  );

  // Send data to the node using the specified method and a payload from the specified event
  // return true if success and no error, return false if something goes wrong
  const apiCall: axiosApiCallType = useCallback(
    async (method, apiNode, payloadObj, isResponseDataValidFunc) => {
      // set state to sending
      setAxiosSendState({
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
          } catch (_err) {
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

        // if AxiosError, don't try to parse
        if (isAxiosError(response)) {
          throw response;
        }

        // parse (narrows and throws err if not valid)
        if (!isResponseDataValidFunc(response.data)) {
          throw new Error('axios send failed, wrong data type returned');
        }

        // success, return
        setAxiosSendState({
          isSending: false,
        });

        return { responseData: response.data, error: undefined };
      } catch (err: unknown) {
        // done & return error
        setAxiosSendState({
          isSending: false,
        });

        return { responseData: undefined, error: await parseAxiosError(err) };
      }
    },
    [axiosInstance, showDebugInfo]
  );

  return { axiosSendState, apiCall, downloadFile };
};

export default useAxiosSend;
