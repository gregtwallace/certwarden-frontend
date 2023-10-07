import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosSend from '../../../../hooks/useAxiosSend';
import { dummyProviderType, providerTypes } from './provider-types';
import { formChangeHandlerFunc } from '../../../../helpers/input-handler';

import ApiError from '../../../UI/Api/ApiError';
import Button from '../../../UI/Button/Button';
import Form from '../../../UI/FormMui/Form';
import FormFooter from '../../../UI/FormMui/FormFooter';
import InputSelect from '../../../UI/FormMui/InputSelect';
import FormContainer from '../../../UI/FormMui/FormContainer';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const AddOneProvider = () => {
  const [apiSendState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  // provider and form state
  const [formState, setFormState] = useState({});

  // set initial form state with dummy provider type
  const setInitialFormState = useCallback(() => {
    setFormState({
      providerType: dummyProviderType,
      validationErrors: {},
    });
  }, [setFormState]);

  // set initial form on load
  useEffect(() => {
    setInitialFormState();
  }, [setInitialFormState]);

  // reset button resets form fields
  const resetClickHandler = () => {
    setInitialFormState();
  };

  // input handlers
  const formStateChangeHandler = formChangeHandlerFunc(setFormState);
  const providerTypeFormChangeHandler = (event) => {
    // get provider
    var providerType = providerTypes.find((obj) => {
      return obj.value === event.target.value;
    });

    // if failed
    if (providerType == undefined) {
      providerType = dummyProviderType;
    }

    setFormState((prevState) => ({
      ...prevState,
      form: providerType.blankConfig,
      providerType: providerType,
    }));
  };

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    // form validation
    const validationErrors = formState.providerType.validationErrorsFunc(
      formState.form
    );

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    // form validation -- end

    sendData(
      `/v1/app/challenges/providers/services`,
      'POST',
      { [formState.providerType.config_name]: { ...formState.form } },
      true
    ).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        // back to the providers page
        navigate(`/providers`);
      }
    });
  };

  // don't render until initial form state is set
  const renderForm = JSON.stringify({}) !== JSON.stringify(formState);

  return (
    <FormContainer>
      <TitleBar title='New Challenge Provider' />

      {renderForm && (
        <>
          <InputSelect
            label='Provider Type'
            id='provider_type'
            options={providerTypes}
            value={formState.providerType.value}
            onChange={providerTypeFormChangeHandler}
          />

          <Form onSubmit={submitFormHandler}>
            <formState.providerType.FormComponent
              formState={formState}
              onChange={formStateChangeHandler}
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
                href='/providers'
                disabled={apiSendState.isSending}
              >
                Cancel
              </Button>
              <Button
                type='reset'
                onClick={resetClickHandler}
                disabled={
                  apiSendState.isSending || formState.providerType.value === ''
                }
              >
                Reset
              </Button>
              <Button
                type='submit'
                disabled={
                  apiSendState.isSending || formState.providerType.value === ''
                }
              >
                Submit
              </Button>
            </FormFooter>
          </Form>
        </>
      )}
    </FormContainer>
  );
};

export default AddOneProvider;
