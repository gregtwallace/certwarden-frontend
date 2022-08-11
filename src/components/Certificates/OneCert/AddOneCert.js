import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useApiGet from '../../../hooks/useApiGet';
import useApiSend from '../../../hooks/useApiSend';
import { isDomainValid, isNameValid } from '../../../helpers/form-validation';
import { newId } from '../../../App';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import H2Header from '../../UI/Header/H2Header';
import Button from '../../UI/Button/Button';
import Form from '../../UI/Form/Form';
import FormInformation from '../../UI/Form/FormInformation';
import InputSelect from '../../UI/Form/InputSelect';
import InputText from '../../UI/Form/InputText';
import InputTextArray from '../../UI/Form/InputTextArray';
import InputHidden from '../../UI/Form/InputHidden';
import FormError from '../../UI/Form/FormError';

const AddOneCert = () => {
  // fetch valid options (for private keys this is the algorithms list)
  const [apiGetState] = useApiGet(
    `/v1/certificates/${newId}`,
    'certificate_options'
  );

  const [sendApiState, sendData] = useApiSend();
  const navigate = useNavigate();

  const blankFormState = {
    certificate: {
      id: newId,
      name: '',
      description: '',
      private_key_id: -2,
      acme_account_id: -2,
      challenge_method_value: '',
      subject: '',
      subject_alts: [],
      organization: '',
      organizational_unit: '',
      country: '',
      city: '',
    },
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankFormState);

  // data change handlers
  // string form field updates
  const stringInputChangeHandler = (event) => {
    setFormState((prevState) => {
      return {
        ...prevState,
        certificate: {
          ...prevState.certificate,
          [event.target.id]: event.target.value,
        },
      };
    });
  };

  // int form field updates
  const intInputChangeHandler = (event) => {
    setFormState((prevState) => {
      return {
        ...prevState,
        certificate: {
          ...prevState.certificate,
          [event.target.id]: parseInt(event.target.value),
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
    //navigate('.');
    navigate('/certificates');
  };

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    /// form validation
    let validationErrors = [];
    // name
    if (!isNameValid(formState.certificate.name)) {
      validationErrors.name = true;
    }

    // subject
    if (!isDomainValid(formState.certificate.subject)) {
      validationErrors.subject = true;
    }

    // subject alts (use an array to record which specific
    // alts are not valid)
    var subject_alts = []
    formState.certificate.subject_alts.forEach(
      (alt, i) => {
        if (!isDomainValid(alt)) {
          subject_alts.push(i);
        }
      }
    );
    // if any alts invalid, create the error array
    if (subject_alts.length !== 0) {
      validationErrors.subject_alts = subject_alts
    }
    
    //TODO: other validation

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    //

    sendData(`/v1/certificates`, 'POST', formState.certificate).then(
      (success) => {
        if (success) {
          // back to the certificates page
          //navigate('.');
          navigate('/certificates');
        }
      }
    );
  };

  if (apiGetState.errorMessage) {
    return <ApiError>{apiGetState.errorMessage}</ApiError>;
  } else if (!apiGetState.isLoaded) {
    return <ApiLoading />;
  } else {
    /// Logic for some of the components so JSX is cleaner
    // build options for available accounts
    var defaultAccountsValue = -2;
    var defaultAccountsName;
    var availableAccounts;
    // if there are available accounts, populate them
    if (apiGetState.certificate_options.acme_accounts) {
      defaultAccountsName = '- Select an Account -';
      availableAccounts = apiGetState.certificate_options.acme_accounts.map(
        (m) => ({
          value: parseInt(m.id),
          name: m.name + (m.is_staging ? ' (Staging)' : ''),
        })
      );
    } else {
      defaultAccountsName = '- No Accounts Available -';
    }

    // build options for available keys
    var defaultKeysValue = -2;
    var defaultKeysName;
    var availableKeys;
    // if there are available keys, populate them
    if (apiGetState.certificate_options.private_keys) {
      defaultKeysName = '- Select a Key -';
      availableKeys = apiGetState.certificate_options.private_keys.map((m) => ({
        value: parseInt(m.id),
        name: m.name + ' (' + m.algorithm.name + ')',
      }));
    } else {
      // change text if no keys available
      defaultKeysName = '- No Keys Available -';
    }

    // build challenge method options
    var defaultMethodValue = -2;
    var defaultMethodName;
    var availableMethodss;
    // if there are available keys, populate them
    if (apiGetState.certificate_options.challenge_methods) {
      defaultMethodName = '- Select Challenge Method -';
      availableMethodss = apiGetState.certificate_options.challenge_methods.map(
        (m) => ({
          value: m.value,
          name: m.name + ' (' + m.type + ')',
        })
      );
    } else {
      // change text if no keys available
      defaultMethodName = '- No Challenge Methods Available -';
    }
    ///

    return (
      <>
        <H2Header h2='Certificates - Add' />
        <Form onSubmit={submitFormHandler}>
          {sendApiState.errorMessage && (
            <FormError>Error Posting -- {sendApiState.errorMessage}</FormError>
          )}

          <InputHidden id='id' name='id' value={formState.certificate.id} />

          <InputText
            label='Name'
            id='name'
            name='name'
            value={formState.certificate.name}
            onChange={stringInputChangeHandler}
            invalid={formState.validationErrors.name && true}
          />
          <InputText
            label='Description'
            id='description'
            name='description'
            value={formState.certificate.description}
            onChange={stringInputChangeHandler}
          />

          <InputSelect
            label='ACME Account'
            id='acme_account_id'
            name='acme_account_id'
            options={availableAccounts}
            value={formState.certificate.acme_account_id}
            onChange={intInputChangeHandler}
            defaultValue={defaultAccountsValue}
            defaultName={defaultAccountsName}
            disableEmptyValue
            invalid={formState.validationErrors.acme_account_id}
          />

          <InputSelect
            label='Private Key'
            id='private_key_id'
            name='private_key_id'
            options={availableKeys}
            value={formState.certificate.private_key_id}
            onChange={intInputChangeHandler}
            defaultValue={defaultKeysValue}
            defaultName={defaultKeysName}
            disableEmptyValue
            invalid={formState.validationErrors.private_key_id}
          />

          <InputSelect
            label='Challenge Method'
            id='challenge_method_value'
            name='challenge_method_value'
            options={availableMethodss}
            value={formState.certificate.challenge_method_value}
            onChange={stringInputChangeHandler}
            defaultValue={defaultMethodValue}
            defaultName={defaultMethodName}
            disableEmptyValue
            invalid={formState.validationErrors.challenge_method_value}
          />

          <InputText
            label='Subject (and Common Name)'
            id='subject'
            name='subject'
            value={formState.certificate.subject}
            onChange={stringInputChangeHandler}
            invalid={formState.validationErrors.subject && true}
          />

          <InputTextArray
            label='Subject Alt. Names'
            id='subject_alts'
            name='subject_alts'
            value={formState.certificate.subject_alts}
            onChange={stringInputChangeHandler}
            invalid={formState.validationErrors.subject_alts}
          />

          <FormInformation>
            <strong>CSR</strong>
          </FormInformation>
          <InputText
            label='Organization'
            id='organization'
            name='organization'
            value={formState.certificate.organization}
            onChange={stringInputChangeHandler}
            invalid={formState.validationErrors.organization && true}
          />
          <InputText
            label='Organizational Unit'
            id='organizational_unit'
            name='organizational_unit'
            value={formState.certificate.organizational_unit}
            onChange={stringInputChangeHandler}
            invalid={formState.validationErrors.organizational_unit && true}
          />
          <InputText
            label='Country (2 Letter Code)'
            id='country'
            name='country'
            value={formState.certificate.country}
            onChange={stringInputChangeHandler}
            invalid={formState.validationErrors.country && true}
          />
          <InputText
            label='City'
            id='city'
            name='city'
            value={formState.certificate.city}
            onChange={stringInputChangeHandler}
            invalid={formState.validationErrors.city && true}
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

export default AddOneCert;
