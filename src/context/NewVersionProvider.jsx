import PropTypes from 'prop-types';
import { createContext, useState } from 'react';

const NewVersionContext = createContext();

// stores if new version is available and information related to an available
// new version
const NewVersionProvider = (props) => {
  const [newVersion, setNewVersion] = useState({
    isLoading: true,
  });

  return (
    <NewVersionContext.Provider value={{ newVersion, setNewVersion }}>
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
