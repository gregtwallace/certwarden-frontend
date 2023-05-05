import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useState } from 'react';

const AuthExpiresContext = createContext();

// Global logout time to track when auth to the backend
// will expire.
const AuthExpiresProvider = (props) => {
  const [authExpires, setAuthExpiresState] = useState();

  // any time set authExpires is called, it should also set the
  // storage item for persistence
  const setAuthExpires = useCallback(
    (expiration) => {
      // in addition to changing state, update storage
      if (expiration == null) {
        sessionStorage.removeItem('auth_expires');
        // also clear access token if logged out
        sessionStorage.removeItem('access_token');
      } else {
        sessionStorage.setItem('auth_expires', expiration);
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
