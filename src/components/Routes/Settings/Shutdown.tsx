import { type FC, type MouseEventHandler } from 'react';
import { type frontendErrorType } from '../../../types/frontend';
import {
  type shutdownResponseType,
  type restartResponseType,
  isShutdownResponse,
  isRestartResponse,
} from '../../../types/api';

import { useState } from 'react';
import { useNavigate } from 'react-router';

import useAuth from '../../../hooks/useAuth';
import useAxiosSend from '../../../hooks/useAxiosSend';

import ApiError from '../../UI/Api/ApiError';
import Button from '../../UI/Button/Button';
import GridItemContainer from '../../UI/Grid/GridItemContainer';
import GridItemText from '../../UI/Grid/GridItemText';
import GridTitle from '../../UI/Grid/GridTitle';

const SHUTDOWN_URL = '/v1/app/control/shutdown';
const RESTART_URL = '/v1/app/control/restart';

const Shutdown: FC = () => {
  // navigate for frontend logout
  const navigate = useNavigate();

  // auth expires for frontend logout after shutdown/restart
  const { setAuth } = useAuth();

  // for sending shutdown / restart commands
  const { sendState, doSendData } = useAxiosSend();

  // state to hold errors
  const [sendError, setSendError] = useState<frontendErrorType | undefined>(
    undefined
  );

  // logout (frontend only - backend shutdown/restart forces backend logout)
  const logoutFrontend = (): void => {
    setAuth(undefined);
    navigate('/');
  };

  // shutdown handler
  const shutdownClickHandler: MouseEventHandler = (event): void => {
    event.preventDefault();

    doSendData<shutdownResponseType>(
      'POST',
      SHUTDOWN_URL,
      {},
      isShutdownResponse
    ).then(({ responseData, error }) => {
      if (responseData) {
        // if success, logout frontend
        logoutFrontend();
      } else {
        // else set error
        setSendError(error);
      }
    });
  };

  // restart handler
  const restartClickHandler: MouseEventHandler = (event): void => {
    event.preventDefault();

    doSendData<restartResponseType>(
      'POST',
      RESTART_URL,
      {},
      isRestartResponse
    ).then(({ responseData, error }) => {
      if (responseData) {
        // if success, logout frontend
        logoutFrontend();
      } else {
        // else set error
        setSendError(error);
      }
    });
  };

  return (
    <GridItemContainer>
      <GridTitle title='Shutdown LeGo' />

      <GridItemText>Programmatically stop and restart LeGo.</GridItemText>

      <Button
        color='warning'
        onClick={restartClickHandler}
        disabled={sendState.isSending}
        sx={{ mt: 1, mb: 2 }}
      >
        Restart
      </Button>

      <GridItemText>
        Programmatically stop LeGo. Depending on how you run LeGo, something
        else may restart it automatically.
      </GridItemText>

      <Button
        color='error'
        onClick={shutdownClickHandler}
        disabled={sendState.isSending}
        sx={{ mt: 1, mb: 2 }}
      >
        Shutdown
      </Button>

      {sendError && (
        <ApiError
          statusCode={sendError.statusCode}
          message={sendError.message}
        />
      )}
    </GridItemContainer>
  );
};

export default Shutdown;
