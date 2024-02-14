import { type FC, type FormEventHandler } from 'react';
import {
  type providerResponseType,
  parseProviderResponseType,
} from '../../../../types/api';
import { type providerFormStateType } from '../../../../types/frontend';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { getProvider, providersList } from './providers';
import { inputHandlerFuncMaker } from '../../../../helpers/input-handler';
import { isDomainValid } from '../../../../helpers/form-validation';

import ApiError from '../../../UI/Api/ApiError';
import Form from '../../../UI/FormMui/Form';
import FormFooter from '../../../UI/FormMui/FormFooter';
import FormInfo from '../../../UI/FormMui/FormInfo';
import InputSelect from '../../../UI/FormMui/InputSelect';
import InputArrayText from '../../../UI/FormMui/InputArrayText';
import FormContainer from '../../../UI/FormMui/FormContainer';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const NEW_PROVIDER_URL = '/v1/app/challenges/providers/services';

const AddOneProvider: FC = () => {
  const { axiosSendState, apiCall } = useAxiosSend();
  const navigate = useNavigate();

  const blankForm: providerFormStateType = {
    provider_type_value: '',
    provider_options: undefined,
    dataToSubmit: {
      domains: [''],
      config: {},
    },
    sendError: undefined,
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankForm);

  // get provider type
  const provider = getProvider(formState.provider_type_value);

  // data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

  // form submission handler
  const submitFormHandler: FormEventHandler = (event) => {
    event.preventDefault();

    // form provider type specific validation
    const validationErrors = provider.validationFunc(formState);

    // must select provider type
    if (formState.provider_type_value === '') {
      validationErrors['provider_type_value'] = true;
    }

    // common domain validation
    // if singular wildcard domain, allow as this is wildcard provider
    if (
      JSON.stringify(formState.dataToSubmit['domains']) != JSON.stringify(['*'])
    ) {
      formState.dataToSubmit['domains'].forEach((domain, i) => {
        if (!isDomainValid(domain, false)) {
          validationErrors['dataToSubmit.domains.' + i] = true;
        }
      });
    }

    // update state with validation result
    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    // form validation -- end

    apiCall<providerResponseType>(
      'POST',
      NEW_PROVIDER_URL,
      {
        domains: formState.dataToSubmit.domains,
        [provider.configName]: formState.dataToSubmit.config,
      },
      parseProviderResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate(`/providers`);
      } else {
        // failed, set error
        setFormState((prevState) => ({
          ...prevState,
          sendError: error,
        }));
      }
    });
  };

  return (
    <FormContainer>
      <TitleBar title='New Challenge Provider' helpURL={provider.helpUrl} />

      <Form onSubmit={submitFormHandler}>
        <InputSelect
          id='provider_type_value'
          label='Provider Type'
          options={providersList}
          value={formState.provider_type_value}
          onChange={inputChangeHandler}
          error={formState.validationErrors['provider_type_value']}
        />

        {formState.provider_type_value !== '' && (
          <>
            {!provider.supportsWindows && (
              <FormInfo color='error'>
                Warning: This provider does not work if the backend is running
                on Windows OS.
              </FormInfo>
            )}

            <InputArrayText
              id='dataToSubmit.domains'
              label='Domains'
              subLabel='Domain'
              minElements={1}
              value={formState.dataToSubmit.domains}
              onChange={inputChangeHandler}
              validationErrors={formState.validationErrors}
              helpURL='https://www.legocerthub.com/docs/user_interface/providers/#domains'
            />

            <provider.FormComponent
              formState={formState}
              onChange={inputChangeHandler}
            />
          </>
        )}

        {formState.sendError &&
          Object.keys(formState.validationErrors).length <= 0 && (
            <ApiError
              statusCode={formState.sendError.statusCode}
              message={formState.sendError.message}
            />
          )}

        <FormFooter
          cancelHref='/providers'
          resetOnClick={() => {
            setFormState(blankForm);
          }}
          disabledAllButtons={axiosSendState.isSending}
          disabledResetButton={
            JSON.stringify(formState.dataToSubmit) ===
            JSON.stringify(blankForm.dataToSubmit)
          }
        />
      </Form>
    </FormContainer>
  );
};

export default AddOneProvider;
