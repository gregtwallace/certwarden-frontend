import { createContext, useEffect, useState } from 'react';
import useAxiosGet from '../hooks/useAxiosGet';

import PropTypes from 'prop-types';

const NewVersionContext = createContext();

// stores if new version is available and information related to an available
// new version
const NewVersionProvider = (props) => {
  // global state
  const [newVersion, setNewVersion] = useState({
    isLoaded: false,
  });

  // get new-version information
  const [apiGetState, reloadNewVersion] = useAxiosGet(
    `/v1/app/updater/new-version`,
    'new_version',
    true
  );

  // once api get has loaded, update state
  useEffect(() => {
    setNewVersion(apiGetState);
  }, [apiGetState, setNewVersion]);

  return (
    <NewVersionContext.Provider value={{ newVersion, reloadNewVersion }}>
      {props.children}
    </NewVersionContext.Provider>
  );
};

NewVersionProvider.propTypes = {
  children: PropTypes.node,
};

// exports
export { NewVersionProvider };
export default NewVersionContext;
