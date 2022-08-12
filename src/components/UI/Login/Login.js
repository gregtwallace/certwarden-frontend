import { useState } from 'react';

import useApiSend from '../../../hooks/useApiSend';

import Form from '../Form/Form';
import FormError from '../Form/FormError';
import InputText from '../Form/InputText';
import Button from '../Button/Button';

import styles from './Login.module.css';

const Login = (props) => {
  var [sendApiState, sendData] = useApiSend();

  var [formState, setFormState] = useState({
    username: '',
    password: '',
  });

  // form data change handler
  const inputChangeHandler = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  };

  // submit login form
  const submitLogin = (event) => {
    event.preventDefault();

    sendData(`/v1/login`, 'POST', formState).then((success) => {
      if (success) {
        props.setJwt(success.jwt);
      }
    });
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login}>
        <Form>
          <InputText
            label='Username'
            id='username'
            name='username'
            value={formState.username}
            onChange={inputChangeHandler}
          />

          <InputText
            label='Password'
            id='password'
            name='password'
            type='password'
            value={formState.password}
            onChange={inputChangeHandler}
          />

          <Button
            type='submit'
            onClick={submitLogin}
            disabled={sendApiState.isSending}
          >
            Login
          </Button>
        </Form>

      </div>
      {sendApiState.errorMessage && (
          <FormError className={styles.login_error}>{sendApiState.errorMessage}</FormError>
        )}
    </div>
  );
};

export default Login;
