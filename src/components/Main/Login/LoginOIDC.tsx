import { useEffect, type FC } from 'react';
import {
  type authorizationResponseType,
  parseAuthorizationResponseType,
} from '../../../types/api';

import { useSearchParams } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';
import useAxiosSend from '../../../hooks/useAxiosSend';
import { apiUrl } from '../../../helpers/environment';

import Container from '@mui/material/Container';
import { Box, Toolbar } from '@mui/material';

import ButtonAsLink from '../../UI/Button/ButtonAsLink';
import OidcError from '../../UI/Api/OidcError';

// backend API path
const LOGIN_URL = '/v1/app/auth/login';

// ensure final login only sent once (needed for dev due to StrictMode)
let isFinalLoggingIn = false;

// component
const LoginOIDC: FC = () => {
  const { apiCall } = useAxiosSend();
  const { setAuth } = useAuth();

  // parse query
  const [searchParams, setSearchParams] = useSearchParams();
  const qState = searchParams.get('state');
  const qCode = searchParams.get('code');
  const qOIDCError = searchParams.get('oidc_error');

  // if there is a state in the query, try to finalize oidc login
  useEffect(() => {
    if ((qState !== null || qCode !== null) && !isFinalLoggingIn) {
      isFinalLoggingIn = true;

      // if state or code exist, nuke them
      searchParams.delete('state');
      searchParams.delete('code');
      setSearchParams(searchParams);

      // only run the oidc finalize login if there was an actual state / code pair
      if (qState !== null && qState !== '' && qCode !== null && qCode !== '') {
        apiCall<authorizationResponseType>(
          'GET',
          LOGIN_URL + '?state=' + qState + '&code=' + qCode,
          {},
          parseAuthorizationResponseType
        ).then(({ responseData }) => {
          // set auth if success
          if (responseData) {
            setAuth(responseData.authorization);
          } else {
            console.log('oidc login failed: state and/or code param invalid');
          }
        });
      }
    }
  }, [
    apiCall,
    qState,
    qCode,
    qOIDCError,
    searchParams,
    setSearchParams,
    setAuth,
  ]);

  return (
    <Container disableGutters>
      <Toolbar variant='dense' disableGutters sx={{ mt: 2 }}>
        <Box sx={{ flexGrow: 1 }}></Box>

        <ButtonAsLink
          color='secondary'
          to={
            apiUrl +
            LOGIN_URL +
            '?redirect_uri=' +
            encodeURIComponent(window.location.href)
          }
        >
          OIDC Login
        </ButtonAsLink>
      </Toolbar>

      {qOIDCError && (
        <OidcError
          message={decodeURIComponent(qOIDCError.replace(/\+/g, ' '))}
        />
      )}
    </Container>
  );
};

export default LoginOIDC;
