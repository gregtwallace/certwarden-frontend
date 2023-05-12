import { useContext } from 'react';

import NewVersionContext from '../context/NewVersionProvider';

const useNewVersion = () => {
  return useContext(NewVersionContext);
};

export default useNewVersion;
