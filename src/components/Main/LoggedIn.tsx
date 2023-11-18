import { type FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/system';

import { NewVersionProvider } from '../../context/NewVersionProvider';
import { newId } from '../../helpers/constants';

import Navbar from './Navbar/Navbar';

import AddOneACMEAccount from '../Routes/ACMEAccounts/OneACMEAccount/AddOneACMEAccount';
import AddOneACMEServer from '../Routes/ACMEServers/Edit/AddOneACMEServer';
import AddOneCert from '../Routes/Certificates/OneCert/AddOneCert';
import AddOnePrivateKey from '../Routes/PrivateKeys/OnePrivateKey/AddOnePrivateKey';
import AllACMEAccounts from '../Routes/ACMEAccounts/AllACMEAccounts';
import AllACMEServers from '../Routes/ACMEServers/AllACMEServers';
import AllCertificates from '../Routes/Certificates/AllCertificates';
import AllPrivateKeys from '../Routes/PrivateKeys/AllPrivateKeys';
import AllProviders from '../Routes/Providers/AllProviders';
import AddOneProvider from '../Routes/Providers/AddEditOneProvider/AddOneProvider';
import ChangeAccountEmail from '../Routes/ACMEAccounts/OneACMEAccount/Edit/ChangeAccountEmail';
import Dashboard from '../Routes/Dashboard/Dashboard';
import EditCertApiKeys from '../Routes/Certificates/OneCert/Edit/EditCertApiKeys';
import EditKeyApiKeys from '../Routes/PrivateKeys/OnePrivateKey/Edit/EditKeyApiKeys';
import EditOneACMEAccount from '../Routes/ACMEAccounts/OneACMEAccount/EditOneACMEAccount';
import EditOneACMEServer from '../Routes/ACMEServers/Edit/EditOneACMEServer';
import EditOneCert from '../Routes/Certificates/OneCert/EditOneCert';
import EditOnePrivateKey from '../Routes/PrivateKeys/OnePrivateKey/EditOnePrivateKey';
import EditOneProvider from '../Routes/Providers/AddEditOneProvider/EditOneProvider';
import Logout from '../Routes/Logout/Logout';
import LogViewer from '../Routes/LogViewer/LogViewer';
import OrderQueue from '../Routes/OrderQueue/OrderQueue';
import RolloverAccountKey from '../Routes/ACMEAccounts/OneACMEAccount/Edit/RolloverAccountKey';
import Settings from '../Routes/Settings/Settings';

// no props

// component
const LoggedIn: FC = () => {
  return (
    <NewVersionProvider>
      <Navbar />

      <Box
        sx={{
          p: 3,
          flexGrow: 1,
          overflowX: 'auto',
        }}
      >
        <Routes>
          {/* Dashboard */}
          <Route path='/' element={<Dashboard />} />

          {/* Private Keys */}
          {/* <Route
            path={`/privatekeys/${newId}`}
            element={<AddOnePrivateKey />}
          />
          <Route path='/privatekeys/:id' element={<EditOnePrivateKey />} />
          <Route path='/privatekeys/:id/apikeys' element={<EditKeyApiKeys />} /> */}
          <Route path='/privatekeys' element={<AllPrivateKeys />} />

          {/* ACME Accounts */}
          {/* <Route
            path={`/acmeaccounts/${newId}`}
            element={<AddOneACMEAccount />}
          />
          <Route path='/acmeaccounts/:id' element={<EditOneACMEAccount />} />
          <Route
            path='/acmeaccounts/:id/email'
            element={<ChangeAccountEmail />}
          />
          <Route
            path='/acmeaccounts/:id/key-change'
            element={<RolloverAccountKey />}
          /> */}
          <Route path='/acmeaccounts' element={<AllACMEAccounts />} />

          {/* Certificates */}
          <Route path='/certificates' element={<AllCertificates />} />
          {/* <Route path='/certificates/:id' element={<EditOneCert />} />
          <Route
            path='/certificates/:id/apikeys'
            element={<EditCertApiKeys />}
          /> */}
          <Route path={`/certificates/${newId}`} element={<AddOneCert />} />

          {/* Order Queue */}
          <Route path={'/orderqueue'} element={<OrderQueue />} />

          {/* Logs */}
          <Route path={'/logs'} element={<LogViewer />} />

          {/* Providers */}
          <Route path={'/providers'} element={<AllProviders />} />
          {/* <Route path={`/providers/${newId}`} element={<AddOneProvider />} />
          <Route path={'/providers/:id'} element={<EditOneProvider />} /> */}

          {/* ACME Servers */}
          <Route path='/acmeservers' element={<AllACMEServers />} />
          <Route
            path={`/acmeservers/${newId}`}
            element={<AddOneACMEServer />}
          />
          <Route path='/acmeservers/:id' element={<EditOneACMEServer />} />

          {/* Settings */}
          <Route path={'/settings'} element={<Settings />} />

          {/* Misc. */}
          <Route path={'/logout'} element={<Logout />} />

          {/* Catch All */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Box>
    </NewVersionProvider>
  );
};

export default LoggedIn;
