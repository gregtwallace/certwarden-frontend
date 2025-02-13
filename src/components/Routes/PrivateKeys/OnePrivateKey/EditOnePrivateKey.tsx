import { type FC, type FormEventHandler, type MouseEventHandler } from 'react';
import {
  type privateKeyDeleteResponseType,
  parsePrivateKeyDeleteResponseType,
  type onePrivateKeyResponseType,
  parseOnePrivateKeyResponseType,
} from '../../../../types/api';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../../types/frontend';

import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { inputHandlerFuncMaker } from '../../../../helpers/input-handler';
import { isNameValid } from '../../../../helpers/form-validation';

import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import Button from '../../../UI/Button/Button';
import ButtonAsLink from '../../../UI/Button/ButtonAsLink';
import DialogAlert from '../../../UI/Dialog/DialogAlert';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormFooter from '../../../UI/FormMui/FormFooter';
import FormRowRight from '../../../UI/FormMui/FormRowRight';
import InputCheckbox from '../../../UI/FormMui/InputCheckbox';
import InputSelect from '../../../UI/FormMui/InputSelect';
import InputTextField from '../../../UI/FormMui/InputTextField';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const ONE_PRIVATE_KEY_URL = '/v1/privatekeys';

// form shape
type formObj = {
  getResponseData: onePrivateKeyResponseType | undefined;
  getError: frontendErrorType | undefined;
  dataToSubmit: {
    name: string;
    description: string;
    api_key_disabled: boolean;
    api_key_via_url: boolean;
  };
  sendError: frontendErrorType | undefined;
  validationErrors: validationErrorsType;
};

const EditOnePrivateKey: FC = () => {
  const { id } = useParams();
  if (!id) {
    throw new Error('id is invalid');
  }

  const thisPrivateKeyUrl = `${ONE_PRIVATE_KEY_URL}/${id}`;
  const thisPrivateKeyDownloadUrl = `${thisPrivateKeyUrl}/download`;
  const thisPrivateKeyApiKeyUrl = `${thisPrivateKeyUrl}/apikey`;

  const { getState } = useAxiosGet<onePrivateKeyResponseType>(
    thisPrivateKeyUrl,
    parseOnePrivateKeyResponseType
  );

  const { axiosSendState, apiCall, downloadFile } = useAxiosSend();
  const navigate = useNavigate();

  // initialForm uses the response to create a starting form object
  const initialForm = useCallback(
    (
      responseData: onePrivateKeyResponseType | undefined,
      error: frontendErrorType | undefined
    ) => ({
      getResponseData: responseData,
      getError: error,
      dataToSubmit: {
        name: responseData?.private_key.name ?? '',
        description: responseData?.private_key.description ?? '',
        api_key_disabled: responseData?.private_key.api_key_disabled ?? false,
        api_key_via_url: responseData?.private_key.api_key_via_url ?? false,
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
    setFormState(initialForm(getState.responseData, getState.error));
  }, [getState, setFormState, initialForm]);

  // data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

  // button handlers
  const downloadClickHandler: MouseEventHandler = () => {
    downloadFile(thisPrivateKeyDownloadUrl).then(({ error }) => {
      setFormState((prevState) => ({
        ...prevState,
        sendError: error,
      }));
    });
  };

  // common api call for key roation
  const apiKeyRotation = (method: 'POST' | 'DELETE'): void => {
    apiCall<onePrivateKeyResponseType>(
      method,
      thisPrivateKeyApiKeyUrl,
      {},
      parseOnePrivateKeyResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        // update get response with update info
        setFormState((prevState) => ({
          ...prevState,
          getResponseData: responseData,
          sendError: undefined,
        }));
      } else {
        // failed, set error
        setFormState((prevState) => ({
          ...prevState,
          sendError: error,
        }));
      }
    });
  };

  const newApiKeyClickHandler: MouseEventHandler = () => {
    apiKeyRotation('POST');
  };

  const retireApiKeyClickHandler: MouseEventHandler = () => {
    apiKeyRotation('DELETE');
  };

  // delete handlers
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteConfirmHandler: MouseEventHandler = () => {
    setDeleteOpen(false);

    apiCall<privateKeyDeleteResponseType>(
      'DELETE',
      thisPrivateKeyUrl,
      {},
      parsePrivateKeyDeleteResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate('/privatekeys');
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

    // name
    if (!isNameValid(formState.dataToSubmit.name)) {
      validationErrors['dataToSubmit.name'] = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    // client side validation -- end

    apiCall<onePrivateKeyResponseType>(
      'PUT',
      thisPrivateKeyUrl,
      formState.dataToSubmit,
      parseOnePrivateKeyResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate('/privatekeys');
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
        title='Edit Private Key'
        helpURL='https://www.certwarden.com/docs/user_interface/private_keys/'
      >
        {formState.getResponseData && (
          <>
            <Button
              onClick={downloadClickHandler}
              disabled={axiosSendState.isSending}
            >
              Download Key
            </Button>
            <Button
              color='error'
              onClick={() => {
                setDeleteOpen(true);
              }}
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
            title={`Are you sure you want to delete ${formState.dataToSubmit.name}?`}
            contentText='This action cannot be undone and the key will NOT be recoverable!'
            open={deleteOpen}
            onCancel={() => {
              setDeleteOpen(false);
            }}
            onConfirm={deleteConfirmHandler}
          />

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

            <InputSelect
              id='disabled.algorithm_value'
              label='Key Algorithm'
              options={[
                {
                  value: 0,
                  name: formState.getResponseData.private_key.algorithm.name,
                },
              ]}
              value={0}
              disabled
            />

            <InputTextField
              id='disabled.api_key'
              label={
                (formState.getResponseData.private_key.api_key_new
                  ? 'Old '
                  : '') + 'API Key'
              }
              value={formState.getResponseData.private_key.api_key}
            />

            <FormRowRight>
              <ButtonAsLink
                to={`/privatekeys/${id}/apikeys`}
                color='warning'
                disabled={axiosSendState.isSending}
              >
                Edit API Keys
              </ButtonAsLink>

              {formState.getResponseData.private_key.api_key_new ? (
                <Button
                  onClick={retireApiKeyClickHandler}
                  disabled={axiosSendState.isSending}
                >
                  Retire Old API Key
                </Button>
              ) : (
                <Button
                  onClick={newApiKeyClickHandler}
                  disabled={axiosSendState.isSending}
                >
                  New API Key
                </Button>
              )}
            </FormRowRight>

            {formState.getResponseData.private_key.api_key_new && (
              <InputTextField
                id='disabled.api_key_new'
                label='New API Key'
                value={formState.getResponseData.private_key.api_key_new}
              />
            )}

            <InputCheckbox
              id='dataToSubmit.api_key_disabled'
              checked={formState.dataToSubmit.api_key_disabled}
              onChange={inputChangeHandler}
            >
              Disable API Key
            </InputCheckbox>

            <InputCheckbox
              id='dataToSubmit.api_key_via_url'
              checked={formState.dataToSubmit.api_key_via_url}
              onChange={inputChangeHandler}
            >
              Allow API Key via URL (for Legacy Clients)
            </InputCheckbox>

            {formState.sendError &&
              Object.keys(formState.validationErrors).length <= 0 && (
                <ApiError
                  statusCode={formState.sendError.statusCode}
                  message={formState.sendError.message}
                />
              )}

            <FormFooter
              cancelHref='/privatekeys'
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
              lastAccess={formState.getResponseData.private_key.last_access}
              createdAt={formState.getResponseData.private_key.created_at}
              updatedAt={formState.getResponseData.private_key.updated_at}
            />
          </Form>
        </>
      )}
    </FormContainer>
  );
};

export default EditOnePrivateKey;
