import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios({
      method: 'POST',
      url: `/v1/auth/refresh`,
      withCredentials: true,
    });

    var accessToken = response.data.response.access_token;

    setAuth((prevState) => {
      return {
        ...prevState,
        accessToken: accessToken,
      };
    });
    return accessToken;
  };

  return refresh;
};

export default useRefreshToken;
