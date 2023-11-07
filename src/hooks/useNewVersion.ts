import { type newVersionContextType } from '../context/NewVersionProvider';

import { useContext } from 'react';

import { NewVersionContext } from '../context/NewVersionProvider';

const useNewVersion = (): newVersionContextType => {
  return useContext(NewVersionContext);
};

export default useNewVersion;
