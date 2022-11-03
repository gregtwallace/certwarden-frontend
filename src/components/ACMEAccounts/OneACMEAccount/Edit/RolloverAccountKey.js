import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { newId } from '../../../../App';

import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import FormInformation from '../../../UI/Form/FormInformation';
import FormError from '../../../UI/Form/FormError';
import InputSelect from '../../../UI/Form/InputSelect';
import Button from '../../../UI/Button/Button';
import Form from '../../../UI/Form/Form';
import H2Header from '../../../UI/Header/H2Header';

const RolloverAccountKey = () => {
  const { id } = useParams();
  const [apiGetState] = useAxiosGet(
    `/v1/acmeaccounts/${id}`,
    'acme_account',
    true
  );

  const [newKeyOptions] = useAxiosGet(
    `/v1/acmeaccounts/${newId}`,
    'acme_account_options',
    true
  );
  const [sendApiState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  // blank form state
  const [formState, setFormState] = useState({
    acme_account: {
      private_key_id: -2,
    },
    validationErrors: {},
  });

  useEffect(() => {
    if (apiGetState.isLoaded && !apiGetState.errorMessage) {
      // if the account is not valid or is missing kid, this page won't work
      // so redirect to main account page
      if (
        apiGetState.acme_account.status !== 'valid' ||
        apiGetState.acme_account.kid === ''
      ) {
        navigate(`/acmeaccounts/${apiGetState.acme_account.id}`);
      }
    }
  }, [apiGetState, navigate]);

  // int form field updates
  const intInputChangeHandler = (event) => {
    setFormState((prevState) => {
      return {
        ...prevState,
        acme_account: {
          ...prevState.acme_account,
          [event.target.id]: parseInt(event.target.value),
        },
      };
    });
  };

  // button handlers
  const cancelClickHandler = (event) => {
    event.preventDefault();
    //navigate('.');
    navigate(`/acmeaccounts/${id}`);
  };

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    // client side validation
    let validationErrors = [];
    // check private key is selected
    if (formState.acme_account.private_key_id === -2) {
      validationErrors.private_key_id = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    // end validation

    sendData(
      `/v1/acmeaccounts/${id}/key-change`,
      'PUT',
      formState.acme_account,
      true
    ).then((success) => {
      if (success) {
        navigate(`/acmeaccounts/${id}`);
      }
    });
  };

  if (apiGetState.errorMessage) {
    return <ApiError>{apiGetState.errorMessage}</ApiError>;
  } else if (!apiGetState.isLoaded) {
    return <ApiLoading />;
  } else {
    // wait for new key options (avail keys) too
    if (newKeyOptions.errorMessage) {
      return <ApiError>{newKeyOptions.errorMessage}</ApiError>;
    } else if (!newKeyOptions.isLoaded) {
      return <ApiLoading />;
    } else {
      // Logic for some of the components so JSX is cleaner
      // build options for available keys
      // if there are available keys, populate them
      var availableKeys;
      var defaultKeysName;
      var defaultKeysValue = -2;
      if (newKeyOptions?.acme_account_options?.private_keys) {
        defaultKeysName = '- Select a Key -';
        availableKeys = newKeyOptions.acme_account_options.private_keys.map(
          (m) => ({
            value: parseInt(m.id),
            name: m.name + ' (' + m.algorithm.name + ')',
          })
        );
      } else {
        defaultKeysName = '- No Keys Available -';
      }
      // end jsx logic

      return (
        <>
          <H2Header h2='ACME Account - Rollover Key'></H2Header>
          <Form onSubmit={submitFormHandler}>
            {sendApiState.errorMessage && (
              <FormError>
                Error Posting -- {sendApiState.errorMessage}
              </FormError>
            )}

            <FormInformation>
              Account Name: {apiGetState.acme_account.name}
            </FormInformation>

            <FormInformation>
              Account Description: {apiGetState.acme_account.description}
            </FormInformation>

            <InputSelect
              label='New Private Key'
              id='private_key_id'
              name='private_key_id'
              options={availableKeys}
              value={formState.acme_account.private_key_id}
              onChange={intInputChangeHandler}
              defaultValue={defaultKeysValue}
              defaultName={defaultKeysName}
              disableEmptyValue
              invalid={formState.validationErrors.private_key_id}
            />

            <Button type='submit' disabled={sendApiState.isSending}>
              Submit
            </Button>
            <Button
              type='cancel'
              onClick={cancelClickHandler}
              disabled={sendApiState.isSending}
            >
              Cancel
            </Button>
          </Form>
        </>
      );
    }
  }
};

export default RolloverAccountKey;
