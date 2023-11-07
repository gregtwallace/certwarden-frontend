import { type FC } from 'react';
import {
  type basicResponseType,
  isBasicResponseType,
} from '../../../types/api';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useAxiosSend from '../../../hooks/useAxiosSend';

import { Paper } from '@mui/material';
import TitleBar from '../../UI/TitleBar/TitleBar';
import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';

// backend API path
const LOGOUT_URL = '/v1/app/auth/logout';

const Logout: FC = () => {
  const { setAuth } = useAuth();
  const { sendState, doSendData } = useAxiosSend();

  const navigate = useNavigate();

  useEffect(() => {
    doSendData<basicResponseType>(
      'POST',
      LOGOUT_URL,
      {},
      isBasicResponseType
    ).then(() => {
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

      {sendState.error && (
        <ApiError
          statusCode={sendState.error.statusCode}
          message={sendState.error.message}
        />
      )}
    </Paper>
  );
};

export default Logout;
