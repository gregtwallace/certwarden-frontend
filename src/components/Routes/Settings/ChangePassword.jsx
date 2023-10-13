import { useState } from 'react';

import useAxiosSend from '../../../hooks/useAxiosSend';
import { formChangeHandlerFunc } from '../../../helpers/input-handler';

import ApiError from '../../UI/Api/ApiError';
import Form from '../../UI/FormMui/Form';
import GridItemContainer from '../../UI/Grid/GridItemContainer';
import FormFooter from '../../UI/FormMui/FormFooter';
import Button from '../../UI/Button/Button';
import GridTitle from '../../UI/Grid/GridTitle';
import InputTextField from '../../UI/FormMui/InputTextField';

const ChangePassword = () => {
  const [apiSendState, sendData] = useAxiosSend();

  const blankFormState = {
    form: {
      // no username (extracted from jwt claims on backend)
      current_password: '',
      new_password: '',
      confirm_new_password: '',
    },
    apiMessage: '',
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankFormState);

  // data change handler
  const inputChangeHandler = formChangeHandlerFunc(setFormState);

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    // form validation
    let validationErrors = {};

    // confirm password
    if (formState.form.new_password !== formState.form.confirm_new_password) {
      validationErrors.confirm_new_password = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    // form validation -- end

    sendData(`/v1/app/auth/changepassword`, 'PUT', formState.form, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          // clear form
          setFormState({
            ...blankFormState,
            apiMessage: response.data?.response?.message,
          });
        }
      }
    );
  };

  return (
    <GridItemContainer>
      <GridTitle title='Change Password' />

      <Form onSubmit={submitFormHandler}>
        <InputTextField
          id='form.current_password'
          label='Current Password'
          type='password'
          value={formState.form.current_password}
          onChange={inputChangeHandler}
        />

        <InputTextField
          id='form.new_password'
          label='New Password'
          type='password'
          value={formState.form.new_password}
          onChange={inputChangeHandler}
          error={formState.validationErrors.new_password}
        />

        <InputTextField
          id='form.confirm_new_password'
          label='Confirm New Password'
          type='password'
          value={formState.form.confirm_new_password}
          onChange={inputChangeHandler}
          error={formState.validationErrors.confirm_new_password}
        />

        {apiSendState.errorMessage &&
          Object.keys(formState.validationErrors).length === 0 && (
            <ApiError
              code={apiSendState.errorCode}
              message={apiSendState.errorMessage}
            />
          )}

        <FormFooter>
          <Button
            type='reset'
            onClick={() => setFormState(blankFormState)}
            disabled={apiSendState.isSending}
          >
            Reset
          </Button>
          <Button type='submit' disabled={apiSendState.isSending}>
            Submit
          </Button>
        </FormFooter>
      </Form>
    </GridItemContainer>
  );
};

export default ChangePassword;
