import { axiosPrivate } from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axiosPrivate({
      method: 'POST',
      url: `/v1/auth/refresh`,
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
