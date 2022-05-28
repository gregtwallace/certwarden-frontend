import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useApiGet from '../../../hooks/useApiGet';
import useApiSend from '../../../hooks/useApiSend';
import {
  isNameValid,
  isEmailValidOrBlank,
} from '../../../helpers/form-validation';
import { newId } from '../../../App';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import H2Header from '../../UI/Header/H2Header';
import Button from '../../UI/Button/Button';
import Form from '../../UI/Form/Form';
import InputText from '../../UI/Form/InputText';
import InputSelect from '../../UI/Form/InputSelect';
import InputCheckbox from '../../UI/Form/InputCheckbox';
import InputHidden from '../../UI/Form/InputHidden';
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
      email: '',
      private_key_id: '',
      is_staging: false,
      accepted_tos: false,
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
  // checkbox updates
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
    setFormState(blankFormState);
  };
  const cancelClickHandler = (event) => {
    event.preventDefault();
    // navigate('.');
    navigate('/acmeaccounts');
  };

  // submit handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    /// form validation
    let validationErrors = [];
    // name
    if (!isNameValid(formState.acme_account.name)) {
      validationErrors.name = true;
    }
    // check email format (if present)
    if (!isEmailValidOrBlank(formState.acme_account.email)) {
      validationErrors.email = true;
    }
    // check private key is selected
    if (formState.acme_account.private_key_id === '') {
      validationErrors.private_key_id = true;
    }
    // ToS must be accepted
    if (formState.acme_account.accepted_tos !== true) {
      validationErrors.accepted_tos = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    ///

    sendData(`/v1/acmeaccounts`, 'POST', event).then((success) => {
      if (success) {
        // back to the acme accounts page
        //navigate('.');
        navigate('/acmeaccounts');
      }
    });
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
    availableKeys = apiGetState.acme_account_options.available_keys.map(
      (m) => ({ value: m.id, name: m.name + ' (' + m.algorithm.name + ')' })
    );
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
        <Form onSubmit={submitFormHandler}>
          <InputText
            label='Account Name'
            id='name'
            name='name'
            value={formState.acme_account.name}
            onChange={inputChangeHandler}
            invalid={formState.validationErrors.name && true}
          />
          <InputText
            label='Description'
            id='description'
            name='description'
            value={formState.acme_account.description}
            onChange={inputChangeHandler}
          />
          <InputText
            label='E-Mail Address'
            id='email'
            name='email'
            value={formState.acme_account.email}
            onChange={inputChangeHandler}
            invalid={formState.validationErrors.email && true}
          />
          <InputSelect
            label='Private Key'
            id='private_key_id'
            name='private_key_id'
            options={availableKeys}
            value={formState.acme_account.private_key_id}
            onChange={inputChangeHandler}
            emptyValue='- Select a Key -'
            invalid={formState.validationErrors.private_key_id}
          />

          <InputCheckbox
            id='is_staging'
            checked={formState.acme_account.is_staging ? true : false}
            onChange={checkChangeHandler}
          >
            Staging Account
          </InputCheckbox>
          <InputHidden
            id='is_staging_input'
            name='is_staging'
            value={formState.acme_account.is_staging ? true : false}
          />

          <InputCheckbox
            id='accepted_tos'
            checked={formState.acme_account.accepted_tos ? true : false}
            onChange={checkChangeHandler}
            invalid={formState.validationErrors.accepted_tos}
          >
            Accept{' '}
            <a href={tos_url} target='_blank' rel='noreferrer'>
              Let's Encrypt Terms of Service
            </a>
          </InputCheckbox>
          <InputHidden
            id='accepted_tos_input'
            name='accepted_tos'
            value={formState.acme_account.accepted_tos ? true : false}
          />

          <Button type='submit' disabled={sendApiState.isSending}>
            Submit
          </Button>
          <Button
            type='reset'
            onClick={resetClickHandler}
            disabled={sendApiState.isSending}
          >
            Reset
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
};

export default AddOneACMEAccount;
