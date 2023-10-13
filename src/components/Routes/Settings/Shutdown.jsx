import { useNavigate } from 'react-router';
import { Typography } from '@mui/material';

import useAuthExpires from '../../../hooks/useAuthExpires';
import useAxiosSend from '../../../hooks/useAxiosSend';

import ApiError from '../../UI/Api/ApiError';
import Button from '../../UI/Button/Button';
import GridItemContainer from '../../UI/Grid/GridItemContainer';
import GridTitle from '../../UI/Grid/GridTitle';

const Shutdown = () => {
  // navigate for frontend logout
  const navigate = useNavigate();

  // auth expires for frontend logout
  const { setAuthExpires } = useAuthExpires();

  // for sending shutdown / restart commands
  const [apiSendState, sendData] = useAxiosSend();

  // logout frontend only (backend stop/restart forces backend logout)
  const logoutFrontend = () => {
    sessionStorage.removeItem('access_token');
    setAuthExpires();
    navigate('/');
  };

  // restart handler
  const restartClickHandler = (event) => {
    event.preventDefault();

    sendData(`/v1/app/control/restart`, 'POST', null, true).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        // if success, logout frontend
        logoutFrontend();
      }
    });
  };

  // shutdown handler
  const shutdownClickHandler = (event) => {
    event.preventDefault();

    sendData(`/v1/app/control/shutdown`, 'POST', null, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          // if success, logout frontend
          logoutFrontend();
        }
      }
    );
  };

  return (
    <GridItemContainer>
      <GridTitle title='Shutdown LeGo' />

      <Typography variant='p' sx={{ my: 2 }} display='block'>
        Programmatically stop and restart LeGo.
      </Typography>

      <Button
        onClick={restartClickHandler}
        variant='contained'
        type='restart'
        disabled={apiSendState.isSending}
      >
        Restart
      </Button>

      <Typography variant='p' sx={{ my: 2 }} display='block'>
        Programmatically stop LeGo. Depending on how you run LeGo, something
        else may restart it automatically.
      </Typography>

      <Button
        onClick={shutdownClickHandler}
        variant='contained'
        type='shutdown'
        disabled={apiSendState.isSending}
        sx={{ mb: 2 }}
      >
        Shutdown
      </Button>

      {apiSendState.errorMessage && (
        <ApiError
          code={apiSendState.errorCode}
          message={apiSendState.errorMessage}
        />
      )}
    </GridItemContainer>
  );
};

export default Shutdown;
