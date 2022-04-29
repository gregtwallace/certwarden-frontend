import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import AllACMEAccounts from './components/ACMEAccounts/AllACMEAccounts';
import OneACMEAccount from './components/ACMEAccounts/OneACMEAccount';
import AllPrivateKeys from './components/PrivateKeys/AllPrivateKeys';
import AddOnePrivateKey from './components/PrivateKeys/OnePrivateKey/AddOnePrivateKey';
import EditOnePrivateKey from './components/PrivateKeys/OnePrivateKey/EditOnePrivateKey';

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
              <Route path='/privatekeys/-1' element={<AddOnePrivateKey />} />
              <Route path='/privatekeys/:id' element={<EditOnePrivateKey />} />
              <Route path='/privatekeys' element={<AllPrivateKeys />} />
              <Route path='/acmeaccounts/:id' element={<OneACMEAccount />} />
              <Route path='/acmeaccounts' element={<AllACMEAccounts />} />
              `// TODO: Other Pages //`
              <Route path='/' element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default App;
