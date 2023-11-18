import { type FC, type FormEventHandler, type MouseEventHandler } from 'react';
import {
  type oneAcmeServerResponseType,
  isOneAcmeServerResponseType,
  type oneAcmeServerDeleteResponseType,
  isOneAcmeServerDeleteResponse,
} from '../../../../types/api';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../../types/frontend';

import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { inputHandlerFuncMaker } from '../../../../helpers/input-handler';
import {
  isDirectoryUrlValid,
  isNameValid,
} from '../../../../helpers/form-validation';

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
  const thisAcmeServerUrl = `${ONE_ACME_SERVER_URL}/${id}`;

  const { getState } = useAxiosGet<oneAcmeServerResponseType>(
    thisAcmeServerUrl,
    isOneAcmeServerResponseType
  );

  const { sendState, doSendData } = useAxiosSend();
  const navigate = useNavigate();

  const makeStartingForm: () => formObj = useCallback(
    () => ({
      getResponseData: getState.responseData,
      getError: getState.error,
      dataToSubmit: {
        name: getState.responseData?.acme_server.name || '',
        description: getState.responseData?.acme_server.description || '',
        directory_url: getState.responseData?.acme_server.directory_url || '',
        is_staging: getState.responseData?.acme_server.is_staging || false,
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
    doSendData<oneAcmeServerDeleteResponseType>(
      'DELETE',
      thisAcmeServerUrl,
      {},
      isOneAcmeServerDeleteResponse
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
    if (!isDirectoryUrlValid(formState.dataToSubmit.directory_url)) {
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

    doSendData<oneAcmeServerResponseType>(
      'PUT',
      thisAcmeServerUrl,
      formState.dataToSubmit,
      isOneAcmeServerResponseType
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
      <TitleBar title='Edit ACME Server'>
        {formState.getResponseData && (
          <>
            <Button
              color='error'
              onClick={() => {
                setDeleteOpen(true);
              }}
              disabled={sendState.isSending}
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
            open={deleteOpen}
            onCancel={() => {
              setDeleteOpen(false);
            }}
            onConfirm={deleteConfirmHandler}
          >
            Deleting this ACME Server will make it unavailable for use.
          </DialogAlert>

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

            <FormInfo color='error.main'>
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

            {formState.sendError &&
              Object.keys(formState.validationErrors).length <= 0 && (
                <ApiError
                  statusCode={formState.sendError.statusCode}
                  message={formState.sendError.message}
                />
              )}

            <FormFooter
              cancelHref='/acmeservers'
              resetOnClick={() => setFormState(makeStartingForm())}
              disabledAllButtons={sendState.isSending}
              disabledSubmitResetButtons={
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
