import { type FC } from 'react';
import {
  type authStatusResponseType,
  parseAuthStatusResponseType,
} from '../../../types/api';

import useAxiosGet from '../../../hooks/useAxiosGet';

import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Paper from '@mui/material/Paper';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import LoginLocal from './LoginLocal';
import LoginOIDC from './LoginOIDC';

// backend API path
const AUTH_STATUS_URL = '/v1/app/auth/status';

// component
const Login: FC = () => {
  // get status to check for OIDC usage
  const { getState } = useAxiosGet<authStatusResponseType>(
    AUTH_STATUS_URL,
    parseAuthStatusResponseType
  );

  return (
    /* do not use standard form container since this form is special size*/
    <Container maxWidth='xs'>
      <Paper
        sx={{
          my: 6,
          px: 6,
          pt: 2,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'error.main', alignItems: 'center' }}>
          <LockOutlinedIcon />
        </Avatar>

        {!getState.responseData && !getState.error && <ApiLoading />}

        {getState.error && (
          <ApiError
            statusCode={getState.error.statusCode}
            message={getState.error.message}
          />
        )}

        {getState.responseData && (
          <>
            {getState.responseData.auth_status.local.enabled && <LoginLocal />}

            {getState.responseData.auth_status.local.enabled &&
              getState.responseData.auth_status.oidc.enabled && (
                <Divider flexItem sx={{ mt: 2 }}></Divider>
              )}

            {getState.responseData.auth_status.oidc.enabled && <LoginOIDC />}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Login;
