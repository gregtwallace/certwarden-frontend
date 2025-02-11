import { type FC, type FormEventHandler } from 'react';
import {
  type authorizationResponseType,
  parseAuthorizationResponseType,
} from '../../../types/api';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../types/frontend';

import { useState } from 'react';

import useAuth from '../../../hooks/useAuth';
import useAxiosSend from '../../../hooks/useAxiosSend';
import { inputHandlerFuncMaker } from '../../../helpers/input-handler';

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
const LoginLocal: FC = () => {
  const { axiosSendState, apiCall } = useAxiosSend();
  const { setAuth } = useAuth();

  // set blank form state
  const blankForm: formObj = {
    dataToSubmit: {
      username: '',
      password: '',
    },
    sendError: undefined,
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankForm);

  // form data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

  // submit login form
  const submitFormHandler: FormEventHandler = (event) => {
    event.preventDefault();

    // form validation
    const validationErrors: validationErrorsType = {};

    // username (not blank)
    if (formState.dataToSubmit.username.length <= 0) {
      validationErrors['dataToSubmit.username'] = true;
    }

    // password (not blank)
    if (formState.dataToSubmit.password.length <= 0) {
      validationErrors['dataToSubmit.password'] = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    // form validation - end

    apiCall<authorizationResponseType>(
      'POST',
      LOGIN_URL,
      formState.dataToSubmit,
      parseAuthorizationResponseType
    ).then(({ responseData, error }) => {
      // set auth if success
      if (responseData) {
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
    <Form onSubmit={submitFormHandler}>
      <InputTextField
        id='dataToSubmit.username'
        label='Username'
        value={formState.dataToSubmit.username}
        onChange={inputChangeHandler}
        error={formState.validationErrors['dataToSubmit.username']}
      />

      <InputTextField
        id='dataToSubmit.password'
        label='Password'
        value={formState.dataToSubmit.password}
        onChange={inputChangeHandler}
        error={formState.validationErrors['dataToSubmit.password']}
      />

      {formState.sendError &&
        Object.keys(formState.validationErrors).length <= 0 && (
          <ApiError
            statusCode={formState.sendError.statusCode}
            message={formState.sendError.message}
          />
        )}

      <FormFooter
        resetOnClick={() => {
          setFormState(blankForm);
        }}
        disabledAllButtons={axiosSendState.isSending}
        disabledResetButton={
          JSON.stringify(formState.dataToSubmit) ===
          JSON.stringify(blankForm.dataToSubmit)
        }
      />
    </Form>
  );
};

export default LoginLocal;
