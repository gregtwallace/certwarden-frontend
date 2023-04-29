import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Paper } from '@mui/material';

import useAuthExpires from '../../hooks/useAuthExpires';
import useAxiosSend from '../../hooks/useAxiosSend';

import TitleBar from '../UI/TitleBar/TitleBar';
import ApiError from '../UI/Api/ApiError';
import ApiLoading from '../UI/Api/ApiLoading';

const Logout = () => {
  const { setAuthExpires } = useAuthExpires();
  const [sendState, sendData] = useAxiosSend();

  const navigate = useNavigate();

  useEffect(() => {
    sendData(`/v1/auth/logout`, 'POST', null, true).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        // if success, clear login and go to root
        sessionStorage.removeItem('access_token');
        setAuthExpires();
        navigate('/');
      }
    });
  }, [navigate, sendData, setAuthExpires]);

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
