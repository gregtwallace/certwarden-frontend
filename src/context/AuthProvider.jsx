import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useState } from 'react';

// auth context for provider
const AuthContext = createContext();

// authStorage is the current auth from session storage
const authStorage = () => ({
  access_token: sessionStorage.getItem('auth_access_token'),
  access_token_claims: JSON.parse(
    sessionStorage.getItem('auth_access_token_claims')
  ),
  session_token_claims: JSON.parse(
    sessionStorage.getItem('auth_session_token_claims')
  ),
});

// accessToken returns the auth access_token
const accessToken = () => {
  const auth = authStorage();

  return auth?.access_token;
};

// setAuthStorage sets the auth in session storage
const setAuthStorage = (authResponse) => {
  // if missing any pieces, no auth
  if (
    authResponse?.access_token == null ||
    authResponse?.access_token === '' ||
    authResponse?.access_token_claims == null ||
    authResponse?.session_token_claims == null
  ) {
    sessionStorage.removeItem('auth_access_token');
    sessionStorage.removeItem('auth_access_token_claims');
    sessionStorage.removeItem('auth_session_token_claims');

    return;
  }

  // good to set
  sessionStorage.setItem('auth_access_token', authResponse.access_token);
  sessionStorage.setItem(
    'auth_access_token_claims',
    JSON.stringify(authResponse.access_token_claims)
  );
  sessionStorage.setItem(
    'auth_session_token_claims',
    JSON.stringify(authResponse.session_token_claims)
  );
};

// sessionValid returns true or false depending on information stored in
// authStorage and if the session exp has elapsed
const sessionValid = () => {
  const auth = authStorage();

  if (
    auth?.session_token_claims?.exp &&
    Number(auth.session_token_claims.exp) > Date.now() / 1000
  ) {
    return true;
  }

  return false;
};

// Global Auth. Keeps track of access token, access token claims and session
// claims, including expiration.
const AuthProvider = (props) => {
  // authenticated state for rendering
  const [isLoggedIn, setIsLoggedIn] = useState(sessionValid());

  // any time setAuth is called, it should set storage and isLoggedIn
  const setAuth = useCallback(
    (authResponse) => {
      setAuthStorage(authResponse);
      setIsLoggedIn(sessionValid());
    },
    [setIsLoggedIn]
  );

  // set a logout timer based on session expiration. if the timer executes, it will
  // logout the frontend.  this is not a substitute for proper backend idle out
  useEffect(() => {
    let logoutTimer;

    // on mount, start the timer
    if (isLoggedIn) {
      // get session expires time
      const auth = authStorage();
      const sessionExpires = auth.session_token_claims.exp;

      logoutTimer = setTimeout(() => {
        setAuth();
      }, sessionExpires * 1000 - Date.now());
    }

    // on dismount, clear timer
    return () => {
      clearTimeout(logoutTimer);
    };
  }, [isLoggedIn, setAuth]);

  return (
    <AuthContext.Provider value={{ accessToken, isLoggedIn, setAuth }}>
      {props.children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

// exports
export { AuthProvider };
export default AuthContext;
