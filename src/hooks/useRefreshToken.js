import axios from 'axios';

import { axiosConfig } from '../api/axios'
import useAuth from './useAuth';

const REFRESH_NODE = 'v1/auth/refresh';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      // NOT using an existing axios instance, as could create infinite loop on
      // accident depending on what is calling refresh()
      const response = await axios({
        ...axiosConfig,
        method: 'POST',
        url: REFRESH_NODE,
        withCredentials: true
      });

      // error if no access_token
      if (response?.data?.response?.access_token == null) {
        throw new Error(
          `Status: ${response.status}, Message: ${response?.error?.message}`
        );
      }

      setAuth((prevState) => {
        return {
          ...prevState,
          accessToken: response.data.response.access_token,
        };
      });

      return response.data.response.access_token;
      
    } catch (error) {
      setAuth({});
      return error;

    }
  };

  return refresh;
};

export default useRefreshToken;
