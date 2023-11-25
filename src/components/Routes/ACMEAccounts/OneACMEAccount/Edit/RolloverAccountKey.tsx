import { type FC, type FormEventHandler } from 'react';
import {
  type oneAcmeAccountResponseType,
  parseOneAcmeAccountResponseType,
  type acmeAccountOptionsResponseType,
  parseAcmeAccountOptionsResponse,
} from '../../../../../types/api';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../../../types/frontend';

import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxiosGet from '../../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../../hooks/useAxiosSend';
import { inputHandlerFuncMaker } from '../../../../../helpers/input-handler';
import { newId } from '../../../../../helpers/constants';
import { buildPrivateKeyOptions } from '../../../../../helpers/options_builders';

import ApiError from '../../../../UI/Api/ApiError';
import ApiLoading from '../../../../UI/Api/ApiLoading';
import Form from '../../../../UI/FormMui/Form';
import FormContainer from '../../../../UI/FormMui/FormContainer';
import FormFooter from '../../../../UI/FormMui/FormFooter';
import InputSelect from '../../../../UI/FormMui/InputSelect';
import InputTextField from '../../../../UI/FormMui/InputTextField';
import TitleBar from '../../../../UI/TitleBar/TitleBar';

const ONE_ACCOUNT_URL = '/v1/acmeaccounts';
const ACCOUNT_OPTIONS_URL = `/v1/acmeaccounts/${newId}`;

// form shape
type formObj = {
  getAccountResponseData: oneAcmeAccountResponseType | undefined;
  getAccountError: frontendErrorType | undefined;
  getOptionsResponseData: acmeAccountOptionsResponseType | undefined;
  getOptionsError: frontendErrorType | undefined;
  dataToSubmit: {
    private_key_id: number | '';
  };
  sendError: frontendErrorType | undefined;
  validationErrors: validationErrorsType;
};

const RolloverAccountKey: FC = () => {
  const { id } = useParams();
  const thisAccountUrl = `${ONE_ACCOUNT_URL}/${id}`;
  const thisAccountKeyChangeUrl = `${ONE_ACCOUNT_URL}/${id}/key-change`;

  // fetch current state
  const { getState: getAccountState } = useAxiosGet<oneAcmeAccountResponseType>(
    thisAccountUrl,
    parseOneAcmeAccountResponseType
  );

  // get config options
  const { getState: getOptionsState } =
    useAxiosGet<acmeAccountOptionsResponseType>(
      ACCOUNT_OPTIONS_URL,
      parseAcmeAccountOptionsResponse
    );

  const { axiosSendState, apiCall } = useAxiosSend();
  const navigate = useNavigate();

  // initialForm uses the cert response to create a starting form object
  const initialForm = useCallback(
    (
      accountResponseData: oneAcmeAccountResponseType | undefined,
      accountError: frontendErrorType | undefined,
      optionsResponseData: acmeAccountOptionsResponseType | undefined,
      optionsError: frontendErrorType | undefined
    ): formObj => ({
      getAccountResponseData: accountResponseData,
      getAccountError: accountError,
      getOptionsResponseData: optionsResponseData,
      getOptionsError: optionsError,
      dataToSubmit: {
        private_key_id: '',
      },
      sendError: undefined,
      validationErrors: {},
    }),
    []
  );
  const [formState, setFormState] = useState<formObj>(
    initialForm(undefined, undefined, undefined, undefined)
  );

  // set initial form after api loads
  useEffect(() => {
    // if no error, but can't edit in current state, go back to account
    if (
      getAccountState.responseData &&
      (getAccountState.responseData.acme_account.status !== 'valid' ||
        getAccountState.responseData.acme_account.kid === '')
    ) {
      navigate(`/acmeaccounts/${id}`);
    }

    setFormState(
      initialForm(
        getAccountState.responseData,
        getAccountState.error,
        getOptionsState.responseData,
        getOptionsState.error
      )
    );
  }, [
    id,
    getAccountState,
    getOptionsState,
    setFormState,
    initialForm,
    navigate,
  ]);

  // data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

  // form submission handler
  const submitFormHandler: FormEventHandler = (event) => {
    event.preventDefault();

    // client side validation
    const validationErrors: validationErrorsType = {};

    // key (can't be blank)
    if (formState.dataToSubmit.private_key_id === '') {
      validationErrors['dataToSubmit.private_key_id'] = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    // client side validation -- end

    apiCall<oneAcmeAccountResponseType>(
      'PUT',
      thisAccountKeyChangeUrl,
      formState.dataToSubmit,
      parseOneAcmeAccountResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate(`/acmeaccounts/${id}`);
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
      <TitleBar title='Rollover ACME Account Key' />

      {((!formState.getAccountResponseData && !formState.getAccountError) ||
        (!formState.getOptionsResponseData && !formState.getOptionsError)) && (
        <ApiLoading />
      )}

      {formState.getAccountError && (
        <ApiError
          statusCode={formState.getAccountError.statusCode}
          message={formState.getAccountError.message}
        />
      )}

      {formState.getOptionsError && (
        <ApiError
          statusCode={formState.getOptionsError.statusCode}
          message={formState.getOptionsError.message}
        />
      )}

      {formState.getAccountResponseData && formState.getOptionsResponseData && (
        <Form onSubmit={submitFormHandler}>
          <InputTextField
            id='disabled.name'
            label='Name'
            value={formState.getAccountResponseData.acme_account.name}
            disabled
          />

          <InputTextField
            id='disabled.description'
            label='Description'
            value={formState.getAccountResponseData.acme_account.description}
            disabled
          />

          <InputSelect
            id='disabled.current_private_key_id'
            label='Current Private Key'
            options={[
              {
                value: 0,
                name:
                  formState.getAccountResponseData.acme_account.private_key
                    .name +
                  ' (' +
                  formState.getAccountResponseData.acme_account.private_key
                    .algorithm.name +
                  ')',
              },
            ]}
            value={0}
            disabled
          />

          <InputSelect
            id='dataToSubmit.private_key_id'
            label='New Private Key'
            value={formState.dataToSubmit.private_key_id}
            onChange={inputChangeHandler}
            options={buildPrivateKeyOptions(
              formState.getOptionsResponseData.acme_account_options.private_keys
            )}
            error={formState.validationErrors['dataToSubmit.private_key_id']}
          />

          {formState.sendError &&
            Object.keys(formState.validationErrors).length <= 0 && (
              <ApiError
                statusCode={formState.sendError.statusCode}
                message={formState.sendError.message}
              />
            )}

          <FormFooter
            cancelHref={`/acmeaccounts/${id}`}
            resetOnClick={() =>
              setFormState((prevState) =>
                initialForm(
                  prevState.getAccountResponseData,
                  prevState.getAccountError,
                  prevState.getOptionsResponseData,
                  prevState.getOptionsError
                )
              )
            }
            disabledAllButtons={axiosSendState.isSending}
            disabledResetButton={
              JSON.stringify(formState.dataToSubmit) ===
              JSON.stringify(
                initialForm(
                  formState.getAccountResponseData,
                  formState.getAccountError,
                  formState.getOptionsResponseData,
                  formState.getOptionsError
                ).dataToSubmit
              )
            }
          />
        </Form>
      )}
    </FormContainer>
  );
};

export default RolloverAccountKey;
