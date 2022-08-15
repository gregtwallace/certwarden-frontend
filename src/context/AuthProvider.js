import { createContext, useState } from 'react';

const AuthContext = createContext({});

// to wrap entire app with the global auth context
const AuthProvider = (props) => {

    const [auth, setAuth] = useState({});

    return (
      <AuthContext.Provider value={{auth, setAuth}}>
        {props.children}        
      </AuthContext.Provider>
    )

}

// exports
export { AuthProvider };
export default AuthContext;
