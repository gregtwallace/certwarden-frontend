import { type FC, type MouseEvent, type ReactNode } from 'react';
import {
  type newVersionType,
  type newVersionResponseType,
  parseNewVersionResponseType,
} from '../types/api';
import { type frontendErrorType } from '../types/frontend';

import { createContext, useEffect, useState } from 'react';

import useAxiosGet from '../hooks/useAxiosGet';
import useAxiosSend from '../hooks/useAxiosSend';

const NEW_VERSION_URL = '/v1/app/updater/new-version';

// context type
export type newVersionContextType = {
  newVersion: newVersionType | undefined;
  checkNewVersion: (event: MouseEvent) => void;
  error: frontendErrorType | undefined;
};

const NewVersionContext = createContext<newVersionContextType>({
  newVersion: undefined,
  checkNewVersion: (_event: MouseEvent) => {},
  error: undefined,
});

type newVersionState = {
  newVersion: newVersionType | undefined;
  error: frontendErrorType | undefined;
};

type propTypes = {
  children: ReactNode;
};

// stores if new version is available and information related to an available
// new version
const NewVersionProvider: FC<propTypes> = (props) => {
  // sender for new version check
  const { apiCall } = useAxiosSend();

  // get new-version information
  const { getState } = useAxiosGet<newVersionResponseType>(
    `/v1/app/updater/new-version`,
    parseNewVersionResponseType
  );

  // new version has its own state that can be updated when command to have
  // backend check for a new version is sent
  const [newVersionState, setNewVersionState] = useState<newVersionState>({
    newVersion: undefined,
    error: undefined,
  });

  // user clicks button to check for update
  const checkNewVersion = (event: MouseEvent): void => {
    event.preventDefault();

    // set loading
    setNewVersionState({
      newVersion: undefined,
      error: undefined,
    });

    apiCall<newVersionResponseType>(
      'POST',
      NEW_VERSION_URL,
      {},
      parseNewVersionResponseType
    ).then(({ responseData, error }) => {
      // set state on success
      if (responseData) {
        setNewVersionState({
          newVersion: responseData.new_version,
          error: undefined,
        });
      } else {
        // set error on fail
        setNewVersionState({
          newVersion: undefined,
          error: error,
        });
      }
    });
  };

  // initial load set state
  useEffect(() => {
    setNewVersionState({
      newVersion: getState.responseData?.new_version,
      error: getState.error,
    });
  }, [getState, setNewVersionState]);

  return (
    <NewVersionContext.Provider
      value={{
        newVersion: newVersionState.newVersion,
        checkNewVersion: checkNewVersion,
        error: newVersionState.error,
      }}
    >
      {props.children}
    </NewVersionContext.Provider>
  );
};

// export
export { NewVersionContext, NewVersionProvider };
