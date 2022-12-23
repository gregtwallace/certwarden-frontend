import { useContext } from 'react';

import AuthExpiresContext from '../context/AuthExpiresProvider';

const useAuthExpires = () => {
  return useContext(AuthExpiresContext);
};

export default useAuthExpires;
