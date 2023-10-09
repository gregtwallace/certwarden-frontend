import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxiosGet from '../../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../../hooks/useAxiosSend';
import { formChangeHandlerFunc } from '../../../../../helpers/input-handler';
import { newId } from '../../../../../helpers/constants';

import ApiError from '../../../../UI/Api/ApiError';
import ApiLoading from '../../../../UI/Api/ApiLoading';
import Button from '../../../../UI/Button/Button';
import Form from '../../../../UI/FormMui/Form';
import FormContainer from '../../../../UI/FormMui/FormContainer';
import FormFooter from '../../../../UI/FormMui/FormFooter';
import InputSelect from '../../../../UI/FormMui/InputSelect';
import InputTextField from '../../../../UI/FormMui/InputTextField';
import TitleBar from '../../../../UI/TitleBar/TitleBar';

const RolloverAccountKey = () => {
  const { id } = useParams();

  const [apiGetAccountState] = useAxiosGet(
    `/v1/acmeaccounts/${id}`,
    'acme_account',
    true
  );

  const [apiGetKeyOptionsState] = useAxiosGet(
    `/v1/acmeaccounts/${newId}`,
    'acme_account_options',
    true
  );

  const [apiSendState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  // set blank form state
  const blankForm = {
    form: {
      private_key_id: '',
    },
    validationErrors: {},
  };

  const [formState, setFormState] = useState(blankForm);

  useEffect(() => {
    // execute actions after loaded
    if (apiGetAccountState.isLoaded) {
      // if api error, redirect to root /acmeaccounts
      if (apiGetAccountState.errorMessage) {
        navigate('/acmeaccounts');
      } else if (
        // if no api error, but account isn't in a state to roll, go back to edit account
        apiGetAccountState.acme_account.status !== 'valid' ||
        apiGetAccountState.acme_account.kid === ''
      ) {
        navigate(`/acmeaccounts/${id}`);
      }
    }
  }, [apiGetAccountState, id, navigate]);

  // data change handler
  const inputChangeHandler = formChangeHandlerFunc(setFormState);

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    // client side validation
    let validationErrors = {};
    // check email (can't edit ACME to blank)
    if (formState.form.private_key_id === '') {
      validationErrors.private_key_id = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    // client side validation -- end

    sendData(
      `/v1/acmeaccounts/${id}/key-change`,
      'PUT',
      formState.form,
      true
    ).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        navigate(`/acmeaccounts/${id}`);
      }
    });
  };

  // consts related to rendering
  // no check on blank form as blank is the starting state
  // which isn't changed by the apiGet
  const renderApiItems =
    apiGetAccountState.isLoaded && !apiGetAccountState.errorMessage;

  // vars related to api
  // build available keys list
  var availableKeys = [{ value: '', name: 'Loading...' }];
  if (apiGetKeyOptionsState.isLoaded) {
    // build options for available keys
    // if there are available keys, populate them
    if (apiGetKeyOptionsState?.acme_account_options?.private_keys) {
      availableKeys =
        apiGetKeyOptionsState.acme_account_options.private_keys.map((m) => ({
          value: parseInt(m.id),
          name: m.name + ' (' + m.algorithm.name + ')',
        }));
    } else {
      // when loaded but none are available
      availableKeys = [];
    }
  }

  return (
    <FormContainer>
      <TitleBar title='Rollover ACME Account Key' />

      {!apiGetAccountState.isLoaded && <ApiLoading />}
      {apiGetAccountState.errorMessage && (
        <ApiError
          code={apiGetAccountState.errorCode}
          message={apiGetAccountState.errorMessage}
        />
      )}

      {renderApiItems && (
        <Form onSubmit={submitFormHandler}>
          <InputTextField
            id='form.name'
            label='Name'
            value={apiGetAccountState.acme_account.name}
            disabled
          />

          <InputTextField
            id='form.description'
            label='Description'
            value={
              apiGetAccountState.acme_account.description
                ? apiGetAccountState.acme_account.description
                : 'None'
            }
            disabled
          />

          <InputSelect
            id='form.current_private_key_id'
            label='Current Private Key'
            value={0}
            options={[
              {
                value: 0,
                name:
                  apiGetAccountState.acme_account.private_key.name +
                  ' (' +
                  apiGetAccountState.acme_account.private_key.algorithm.name +
                  ')',
              },
            ]}
            disabled
          />

          <InputSelect
            id='form.private_key_id'
            label='New Private Key'
            value={formState.form.private_key_id}
            onChange={inputChangeHandler}
            options={availableKeys}
            error={formState.validationErrors.private_key_id}
          />

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
              href={`/acmeaccounts/${id}`}
              disabled={apiSendState.isSending}
            >
              Cancel
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

export default RolloverAccountKey;
