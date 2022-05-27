import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useApiGet from '../../../hooks/useApiGet';
import useApiSend from '../../../hooks/useApiSend';
import { isNameValid } from '../../../helpers/form-validation';
import { newId } from '../../../App';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import H2Header from '../../UI/Header/H2Header';
import Button from '../../UI/Button/Button';
import Form from '../../UI/Form/Form';
import InputText from '../../UI/Form/InputText';
import InputSelect from '../../UI/Form/InputSelect';
import InputCheckbox from '../../UI/Form/InputCheckbox';
import FormInformation from '../../UI/Form/FormInformation';

const AddOneACMEAccount = () => {
  // fetch valid options (for private keys this is the algorithms list)
  const apiGetState = useApiGet(
    `/v1/acmeaccounts/${newId}`,
    'acme_account_options'
  );

  const [sendApiState, sendData] = useApiSend();
  const navigate = useNavigate();

  const blankFormState = {
    acme_account: {
      id: newId,
      name: '',
      description: '',
      algorithm: {
        value: '',
      },
      pem: '',
    },
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankFormState);

  // data change handlers

  // form field updates
  const inputChangeHandler = (event) => {
    setFormState((prevState) => {
      return {
        ...prevState,
        acme_account: {
          ...prevState.acme_account,
          [event.target.id]: event.target.value,
        },
      };
    });
  };
  const checkChangeHandler = (event) => {
    setFormState((prevState) => {
      return {
        ...prevState,
        acme_account: {
          ...prevState.acme_account,
          [event.target.id]: event.target.checked,
        },
      };
    });
  };

  // button handlers
  const resetClickHandler = (event) => {
    event.preventDefault();
    // setAcmeAccount((prevState) => {
    //   return {
    //     ...prevState,
    //     account: { ...prevState.origAccount },
    //   };
    // });
  };

  /// Logic for some of the components so JSX is cleaner
  var tos_url;
  var availableKeys;

  if (apiGetState.isLoaded && !apiGetState.errorMessage) {
    // tos URL (prod vs. staging)
    if (!formState.acme_account.is_staging) {
      tos_url = apiGetState.acme_account_options.tos_url;
    } else {
      tos_url = apiGetState.acme_account_options.staging_tos_url;
    }

    // build options for available keys
    if (apiGetState.isLoaded) {
      availableKeys = apiGetState.acme_account_options.available_keys.map(
        (m) => ({ value: m.id, name: m.name + " (" + m.algorithm.name + ")" })
      );
    }
  }
  ///

  if (apiGetState.errorMessage) {
    return <ApiError>{apiGetState.errorMessage}</ApiError>;
  } else if (!apiGetState.isLoaded) {
    return <ApiLoading />;
  } else {
    return (
      <>
        <H2Header h2='ACME Accounts - Add' />
        <Form>
          <InputText
            label='Account Name'
            id='name'
            value={formState.acme_account.name}
            onChange={inputChangeHandler}
          />
          <InputText
            label='Description'
            id='description'
            value={formState.acme_account.description}
            onChange={inputChangeHandler}
          />
          <InputText
            label='E-Mail Address'
            id='email'
            value={formState.acme_account.email}
            onChange={inputChangeHandler}
          />
          <InputSelect
            label='Private Key'
            id='privateKey'
            options={availableKeys}
            value={formState.acme_account.private_key_id}
            onChange={inputChangeHandler}
          />

          <FormInformation>
            Adding an account with a key that already has an associated account
            will cause the fields below to behave no effect.
          </FormInformation>

          <InputCheckbox
            id='is_staging'
            checked={formState.acme_account.is_staging ? true : ''}
            onChange={checkChangeHandler}
          >
            Staging Account
          </InputCheckbox>

          <FormInformation>
            Terms of Service:{' '}
            <a href={tos_url} target='_blank' rel='noreferrer'>
              {tos_url}
            </a>
          </FormInformation>
          <InputCheckbox
            id='accepted_tos'
            checked={formState.acme_account.accepted_tos ? true : ''}
            onChange={checkChangeHandler}
          >
            Accept Let's Encrypt Terms of Service
          </InputCheckbox>

          <FormInformation>
            <small>Created: {formState.acme_account.created_at}</small>
          </FormInformation>
          <FormInformation>
            <small>Last Updated: {formState.acme_account.updated_at}</small>
          </FormInformation>

          <Button type='submit'>Submit</Button>
          <Button type='reset' onClick={resetClickHandler}>
            Reset
          </Button>
          <Button type='cancel'>Cancel</Button>
        </Form>
      </>
    );
  }
};

export default AddOneACMEAccount;
