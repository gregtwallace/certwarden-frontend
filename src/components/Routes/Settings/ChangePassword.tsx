import { type FC, type FormEventHandler } from 'react';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../types/frontend';
import {
  parseChangePasswordResponse,
  type changePasswordResponseType,
} from '../../../types/api';

import { useState } from 'react';

import useAxiosSend from '../../../hooks/useAxiosSend';
import { inputHandlerFuncMaker } from '../../../helpers/input-handler';

import ApiError from '../../UI/Api/ApiError';
import ApiSuccess from '../../UI/Api/ApiSuccess';
import Form from '../../UI/FormMui/Form';
import GridItemContainer from '../../UI/Grid/GridItemContainer';
import FormFooter from '../../UI/FormMui/FormFooter';
import GridTitle from '../../UI/Grid/GridTitle';
import InputTextField from '../../UI/FormMui/InputTextField';

// backend API path
const CHANGE_PASSWORD_URL = '/v1/app/auth/changepassword';

// form shape
type formObj = {
  dataToSubmit: {
    current_password: string;
    new_password: string;
    confirm_new_password: string;
  };
  sendSuccess: boolean | undefined;
  sendError: frontendErrorType | undefined;
  validationErrors: validationErrorsType;
};

const ChangePassword: FC = () => {
  const { axiosSendState, apiCall } = useAxiosSend();

  const blankFormState: formObj = {
    dataToSubmit: {
      // no username (extracted from jwt claims on backend)
      current_password: '',
      new_password: '',
      confirm_new_password: '',
    },
    sendSuccess: undefined,
    sendError: undefined,
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankFormState);

  // data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

  // form submission handler
  const submitFormHandler: FormEventHandler = (event) => {
    event.preventDefault();

    // form validation
    const validationErrors: validationErrorsType = {};

    // current password (not blank)
    if (formState.dataToSubmit.current_password.length <= 0) {
      validationErrors['dataToSubmit.current_password'] = true;
    }

    // new password (not blank)
    if (formState.dataToSubmit.new_password.length <= 0) {
      validationErrors['dataToSubmit.new_password'] = true;
    }

    // confirm password matches new password
    if (
      formState.dataToSubmit.new_password !==
      formState.dataToSubmit.confirm_new_password
    ) {
      validationErrors['dataToSubmit.confirm_new_password'] = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    // form validation - end

    apiCall<changePasswordResponseType>(
      'PUT',
      CHANGE_PASSWORD_URL,
      formState.dataToSubmit,
      parseChangePasswordResponse
    ).then(({ responseData, error }) => {
      // clear form and set success or error
      setFormState({
        ...blankFormState,
        sendSuccess: !!responseData,
        sendError: error,
      });
    });
  };

  return (
    <GridItemContainer>
      <GridTitle title='Change Password' />

      <Form onSubmit={submitFormHandler}>
        <InputTextField
          id='dataToSubmit.current_password'
          label='Current Password'
          value={formState.dataToSubmit.current_password}
          onChange={inputChangeHandler}
          error={formState.validationErrors['dataToSubmit.current_password']}
        />

        <InputTextField
          id='dataToSubmit.new_password'
          label='New Password'
          value={formState.dataToSubmit.new_password}
          onChange={inputChangeHandler}
          error={formState.validationErrors['dataToSubmit.new_password']}
        />

        <InputTextField
          id='dataToSubmit.confirm_new_password'
          label='Confirm New Password'
          value={formState.dataToSubmit.confirm_new_password}
          onChange={inputChangeHandler}
          error={
            formState.validationErrors['dataToSubmit.confirm_new_password']
          }
        />

        {formState.sendError && (
          <ApiError
            statusCode={formState.sendError.statusCode}
            message={formState.sendError.message}
          />
        )}

        {formState.sendSuccess && <ApiSuccess>Password changed.</ApiSuccess>}

        <FormFooter
          resetOnClick={() => setFormState(blankFormState)}
          disabledAllButtons={axiosSendState.isSending}
        />
      </Form>
    </GridItemContainer>
  );
};

export default ChangePassword;
