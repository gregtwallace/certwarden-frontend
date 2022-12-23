import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/system';

import { newId } from '../../App';
import AddOneACMEAccount from '../ACMEAccounts/OneACMEAccount/AddOneACMEAccount';
import AddOneCert from '../Certificates/OneCert/AddOneCert';
import AddOnePrivateKey from '../PrivateKeys/OnePrivateKey/AddOnePrivateKey';
import AllACMEAccounts from '../ACMEAccounts/AllACMEAccounts';
import AllCertificates from '../Certificates/AllCertificates';
import AllPrivateKeys from '../PrivateKeys/AllPrivateKeys';
import ChangeAccountEmail from '../ACMEAccounts/OneACMEAccount/Edit/ChangeAccountEmail';
import Dashboard from '../Dashboard/Dashboard';
import EditOneACMEAccount from '../ACMEAccounts/OneACMEAccount/EditOneACMEAccount';
import EditOneCert from '../Certificates/OneCert/EditOneCert';
import EditOnePrivateKey from '../PrivateKeys/OnePrivateKey/EditOnePrivateKey';
import Logout from '../Authentication/Logout';
import LogViewer from '../LogViewer/LogViewer';
import Navbar from './Navbar';
import RolloverAccountKey from '../ACMEAccounts/OneACMEAccount/Edit/RolloverAccountKey';
import Settings from '../Settings/Settings';

const LoggedIn = () => {
  return (
    <>
      <Navbar />

      <Box
        sx={{
          p: 3,
          flexGrow: 1,
          overflowX: 'auto',
        }}
      >
        <Routes>
          <Route
            path={`/privatekeys/${newId}`}
            element={<AddOnePrivateKey />}
          />
          <Route path='/privatekeys/:id' element={<EditOnePrivateKey />} />
          <Route path='/privatekeys' element={<AllPrivateKeys />} />
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
          <Route path='/certificates' element={<AllCertificates />} />
          <Route path='/certificates/:id' element={<EditOneCert />} />
          <Route path={`/certificates/${newId}`} element={<AddOneCert />} />

          <Route path={'/logs'} element={<LogViewer />} />

          <Route path={'/settings'} element={<Settings />} />

          <Route path={'/logout'} element={<Logout />} />

          <Route path='/' element={<Dashboard />} />

          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Box>
    </>
  );
};

export default LoggedIn;
