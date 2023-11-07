import { useContext } from 'react';

import AuthContext from '../context/AuthProvider.tsx';

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
