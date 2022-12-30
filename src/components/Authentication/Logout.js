import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Paper } from '@mui/material';

import useAuthExpires from '../../hooks/useAuthExpires';
import useAxiosSend from '../../hooks/useAxiosSend';

import TitleBar from '../UI/TitleBar/TitleBar';
import ApiError from '../UI/Api/ApiError';

const Logout = () => {
  const { setAuthExpires } = useAuthExpires();
  const [, sendData] = useAxiosSend();

  const [logoutFailed, setLogoutFailed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    sendData(`/v1/auth/logout`, 'POST', null, true).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        // update auth
        sessionStorage.removeItem('access_token');
        setAuthExpires();
        navigate('/');
      } else {
        setLogoutFailed(true);
      }
    });
  }, []);

  return (
    <Paper
      sx={{
        width: 1,
        p: 2,
      }}
    >
      <TitleBar title='Logout' />

      {logoutFailed && <ApiError>Logout API call failed.</ApiError>}
    </Paper>
  );
};

export default Logout;
