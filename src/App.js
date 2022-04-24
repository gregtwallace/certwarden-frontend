import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import AllACMEAccounts from './components/ACMEAccounts/AllACMEAccounts';
import OneACMEAccount from './components/ACMEAccounts/OneACMEAccount';
import PrivateKeys from './components/PrivateKeys'

const App = () => {
  return (
    <div className='container'>
      <div className='row'>
        <h1 className='ml-3 my-3'>LeGo CertHub</h1>
      </div>

      <Router>
        <div className='row'>
          <div className="col-md-3">
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
              <Route path='/privatekeys/:id' element={<PrivateKeys />} />
              <Route path='/acmeaccounts/:id' element={<OneACMEAccount />} />
              <Route path='/acmeaccounts' element={<AllACMEAccounts />} />
              <Route path='/privatekeys' element={<PrivateKeys />} />

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
