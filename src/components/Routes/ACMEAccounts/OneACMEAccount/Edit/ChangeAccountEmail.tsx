import { type FC, type FormEventHandler } from 'react';
import {
  type oneAcmeAccountResponseType,
  parseOneAcmeAccountResponseType,
} from '../../../../../types/api';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../../../types/frontend';

import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import useAxiosGet from '../../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../../hooks/useAxiosSend';
import { inputHandlerFuncMaker } from '../../../../../helpers/input-handler';
import { isEmailValid } from '../../../../../helpers/form-validation';

import ApiError from '../../../../UI/Api/ApiError';
import ApiLoading from '../../../../UI/Api/ApiLoading';
import Form from '../../../../UI/FormMui/Form';
import FormContainer from '../../../../UI/FormMui/FormContainer';
import FormFooter from '../../../../UI/FormMui/FormFooter';
import InputTextField from '../../../../UI/FormMui/InputTextField';
import TitleBar from '../../../../UI/TitleBar/TitleBar';

const ONE_ACCOUNT_URL = '/v1/acmeaccounts';

// form shape
type formObj = {
  getResponseData: oneAcmeAccountResponseType | undefined;
  getError: frontendErrorType | undefined;
  dataToSubmit: {
    email: string;
  };
  sendError: frontendErrorType | undefined;
  validationErrors: validationErrorsType;
};

const ChangeAccountEmail: FC = () => {
  const { id } = useParams();
  if (!id) {
    throw new Error('id is invalid');
  }

  const thisAccountUrl = `${ONE_ACCOUNT_URL}/${id}`;
  const thisAccountEmailUrl = `${thisAccountUrl}/email`;

  const { getState } = useAxiosGet<oneAcmeAccountResponseType>(
    thisAccountUrl,
    parseOneAcmeAccountResponseType
  );

  const { axiosSendState, apiCall } = useAxiosSend();
  const navigate = useNavigate();

  // initialForm uses the response to create a starting form object
  const initialForm = useCallback(
    (
      responseData: oneAcmeAccountResponseType | undefined,
      error: frontendErrorType | undefined
    ) => ({
      getResponseData: responseData,
      getError: error,
      dataToSubmit: {
        email: responseData?.acme_account.email ?? '',
      },
      sendError: undefined,
      validationErrors: {},
    }),
    []
  );
  const [formState, setFormState] = useState<formObj>(
    initialForm(undefined, undefined)
  );

  // set initial form after api loads
  useEffect(() => {
    // if no error, but can't edit email in current state, go back to account
    if (
      getState.responseData &&
      (getState.responseData.acme_account.status !== 'valid' ||
        getState.responseData.acme_account.kid === '')
    ) {
      navigate(`/acmeaccounts/${id}`);
    }

    setFormState(initialForm(getState.responseData, getState.error));
  }, [id, getState, setFormState, initialForm, navigate]);

  // data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

  // form submission handler
  const submitFormHandler: FormEventHandler = (event) => {
    event.preventDefault();

    // client side validation
    const validationErrors: validationErrorsType = {};

    // check email (can't edit ACME to blank)
    if (!isEmailValid(formState.dataToSubmit.email)) {
      validationErrors['dataToSubmit.email'] = true;
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
      thisAccountEmailUrl,
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
      <TitleBar title='Change ACME Account Email' />

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
            id='disabled.name'
            label='Name'
            value={formState.getResponseData.acme_account.name}
            disabled
          />

          <InputTextField
            id='disabled.description'
            label='Description'
            value={formState.getResponseData.acme_account.description}
            disabled
          />

          <InputTextField
            id='dataToSubmit.email'
            label='Contact E-Mail Address'
            value={formState.dataToSubmit.email}
            onChange={inputChangeHandler}
            error={formState.validationErrors['dataToSubmit.email']}
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
            resetOnClick={() => {
              setFormState((prevState) =>
                initialForm(prevState.getResponseData, prevState.getError)
              );
            }}
            disabledAllButtons={axiosSendState.isSending}
            disabledResetButton={
              JSON.stringify(formState.dataToSubmit) ===
              JSON.stringify(
                initialForm(formState.getResponseData, formState.getError)
                  .dataToSubmit
              )
            }
          />
        </Form>
      )}
    </FormContainer>
  );
};

export default ChangeAccountEmail;
