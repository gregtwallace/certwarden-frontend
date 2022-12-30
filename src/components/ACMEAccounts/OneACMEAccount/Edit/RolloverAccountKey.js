import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { newId } from '../../../../App';

import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import Button from '../../../UI/Button/Button';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormError from '../../../UI/FormMui/FormError';
import FormFooter from '../../../UI/FormMui/FormFooter';
import InputSelect from '../../../UI/FormMui/InputSelect';
import InputTextField from '../../../UI/FormMui/InputTextField';
import TitleBar from '../../../UI/TitleBar/TitleBar';

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

  // set dummy state
  const dummyForm = {
    form: {
      private_key_id: '',
    },
    validationErrors: {},
  };

  const [formState, setFormState] = useState(dummyForm);

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

  // int form field updates
  const intInputChangeHandler = (event) => {
    setFormState((prevState) => {
      return {
        ...prevState,
        form: {
          ...prevState.form,
          [event.target.name]: parseInt(event.target.value),
        },
      };
    });
  };

  // button handlers
  const cancelClickHandler = (event) => {
    event.preventDefault();
    navigate(-1);
  };

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    // client side validation
    // not needed w/ only select box

    sendData(
      `/v1/acmeaccounts/${id}/key-change`,
      'PUT',
      formState.form,
      true
    ).then((success) => {
      if (success) {
        navigate(`/acmeaccounts/${id}`);
      }
    });
  };

  // consts related to rendering
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
    }
  }

  return (
    <FormContainer>
      <TitleBar title='Rollover ACME Account Key' />

      {!apiGetAccountState.isLoaded && <ApiLoading />}
      {apiGetAccountState.errorMessage && (
        <ApiError>{apiGetAccountState.errorMessage}</ApiError>
      )}

      {renderApiItems && (
        <Form onSubmit={submitFormHandler}>
          <InputTextField
            label='Name'
            id='name'
            value={apiGetAccountState.acme_account.name}
            disabled
          />

          <InputTextField
            label='Description'
            id='description'
            value={
              apiGetAccountState.acme_account.description
                ? apiGetAccountState.acme_account.description
                : 'None'
            }
            disabled
          />

          <InputSelect
            label='Current Private Key'
            id='private_key_id'
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
            value={0}
            disabled
          />

          <InputSelect
            label='New Private Key'
            id='private_key_id'
            options={availableKeys}
            value={formState.form.private_key_id}
            onChange={intInputChangeHandler}
          />

          {apiSendState.errorMessage &&
            Object.keys(formState.validationErrors).length <= 0 && (
              <FormError>
                Error Posting -- {apiSendState.errorMessage}
              </FormError>
            )}

          <FormFooter>
            <Button
              type='cancel'
              onClick={cancelClickHandler}
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
