import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { formChangeHandlerFunc } from '../../../../helpers/input-handler';
import { isNameValid, isEmailValid } from '../../../../helpers/form-validation';
import { newId } from '../../../../helpers/constants';

import { Link } from '@mui/material';

import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import Button from '../../../UI/Button/Button';
import InputCheckbox from '../../../UI/FormMui/InputCheckbox';
import InputSelect from '../../../UI/FormMui/InputSelect';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormFooter from '../../../UI/FormMui/FormFooter';
import InputTextField from '../../../UI/FormMui/InputTextField';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const AddOneACMEAccount = () => {
  // fetch valid options (for private keys this is the algorithms list)
  const [apiGetState] = useAxiosGet(
    `/v1/acmeaccounts/${newId}`,
    'acme_account_options',
    true
  );

  const [apiSendState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  // set blank form state
  const blankForm = {
    form: {
      name: '',
      description: '',
      email: '',
      acme_server_id: '',
      private_key_id: '',
      accepted_tos: false,
    },
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankForm);

  // data change handler
  const inputChangeHandler = formChangeHandlerFunc(setFormState);

  // submit handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    // form validation
    let validationErrors = {};
    // name
    if (!isNameValid(formState.form.name)) {
      validationErrors.name = true;
    }
    // check email format
    if (!isEmailValid(formState.form.email)) {
      validationErrors.email = true;
    }
    // check ACME server us selected
    if (formState.form.acme_server_id === '') {
      validationErrors.acme_server_id = true;
    }
    // check private key is selected
    if (formState.form.private_key_id === '') {
      validationErrors.private_key_id = true;
    }
    // ToS must be accepted
    if (formState.form.accepted_tos !== true) {
      validationErrors.accepted_tos = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    // form validation -- end

    sendData(`/v1/acmeaccounts`, 'POST', formState.form, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          // go to the new account
          navigate(`/acmeaccounts/${response.data?.response?.record_id}`);
        }
      }
    );
  };

  // consts related to rendering
  // no check on blank form as blank is the starting state
  // which isn't changed by the apiGet
  const renderApiItems = apiGetState.isLoaded && !apiGetState.errorMessage;

  // vars related to api
  var tos_url;
  var availableServers;
  var availableKeys;

  if (renderApiItems) {
    // tos URL (use selected acme server)
    if (formState.form.acme_server_id !== '') {
      var selectedServer = apiGetState.acme_account_options.acme_servers.filter(
        (s) => s.id === formState.form.acme_server_id
      )[0];
      tos_url = selectedServer.terms_of_service;
    }

    // build options for available servers
    if (apiGetState?.acme_account_options?.acme_servers) {
      availableServers = apiGetState.acme_account_options.acme_servers.map(
        (m) => ({
          value: parseInt(m.id),
          name: m.name + (m.is_staging ? ' (Staging)' : ''),
        })
      );
    }

    // build options for available keys
    // if there are available keys, populate them
    if (apiGetState?.acme_account_options?.private_keys) {
      availableKeys = apiGetState.acme_account_options.private_keys.map(
        (m) => ({
          value: parseInt(m.id),
          name: m.name + ' (' + m.algorithm.name + ')',
        })
      );
    }
  }
  // vars related to api -- end

  return (
    <FormContainer>
      <TitleBar title='New ACME Account' />

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

          <InputTextField
            id='form.email'
            label='Contact E-Mail Address'
            value={formState.form.email}
            onChange={inputChangeHandler}
            error={formState.validationErrors.email}
          />

          <InputSelect
            id='form.acme_server_id'
            label='ACME Server'
            value={formState.form.acme_server_id}
            onChange={inputChangeHandler}
            options={availableServers}
            error={formState.validationErrors.acme_server_id}
          />

          <InputSelect
            id='form.private_key_id'
            label='Private Key'
            value={formState.form.private_key_id}
            onChange={inputChangeHandler}
            options={availableKeys}
            error={formState.validationErrors.private_key_id}
          />

          <InputCheckbox
            id='form.accepted_tos'
            checked={formState.form.accepted_tos}
            onChange={inputChangeHandler}
            error={formState.validationErrors.accepted_tos && true}
            disabled={formState.form.acme_server_id === ''}
          >
            Accept{' '}
            {formState.form.acme_server_id === '' ? (
              "ACME Server's Terms of Service"
            ) : (
              <Link href={tos_url} target='_blank' rel='noreferrer'>
                ACME Server&apos;s Terms of Service
              </Link>
            )}
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
              href='/acmeaccounts'
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

export default AddOneACMEAccount;
