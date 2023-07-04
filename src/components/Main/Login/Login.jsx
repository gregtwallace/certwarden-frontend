import { useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Paper } from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ApiError from '../../UI/Api/ApiError';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import useAuthExpires from '../../../hooks/useAuthExpires';
import useAxiosSend from '../../../hooks/useAxiosSend';

const LOGIN_URL = '/v1/auth/login';

const Login = () => {
  const [sendState, sendData] = useAxiosSend();
  const { setAuthExpires } = useAuthExpires();

  // set blank form state
  const blankForm = {
    login: {
      username: '',
      password: '',
    },
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankForm);

  // form data change handler
  const inputChangeHandler = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      login: {
        ...prevState.login,
        [event.target.id]: event.target.value,
      },
    }));
  };

  // submit login form
  const submitLogin = (event) => {
    event.preventDefault();

    // form validation
    let validationErrors = {};

    // username (not blank)
    if (formState.login.username.length <= 0) {
      validationErrors.username = true;
    }

    // password (not blank)
    if (formState.login.password.length <= 0) {
      validationErrors.password = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    // form validation - end

    sendData(LOGIN_URL, 'POST', formState.login, true).then((response) => {
      if (response.status === 200) {
        sessionStorage.setItem(
          'access_token',
          response.data.response.access_token
        );
        setAuthExpires(response.data.response.session.exp);
      } else {
        setFormState(blankForm);
      }
    });
  };

  return (
    <Container maxWidth='xs'>
      <Paper
        sx={{
          my: 6,
          px: 6,
          pt: 2,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'error.main' }}>
          <LockOutlinedIcon />
        </Avatar>

        {sendState.errorMessage &&
          // hide error if form becomes invalid
          Object.keys(formState.validationErrors).length <= 0 && (
            <ApiError
              code={sendState.errorCode}
              message={sendState.errorMessage}
            />
          )}

        <Box component='form' onSubmit={submitLogin}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='username'
            name='Username'
            label='Username'
            value={formState.login.username}
            onChange={inputChangeHandler}
            error={formState.validationErrors.username}
            helperText={
              formState.validationErrors.username && 'Username cannot be blank.'
            }
          />

          <TextField
            margin='normal'
            required
            fullWidth
            id='password'
            label='Password'
            name='password'
            type='password'
            value={formState.login.password}
            onChange={inputChangeHandler}
            error={formState.validationErrors.password}
            helperText={
              formState.validationErrors.password && 'Password cannot be blank.'
            }
          />

          <Stack direction='row' justifyContent='end' sx={{ marginTop: 1 }}>
            <Button
              type='submit'
              color='primary'
              variant='contained'
              onClick={submitLogin}
              disabled={sendState.isSending}
            >
              Login
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
