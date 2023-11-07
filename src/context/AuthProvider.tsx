import { type FC, type ReactNode } from 'react';
import { type authResponseType } from '../helpers/api-types';
import { isAuthResponse } from '../helpers/api-types';

import { createContext, useCallback, useEffect, useState } from 'react';

// storageAuth is the current auth from session storage
const storageAuth = (): authResponseType | null => {
  const storageAuth = {
    access_token: sessionStorage.getItem('auth_access_token') || '',
    access_token_claims: JSON.parse(
      sessionStorage.getItem('auth_access_token_claims') || '{}'
    ),
    session_token_claims: JSON.parse(
      sessionStorage.getItem('auth_session_token_claims') || '{}'
    ),
  };

  // return if valid
  if (isAuthResponse(storageAuth)) {
    return storageAuth;
  }

  // else null
  return null;
};

// accessToken returns the auth's access_token if auth is not null
const accessToken = (): string => {
  const auth = storageAuth();

  if (auth === null) {
    return '';
  }

  return auth.access_token;
};

// setStorageAuth sets the newAuth in session storage if it is valid,
// else auth storage is removed
const setStorageAuth = (newAuth: authResponseType | null) => {
  if (isAuthResponse(newAuth)) {
    // if response object, set storage
    sessionStorage.setItem('auth_access_token', newAuth.access_token);
    sessionStorage.setItem(
      'auth_access_token_claims',
      JSON.stringify(newAuth.access_token_claims)
    );
    sessionStorage.setItem(
      'auth_session_token_claims',
      JSON.stringify(newAuth.session_token_claims)
    );
  } else {
    // otherwise, clear auth
    sessionStorage.removeItem('auth_access_token');
    sessionStorage.removeItem('auth_access_token_claims');
    sessionStorage.removeItem('auth_session_token_claims');
  }
};

// context type
type AuthContextType = {
  accessToken: () => string;
  isLoggedIn: boolean;
  setAuth: (newAuth: any) => void;
};

// create context
const AuthContext = createContext<AuthContextType>({
  accessToken: () => '',
  isLoggedIn: false,
  setAuth: (_: any) => {},
});

// authSessionValid returns true or false depending the current storageAuth's validity
const authSessionValid = () => {
  const auth = storageAuth();

  // invalid if null or expired
  if (auth === null || auth.session_token_claims.exp < Date.now() / 1000) {
    return false;
  }

  return true;
};

// props type
type AuthProviderProps = {
  children: ReactNode;
};

// Global Auth. Keeps track of access token, access token claims and session
// claims, including expiration.
const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  // logged in state for rendering
  const [isLoggedIn, setIsLoggedIn] = useState(authSessionValid());

  // any time setAuth is called, it should set storage and isLoggedIn
  const setAuth = useCallback(
    (authResponse: authResponseType | null) => {
      setStorageAuth(authResponse);
      setIsLoggedIn(authSessionValid());
    },
    [setIsLoggedIn]
  );

  // set a logout timer based on session expiration. if the timer executes, it will
  // logout the frontend.  this is not a substitute for proper backend idle out
  useEffect(() => {
    let logoutTimer: number;
    const auth = storageAuth();

    // on mount, start the timer if logged in
    if (isLoggedIn && auth !== null) {
      // get session expires time
      const sessionExpires = auth.session_token_claims.exp;

      logoutTimer = setTimeout(() => {
        setStorageAuth(null);
      }, sessionExpires * 1000 - Date.now());
    }

    // on dismount, clear timer
    return () => {
      clearTimeout(logoutTimer);
    };
  }, [isLoggedIn, setAuth]);

  return (
    <AuthContext.Provider value={{ accessToken, isLoggedIn, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// exports
export { AuthProvider };
export default AuthContext;
