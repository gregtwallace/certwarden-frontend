import { type FC, type SyntheticEvent } from 'react';
import {
  type authorizationResponseType,
  isAuthorizationResponseType,
} from '../../../types/api';

import { useState } from 'react';

import useAuth from '../../../hooks/useAuth';
import useAxiosSend from '../../../hooks/useAxiosSend';
import { inputHandlerFuncMaker } from '../../../helpers/input-handler';

import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Paper } from '@mui/material';

import ApiError from '../../UI/Api/ApiError';
import InputTextField from '../../UI/FormMui/InputTextField';
import FormFooter from '../../UI/FormMui/FormFooter';
import Form from '../../UI/FormMui/Form';

// backend API path
const LOGIN_URL = '/v1/app/auth/login';

// form shape
type formObj = {
  dataToSubmit: {
    username: string;
    password: string;
  };
  validationErrors: { [key: string]: boolean };
};

// component
const Login: FC = () => {
  const { sendState, doSendData } = useAxiosSend();
  const { setAuth } = useAuth();

  // set blank form state
  const blankForm: formObj = {
    dataToSubmit: {
      username: '',
      password: '',
    },
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankForm);

  // form data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

  // submit login form
  const submitFormHandler = (event: SyntheticEvent): void => {
    event.preventDefault();

    // form validation
    const validationErrors: { [key: string]: boolean } = {};

    // username (not blank)
    if (formState.dataToSubmit.username.length <= 0) {
      validationErrors['username'] = true;
    }

    // password (not blank)
    if (formState.dataToSubmit.password.length <= 0) {
      validationErrors['password'] = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    // form validation - end

    doSendData<authorizationResponseType>(
      'POST',
      LOGIN_URL,
      formState.dataToSubmit,
      isAuthorizationResponseType
    ).then((responseData) => {
      // set auth if success
      if (responseData && responseData.status_code === 200) {
        setAuth(responseData.authorization);
      } else {
        // failed, clear form
        setFormState(blankForm);
      }
    });
  };

  return (
    /* do not use standard form container since this form is special size*/
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

        <Form onSubmit={submitFormHandler}>
          <InputTextField
            id='dataToSubmit.username'
            label='Username'
            value={formState.dataToSubmit.username}
            onChange={inputChangeHandler}
            error={formState.validationErrors['username']}
          />

          <InputTextField
            id='dataToSubmit.password'
            label='Password'
            value={formState.dataToSubmit.password}
            onChange={inputChangeHandler}
            error={formState.validationErrors['password']}
          />

          {sendState.error &&
            Object.keys(formState.validationErrors).length <= 0 && (
              <ApiError
                statusCode={sendState.error.code}
                message={sendState.error.message}
              />
            )}

          <FormFooter
            resetOnClick={() => setFormState(blankForm)}
            disabledAllButtons={sendState.isSending}
          />
        </Form>
      </Paper>
    </Container>
  );
};

export default Login;
