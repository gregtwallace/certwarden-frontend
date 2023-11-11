import { type FC, type FormEventHandler } from 'react';
import {
  type authorizationResponseType,
  isAuthorizationResponseType,
} from '../../../types/api';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../types/frontend';

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
  sendError: frontendErrorType | undefined;
  validationErrors: validationErrorsType;
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
    sendError: undefined,
    validationErrors: new Map<string, boolean>(),
  };
  const [formState, setFormState] = useState(blankForm);

  // form data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

  // submit login form
  const submitFormHandler: FormEventHandler = (event) => {
    event.preventDefault();

    // form validation
    const validationErrors = new Map<string, boolean>();

    // username (not blank)
    if (formState.dataToSubmit.username.length <= 0) {
      validationErrors.set('dataToSubmit.username', true);
    }

    // password (not blank)
    if (formState.dataToSubmit.password.length <= 0) {
      validationErrors.set('dataToSubmit.password', true);
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (validationErrors.size > 0) {
      return;
    }
    // form validation - end

    doSendData<authorizationResponseType>(
      'POST',
      LOGIN_URL,
      formState.dataToSubmit,
      isAuthorizationResponseType
    ).then(({ responseData, error }) => {
      // set auth if success
      if (responseData && responseData.status_code === 200) {
        setAuth(responseData.authorization);
      } else {
        // failed, clear form and set error
        setFormState({
          ...blankForm,
          sendError: error,
        });
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
            error={formState.validationErrors.get('dataToSubmit.username')}
          />

          <InputTextField
            id='dataToSubmit.password'
            label='Password'
            value={formState.dataToSubmit.password}
            onChange={inputChangeHandler}
            error={formState.validationErrors.get('dataToSubmit.password')}
          />

          {formState.sendError &&
            Object.keys(formState.validationErrors).length <= 0 && (
              <ApiError
                statusCode={formState.sendError.statusCode}
                message={formState.sendError.message}
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