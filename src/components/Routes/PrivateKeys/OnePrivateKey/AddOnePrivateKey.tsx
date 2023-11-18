import { type FC, type FormEventHandler } from 'react';
import {
  type privateKeyOptionsResponseType,
  parsePrivateKeyOptionsResponseType,
  type privateKeyResponseType,
  parsePrivateKeyResponseType,
} from '../../../../types/api';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../../types/frontend';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { inputHandlerFuncMaker } from '../../../../helpers/input-handler';
import { isNameValid } from '../../../../helpers/form-validation';
import {
  newId,
  defaultKeyGenAlgorithmValue,
} from '../../../../helpers/constants';

import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import InputSelect from '../../../UI/FormMui/InputSelect';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormFooter from '../../../UI/FormMui/FormFooter';
import InputCheckbox from '../../../UI/FormMui/InputCheckbox';
import InputTextField from '../../../UI/FormMui/InputTextField';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const NEW_PRIVATE_KEY_URL = '/v1/privatekeys';
const PRIVATE_KEY_OPTIONS_URL = NEW_PRIVATE_KEY_URL + '/' + newId;

const keySources = [
  {
    value: 0,
    name: 'Generate',
    alsoSet: [
      {
        name: 'dataToSubmit.algorithm_value',
        value: defaultKeyGenAlgorithmValue,
      },
      {
        name: 'dataToSubmit.pem',
        value: undefined,
      },
    ],
  },
  {
    value: 1,
    name: 'Paste PEM',
    alsoSet: [
      {
        name: 'dataToSubmit.algorithm_value',
        value: undefined,
      },
      {
        name: 'dataToSubmit.pem',
        value: '',
      },
    ],
  },
];

// form shape
type formObj = {
  key_source: number | '';
  dataToSubmit: {
    name: string;
    description: string;
    algorithm_value?: string | undefined;
    pem?: string | undefined;
    api_key_disabled: boolean;
  };
  sendError: frontendErrorType | undefined;
  validationErrors: validationErrorsType;
};

const AddOnePrivateKey: FC = () => {
  // fetch valid options (for private keys this is the algorithms list)
  const { getState } = useAxiosGet<privateKeyOptionsResponseType>(
    PRIVATE_KEY_OPTIONS_URL,
    parsePrivateKeyOptionsResponseType
  );

  const { axiosSendState, apiCall } = useAxiosSend();
  const navigate = useNavigate();

  const blankForm: formObj = {
    key_source: 0,
    dataToSubmit: {
      name: '',
      description: '',
      algorithm_value: defaultKeyGenAlgorithmValue,
      // pem: '',
      api_key_disabled: false,
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

    // ensure algo or pem
    if (formState.key_source === '') {
      validationErrors['key_source'] = true;
    }

    // if algo, confirm selected
    if (
      formState.key_source === 0 &&
      formState.dataToSubmit.algorithm_value === ''
    ) {
      validationErrors['dataToSubmit.algorithm_value'] = true;
    }

    // if pem, confirm not blank
    if (formState.key_source === 1 && formState.dataToSubmit.pem === '') {
      validationErrors['dataToSubmit.pem'] = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    // form validation - END

    apiCall<privateKeyResponseType>(
      'POST',
      NEW_PRIVATE_KEY_URL,
      formState.dataToSubmit,
      parsePrivateKeyResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate(`/privatekeys/${responseData.private_key.id}`);
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
      <TitleBar title='New Private Key' />

      {!getState.responseData && !getState.error && <ApiLoading />}

      {getState.error && (
        <ApiError
          statusCode={getState.error.statusCode}
          message={getState.error.message}
        />
      )}

      {getState.responseData && (
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
            id='key_source'
            label='Key Source'
            value={formState.key_source}
            onChange={inputChangeHandler}
            options={keySources}
            error={formState.validationErrors['key_source']}
          />

          {formState.dataToSubmit.algorithm_value !== undefined && (
            <InputSelect
              id='dataToSubmit.algorithm_value'
              label='Key Generation Algorithm'
              value={formState.dataToSubmit.algorithm_value}
              onChange={inputChangeHandler}
              options={getState.responseData.private_key_options.key_algorithms}
              error={formState.validationErrors['dataToSubmit.algorithm_value']}
            />
          )}

          {formState.dataToSubmit.pem !== undefined && (
            <InputTextField
              id='dataToSubmit.pem'
              label='PEM Content'
              value={formState.dataToSubmit.pem}
              onChange={inputChangeHandler}
              error={formState.validationErrors['dataToSubmit.pem']}
              multiline
            />
          )}

          <InputCheckbox
            id='dataToSubmit.api_key_disabled'
            checked={formState.dataToSubmit.api_key_disabled}
            onChange={inputChangeHandler}
          >
            Disable API Key
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

export default AddOnePrivateKey;
