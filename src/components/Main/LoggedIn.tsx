import { type FC } from 'react';
import { Routes, Route, Navigate } from 'react-router';
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
import AllProviders from '../Routes/Challenges/Providers/AllProviders';
import AddOneProvider from '../Routes/Challenges/Providers/AddEditOneProvider/AddOneProvider';
import BackupRestore from '../Routes/BackupRestore/BackupRestore';
import ChangeAccountEmail from '../Routes/ACMEAccounts/OneACMEAccount/Edit/ChangeAccountEmail';
import Dashboard from '../Routes/Dashboard/Dashboard';
import EditAPIKeysPage from '../Pages/EditAPIKeysPage/EditAPIKeysPage';
import EditOneACMEAccount from '../Routes/ACMEAccounts/OneACMEAccount/EditOneACMEAccount';
import EditOneACMEServer from '../Routes/ACMEServers/Edit/EditOneACMEServer';
import EditOneCert from '../Routes/Certificates/OneCert/EditOneCert';
import EditOnePrivateKey from '../Routes/PrivateKeys/OnePrivateKey/EditOnePrivateKey';
import EditOneProvider from '../Routes/Challenges/Providers/AddEditOneProvider/EditOneProvider';
import Logout from '../Routes/Logout/Logout';
import LogViewer from '../Routes/LogViewer/LogViewer';
import OrderFulfillQueue from '../Routes/OrderFulfillQueue/OrderFulfillQueue';
import OrderPostProcessQueue from '../Routes/OrderPostProcessQueue/OrderPostProcessQueue';
import RolloverAccountKey from '../Routes/ACMEAccounts/OneACMEAccount/Edit/RolloverAccountKey';
import Settings from '../Routes/Settings/Settings';
import EditAliases from '../Routes/Challenges/Aliases/EditAliases';
import PostAsGet from '../Routes/ACMEAccounts/OneACMEAccount/Edit/PostAsGet';

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
          <Route
            path={`/privatekeys/${newId}`}
            element={<AddOnePrivateKey />}
          />
          <Route path='/privatekeys/:id' element={<EditOnePrivateKey />} />
          <Route
            path='/privatekeys/:id/apikeys'
            element={<EditAPIKeysPage objectType='privatekeys' />}
          />
          <Route path='/privatekeys' element={<AllPrivateKeys />} />

          {/* ACME Accounts */}
          <Route
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
          />
          <Route path='/acmeaccounts/:id/post-as-get' element={<PostAsGet />} />
          <Route path='/acmeaccounts' element={<AllACMEAccounts />} />

          {/* Certificates */}
          <Route path='/certificates' element={<AllCertificates />} />
          <Route path='/certificates/:id' element={<EditOneCert />} />
          <Route
            path='/certificates/:id/apikeys'
            element={<EditAPIKeysPage objectType='certificates' />}
          />
          <Route path={`/certificates/${newId}`} element={<AddOneCert />} />

          {/* Order Fulfill Queue */}
          <Route path={'/orderacmequeue'} element={<OrderFulfillQueue />} />

          {/* Order Post Process Queue */}
          <Route path={'/orderpostqueue'} element={<OrderPostProcessQueue />} />

          {/* Logs */}
          <Route path={'/logs'} element={<LogViewer />} />

          {/* Providers */}
          <Route path={'/challenges/aliases'} element={<EditAliases />} />
          <Route path={'/challenges/providers'} element={<AllProviders />} />
          <Route
            path={`/challenges/providers/${newId}`}
            element={<AddOneProvider />}
          />
          <Route
            path={'/challenges/providers/:id'}
            element={<EditOneProvider />}
          />

          {/* ACME Servers */}
          <Route path='/acmeservers' element={<AllACMEServers />} />
          <Route
            path={`/acmeservers/${newId}`}
            element={<AddOneACMEServer />}
          />
          <Route path='/acmeservers/:id' element={<EditOneACMEServer />} />

          {/* Settings */}
          <Route path={'/settings'} element={<Settings />} />
          <Route path='/backuprestore' element={<BackupRestore />} />

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
