import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosGet from '../../../hooks/useAxiosGet';
import useAxiosSend from '../../../hooks/useAxiosSend';
import {
  isNameValid,
  isEmailValidOrBlank,
} from '../../../helpers/form-validation';
import { newId } from '../../../helpers/constants';

import { Link } from '@mui/material';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import Button from '../../UI/Button/Button';
import InputCheckbox from '../../UI/FormMui/InputCheckbox';
import InputSelect from '../../UI/FormMui/InputSelect';
import Form from '../../UI/FormMui/Form';
import FormContainer from '../../UI/FormMui/FormContainer';
import FormError from '../../UI/FormMui/FormError';
import FormFooter from '../../UI/FormMui/FormFooter';
import InputTextField from '../../UI/FormMui/InputTextField';
import TitleBar from '../../UI/TitleBar/TitleBar';

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
      private_key_id: '',
      is_staging: false,
      accepted_tos: false,
    },
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankForm);

  // data change handlers
  // string form field updates
  const stringInputChangeHandler = (event) => {
    setFormState((prevState) => {
      return {
        ...prevState,
        form: {
          ...prevState.form,
          [event.target.name]: event.target.value,
        },
      };
    });
  };

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

  // checkbox updates
  const checkChangeHandler = (event) => {
    setFormState((prevState) => {
      return {
        ...prevState,
        form: {
          ...prevState.form,
          [event.target.name]: event.target.checked,
        },
      };
    });
  };

  // button handlers
  const resetClickHandler = (event) => {
    event.preventDefault();
    setFormState(blankForm);
  };
  const cancelClickHandler = (event) => {
    event.preventDefault();
    navigate('/acmeaccounts');
  };

  // submit handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    // form validation
    let validationErrors = {};
    // name
    if (!isNameValid(formState.form.name)) {
      validationErrors.name = true;
    }
    // check email format (if present)
    if (!isEmailValidOrBlank(formState.form.email)) {
      validationErrors.email = true;
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
  var availableKeys;

  if (renderApiItems) {
    // tos URL (prod vs. staging)
    if (!formState.form.is_staging) {
      tos_url = apiGetState.acme_account_options.tos_url;
    } else {
      tos_url = apiGetState.acme_account_options.staging_tos_url;
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
        <ApiError>{apiGetState.errorMessage}</ApiError>
      )}

      {renderApiItems && (
        <Form onSubmit={submitFormHandler}>
          <InputTextField
            label='Name'
            id='name'
            value={formState.form.name}
            onChange={stringInputChangeHandler}
            error={formState.validationErrors.name && true}
          />

          <InputTextField
            label='Description'
            id='description'
            value={formState.form.description}
            onChange={stringInputChangeHandler}
          />

          <InputTextField
            label='Contact E-Mail Address'
            id='email'
            name='email'
            value={formState.form.email}
            onChange={stringInputChangeHandler}
            error={formState.validationErrors.email && true}
          />

          <InputSelect
            label='Private Key'
            id='private_key_id'
            options={availableKeys}
            value={formState.form.private_key_id}
            onChange={intInputChangeHandler}
            error={formState.validationErrors.private_key_id && true}
          />

          <InputCheckbox
            id='is_staging'
            checked={formState.form.is_staging}
            onChange={checkChangeHandler}
          >
            Staging Environment Account
          </InputCheckbox>

          <InputCheckbox
            id='accepted_tos'
            checked={formState.form.accepted_tos}
            onChange={checkChangeHandler}
            error={formState.validationErrors.accepted_tos && true}
          >
            Accept{' '}
            <Link href={tos_url} target='_blank' rel='noreferrer'>
              Let&apos;s Encrypt Terms of Service
            </Link>
          </InputCheckbox>

          {apiSendState.errorMessage &&
            Object.keys(formState.validationErrors).length <= 0 && (
              <FormError>
                Error Sending -- {apiSendState.errorMessage}
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

export default AddOneACMEAccount;
