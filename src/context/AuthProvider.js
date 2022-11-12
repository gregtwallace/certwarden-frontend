import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

// to wrap entire app with the global auth context
const AuthProvider = (props) => {
  const [auth, setAuth] = useState({});

  // set a logout timer based on expiration
  // if the timer executes, it will logout the frontend
  // this is not a substitute for proper backend idle out
  useEffect(() => {
    let logoutTimer

    // any time AuthProvier mounts, start a timer based
    // on current loggedInExpiration
    if (auth.loggedInExpiration) {
      logoutTimer = setTimeout(
        () => {
          setAuth({})
        },
        auth.loggedInExpiration * 1000 - Date.now()
      );
    }

    // any time AuthProvider dismounts, clear old timer
    return () => {
      clearTimeout(logoutTimer);
    };
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {props.children}
    </AuthContext.Provider>
  );
};

// exports
export { AuthProvider };
export default AuthContext;
