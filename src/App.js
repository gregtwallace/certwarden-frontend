import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Dashboard from './components/Dashboard';
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

export const newId = -1;

const App = () => {
  return (
    <div className='container'>
      <div className='row'>
        <h1 className='ml-3 my-3'>LeGo CertHub</h1>
      </div>

      <Router>
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
                  <Link to='/settings'>Settings</Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className='col-md-9'>
            <Routes>
              <Route path={`/privatekeys/${newId}`} element={<AddOnePrivateKey />} />
              <Route path='/privatekeys/:id' element={<EditOnePrivateKey />} />
              <Route path='/privatekeys' element={<AllPrivateKeys />} />

              <Route path={`/acmeaccounts/${newId}`} element={<AddOneACMEAccount />} />
              <Route path='/acmeaccounts/:id' element={<EditOneACMEAccount />} />
              <Route path='/acmeaccounts/:id/email' element={<ChangeAccountEmail />} />
              <Route path='/acmeaccounts' element={<AllACMEAccounts />} />

              <Route path='/certificates' element={<AllCertificates />} />
              <Route path='/certificates/:id' element={<ViewOneCert />} />
              <Route path='/certificates/:id/edit' element={<EditOneCert />} />
              <Route path={`/certificates/${newId}`} element={<AddOneCert />} />

              `// TODO: Dashboard, Settings //`
              <Route path='/' element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default App;
