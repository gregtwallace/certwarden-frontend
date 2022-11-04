import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { isEmailValid } from '../../../../helpers/form-validation';

import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import InputText from '../../../UI/Form/InputText';
import FormInformation from '../../../UI/Form/FormInformation';
import FormError from '../../../UI/Form/FormError';
import Button from '../../../UI/Button/Button';
import Form from '../../../UI/Form/Form';
import H2Header from '../../../UI/Header/H2Header';

const ChangeAccountEmail = () => {
  const { id } = useParams();
  const [ apiGetState ] = useAxiosGet(
    `/v1/acmeaccounts/${id}`,
    'acme_account',
    true
  );

  const [sendApiState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  // set dummy state prior to apiGet loading
  // only includes values that will be used in payload
  const [formState, setFormState] = useState({
    acme_account: {
      email: '',
    },
    validationErrors: {},
  });

  // Function to set the form equal to the current API state
  const setFormToApi = useCallback(() => {
    setFormState({
      acme_account: {
        email: apiGetState.acme_account.email,
      },
      validationErrors: {},
    });
  }, [apiGetState]);

  useEffect(() => {
    if (apiGetState.isLoaded && !apiGetState.errorMessage) {
      
      // if the account is not valid or is missing kid, this page won't work
      // so redirect to main account page
      if (apiGetState.acme_account.status !== 'valid' || apiGetState.acme_account.kid === '') {
        navigate(`/acmeaccounts/${id}`);
      }

      setFormToApi();
    }
  }, [apiGetState, id, setFormToApi, navigate]);

  // data change handler
  const inputChangeHandler = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      acme_account: {
        ...prevState.acme_account,
        [event.target.id]: event.target.value,
      },
    }));
  };

  // button handlers
  const resetClickHandler = (event) => {
    event.preventDefault();

    setFormToApi();
  };
  const cancelClickHandler = (event) => {
    event.preventDefault();
    //navigate('.');
    navigate(`/acmeaccounts/${id}`);
  };

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    /// client side validation
    let validationErrors = {};
    // check email (can't edit ACME to blank)
    if (!isEmailValid(formState.acme_account.email)) {
      validationErrors.email = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    ///

    sendData(
      `/v1/acmeaccounts/${id}/email`,
      'PUT',
      formState.acme_account,
      true
    ).then((success) => {
      if (success) {
        navigate(`/acmeaccounts/${id}`);
      }
    });
  };

  if (apiGetState.errorMessage) {
    return <ApiError>{apiGetState.errorMessage}</ApiError>;
  } else if (!apiGetState.isLoaded) {
    return <ApiLoading />;
  } else {
    return (
      <>
        <H2Header h2='ACME Account - Change Email'></H2Header>
        <Form onSubmit={submitFormHandler}>
          {sendApiState.errorMessage && (
            <FormError>Error Posting -- {sendApiState.errorMessage}</FormError>
          )}

          <FormInformation>
            Account Name: {apiGetState.acme_account.name}
          </FormInformation>

          <FormInformation>
            Account Description: {apiGetState.acme_account.description}
          </FormInformation>

          {/* TODO: Allow multiple email addresses */}
          <InputText
            label='E-Mail Address'
            id='email'
            name='email'
            value={formState.acme_account.email}
            onChange={inputChangeHandler}
            invalid={formState.validationErrors.email && true}
          />

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
          <Button
            type='cancel'
            onClick={cancelClickHandler}
            disabled={sendApiState.isSending}
          >
            Cancel
          </Button>
        </Form>
      </>
    );
  }
};

export default ChangeAccountEmail;
