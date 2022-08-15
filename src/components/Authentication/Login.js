import { useState } from 'react';

import useAxiosSend from '../../hooks/useAxiosSend';
import useAuth from '../../hooks/useAuth';

import Form from '../UI/Form/Form';
import FormError from '../UI/Form/FormError';
import InputText from '../UI/Form/InputText';
import Button from '../UI/Button/Button';

import styles from './Login.module.css';

const LOGIN_URL = '/v1/auth/login';

const Login = (props) => {
  const [sendState, sendData] = useAxiosSend();
  const { setAuth } = useAuth();

  const [formState, setFormState] = useState({
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

    sendData(LOGIN_URL, 'POST', true, formState).then((success) => {
      if (success) {
        setAuth({
          username: formState.username,
          accessToken: success?.access_token,
        });
      } else {
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
            disabled={sendState.isSending}
          >
            Login
          </Button>
        </Form>
      </div>
      {sendState.errorMessage && (
        <FormError className={styles.login_error}>
          {sendState.errorMessage}
        </FormError>
      )}
    </div>
  );
};

export default Login;
