import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useState } from 'react';

const AuthExpiresContext = createContext();

// Global logout time to track when auth to the backend will expire.
const AuthExpiresProvider = (props) => {
  const [authExpires, setAuthExpiresState] = useState();

  // any time setAuthExpires is called, it should also set storage
  // for persistence
  const setAuthExpires = useCallback(
    (expiration) => {
      if (expiration == null) {
        // null == logged out / expired
        sessionStorage.removeItem('session_expiration');
        // also clear access token if logged out
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token_expiration');
      } else {
        // not null, set expire time
        sessionStorage.setItem('session_expiration', expiration);
      }

      setAuthExpiresState(expiration);
    },
    [setAuthExpiresState]
  );

  // set a logout timer based on expiration. if the timer executes, it will
  // logout the frontend.  this is not a substitute for proper backend idle out
  useEffect(() => {
    let logoutTimer;

    // on mount, start the timer
    if (authExpires) {
      logoutTimer = setTimeout(() => {
        setAuthExpires();
      }, authExpires * 1000 - Date.now());
    }

    // on dismount, clear timer
    return () => {
      clearTimeout(logoutTimer);
    };
  });

  return (
    <AuthExpiresContext.Provider value={{ authExpires, setAuthExpires }}>
      {props.children}
    </AuthExpiresContext.Provider>
  );
};

AuthExpiresProvider.propTypes = {
  children: PropTypes.node,
};

// exports
export { AuthExpiresProvider };
export default AuthExpiresContext;
