import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Link,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import useAuth from './hooks/useAuth';
import useAxiosSend from './hooks/useAxiosSend';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import KeyIcon from '@mui/icons-material/Key';
import BadgeIcon from '@mui/icons-material/Badge';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

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
import Settings from './components/Settings/Settings';
import LogViewer from './components/LogViewer/LogViewer';
import RolloverAccountKey from './components/ACMEAccounts/OneACMEAccount/Edit/RolloverAccountKey';
import Footer from './Footer';

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

  const drawerWidth = 240;

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(5),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(7),
        },
      }),
    },
  }));

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* Not Logged In vs. Logged In */}
      {!auth.loggedInExpiration ? (
        <>
          <Login />
          <Footer />
        </>
      ) : (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Router basename={process.env.PUBLIC_URL}>
            <AppBar position='absolute' open={open}>
              <Toolbar
                sx={{
                  pr: '24px', // keep right padding when drawer closed
                }}
              >
                <IconButton
                  edge='start'
                  color='inherit'
                  aria-label='open drawer'
                  onClick={toggleDrawer}
                  sx={{
                    marginRight: '36px',
                    ...(open && { display: 'none' }),
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  component='h1'
                  variant='h6'
                  color='inherit'
                  noWrap
                  sx={{ flexGrow: 1 }}
                >
                  LeGo CertHub
                </Typography>
              </Toolbar>
            </AppBar>
            <Drawer variant='permanent' open={open}>
              <Toolbar
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  px: [1],
                }}
              >
                <IconButton onClick={toggleDrawer}>
                  <ChevronLeftIcon />
                </IconButton>
              </Toolbar>
              <Divider />
              <List component='nav'>
                <ListItemButton component={Link} to='/'>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary='Dashboard' />
                </ListItemButton>

                <ListItemButton component={Link} to='/privatekeys'>
                  <ListItemIcon>
                    <KeyIcon />
                  </ListItemIcon>
                  <ListItemText primary='Private Keys' />
                </ListItemButton>

                <ListItemButton component={Link} to='/acmeaccounts'>
                  <ListItemIcon>
                    <BadgeIcon />
                  </ListItemIcon>
                  <ListItemText primary='ACME Accounts' />
                </ListItemButton>

                <ListItemButton component={Link} to='/certificates'>
                  <ListItemIcon>
                    <CardMembershipIcon />
                  </ListItemIcon>
                  <ListItemText primary='Certificates' />
                </ListItemButton>

                <ListItemButton component={Link} to='/logs'>
                  <ListItemIcon>
                    <TextSnippetIcon />
                  </ListItemIcon>
                  <ListItemText primary='Logs' />
                </ListItemButton>

                <ListItemButton component={Link} to='/settings'>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary='Settings' />
                </ListItemButton>

                <ListItemButton component={Link} to='/' onClick={logoutHandler}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary='Logout' />
                </ListItemButton>
              </List>
            </Drawer>

            <Box
              component='main'
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                width: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
              }}
            >
              <Toolbar />
              <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
                <Paper
                  sx={{
                    width: 1,
                    p: 2,
                  }}
                >
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
                </Paper>
              </Container>
              <Footer />
            </Box>
          </Router>
        </Box>
      )}
    </Box>
  );
};

export default App;
