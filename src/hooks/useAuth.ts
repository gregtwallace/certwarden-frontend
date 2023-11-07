import { type authContextType } from '../context/AuthProvider';

import { useContext } from 'react';

import { AuthContext } from '../context/AuthProvider';

const useAuth = (): authContextType => {
  return useContext(AuthContext);
};

export default useAuth;
