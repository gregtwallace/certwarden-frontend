import { useState } from 'react';

import useAxiosSend from '../../hooks/useAxiosSend';

import Form from '../UI/Form/Form';
import InputText from '../UI/Form/InputText';
import Button from '../UI/Button/Button';
import FormResponse from '../UI/Form/FormResponse';
import H5Header from '../UI/Header/H5Header';

const ChangePassword = () => {
  const [sendApiState, sendData] = useAxiosSend();

  const blankFormState = {
    payload: {
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
      payload: {
        ...prevState.payload,
        [event.target.id]: event.target.value,
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

    /// form validation
    let validationErrors = [];
    // TODO: Additional password complexity requirements?
    // new password
    if (formState.payload.new_password.length < 10) {
      validationErrors.new_password = true;
    }

    // confirm password
    if (formState.payload.new_password !== formState.payload.confirm_new_password) {
      validationErrors.confirm_new_password = true;
    }

    // TODO: Confirm passwords match

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    //

    sendData(`/v1/auth/changepassword`, 'PUT', formState.payload, true).then(
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
    <>
      <H5Header h5="Change Password" />
      <Form onSubmit={submitFormHandler}>
        {/* {sendApiState.errorMessage && (
          <FormError>Error Posting -- {sendApiState.errorMessage}</FormError>
        )} */}
        <InputText
          label='Current Password'
          id='current_password'
          name='name'
          type='password'
          value={formState.payload.current_password}
          onChange={inputChangeHandler}
        />
        <InputText
          label='New Password'
          id='new_password'
          name='new_password'
          type='password'
          value={formState.payload.new_password}
          onChange={inputChangeHandler}
          invalid={formState.validationErrors.new_password && true}
        />
        <InputText
          label='Confirm New Password'
          id='confirm_new_password'
          name='confirm_new_password'
          type='password'
          value={formState.payload.confirm_new_password}
          onChange={inputChangeHandler}
          invalid={formState.validationErrors.confirm_new_password && true}
        />

        {!sendApiState.errorMessage && formState.apiMessage && (
          <FormResponse>Password successfully changed.</FormResponse>
        )}

        <Button type='submit' disabled={sendApiState.isSending}>
          Submit
        </Button>
        <Button
          type='reset'
          onClick={resetClickHandler}
          disabled={sendApiState.isSending}
        >
          Reset
        </Button>
      </Form>
    </>
  );
};

export default ChangePassword;
