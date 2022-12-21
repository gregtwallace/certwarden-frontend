import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosGet from '../../../hooks/useAxiosGet';
import useAxiosSend from '../../../hooks/useAxiosSend';
import { isNameValid } from '../../../helpers/form-validation';
import { newId } from '../../../App';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import Button from '../../UI/Button/Button';
import InputSelect from '../../UI/FormMui/InputSelect';
import Form from '../../UI/FormMui/Form';
import FormContainer from '../../UI/FormMui/FormContainer';
import FormError from '../../UI/FormMui/FormError';
import FormFooter from '../../UI/FormMui/FormFooter';
import InputTextArea from '../../UI/FormMui/InputTextArea';
import InputTextField from '../../UI/FormMui/InputTextField';
import TitleBar from '../../UI/Header/TitleBar';

const keySources = [
  {
    value: 0,
    name: 'Generate',
  },
  {
    value: 1,
    name: 'Paste PEM',
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

  const blankFormState = {
    key_source: '',
    private_key: {
      name: '',
      description: '',
      algorithm_value: '',
      pem: '',
    },
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankFormState);

  // data change handler
  const inputChangeHandler = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      private_key: {
        ...prevState.private_key,
        [event.target.name]: event.target.value,
      },
    }));
  };

  // on key change, clear out alg value and pem also
  const keySourceChangeHandler = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      key_source: event.target.value,
      private_key: {
        ...prevState.private_key,
        algorithm_value: '',
        pem: '',
      },
    }));
  };

  // button handlers
  const resetClickHandler = (event) => {
    event.preventDefault();
    setFormState(blankFormState);
  };
  const cancelClickHandler = (event) => {
    event.preventDefault();
    //navigate('.');
    navigate('/privatekeys');
  };

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    /// form validation
    let validationErrors = [];
    // name
    if (!isNameValid(formState.private_key.name)) {
      validationErrors.name = true;
    }

    // ensure algo or pem
    if (formState.key_source === '') {
      validationErrors.key_source = true;
    }

    // if algo, confirm selected
    if (
      formState.key_source === 0 &&
      formState.private_key.algorithm_value === ''
    ) {
      validationErrors.algorithm_value = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    //

    sendData(`/v1/privatekeys`, 'POST', formState.private_key, true).then(
      (success) => {
        if (success) {
          // back to the private keys page
          //navigate('.');
          navigate('/privatekeys');
        }
      }
    );
  };

  return (
    <FormContainer>
      <TitleBar title='New Private Key' />

      {!apiGetState.isLoaded && <ApiLoading />}
      {apiGetState.errorMessage && (
        <ApiError>{apiGetState.errorMessage}</ApiError>
      )}

      {apiGetState.isLoaded && !apiGetState.errorMessage && (
        <Form onSubmit={submitFormHandler}>
          <InputTextField
            label='Name'
            id='name'
            value={formState.private_key.name}
            onChange={inputChangeHandler}
            error={formState.validationErrors.name && true}
          />

          <InputTextField
            label='Description'
            id='description'
            value={formState.private_key.description}
            onChange={inputChangeHandler}
          />

          <InputSelect
            label='Key Source'
            id='key_source'
            options={keySources}
            value={formState.key_source}
            onChange={keySourceChangeHandler}
            error={formState.validationErrors.key_source && true}
          />

          {formState.key_source === 0 && (
            <InputSelect
              label='Key Generation Algorithm'
              id='algorithm_value'
              options={apiGetState.private_key_options.key_algorithms}
              value={formState.private_key.algorithm_value}
              onChange={inputChangeHandler}
              error={formState.validationErrors.algorithm_value && true}
            />
          )}

          {formState.key_source === 1 && (
            <InputTextArea
              label='PEM Content'
              id='pem'
              value={formState.private_key.pem}
              onChange={inputChangeHandler}
              invalid={formState.validationErrors.pem && true}
            />
          )}

          {apiSendState.errorMessage && formState.validationErrors.length > 0 && (
            <FormError>Error Posting -- {apiSendState.errorMessage}</FormError>
          )}

          <FormFooter>
            <Button
              type='cancel'
              onClick={cancelClickHandler}
              disabled={apiSendState.isSending}
            >
              Cancel
            </Button>
            <Button
              type='reset'
              onClick={resetClickHandler}
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
