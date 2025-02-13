import { type FC, type FormEventHandler, type MouseEventHandler } from 'react';
import {
  type oneAcmeServerResponseType,
  parseOneAcmeServerResponseType,
  type oneAcmeServerDeleteResponseType,
  parseOneAcmeServerDeleteResponse,
} from '../../../../types/api';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../../types/frontend';

import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import useClientSettings from '../../../../hooks/useClientSettings';
import { inputHandlerFuncMaker } from '../../../../helpers/input-handler';
import {
  isHttpsUrlValid,
  isNameValid,
} from '../../../../helpers/form-validation';

import { TextField as MuiTextField } from '@mui/material';

import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import Button from '../../../UI/Button/Button';
import DialogAlert from '../../../UI/Dialog/DialogAlert';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormFooter from '../../../UI/FormMui/FormFooter';
import FormInfo from '../../../UI/FormMui/FormInfo';
import InputCheckbox from '../../../UI/FormMui/InputCheckbox';
import InputTextField from '../../../UI/FormMui/InputTextField';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const ONE_ACME_SERVER_URL = '/v1/acmeservers';

// form shape
type formObj = {
  getResponseData: oneAcmeServerResponseType | undefined;
  getError: frontendErrorType | undefined;
  dataToSubmit: {
    name: string;
    description: string;
    directory_url: string;
    is_staging: boolean;
  };
  sendError: frontendErrorType | undefined;
  validationErrors: validationErrorsType;
};

const EditOneACMEServer: FC = () => {
  const { id } = useParams();
  if (!id) {
    throw new Error('id is invalid');
  }

  // debug?
  const { showDebugInfo } = useClientSettings();
  const thisAcmeServerUrl = `${ONE_ACME_SERVER_URL}/${id}`;

  const { getState } = useAxiosGet<oneAcmeServerResponseType>(
    thisAcmeServerUrl,
    parseOneAcmeServerResponseType
  );

  const { axiosSendState, apiCall } = useAxiosSend();
  const navigate = useNavigate();

  const makeStartingForm: () => formObj = useCallback(
    () => ({
      getResponseData: getState.responseData,
      getError: getState.error,
      dataToSubmit: {
        name: getState.responseData?.acme_server.name ?? '',
        description: getState.responseData?.acme_server.description ?? '',
        directory_url: getState.responseData?.acme_server.directory_url ?? '',
        is_staging: getState.responseData?.acme_server.is_staging ?? false,
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

  // delete handlers
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteConfirmHandler: MouseEventHandler = () => {
    setDeleteOpen(false);
    apiCall<oneAcmeServerDeleteResponseType>(
      'DELETE',
      thisAcmeServerUrl,
      {},
      parseOneAcmeServerDeleteResponse
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate('/acmeservers');
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

    // form validation
    const validationErrors: validationErrorsType = {};

    // name
    if (!isNameValid(formState.dataToSubmit.name)) {
      validationErrors['dataToSubmit.name'] = true;
    }

    // directory url
    if (!isHttpsUrlValid(formState.dataToSubmit.directory_url)) {
      validationErrors['dataToSubmit.directory_url'] = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    // form validation - end

    apiCall<oneAcmeServerResponseType>(
      'PUT',
      thisAcmeServerUrl,
      formState.dataToSubmit,
      parseOneAcmeServerResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate('/acmeservers');
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
        title='Edit ACME Server'
        helpURL='https://www.certwarden.com/docs/user_interface/acme_servers/'
      >
        {formState.getResponseData && (
          <Button
            color='error'
            onClick={() => {
              setDeleteOpen(true);
            }}
            disabled={axiosSendState.isSending}
          >
            Delete
          </Button>
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
            contentText='Deleting this ACME Server will make it unavailable for use.'
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

            <FormInfo sx={{ color: 'error.main' }}>
              You should only update the Directory URL if your provider has
              actually changed it. If you are trying to change provider, create
              a new server instead.
            </FormInfo>

            <InputTextField
              id='dataToSubmit.directory_url'
              label='Directory URL'
              value={formState.dataToSubmit.directory_url}
              onChange={inputChangeHandler}
              error={formState.validationErrors['dataToSubmit.directory_url']}
            />

            <InputCheckbox
              id='dataToSubmit.is_staging'
              checked={formState.dataToSubmit.is_staging}
              onChange={inputChangeHandler}
            >
              Staging Environment Server
            </InputCheckbox>

            {showDebugInfo && (
              <MuiTextField
                id='disabled.raw_directory_response'
                label='Raw Directory Response'
                fullWidth
                variant='standard'
                value={JSON.stringify(
                  formState.getResponseData.acme_server.raw_directory_response,
                  null,
                  2
                )}
                sx={{ my: 1, px: 1, overflowY: 'auto' }}
                multiline
                slotProps={{
                  input: {
                    disableUnderline: true,
                    style: {
                      fontFamily: 'Monospace',
                      fontSize: 12,
                    },
                  },
                }}
              />
            )}

            {formState.sendError &&
              Object.keys(formState.validationErrors).length <= 0 && (
                <ApiError
                  statusCode={formState.sendError.statusCode}
                  message={formState.sendError.message}
                />
              )}

            <FormFooter
              cancelHref='/acmeservers'
              resetOnClick={() => {
                setFormState(makeStartingForm());
              }}
              disabledAllButtons={axiosSendState.isSending}
              disabledResetButton={
                JSON.stringify(formState.dataToSubmit) ===
                JSON.stringify(makeStartingForm().dataToSubmit)
              }
              createdAt={formState.getResponseData.acme_server.created_at}
              updatedAt={formState.getResponseData.acme_server.updated_at}
            />
          </Form>
        </>
      )}
    </FormContainer>
  );
};

export default EditOneACMEServer;
