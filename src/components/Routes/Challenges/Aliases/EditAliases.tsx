import { type FC, type FormEventHandler } from 'react';
import {
  type domainAliasesType,
  type domainAliasesResponseType,
  parseDomainAliasesResponseType,
} from '../../../../types/api';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../../types/frontend';

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { inputHandlerFuncMaker } from '../../../../helpers/input-handler';
import { isDomainValid } from '../../../../helpers/form-validation';

import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormFooter from '../../../UI/FormMui/FormFooter';
import TitleBar from '../../../UI/TitleBar/TitleBar';
import InputArrayObjectsOfText from '../../../UI/FormMui/InputArrayObjectsOfText';

const CHALLENGES_DOMAIN_ALIASES = '/v1/app/challenges/domainaliases';

// form shape
type formObj = {
  getResponseData: domainAliasesResponseType | undefined;
  getError: frontendErrorType | undefined;
  dataToSubmit: {
    domain_aliases: domainAliasesType;
  };
  sendError: frontendErrorType | undefined;
  validationErrors: validationErrorsType;
};

const EditAliases: FC = () => {
  const { getState } = useAxiosGet<domainAliasesResponseType>(
    CHALLENGES_DOMAIN_ALIASES,
    parseDomainAliasesResponseType
  );
  const { axiosSendState, apiCall } = useAxiosSend();
  const navigate = useNavigate();

  const makeStartingForm: () => formObj = useCallback(
    () => ({
      getResponseData: getState.responseData,
      getError: getState.error,
      dataToSubmit: {
        domain_aliases: getState.responseData?.domain_aliases || [],
      },
      sendError: undefined,
      validationErrors: {},
    }),
    [getState]
  );
  const [formState, setFormState] = useState<formObj>(makeStartingForm());

  // reload starting form after GET loads
  useEffect(() => {
    setFormState(makeStartingForm());
  }, [setFormState, makeStartingForm]);

  // data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

  // form submission handler
  const submitFormHandler: FormEventHandler = (event) => {
    event.preventDefault();

    // form validation
    const validationErrors: validationErrorsType = {};

    formState.dataToSubmit.domain_aliases.map((alias, index) => {
      // challenge domain
      if (!isDomainValid(alias.challenge_domain)) {
        validationErrors[`dataToSubmit.domain_aliases.${index}`] = true;
        validationErrors[
          `dataToSubmit.domain_aliases.${index}.challenge_domain`
        ] = true;
      }

      // provision domain
      if (!isDomainValid(alias.provision_domain)) {
        validationErrors[`dataToSubmit.domain_aliases.${index}`] = true;
        validationErrors[
          `dataToSubmit.domain_aliases.${index}.provision_domain`
        ] = true;
      }

      // duplicate challenge domain check
      formState.dataToSubmit.domain_aliases.map((dupeAlias, dupeIndex) => {
        if (
          alias.challenge_domain === dupeAlias.challenge_domain &&
          index !== dupeIndex
        ) {
          validationErrors[`dataToSubmit.domain_aliases.${index}`] = true;
          validationErrors[
            `dataToSubmit.domain_aliases.${index}.challenge_domain`
          ] = true;
        }
      });
    });

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    // form validation - end

    apiCall<domainAliasesResponseType>(
      'POST',
      CHALLENGES_DOMAIN_ALIASES,
      formState.dataToSubmit,
      parseDomainAliasesResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate('/challenges/providers');
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
      <TitleBar
        title='Domain Aliases'
        helpURL='https://www.certwarden.com/docs/user_interface/providers/#domain-aliases'
      />

      {!formState.getResponseData && !formState.getError && <ApiLoading />}

      {formState.getError && (
        <ApiError
          statusCode={formState.getError.statusCode}
          message={formState.getError.message}
        />
      )}

      {formState.getResponseData && (
        <Form onSubmit={submitFormHandler}>
          <InputArrayObjectsOfText
            id='dataToSubmit.domain_aliases'
            label='Domain Aliases'
            subLabel='Alias'
            newObject={{
              challenge_domain: '',
              provision_domain: '',
            }}
            value={formState.dataToSubmit.domain_aliases}
            onChange={inputChangeHandler}
            validationErrors={formState.validationErrors}
          />

          {formState.sendError &&
            Object.keys(formState.validationErrors).length <= 0 && (
              <ApiError
                statusCode={formState.sendError.statusCode}
                message={formState.sendError.message}
              />
            )}

          <FormFooter
            cancelHref='/challenges/providers'
            resetOnClick={() => setFormState(makeStartingForm())}
            disabledAllButtons={axiosSendState.isSending}
            disabledResetButton={
              JSON.stringify(formState.dataToSubmit) ===
              JSON.stringify(makeStartingForm().dataToSubmit)
            }
          />
        </Form>
      )}
    </FormContainer>
  );
};

export default EditAliases;
