import { useState } from 'react';

import useAxiosSend from '../../hooks/useAxiosSend';

import Form from '../UI/FormMui/Form';
import GridItemContainer from '../UI/Grid/GridItemContainer';
import FormError from '../UI/FormMui/FormError';
import FormFooter from '../UI/FormMui/FormFooter';
import Button from '../UI/Button/Button';
import GridTitle from '../UI/Grid/GridTitle';
import InputTextField from '../UI/FormMui/InputTextField';

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
  const inputChangeHandler = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        [event.target.name]: event.target.value,
      },
    }));
  };

  // button handlers
  const resetClickHandler = (event) => {
    event.preventDefault();
    setFormState(blankFormState);
  };

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    // form validation
    let validationErrors = [];
    // TODO: Additional password complexity requirements?
    // new password
    if (formState.form.new_password.length < 10) {
      validationErrors.new_password = true;
    }

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

    sendData(`/v1/auth/changepassword`, 'PUT', formState.form, true).then(
      (success) => {
        if (success) {
          // clear form
          setFormState({
            ...blankFormState,
            apiMessage: success?.message,
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
          label='Current Password'
          id='current_password'
          type='password'
          value={formState.form.current_password}
          onChange={inputChangeHandler}
        />

        <InputTextField
          label='New Password'
          id='new_password'
          type='password'
          value={formState.form.new_password}
          onChange={inputChangeHandler}
          error={formState.validationErrors.new_password && true}
        />

        <InputTextField
          label='Confirm New Password'
          id='confirm_new_password'
          type='password'
          value={formState.form.confirm_new_password}
          onChange={inputChangeHandler}
          error={formState.validationErrors.confirm_new_password && true}
        />

        {apiSendState.errorMessage && formState.validationErrors.length > 0 && (
          <FormError>Error Posting -- {apiSendState.errorMessage}</FormError>
        )}

        <FormFooter>
          <Button
            type='reset'
            onClick={resetClickHandler}
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
