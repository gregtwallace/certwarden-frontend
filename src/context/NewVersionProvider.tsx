import { type FC, type ReactNode } from 'react';
import {
  type newVersionType,
  type newVersionResponseType,
  isNewVersionResponseType,
} from '../types/api';

import { createContext } from 'react';

import useAxiosGet from '../hooks/useAxiosGet';

// context type
export type newVersionContextType = {
  newVersion: newVersionType | undefined;
};

const NewVersionContext = createContext<newVersionContextType>({
  newVersion: undefined,
});

type propTypes = {
  children: ReactNode;
};

// stores if new version is available and information related to an available
// new version
const NewVersionProvider: FC<propTypes> = (props) => {
  // get new-version information
  const { getState } = useAxiosGet<newVersionResponseType>(
    `/v1/app/updater/new-version`,
    isNewVersionResponseType
  );

  // todo: instead of doing update get, when reload is called, post to backend to fetch
  // new version and then use the response from that as the new verion
  // const { sendState, doSendData } = useAxiosSend();

  return (
    <NewVersionContext.Provider
      value={{ newVersion: getState.responseData?.new_version }}
    >
      {props.children}
    </NewVersionContext.Provider>
  );
};

// export
export { NewVersionContext, NewVersionProvider };
