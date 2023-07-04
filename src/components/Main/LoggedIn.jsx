import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/system';

import { NewVersionProvider } from '../../context/NewVersionProvider';

import { newId } from '../../helpers/constants';
import AddOneACMEAccount from '../ACMEAccounts/OneACMEAccount/AddOneACMEAccount';
import AddOneACMEServer from '../ACMEServers/Edit/AddOneACMEServer';
import AddOneCert from '../Certificates/OneCert/AddOneCert';
import AddOnePrivateKey from '../Routes/PrivateKeys/OnePrivateKey/AddOnePrivateKey';
import AllACMEAccounts from '../ACMEAccounts/AllACMEAccounts';
import AllACMEServers from '../ACMEServers/AllACMEServers';
import AllCertificates from '../Certificates/AllCertificates';
import AllPrivateKeys from '../Routes/PrivateKeys/AllPrivateKeys';
import ChangeAccountEmail from '../ACMEAccounts/OneACMEAccount/Edit/ChangeAccountEmail';
import Dashboard from '../Dashboard/Dashboard';
import EditOneACMEAccount from '../ACMEAccounts/OneACMEAccount/EditOneACMEAccount';
import EditOneACMEServer from '../ACMEServers/Edit/EditOneACMEServer';
import EditOneCert from '../Certificates/OneCert/EditOneCert';
import EditOnePrivateKey from '../Routes/PrivateKeys/OnePrivateKey/EditOnePrivateKey';
import Logout from '../Routes/Logout/Logout';
import LogViewer from '../Routes/LogViewer/LogViewer';
import Navbar from './Navbar/Navbar';
import RolloverAccountKey from '../ACMEAccounts/OneACMEAccount/Edit/RolloverAccountKey';
import Settings from '../Routes/Settings/Settings';

const LoggedIn = () => {
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
          {/* ACME Servers */}
          <Route path='/acmeservers' element={<AllACMEServers />} />
          <Route
            path={`/acmeservers/${newId}`}
            element={<AddOneACMEServer />}
          />
          <Route path='/acmeservers/:id' element={<EditOneACMEServer />} />

          {/* Private Keys */}
          <Route
            path={`/privatekeys/${newId}`}
            element={<AddOnePrivateKey />}
          />
          <Route path='/privatekeys/:id' element={<EditOnePrivateKey />} />
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
          <Route path='/acmeaccounts' element={<AllACMEAccounts />} />

          {/* Certificates */}
          <Route path='/certificates' element={<AllCertificates />} />
          <Route path='/certificates/:id' element={<EditOneCert />} />
          <Route path={`/certificates/${newId}`} element={<AddOneCert />} />

          {/* Misc. */}
          <Route path='/' element={<Dashboard />} />
          <Route path={'/logs'} element={<LogViewer />} />
          <Route path={'/settings'} element={<Settings />} />
          <Route path={'/logout'} element={<Logout />} />

          {/* Catch All */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Box>
    </NewVersionProvider>
  );
};

export default LoggedIn;
