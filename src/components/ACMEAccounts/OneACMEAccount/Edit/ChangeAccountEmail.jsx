import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { isEmailValid } from '../../../../helpers/form-validation';

import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import Button from '../../../UI/Button/Button';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormError from '../../../UI/FormMui/FormError';
import FormFooter from '../../../UI/FormMui/FormFooter';
import InputTextField from '../../../UI/FormMui/InputTextField';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const ChangeAccountEmail = () => {
  const { id } = useParams();
  const [apiGetState] = useAxiosGet(
    `/v1/acmeaccounts/${id}`,
    'acme_account',
    true
  );

  const [apiSendState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({});

  // Function to set the form equal to the current API state
  const setFormToApi = useCallback(() => {
    setFormState({
      form: {
        email: apiGetState.acme_account.email,
      },
      validationErrors: {},
    });
  }, [apiGetState]);

  useEffect(() => {
    // execute actions after loaded
    if (apiGetState.isLoaded) {
      // if api error, redirect to root /acmeaccounts
      if (apiGetState.errorMessage) {
        navigate('/acmeaccounts');
      } else if (
        // if no api error, but account isn't in a state to edit email, go back to edit account
        apiGetState.acme_account.status !== 'valid' ||
        apiGetState.acme_account.kid === ''
      ) {
        navigate(`/acmeaccounts/${id}`);
      }

      setFormToApi();
    }
  }, [apiGetState, id, setFormToApi, navigate]);

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

    // client side validation
    let validationErrors = {};
    // check email (can't edit ACME to blank)
    if (!isEmailValid(formState.form.email)) {
      validationErrors.email = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    // client side validation -- end

    sendData(`/v1/acmeaccounts/${id}/email`, 'PUT', formState.form, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          navigate(`/acmeaccounts/${id}`);
        }
      }
    );
  };

  // consts related to rendering
  // don't render if not loaded, error, or formState not yet set
  // formState set is needed to prevent animations of form fields
  // populating (when previously using a blank form object) or invalid
  // references to formState.form now that blank form object is gone
  const renderApiItems =
    apiGetState.isLoaded &&
    !apiGetState.errorMessage &&
    JSON.stringify({}) !== JSON.stringify(formState);

  var formUnchanged = false;
  if (renderApiItems) {
    formUnchanged = apiGetState.acme_account.email === formState.form.email;
  }

  return (
    <FormContainer>
      <TitleBar title='Change ACME Account Email' />

      {!apiGetState.isLoaded && <ApiLoading />}
      {apiGetState.errorMessage && (
        <ApiError>{apiGetState.errorMessage}</ApiError>
      )}

      {renderApiItems && (
        <Form onSubmit={submitFormHandler}>
          <InputTextField
            label='Name'
            id='name'
            value={apiGetState.acme_account.name}
            disabled
          />

          <InputTextField
            label='Description'
            id='description'
            value={
              apiGetState.acme_account.description
                ? apiGetState.acme_account.description
                : 'None'
            }
            disabled
          />

          <InputTextField
            label='Contact E-Mail Address'
            id='email'
            name='email'
            value={formState.form.email}
            onChange={inputChangeHandler}
            error={formState.validationErrors.email && true}
          />

          {apiSendState.errorMessage &&
            Object.keys(formState.validationErrors).length <= 0 && (
              <FormError>
                Error Sending -- {apiSendState.errorMessage}
              </FormError>
            )}

          <FormFooter>
            <Button
              type='cancel'
              onClick={cancelClickHandler}
              disabled={apiSendState.isSending}
            >
              Cancel
            </Button>
            <Button
              type='reset'
              onClick={resetClickHandler}
              disabled={apiSendState.isSending || formUnchanged}
            >
              Reset
            </Button>
            <Button
              type='submit'
              disabled={apiSendState.isSending || formUnchanged}
            >
              Submit
            </Button>
          </FormFooter>
        </Form>
      )}
    </FormContainer>
  );
};

export default ChangeAccountEmail;
