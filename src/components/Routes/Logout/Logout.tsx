import { type FC } from 'react';
import {
  type logoutResponseType,
  parseLogoutResponseType,
} from '../../../types/api';

import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import useAuth from '../../../hooks/useAuth';
import useAxiosSend from '../../../hooks/useAxiosSend';

import { Paper } from '@mui/material';

import TitleBar from '../../UI/TitleBar/TitleBar';
import ApiLoading from '../../UI/Api/ApiLoading';

// backend API path
const LOGOUT_URL = '/v1/app/auth/logout';

const Logout: FC = () => {
  const { setAuth } = useAuth();
  const { axiosSendState, apiCall } = useAxiosSend();

  const navigate = useNavigate();

  useEffect(() => {
    apiCall<logoutResponseType>(
      'POST',
      LOGOUT_URL,
      {},
      parseLogoutResponseType
    ).then(({ responseData: _r, error: _e }) => {
      // regardless of result, clear auth state and redirect
      setAuth(undefined);
      navigate('/');
    });
  }, [apiCall, navigate, setAuth]);

  return (
    <Paper
      sx={{
        width: 1,
        p: 2,
      }}
    >
      <TitleBar title='Logging Out...' />

      {axiosSendState.isSending && <ApiLoading />}
    </Paper>
  );
};

export default Logout;
