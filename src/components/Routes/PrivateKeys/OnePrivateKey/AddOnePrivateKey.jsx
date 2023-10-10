import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { formChangeHandlerFunc } from '../../../../helpers/input-handler';
import { isNameValid } from '../../../../helpers/form-validation';
import {
  newId,
  defaultKeyGenAlgorithmValue,
} from '../../../../helpers/constants';

import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import Button from '../../../UI/Button/Button';
import InputSelect from '../../../UI/FormMui/InputSelect';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormFooter from '../../../UI/FormMui/FormFooter';
import InputCheckbox from '../../../UI/FormMui/InputCheckbox';
import InputTextField from '../../../UI/FormMui/InputTextField';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const keySources = [
  {
    value: 0,
    name: 'Generate',
    alsoSet: [
      {
        name: 'form.algorithm_value',
        value: defaultKeyGenAlgorithmValue,
      },
      {
        name: 'form.pem',
        value: undefined,
      },
    ],
  },
  {
    value: 1,
    name: 'Paste PEM',
    alsoSet: [
      {
        name: 'form.algorithm_value',
        value: undefined,
      },
      {
        name: 'form.pem',
        value: '',
      },
    ],
  },
];

const AddOnePrivateKey = () => {
  // fetch valid options (for private keys this is the algorithms list)
  const [apiGetState] = useAxiosGet(
    `/v1/privatekeys/${newId}`,
    'private_key_options',
    true
  );

  const [apiSendState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  const blankForm = {
    key_source: 0,
    form: {
      name: '',
      description: '',
      algorithm_value: defaultKeyGenAlgorithmValue,
      // pem: '',
      api_key_disabled: false,
    },
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankForm);

  // data change handler
  const inputChangeHandler = formChangeHandlerFunc(setFormState);

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    /// form validation
    let validationErrors = {};
    // name
    if (!isNameValid(formState.form.name)) {
      validationErrors.name = true;
    }

    // ensure algo or pem
    if (formState.key_source === '') {
      validationErrors.key_source = true;
    }

    // if algo, confirm selected
    if (formState.key_source === 0 && formState.form.algorithm_value === '') {
      validationErrors.algorithm_value = true;
    }

    // if pem, confirm not blank
    if (formState.key_source === 1 && formState.form.pem === '') {
      validationErrors.pem = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    //

    sendData(`/v1/privatekeys`, 'POST', formState.form, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          // back to the private keys page
          navigate(`/privatekeys/${response.data?.response?.record_id}`);
        }
      }
    );
  };

  // render once api loads
  const renderApiItems = apiGetState.isLoaded && !apiGetState.errorMessage;

  return (
    <FormContainer>
      <TitleBar title='New Private Key' />

      {!apiGetState.isLoaded && <ApiLoading />}
      {apiGetState.errorMessage && (
        <ApiError
          code={apiGetState.errorCode}
          message={apiGetState.errorMessage}
        />
      )}

      {renderApiItems && (
        <Form onSubmit={submitFormHandler}>
          <InputTextField
            id='form.name'
            label='Name'
            value={formState.form.name}
            onChange={inputChangeHandler}
            error={formState.validationErrors.name}
          />

          <InputTextField
            id='form.description'
            label='Description'
            value={formState.form.description}
            onChange={inputChangeHandler}
          />

          <InputSelect
            id='key_source'
            label='Key Source'
            value={formState.key_source}
            onChange={inputChangeHandler}
            options={keySources}
            error={formState.validationErrors.key_source}
          />

          {formState.key_source === 0 && (
            <InputSelect
              id='form.algorithm_value'
              label='Key Generation Algorithm'
              value={formState.form.algorithm_value}
              onChange={inputChangeHandler}
              options={apiGetState.private_key_options.key_algorithms}
              error={formState.validationErrors.algorithm_value}
            />
          )}

          {formState.key_source === 1 && (
            <InputTextField
              id='form.pem'
              label='PEM Content'
              value={formState.form.pem}
              onChange={inputChangeHandler}
              error={formState.validationErrors.pem}
              multiline
            />
          )}

          <InputCheckbox
            id='form.api_key_disabled'
            checked={formState.form.api_key_disabled}
            onChange={inputChangeHandler}
          >
            Disable API Key
          </InputCheckbox>

          {apiSendState.errorMessage &&
            Object.keys(formState.validationErrors).length <= 0 && (
              <ApiError
                code={apiSendState.errorCode}
                message={apiSendState.errorMessage}
              />
            )}

          <FormFooter>
            <Button
              type='cancel'
              href='/privatekeys'
              disabled={apiSendState.isSending}
            >
              Cancel
            </Button>
            <Button
              type='reset'
              onClick={() => setFormState(blankForm)}
              disabled={apiSendState.isSending}
            >
              Reset
            </Button>
            <Button type='submit' disabled={apiSendState.isSending}>
              Submit
            </Button>
          </FormFooter>
        </Form>
      )}
    </FormContainer>
  );
};

export default AddOnePrivateKey;
