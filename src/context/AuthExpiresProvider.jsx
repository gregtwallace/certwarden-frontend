import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';

const AuthExpiresContext = createContext();

// Global logout time to track when auth to the backend
// will expire.
const AuthExpiresProvider = (props) => {
  const [authExpires, setAuthExpires] = useState();

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
