import axios from 'axios';

import { axiosConfig } from '../api/axios';
import useAuthExpires from './useAuthExpires';

const REFRESH_NODE = '/v1/app/auth/refresh';

const useRefreshToken = () => {
  const { setAuthExpires } = useAuthExpires();

  const refresh = async () => {
    try {
      // NOT using an existing axios instance, as could create infinite loop on
      // accident depending on what is calling refresh()
      const response = await axios({
        ...axiosConfig,
        method: 'POST',
        url: REFRESH_NODE,
      });

      // error if no access_token or blank
      if (
        response?.data?.response?.access_token == null ||
        response?.data?.response?.access_token === ''
      ) {
        throw new Error(
          `Status: ${response.status}, Message: ${response?.error?.message}`
        );
      }

      sessionStorage.setItem(
        'access_token',
        response.data.response.access_token
      );
      sessionStorage.setItem(
        'access_token_expiration',
        response.data.response.access_token_claims.exp
      );
      setAuthExpires(response.data.response.session_claims.exp);

      return response.data.response.access_token;
    } catch (error) {
      setAuthExpires();
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token_expiration');

      return error;
    }
  };

  return refresh;
};

export default useRefreshToken;
