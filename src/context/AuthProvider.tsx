import { type FC, type ReactNode } from 'react';
import { type storedAuthorizationType, parseStoredAuthorizationType } from '../types/api';

import { createContext, useCallback, useEffect, useState } from 'react';

// global idle logout timer
let logoutTimer: number;

const resetIdleLogoutTimer = (
  auth: storedAuthorizationType | undefined,
  setAuth: (auth: storedAuthorizationType | undefined) => void
): void => {
  // always clear any previous timer
  clearTimeout(logoutTimer);

  // if auth, set new logout timer using its session expiration
  if (auth) {
    logoutTimer = setTimeout(
      () => {
        // on expire clear auth
        setAuth(undefined);
      },
      auth.session_exp * 1000 - Date.now()
    );
  }
};

// getAuth fetches the current auth from session storage
const getAuth = (): storedAuthorizationType | undefined => {
  try {
    const maybeAuth: unknown = JSON.parse(
      sessionStorage.getItem('authorization') ?? '{}'
    );

    // parse auth for validity
    const auth = parseStoredAuthorizationType(maybeAuth);

    // check expiration
    if (auth.session_exp < Date.now() / 1000) {
      throw new Error('session expired');
    }

    // valid & not expired
    return auth;
  } catch (_err) {
    // not proper type or expired, delete storage & return undefined
    sessionStorage.removeItem('authorization');
    return undefined;
  }

  // unreachable
};

// getAccessToken returns the auth's access_token if auth is defined
const getAccessToken = (): string => {
  const auth = getAuth();

  if (!auth) {
    return '';
  }

  return auth.access_token;
};

// getAccessToken returns the auth's access_token if auth is defined
const getUserType = (): string | undefined => {
  const auth = getAuth();

  return auth?.user_type;
};

// setAuthStorage saves the newAuth in session storage or clears storage if
// undefined is set
const setAuthStorage = (newAuth: storedAuthorizationType | undefined): void => {
  if (!newAuth) {
    // undefined
    sessionStorage.removeItem('authorization');

    return;
  }

  // is auth type
  sessionStorage.setItem('authorization', JSON.stringify(newAuth));
};

// context type
export type authContextType = {
  isLoggedIn: boolean;
  getAccessToken: () => string;
  getUserType: () => string | undefined;
  setAuth: (newAuth: storedAuthorizationType | undefined) => void;
};

// create context
const AuthContext = createContext<authContextType>({
  isLoggedIn: false,
  getAccessToken: () => '',
  getUserType: () => undefined,
  setAuth: (_unused) => {
    /* No-Op */
  },
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
  // and reset the idle logout timer
  const setAuth = useCallback(
    (auth: storedAuthorizationType | undefined) => {
      // reset timer using new auth
      resetIdleLogoutTimer(auth, setAuth);

      // save auth to storage and logged in state
      setAuthStorage(auth);
      setIsLoggedIn(!!auth);
    },
    [setIsLoggedIn]
  );

  // Initial app load idle logout timer (this is not a substitute for proper backend idle out)
  useEffect(() => {
    // on mount, set idle logout timer using current auth
    const auth = getAuth();
    resetIdleLogoutTimer(auth, setAuth);

    // on dismount, clear idle logout timer (auth undefined)
    return () => {
      resetIdleLogoutTimer(undefined, setAuth);
    };
  }, [isLoggedIn, setAuth]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, getAccessToken, getUserType, setAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// export
export { AuthContext, AuthProvider };
