import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/system';

import { newId } from '../../App';
import AddOneACMEAccount from '../ACMEAccounts/OneACMEAccount/AddOneACMEAccount';
import AddOneCert from '../Certificates/OneCert/AddOneCert';
import AddOnePrivateKey from '../PrivateKeys/OnePrivateKey/AddOnePrivateKey';
import AllACMEAccounts from '../ACMEAccounts/AllACMEAccounts';
import AllCertificates from '../Certificates/AllCertificates';
import AllPrivateKeys from '../PrivateKeys/AllPrivateKeys';
import AppDrawer from './Drawer';
import ChangeAccountEmail from '../ACMEAccounts/OneACMEAccount/Edit/ChangeAccountEmail';
import Dashboard from '../Dashboard/Dashboard';
import EditOneACMEAccount from '../ACMEAccounts/OneACMEAccount/EditOneACMEAccount';
import EditOneCert from '../Certificates/OneCert/EditOneCert';
import EditOnePrivateKey from '../PrivateKeys/OnePrivateKey/EditOnePrivateKey';
import Logout from '../Authentication/Logout';
import LogViewer from '../LogViewer/LogViewer';
import RolloverAccountKey from '../ACMEAccounts/OneACMEAccount/Edit/RolloverAccountKey';
import Settings from '../Settings/Settings';
import ViewOneCert from '../Certificates/OneCert/ViewOneCert';

const LoggedIn = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppDrawer />

      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          width: 1,
        }}
      >
        <Container maxWidth={false} sx={{ mt: 3 }}>
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
            <Route path='/certificates/:id' element={<ViewOneCert />} />
            <Route path='/certificates/:id/edit' element={<EditOneCert />} />
            <Route path={`/certificates/${newId}`} element={<AddOneCert />} />

            <Route path={'/logs'} element={<LogViewer />} />

            <Route path={'/settings'} element={<Settings />} />

            <Route path={'/logout'} element={<Logout />} />

            <Route path='/' element={<Dashboard />} />

            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

export default LoggedIn;
