import { type FC } from 'react';
import {
  type logoutResponseType,
  isLogoutResponseType,
} from '../../../types/api';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';
import useAxiosSend from '../../../hooks/useAxiosSend';

import { Paper } from '@mui/material';

import TitleBar from '../../UI/TitleBar/TitleBar';
import ApiLoading from '../../UI/Api/ApiLoading';

// backend API path
const LOGOUT_URL = '/v1/app/auth/logout';

const Logout: FC = () => {
  const { setAuth } = useAuth();
  const { sendState, doSendData } = useAxiosSend();

  const navigate = useNavigate();

  useEffect(() => {
    doSendData<logoutResponseType>(
      'POST',
      LOGOUT_URL,
      {},
      isLogoutResponseType
    ).then(({ responseData: _r, error: _e }) => {
      // regardless of result, clear auth state and redirect
      setAuth(undefined);
      navigate('/');
    });
  }, [doSendData, navigate, setAuth]);

  return (
    <Paper
      sx={{
        width: 1,
        p: 2,
      }}
    >
      <TitleBar title='Logging Out...' />

      {sendState.isSending && <ApiLoading />}
    </Paper>
  );
};

export default Logout;
