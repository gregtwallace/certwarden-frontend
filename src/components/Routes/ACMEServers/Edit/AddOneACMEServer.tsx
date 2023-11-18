import { type FC, type FormEventHandler } from 'react';
import {
  type oneAcmeServerResponseType,
  isOneAcmeServerResponseType,
} from '../../../../types/api';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../../types/frontend';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosSend from '../../../../hooks/useAxiosSend';
import { inputHandlerFuncMaker } from '../../../../helpers/input-handler';
import {
  isDirectoryUrlValid,
  isNameValid,
} from '../../../../helpers/form-validation';

import ApiError from '../../../UI/Api/ApiError';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormFooter from '../../../UI/FormMui/FormFooter';
import InputCheckbox from '../../../UI/FormMui/InputCheckbox';
import InputTextField from '../../../UI/FormMui/InputTextField';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const NEW_ACME_SERVER_URL = '/v1/acmeservers';

// form shape
type formObj = {
  dataToSubmit: {
    name: string;
    description: string;
    directory_url: string;
    is_staging: boolean;
  };
  sendError: frontendErrorType | undefined;
  validationErrors: validationErrorsType;
};

const AddOneACMEServer: FC = () => {
  const { sendState, doSendData } = useAxiosSend();
  const navigate = useNavigate();

  const blankForm: formObj = {
    dataToSubmit: {
      name: '',
      description: '',
      directory_url: '',
      is_staging: false,
    },
    sendError: undefined,
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankForm);

  // data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

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
      'POST',
      NEW_ACME_SERVER_URL,
      formState.dataToSubmit,
      isOneAcmeServerResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate(`/acmeservers/${responseData.acme_server.id}`);
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
      <TitleBar title='New ACME Server' />
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
          resetOnClick={() => setFormState(blankForm)}
          disabledAllButtons={sendState.isSending}
          disabledResetButton={
            JSON.stringify(formState.dataToSubmit) ===
            JSON.stringify(blankForm.dataToSubmit)
          }
        />
      </Form>
    </FormContainer>
  );
};

export default AddOneACMEServer;
