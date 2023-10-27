import axios from 'axios';
import { axiosConfig } from '../api/axios';
import { showDebugInfo } from '../helpers/environment';
import useAuth from './useAuth';

const REFRESH_NODE = '/v1/app/auth/refresh';

const useRefreshAccessToken = () => {
  const { setAuth } = useAuth();

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

      // good, set auth
      setAuth(response.data.response);
      // debug log
      if (showDebugInfo) {
        console.log('access token successfully refreshed');
      }

      //
      //
    } catch (_) {
      // any error - set empty auth
      setAuth();
      // debug log
      if (showDebugInfo) {
        console.log('access token failed to refresh');
      }
    }
  };

  return refreshAccessToken;
};

export default useRefreshAccessToken;
