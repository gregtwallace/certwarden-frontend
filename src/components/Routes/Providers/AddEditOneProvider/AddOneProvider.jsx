import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { getProvider, providerTypes } from './provider-types';
import { formChangeHandlerFunc } from '../../../../helpers/input-handler';
import { isDomainValid } from '../../../../helpers/form-validation';

import { Typography } from '@mui/material';
import ApiError from '../../../UI/Api/ApiError';
import Button from '../../../UI/Button/Button';
import Form from '../../../UI/FormMui/Form';
import FormFooter from '../../../UI/FormMui/FormFooter';
import InputSelect from '../../../UI/FormMui/InputSelect';
import InputTextArray from '../../../UI/FormMui/InputTextArray';
import FormContainer from '../../../UI/FormMui/FormContainer';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const AddOneProvider = () => {
  const [apiSendState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  const blankForm = {
    provider_type_value: '',
    form: {
      domains: [''],
    },
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankForm);

  // get provider type
  const provider = getProvider(formState.provider_type_value);

  // data change handler
  const inputChangeHandler = formChangeHandlerFunc(setFormState);

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    // form provider type specific validation
    let validationErrors = provider.validationFunc(formState);

    // common domain validation
    let domains = [];
    // if singular wildcard domain, allow as this is wildcard provider
    if (JSON.stringify(formState.form.domains) != JSON.stringify(['*'])) {
      formState.form.domains.forEach((domain, i) => {
        if (!isDomainValid(domain, false)) {
          domains.push(i);
        }
      });
      // if any domain invalid, create the error array
      if (domains.length !== 0) {
        validationErrors.domains = domains;
      }
    }

    // update state with validation result
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
      { [provider.configName]: formState.form },
      true
    ).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        // back to the providers page
        navigate(`/providers`);
      }
    });
  };

  // for disable reset/submit buttons
  const formUnchanged = formState.provider_type_value === '';

  return (
    <FormContainer>
      <TitleBar title='New Challenge Provider' />

      <Form onSubmit={submitFormHandler}>
        <InputSelect
          id='provider_type_value'
          label='Provider Type'
          options={providerTypes}
          value={formState.provider_type_value}
          onChange={inputChangeHandler}
        />

        {formState.provider_type_value !== '' && (
          <>
            {!!provider.noWindows && (
              <Typography color='error' variant='subtitle2' sx={{ m: 2 }}>
                Warning: This provider does not work if the backend is running
                on Windows OS.
              </Typography>
            )}

            <Typography variant='body2' sx={{ m: 2 }}>
              Either list the domains you want this provider to be used for or
              list a single domain with the value of an asterisk (*) to use this
              provider as a catch-all (wildcard). Only one provider can be a
              wildcard provider and LeGo uses it for any domain not explicitly
              listed in another provider.
            </Typography>

            <InputTextArray
              id='form.domains'
              label='Domains'
              subLabel='Domain'
              minElements={1}
              value={formState.form.domains}
              onChange={inputChangeHandler}
              error={formState.validationErrors.domains}
            />

            <provider.FormComponent
              formState={formState}
              onChange={inputChangeHandler}
            />
          </>
        )}

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
            onClick={() => setFormState(blankForm)}
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
    </FormContainer>
  );
};

export default AddOneProvider;
