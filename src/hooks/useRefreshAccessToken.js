import axios from 'axios';
import { axiosConfig } from '../api/axios';
import { showDebugInfo } from '../helpers/environment';
import useAuthExpires from './useAuthExpires';

const REFRESH_NODE = '/v1/app/auth/refresh';

const useRefreshAccessToken = () => {
  const { setAuthExpires } = useAuthExpires();

  // refreshAccessToken calls the refresh route and updates session
  // storage and auth state
  const refreshAccessToken = async () => {
    try {
      // NOT using an existing axios instance, as could create infinite loop
      const response = await axios({
        ...axiosConfig,
        method: 'POST',
        url: REFRESH_NODE,
      });

      // throw error if valid looking access token not present
      if (
        !response?.data?.response?.access_token || // technically not needed w/ try/catch
        response.data.response.access_token == null ||
        response.data.response.access_token === ''
      ) {
        throw new Error('failed to get valid access token during refresh');
      }

      // good token - set it
      sessionStorage.setItem(
        'access_token',
        response.data.response.access_token
      );
      sessionStorage.setItem(
        'access_token_expiration',
        response.data.response.access_token_claims.exp
      );
      setAuthExpires(response.data.response.session_claims.exp);
      // debug log
      if (showDebugInfo) {
        console.log('access token successfully refreshed');
      }

      //
      //
    } catch (_) {
      // any error - delete access token / auth
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token_expiration');
      setAuthExpires();
      // debug log
      if (showDebugInfo) {
        console.log('access token failed to refresh');
      }
    }
  };

  return refreshAccessToken;
};

export default useRefreshAccessToken;
