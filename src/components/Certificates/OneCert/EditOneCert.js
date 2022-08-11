import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

const EditOneCert = () => {
  // fetch current state
  const { id } = useParams();
  const [apiGetState] = useApiGet(`/v1/certificates/${id}`, 'certificate');

  // get config options
  const [optionsState] = useApiGet(
    `/v1/certificates/${newId}`,
    'certificate_options'
  );

  const [sendApiState, sendData] = useApiSend();
  const navigate = useNavigate();

  // initialize dummy values
  const [formState, setFormState] = useState({
    certificate: {
      id: -2,
      name: '',
      description: '',
      private_key_id: -2,
      challenge_method_value: '',
      subject_alts: [],
      organization: '',
      organizational_unit: '',
      country: '',
      city: '',
    },
    validationErrors: {},
  });

  // Function to set the form equal to the current API state
  const setFormToApi = useCallback(() => {
    setFormState({
      certificate: {
        id: apiGetState.certificate.id,
        name: apiGetState.certificate.name,
        description: apiGetState.certificate.description,
        private_key_id: apiGetState.certificate.private_key.id,
        challenge_method_value: apiGetState.certificate.challenge_method.value,
        subject_alts: apiGetState.certificate.subject_alts,
        organization: apiGetState.certificate.organization,
        organizational_unit: apiGetState.certificate.organizational_unit,
        country: apiGetState.certificate.country,
        city: apiGetState.certificate.city,
      },
      validationErrors: {},
    });
  }, [apiGetState]);

  useEffect(() => {
    if (apiGetState.isLoaded && !apiGetState.errorMessage) {
      setFormToApi();
    }
  }, [apiGetState, setFormToApi]);

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

    setFormToApi();
  };
  const cancelClickHandler = (event) => {
    event.preventDefault();
    //navigate('.');
    navigate(`/certificates/${id}`);
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

    // subject alts (use an array to record which specific
    // alts are not valid)
    var subject_alts = [];
    formState.certificate.subject_alts.forEach((alt, i) => {
      if (!isDomainValid(alt)) {
        subject_alts.push(i);
      }
    });
    // if any alts invalid, create the error array
    if (subject_alts.length !== 0) {
      validationErrors.subject_alts = subject_alts;
    }

    //TODO: CSR validation?

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    //

    sendData(`/v1/certificates/${id}`, 'PUT', formState.certificate).then(
      (success) => {
        if (success) {
          // back to certificate view
          navigate(`/certificates/${id}`);
        }
      }
    );
  };

  if (apiGetState.errorMessage) {
    return <ApiError>{apiGetState.errorMessage}</ApiError>;
  } else if (optionsState.errorMessage) {
    <ApiError>{optionsState.errorMessage}</ApiError>;
  } else if (!apiGetState.isLoaded || !optionsState.isLoaded) {
    return <ApiLoading />;
  } else {
    // Logic for some of the components so JSX is cleaner
    // build options for available keys
    var availableKeys;
    // populate current key
    availableKeys = [
      {
        value: apiGetState.certificate.private_key.id,
        name: apiGetState.certificate.private_key.name + ' - Current Key',
      },
    ];
    // if there are additional available keys, add those
    if (optionsState.certificate_options.private_keys) {
      availableKeys = availableKeys.concat(
        optionsState.certificate_options.private_keys.map((m) => ({
          value: parseInt(m.id),
          name: m.name + ' (' + m.algorithm.name + ')',
        }))
      );
    }

    // build challenge method options (must be returned by backend)
    var defaultMethodValue = apiGetState.certificate.challenge_method.value;
    var defaultMethodName =
      apiGetState.certificate.challenge_method.name +
      ' (' +
      apiGetState.certificate.challenge_method.type +
      ') - Current Method';
    var availableMethods =
      optionsState.certificate_options.challenge_methods.map((m) => ({
        value: m.value,
        name: m.name + ' (' + m.type + ')',
      }));
    // remove default from available options so it isn't listed twice
    availableMethods = availableMethods.filter(method => method.value !== defaultMethodValue)
    ///

    return (
      <>
        <H2Header h2='Certificates - Edit' />
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
            defaultName={
              apiGetState.certificate.acme_account.name +
              (apiGetState.certificate.acme_account.is_staging && ' (Staging)')
            }
            disabled
          />

          <InputSelect
            label='Private Key'
            id='private_key_id'
            name='private_key_id'
            options={availableKeys}
            value={formState.certificate.private_key_id}
            onChange={intInputChangeHandler}
            disableEmptyValue
            invalid={formState.validationErrors.private_key_id}
          />

          <InputSelect
            label='Challenge Method'
            id='challenge_method_value'
            name='challenge_method_value'
            options={availableMethods}
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
            value={apiGetState.certificate.subject}
            disabled
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

export default EditOneCert;
