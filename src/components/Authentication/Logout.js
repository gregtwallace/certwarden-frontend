import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Paper } from '@mui/material';

import useAuth from '../../hooks/useAuth';
import useAxiosSend from '../../hooks/useAxiosSend';

import TitleBar from '../UI/Header/TitleBar';
import ApiError from '../UI/Api/ApiError';

const Logout = () => {
  const { setAuth } = useAuth();
  const [, sendData] = useAxiosSend();

  const [logoutFailed, setLogoutFailed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    sendData(`/v1/auth/logout`, 'POST', null, true).then((success) => {
      console.log(success);
      if (success) {
        // update auth state
        setAuth({});
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

      {logoutFailed && <ApiError>Logout failed.</ApiError>}
    </Paper>
  );
};

export default Logout;
