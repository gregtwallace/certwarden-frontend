import { type FC, type FormEventHandler, type MouseEventHandler } from 'react';
import {
  type acmeAccountDeleteResponseType,
  parseAcmeAccountDeleteResponseType,
  type acmeAccountDeactivateResponseType,
  parseAcmeAccountDeactivateResponseType,
  type acmeAccountRegisterResponseType,
  parseAcmeAccountRegisterResponseType,
  type oneAcmeAccountResponseType,
  parseOneAcmeAccountResponseType,
} from '../../../../types/api';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../../types/frontend';

import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { inputHandlerFuncMaker } from '../../../../helpers/input-handler';
import { isNameValid } from '../../../../helpers/form-validation';
import { showDebugInfo } from '../../../../helpers/environment';

import { Box } from '@mui/material';
import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import Button from '../../../UI/Button/Button';
import ButtonAsLink from '../../../UI/Button/ButtonAsLink';
import DialogAlert from '../../../UI/Dialog/DialogAlert';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormFooter from '../../../UI/FormMui/FormFooter';
import FormInfo from '../../../UI/FormMui/FormInfo';
import FormRowRight from '../../../UI/FormMui/FormRowRight';
import InputCheckbox from '../../../UI/FormMui/InputCheckbox';
import InputSelect from '../../../UI/FormMui/InputSelect';
import InputTextField from '../../../UI/FormMui/InputTextField';
import TitleBar from '../../../UI/TitleBar/TitleBar';

// TODO
// Add: refresh LE status button

const ACME_ACCOUNT_URL = '/v1/acmeaccounts';

// form shape
type formObj = {
  getResponseData: oneAcmeAccountResponseType | undefined;
  getError: frontendErrorType | undefined;
  dataToSubmitEdit: {
    name: string;
    description: string;
  };
  dataToSubmitRegister: {
    eab_kid: string;
    eab_hmac_key: string;
  };
  sendError: frontendErrorType | undefined;
  validationErrors: validationErrorsType;
};

const EditOneACMEAccount: FC = () => {
  const { id } = useParams();
  const thisAcmeAccountUrl = `${ACME_ACCOUNT_URL}/${id}`;

  // fetch account
  const { getState, updateGet } = useAxiosGet<oneAcmeAccountResponseType>(
    thisAcmeAccountUrl,
    parseOneAcmeAccountResponseType
  );

  const { axiosSendState, apiCall } = useAxiosSend();
  const navigate = useNavigate();

  // makeBlankForm uses the response to create a starting form object
  const makeBlankForm = useCallback(
    (
      responseData: oneAcmeAccountResponseType | undefined,
      error: frontendErrorType | undefined
    ) => ({
      getResponseData: responseData,
      getError: error,
      dataToSubmitEdit: {
        name: responseData?.acme_account.name || '',
        description: responseData?.acme_account.description || '',
      },
      dataToSubmitRegister: {
        eab_kid: '',
        eab_hmac_key: '',
      },
      sendError: undefined,
      validationErrors: {},
    }),
    []
  );
  const [formState, setFormState] = useState<formObj>(
    makeBlankForm(undefined, undefined)
  );

  // set initial form after api loads
  useEffect(() => {
    setFormState(makeBlankForm(getState.responseData, getState.error));
  }, [getState, setFormState, makeBlankForm]);

  // data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

  // delete handler
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteConfirmHandler: MouseEventHandler = () => {
    setDeleteOpen(false);

    apiCall<acmeAccountDeleteResponseType>(
      'DELETE',
      thisAcmeAccountUrl,
      {},
      parseAcmeAccountDeleteResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate('/acmeaccounts');
      } else {
        // failed, set error
        setFormState((prevState) => ({
          ...prevState,
          sendError: error,
        }));
      }
    });
  };

  // deactivate handler
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  const deactivateConfirmHandler: MouseEventHandler = () => {
    setDeactivateOpen(false);

    apiCall<acmeAccountDeactivateResponseType>(
      'POST',
      thisAcmeAccountUrl + '/deactivate',
      {},
      parseAcmeAccountDeactivateResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        updateGet();
      } else {
        // failed, set error
        setFormState((prevState) => ({
          ...prevState,
          sendError: error,
        }));
      }
    });
  };

  // register ACME account handler
  const registerClickHandler: MouseEventHandler = () => {
    const eabRequired =
      formState.getResponseData?.acme_account.acme_server
        .external_account_required || false;

    // client side validation
    const validationErrors: validationErrorsType = {};

    // EAB KID if EAB required
    if (eabRequired && formState.dataToSubmitRegister.eab_kid === '') {
      validationErrors['dataToSubmitRegister.eab_kid'] = true;
    }

    // EAB Key if EAB required
    if (eabRequired && formState.dataToSubmitRegister.eab_hmac_key === '') {
      validationErrors['dataToSubmitRegister.eab_hmac_key'] = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    apiCall<acmeAccountRegisterResponseType>(
      'POST',
      thisAcmeAccountUrl + '/register-account',
      formState.dataToSubmitRegister,
      parseAcmeAccountRegisterResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        updateGet();
      } else {
        // failed, set error
        setFormState((prevState) => ({
          ...prevState,
          sendError: error,
        }));
      }
    });
  };

  // form submission handler
  const submitFormHandler: FormEventHandler = (event) => {
    event.preventDefault();

    // client side validation
    const validationErrors: validationErrorsType = {};

    // check name
    if (!isNameValid(formState.dataToSubmitEdit.name)) {
      validationErrors['dataToSubmitEdit.name'] = true;
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
      thisAcmeAccountUrl,
      formState.dataToSubmitEdit,
      parseOneAcmeAccountResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate('/acmeaccounts');
      } else {
        // failed, set error
        setFormState((prevState) => ({
          ...prevState,
          sendError: error,
        }));
      }
    });
  };

  // vars for conditionally showing certain actions
  const canDoAccountActions =
    formState.getResponseData &&
    formState.getResponseData.acme_account.status === 'valid' &&
    formState.getResponseData.acme_account.kid !== '';

  const canRegister =
    formState.getResponseData &&
    (formState.getResponseData.acme_account.status === 'unknown' ||
      formState.getResponseData.acme_account.status === '' ||
      formState.getResponseData.acme_account.kid === '');

  return (
    <FormContainer>
      <TitleBar
        title='Edit ACME Account'
        helpURL='https://www.certwarden.com/docs/user_interface/acme_accounts/'
      >
        {formState.getResponseData && (
          <>
            <Button
              color='warning'
              onClick={() => setDeactivateOpen(true)}
              disabled={axiosSendState.isSending || !canDoAccountActions}
            >
              Deactivate
            </Button>

            <Button
              color='error'
              onClick={() => setDeleteOpen(true)}
              disabled={axiosSendState.isSending}
            >
              Delete
            </Button>
          </>
        )}
      </TitleBar>

      {!formState.getResponseData && !formState.getError && <ApiLoading />}

      {formState.getError && (
        <ApiError
          statusCode={formState.getError.statusCode}
          message={formState.getError.message}
        />
      )}

      {formState.getResponseData && (
        <>
          <DialogAlert
            title={`Are you sure you want to delete ${formState.dataToSubmitEdit.name}?`}
            open={deleteOpen}
            onCancel={() => setDeleteOpen(false)}
            onConfirm={deleteConfirmHandler}
          >
            The account can be recovered as long as the associated key is not
            lost or deleted.
          </DialogAlert>

          <DialogAlert
            title={`Are you sure you want to deactivate ${formState.dataToSubmitEdit.name}?`}
            open={deactivateOpen}
            onCancel={() => setDeactivateOpen(false)}
            onConfirm={deactivateConfirmHandler}
          >
            This process cannot be reversed! Ensure you understand all
            consequences of this action before confirming!
          </DialogAlert>

          <Form onSubmit={submitFormHandler}>
            <InputTextField
              label='Name'
              id='dataToSubmitEdit.name'
              value={formState.dataToSubmitEdit.name}
              onChange={inputChangeHandler}
              error={formState.validationErrors['dataToSubmitEdit.name']}
            />

            <InputTextField
              id='dataToSubmitEdit.description'
              label='Description'
              value={formState.dataToSubmitEdit.description}
              onChange={inputChangeHandler}
            />

            <InputTextField
              id='disabled.email'
              label='Contact E-Mail Address'
              value={formState.getResponseData.acme_account.email}
              disabled
            />

            <FormRowRight>
              <ButtonAsLink
                color='info'
                to={`/acmeaccounts/${id}/email`}
                disabled={axiosSendState.isSending || !canDoAccountActions}
              >
                Change Email
              </ButtonAsLink>
            </FormRowRight>

            <InputSelect
              id='disabled.acme_server_id'
              label='ACME Server'
              options={[
                {
                  value: 0,
                  name:
                    formState.getResponseData.acme_account.acme_server.name +
                    (formState.getResponseData.acme_account.acme_server
                      .is_staging
                      ? ' (Staging)'
                      : ''),
                },
              ]}
              value={0}
              disabled
            />

            <InputSelect
              id='disabled.private_key_id'
              label='Private Key'
              options={[
                {
                  value: 0,
                  name:
                    formState.getResponseData.acme_account.private_key.name +
                    ' (' +
                    formState.getResponseData.acme_account.private_key.algorithm
                      .name +
                    ')',
                },
              ]}
              value={0}
              disabled
            />

            <FormRowRight>
              <ButtonAsLink
                color='info'
                to={`/acmeaccounts/${id}/key-change`}
                disabled={axiosSendState.isSending || !canDoAccountActions}
              >
                Rollover Key
              </ButtonAsLink>
            </FormRowRight>

            {canRegister &&
              formState.getResponseData.acme_account.acme_server
                .external_account_required && (
                <Box
                  sx={{
                    mt: 1,
                    p: 1,
                    border: 1,
                    borderRadius: '4px',
                    borderColor: 'grey.800',
                  }}
                >
                  <FormInfo sx={{ m: 1 }}>External Account Binding</FormInfo>

                  <InputTextField
                    id='dataToSubmitRegister.eab_kid'
                    label='Key ID'
                    value={formState.dataToSubmitRegister.eab_kid}
                    onChange={inputChangeHandler}
                    error={
                      formState.validationErrors['dataToSubmitRegister.eab_kid']
                    }
                  />

                  <InputTextField
                    id='dataToSubmitRegister.eab_hmac_key'
                    label='HMAC Key'
                    value={formState.dataToSubmitRegister.eab_hmac_key}
                    onChange={inputChangeHandler}
                    error={
                      formState.validationErrors[
                        'dataToSubmitRegister.eab_hmac_key'
                      ]
                    }
                  />
                </Box>
              )}

            {showDebugInfo &&
              formState.getResponseData.acme_account.kid !== '' && (
                <FormInfo>
                  KID: {formState.getResponseData.acme_account.kid}
                </FormInfo>
              )}

            <FormInfo>
              Account Status:{' '}
              {formState.getResponseData.acme_account.status
                .charAt(0)
                .toUpperCase() +
                formState.getResponseData.acme_account.status.slice(1)}
            </FormInfo>

            <FormRowRight>
              <Button
                color='primary'
                onClick={registerClickHandler}
                disabled={axiosSendState.isSending || !canRegister}
              >
                Register
              </Button>
            </FormRowRight>

            <InputCheckbox
              id='disabled.accepted_tos'
              checked={formState.getResponseData.acme_account.accepted_tos}
              disabled
            >
              Accept CA&apos;s Terms of Service
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
              resetOnClick={() =>
                setFormState((prevState) =>
                  makeBlankForm(prevState.getResponseData, prevState.getError)
                )
              }
              disabledAllButtons={axiosSendState.isSending}
              disabledResetButton={
                JSON.stringify(formState.dataToSubmitEdit) ===
                JSON.stringify(
                  makeBlankForm(formState.getResponseData, formState.getError)
                    .dataToSubmitEdit
                )
              }
              createdAt={formState.getResponseData.acme_account.created_at}
              updatedAt={formState.getResponseData.acme_account.updated_at}
            />
          </Form>
        </>
      )}
    </FormContainer>
  );
};

export default EditOneACMEAccount;
