import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';

import useAuth from './hooks/useAuth';
import useAxiosSend from './hooks/useAxiosSend';

import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Authentication/Login';
import AllACMEAccounts from './components/ACMEAccounts/AllACMEAccounts';
import AddOneACMEAccount from './components/ACMEAccounts/OneACMEAccount/AddOneACMEAccount';
import EditOneACMEAccount from './components/ACMEAccounts/OneACMEAccount/EditOneACMEAccount';
import ChangeAccountEmail from './components/ACMEAccounts/OneACMEAccount/Edit/ChangeAccountEmail';
import AllPrivateKeys from './components/PrivateKeys/AllPrivateKeys';
import AddOnePrivateKey from './components/PrivateKeys/OnePrivateKey/AddOnePrivateKey';
import EditOnePrivateKey from './components/PrivateKeys/OnePrivateKey/EditOnePrivateKey';
import AllCertificates from './components/Certificates/AllCertificates';
import ViewOneCert from './components/Certificates/OneCert/ViewOneCert';
import EditOneCert from './components/Certificates/OneCert/EditOneCert';
import AddOneCert from './components/Certificates/OneCert/AddOneCert';
import H1Header from './components/UI/Header/H1Header';
import Settings from './components/Settings/Settings';
import LogViewer from './components/LogViewer/LogViewer';
import RolloverAccountKey from './components/ACMEAccounts/OneACMEAccount/Edit/RolloverAccountKey';

// react app version
export const frontendVersion = '0.5.0';
// value for new records on backend
export const newId = -1;

const App = () => {
  const { auth, setAuth } = useAuth();
  const [, sendData] = useAxiosSend();

  // check for 'logged_in_expiration' cookie to set the initial login state
  useEffect(() => {
    const loggedInExpiration = document.cookie.match(
      new RegExp(`(^| )logged_in_expiration=([^;]+)`)
    );
    if (loggedInExpiration) {
      setAuth({
        loggedInExpiration: loggedInExpiration[2],
      });
    } else {
      setAuth({});
    }
  }, [setAuth]);

  // logout handler
  // backend clears cookie on the call to /logout
  const logoutHandler = () => {
    sendData(`/v1/auth/logout`, 'POST', null, true).then((success) => {
      if (success) {
        // update auth state
        setAuth({});
      }
    });
  };

  // if not logged in
  if (!auth.loggedInExpiration) {
    return <Login />;
  } else {
    // if logged in
    return (
      <div className='container'>
        <H1Header className='ml-3 my-3' h1='LeGo CertHub'></H1Header>

        <Router basename={process.env.PUBLIC_URL}>
          <div className='row'>
            <div className='col-md-3'>
              <nav>
                <ul className='list-group'>
                  <li className='list-group-item'>
                    <Link to='/'>Dashboard</Link>
                  </li>
                  <li className='list-group-item'>
                    <Link to='/privatekeys'>Private Keys</Link>
                  </li>
                  <li className='list-group-item'>
                    <Link to='/acmeaccounts'>ACME Accounts</Link>
                  </li>
                  <li className='list-group-item'>
                    <Link to='/certificates'>Certificates</Link>
                  </li>
                  <li className='list-group-item'>
                    <Link to='/logs'>Logs</Link>
                  </li>
                  <li className='list-group-item'>
                    <Link to='/settings'>Settings</Link>
                  </li>
                  <li className='list-group-item'>
                    <Link to='/' onClick={logoutHandler}>
                      Logout
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className='col-md-9'>
              <Routes>
                <Route
                  path={`/privatekeys/${newId}`}
                  element={<AddOnePrivateKey />}
                />
                <Route
                  path='/privatekeys/:id'
                  element={<EditOnePrivateKey />}
                />
                <Route path='/privatekeys' element={<AllPrivateKeys />} />
                <Route
                  path={`/acmeaccounts/${newId}`}
                  element={<AddOneACMEAccount />}
                />
                <Route
                  path='/acmeaccounts/:id'
                  element={<EditOneACMEAccount />}
                />
                <Route
                  path='/acmeaccounts/:id/email'
                  element={<ChangeAccountEmail />}
                />
                <Route
                  path='/acmeaccounts/:id/key-change'
                  element={<RolloverAccountKey />}
                />
                <Route path='/acmeaccounts' element={<AllACMEAccounts />} />
                <Route path='/certificates' element={<AllCertificates />} />
                <Route path='/certificates/:id' element={<ViewOneCert />} />
                <Route
                  path='/certificates/:id/edit'
                  element={<EditOneCert />}
                />
                <Route
                  path={`/certificates/${newId}`}
                  element={<AddOneCert />}
                />

                <Route path={'/logs'} element={<LogViewer />} />

                <Route path={'/settings'} element={<Settings />} />

                <Route path='/' element={<Dashboard />} />

                <Route path='*' element={<Navigate to='/' replace />} />
              </Routes>
            </div>
          </div>
        </Router>

        <footer className='my-4'>
          <div className='text-center'>
            <hr />
            <p>Copyright © 2022 Greg T. Wallace</p>
          </div>
        </footer>
      </div>
    );
  }
};

export default App;
