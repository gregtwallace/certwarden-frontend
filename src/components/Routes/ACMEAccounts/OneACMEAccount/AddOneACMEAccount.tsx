import { type FC, type FormEventHandler } from 'react';
import {
  type acmeAccountOptionsResponseType,
  parseAcmeAccountOptionsResponse,
  type oneAcmeAccountResponseType,
  parseOneAcmeAccountResponseType,
} from '../../../../types/api';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../../types/frontend';

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { inputHandlerFuncMaker } from '../../../../helpers/input-handler';
import { isNameValid, isEmailValid } from '../../../../helpers/form-validation';
import { newId } from '../../../../helpers/constants';
import {
  buildAcmeServerOptions,
  buildPrivateKeyOptions,
} from '../../../../helpers/options_builders';

import { Link } from '@mui/material';

import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import InputCheckbox from '../../../UI/FormMui/InputCheckbox';
import InputSelect from '../../../UI/FormMui/InputSelect';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormFooter from '../../../UI/FormMui/FormFooter';
import InputTextField from '../../../UI/FormMui/InputTextField';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const NEW_ACME_ACCOUNT_URL = '/v1/acmeaccounts';
const ACME_ACCOUNT_OPTIONS_URL = `/v1/acmeaccounts/${newId}`;

// form shape
type formObj = {
  getResponseData: acmeAccountOptionsResponseType | undefined;
  getError: frontendErrorType | undefined;
  dataToSubmit: {
    name: string;
    description: string;
    email: string;
    acme_server_id: number | '';
    private_key_id: number | '';
    accepted_tos: boolean;
  };
  sendError: frontendErrorType | undefined;
  validationErrors: validationErrorsType;
};

const AddOneACMEAccount: FC = () => {
  // fetch new options
  const { getState } = useAxiosGet<acmeAccountOptionsResponseType>(
    ACME_ACCOUNT_OPTIONS_URL,
    parseAcmeAccountOptionsResponse
  );

  const { axiosSendState, apiCall } = useAxiosSend();
  const navigate = useNavigate();

  const blankForm: formObj = useMemo(
    () => ({
      getResponseData: getState.responseData,
      getError: getState.error,
      dataToSubmit: {
        name: '',
        description: '',
        email: '',
        acme_server_id: '',
        private_key_id: '',
        accepted_tos: false,
      },
      sendError: undefined,
      validationErrors: {},
    }),
    [getState]
  );
  const [formState, setFormState] = useState(blankForm);

  // update state when GET loads
  useEffect(() => {
    setFormState(blankForm);
  }, [blankForm, setFormState]);

  // data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

  // submit handler
  const submitFormHandler: FormEventHandler = (event) => {
    event.preventDefault();

    // form validation
    const validationErrors: validationErrorsType = {};

    // name
    if (!isNameValid(formState.dataToSubmit.name)) {
      validationErrors['dataToSubmit.name'] = true;
    }

    // check email format
    if (!isEmailValid(formState.dataToSubmit.email)) {
      validationErrors['dataToSubmit.email'] = true;
    }

    // check ACME server us selected
    if (formState.dataToSubmit.acme_server_id === '') {
      validationErrors['dataToSubmit.acme_server_id'] = true;
    }

    // check private key is selected
    if (formState.dataToSubmit.private_key_id === '') {
      validationErrors['dataToSubmit.private_key_id'] = true;
    }

    // ToS must be accepted
    if (formState.dataToSubmit.accepted_tos !== true) {
      validationErrors['dataToSubmit.accepted_tos'] = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    // form validation -- end

    apiCall<oneAcmeAccountResponseType>(
      'POST',
      NEW_ACME_ACCOUNT_URL,
      formState.dataToSubmit,
      parseOneAcmeAccountResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate(`/acmeaccounts/${responseData.acme_account.id}`);
      } else {
        // failed, set error
        setFormState((prevState) => ({
          ...prevState,
          sendError: error,
        }));
      }
    });
  };

  // logic to get tos_url (or undefined)
  const tos_url =
    formState.getResponseData?.acme_account_options.acme_servers.find(
      (serv) => serv.id === formState.dataToSubmit.acme_server_id
    )?.terms_of_service;

  return (
    <FormContainer>
      <TitleBar
        title='New ACME Account'
        helpURL='https://www.certwarden.com/docs/user_interface/acme_accounts/'
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
          <InputTextField
            id='dataToSubmit.name'
            label='Name'
            value={formState.dataToSubmit.name}
            onChange={inputChangeHandler}
            error={formState.validationErrors['dataToSubmit.name']}
          />

          <InputTextField
            id='dataToSubmit.description'
            label='Description'
            value={formState.dataToSubmit.description}
            onChange={inputChangeHandler}
          />

          <InputTextField
            id='dataToSubmit.email'
            label='Contact E-Mail Address'
            value={formState.dataToSubmit.email}
            onChange={inputChangeHandler}
            error={formState.validationErrors['dataToSubmit.email']}
          />

          <InputSelect
            id='dataToSubmit.acme_server_id'
            label='ACME Server'
            value={formState.dataToSubmit.acme_server_id}
            onChange={inputChangeHandler}
            options={buildAcmeServerOptions(
              formState.getResponseData.acme_account_options.acme_servers
            )}
            error={formState.validationErrors['dataToSubmit.acme_server_id']}
          />

          <InputSelect
            id='dataToSubmit.private_key_id'
            label='Private Key'
            value={formState.dataToSubmit.private_key_id}
            onChange={inputChangeHandler}
            options={buildPrivateKeyOptions(
              formState.getResponseData.acme_account_options.private_keys
            )}
            error={formState.validationErrors['dataToSubmit.private_key_id']}
          />

          <InputCheckbox
            id='dataToSubmit.accepted_tos'
            checked={formState.dataToSubmit.accepted_tos}
            onChange={inputChangeHandler}
            error={formState.validationErrors['dataToSubmit.accepted_tos']}
            disabled={formState.dataToSubmit.acme_server_id === ''}
          >
            Accept{' '}
            {!tos_url ? (
              "ACME Server's Terms of Service"
            ) : (
              <Link href={tos_url} target='_blank' rel='noreferrer'>
                ACME Server&apos;s Terms of Service
              </Link>
            )}
          </InputCheckbox>

          {formState.sendError &&
            Object.keys(formState.validationErrors).length <= 0 && (
              <ApiError
                statusCode={formState.sendError.statusCode}
                message={formState.sendError.message}
              />
            )}

          <FormFooter
            cancelHref='/acmeaccounts'
            resetOnClick={() => setFormState(blankForm)}
            disabledAllButtons={axiosSendState.isSending}
            disabledResetButton={
              JSON.stringify(formState.dataToSubmit) ===
              JSON.stringify(blankForm.dataToSubmit)
            }
          />
        </Form>
      )}
    </FormContainer>
  );
};

export default AddOneACMEAccount;
