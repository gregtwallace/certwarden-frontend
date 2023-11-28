import { type FC, type ReactNode } from 'react';
import { type authorizationType } from '../types/api';

import { createContext, useCallback, useEffect, useState } from 'react';
import { parseAuthorizationType } from '../types/api';

// getAuth fetches the current auth from session storage
const getAuth = (): authorizationType | undefined => {
  let auth: authorizationType = {
    access_token: sessionStorage.getItem('auth_access_token') || '',
    access_token_claims: JSON.parse(
      sessionStorage.getItem('auth_access_token_claims') || '{}'
    ),
    session_token_claims: JSON.parse(
      sessionStorage.getItem('auth_session_token_claims') || '{}'
    ),
  };

  try {
    // parse auth for validity
    auth = parseAuthorizationType(auth);

    // check expiration
    if (auth.session_token_claims.exp < Date.now() / 1000) {
      throw new Error('session expired');
    }
  } catch (_err) {
    // not proper type or expired, delete storage & return undefined
    sessionStorage.removeItem('auth_access_token');
    sessionStorage.removeItem('auth_access_token_claims');
    sessionStorage.removeItem('auth_session_token_claims');

    return undefined;
  }

  // valid & not expired
  return auth;
};

// getAccessToken returns the auth's access_token if auth is defined
const getAccessToken = (): string => {
  const auth = getAuth();

  if (!auth) {
    return '';
  }

  return auth.access_token;
};

// setAuthStorage saves the newAuth in session storage or clears storage if
// undefined is set
const setAuthStorage = (newAuth: authorizationType | undefined): void => {
  if (!newAuth) {
    // undefined
    sessionStorage.removeItem('auth_access_token');
    sessionStorage.removeItem('auth_access_token_claims');
    sessionStorage.removeItem('auth_session_token_claims');

    return;
  }

  // is auth type
  sessionStorage.setItem('auth_access_token', newAuth.access_token);
  sessionStorage.setItem(
    'auth_access_token_claims',
    JSON.stringify(newAuth.access_token_claims)
  );
  sessionStorage.setItem(
    'auth_session_token_claims',
    JSON.stringify(newAuth.session_token_claims)
  );
};

// context type
export type authContextType = {
  isLoggedIn: boolean;
  getAccessToken: () => string;
  setAuth: (newAuth: authorizationType | undefined) => void;
};

// create context
const AuthContext = createContext<authContextType>({
  isLoggedIn: false,
  getAccessToken: () => '',
  setAuth: (_unused) => {},
});

// props type
type AuthProviderProps = {
  children: ReactNode;
};

// Global Auth. Keeps track of access token, access token claims and session
// claims, including expiration.
const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;

  // logged in state for rendering
  const [isLoggedIn, setIsLoggedIn] = useState(!!getAuth());

  // any time setAuth is called, it should save storage and update isLoggedIn
  const setAuth = useCallback(
    (auth: authorizationType | undefined) => {
      setAuthStorage(auth);
      setIsLoggedIn(!!getAuth());
    },
    [setIsLoggedIn]
  );

  // set a logout timer based on session expiration. if the timer executes, it will
  // logout the frontend.  this is not a substitute for proper backend idle out
  useEffect(() => {
    let logoutTimer: number;
    const auth = getAuth();

    // if valid session
    if (auth) {
      // get session expires time
      const sessionExpires = auth.session_token_claims.exp;

      // start timer on mount
      logoutTimer = setTimeout(() => {
        // on expire clear auth
        setAuth(undefined);
      }, sessionExpires * 1000 - Date.now());
    }

    // on dismount, clear timer
    return () => {
      clearTimeout(logoutTimer);
    };
  }, [isLoggedIn, setAuth]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, getAccessToken, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// export
export { AuthContext, AuthProvider };
