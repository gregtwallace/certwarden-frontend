import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useAxiosSend from '../../../hooks/useAxiosSend';

import { Paper } from '@mui/material';
import TitleBar from '../../UI/TitleBar/TitleBar';
import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';

const Logout = () => {
  const { setAuth } = useAuth();
  const [sendState, sendData] = useAxiosSend();

  const navigate = useNavigate();

  useEffect(() => {
    sendData(`/v1/app/auth/logout`, 'POST', null, true).then(() => {
      // regardless of result, clear auth state and redirect
      setAuth();
      navigate('/');
    });
  }, [navigate, sendData, setAuth]);

  return (
    <Paper
      sx={{
        width: 1,
        p: 2,
      }}
    >
      <TitleBar title='Logging Out...' />

      {sendState.isSending && <ApiLoading />}

      {sendState.errorMessage && (
        <ApiError code={sendState.errorCode} message={sendState.errorMessage} />
      )}
    </Paper>
  );
};

export default Logout;
