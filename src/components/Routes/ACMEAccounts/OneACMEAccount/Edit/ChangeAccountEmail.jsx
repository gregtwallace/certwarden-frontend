import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxiosGet from '../../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../../hooks/useAxiosSend';
import { formChangeHandlerFunc } from '../../../../../helpers/input-handler';
import { isEmailValid } from '../../../../../helpers/form-validation';

import ApiError from '../../../../UI/Api/ApiError';
import ApiLoading from '../../../../UI/Api/ApiLoading';
import Button from '../../../../UI/Button/Button';
import Form from '../../../../UI/FormMui/Form';
import FormContainer from '../../../../UI/FormMui/FormContainer';
import FormFooter from '../../../../UI/FormMui/FormFooter';
import InputTextField from '../../../../UI/FormMui/InputTextField';
import TitleBar from '../../../../UI/TitleBar/TitleBar';

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
  const inputChangeHandler = formChangeHandlerFunc(setFormState);

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
        <ApiError
          code={apiGetState.errorCode}
          message={apiGetState.errorMessage}
        />
      )}

      {renderApiItems && (
        <Form onSubmit={submitFormHandler}>
          <InputTextField
            id='form.name'
            label='Name'
            value={apiGetState.acme_account.name}
            disabled
          />

          <InputTextField
            id='form.description'
            label='Description'
            value={
              apiGetState.acme_account.description
                ? apiGetState.acme_account.description
                : 'None'
            }
            disabled
          />

          <InputTextField
            id='form.email'
            label='Contact E-Mail Address'
            value={formState.form.email}
            onChange={inputChangeHandler}
            error={formState.validationErrors.email}
          />

          {apiSendState.errorMessage &&
            Object.keys(formState.validationErrors).length <= 0 && (
              <ApiError
                code={apiSendState.errorCode}
                message={apiSendState.errorMessage}
              />
            )}

          <FormFooter>
            <Button
              type='cancel'
              href={`/acmeaccounts/${id}`}
              disabled={apiSendState.isSending}
            >
              Cancel
            </Button>
            <Button
              type='reset'
              onClick={() => setFormToApi()}
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
