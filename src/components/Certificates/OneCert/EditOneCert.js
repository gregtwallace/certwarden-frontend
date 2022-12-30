import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import useAxiosGet from '../../../hooks/useAxiosGet';
import useAxiosSend from '../../../hooks/useAxiosSend';
import { isDomainValid, isNameValid } from '../../../helpers/form-validation';
import { newId } from '../../../App';
import { buildMethodsList } from './methods';

import { Typography } from '@mui/material';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import Button from '../../UI/Button/Button';
import DialogAlert from '../../UI/Dialog/DialogAlert';
import Form from '../../UI/FormMui/Form';
import FormContainer from '../../UI/FormMui/FormContainer';
import FormError from '../../UI/FormMui/FormError';
import FormFooter from '../../UI/FormMui/FormFooter';
import InputCheckbox from '../../UI/FormMui/InputCheckbox';
import InputSelect from '../../UI/FormMui/InputSelect';
import InputTextArray from '../../UI/FormMui/InputTextArray';
import InputTextField from '../../UI/FormMui/InputTextField';
import Orders from './Orders/Orders';
import TitleBar from '../../UI/TitleBar/TitleBar';

const EditOneCert = () => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [apiSendState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  // fetch current state
  const { id } = useParams();
  const [apiGetState] = useAxiosGet(
    `/v1/certificates/${id}`,
    'certificate',
    true
  );

  // get config options
  const [apiGetCertOptionsState] = useAxiosGet(
    `/v1/certificates/${newId}`,
    'certificate_options',
    true
  );

  // initialize dummy values
  const dummyForm = {
    form: {
      name: '',
      description: '',
      private_key_id: '',
      challenge_method_value: '',
      subject_alts: [],
      api_key_via_url: false,
      country: '',
      city: '',
      organization: '',
      organizational_unit: '',
    },
    validationErrors: {},
  };

  const [formState, setFormState] = useState(dummyForm);

  // Function to set the form equal to the current API state
  const setFormToApi = useCallback(() => {
    setFormState({
      form: {
        name: apiGetState.certificate.name,
        description: apiGetState.certificate.description,
        private_key_id: apiGetState.certificate.private_key.id,
        challenge_method_value: apiGetState.certificate.challenge_method.value,
        subject_alts: apiGetState.certificate.subject_alts,
        api_key_via_url: apiGetState.certificate.api_key_via_url,
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
        form: {
          ...prevState.form,
          [event.target.name]: event.target.value,
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

  // delete handlers
  const deleteClickHandler = () => {
    setDeleteOpen(true);
  };
  const deleteCancelHandler = () => {
    setDeleteOpen(false);
  };
  const deleteConfirmHandler = () => {
    setDeleteOpen(false);
    sendData(`/v1/certificates/${id}`, 'DELETE', null, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          navigate(-1);
        }
      }
    );
  };

  // button handlers
  const resetClickHandler = (event) => {
    event.preventDefault();

    setFormToApi();
  };
  const cancelClickHandler = (event) => {
    event.preventDefault();
    navigate(-1);
  };

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    // form validation
    let validationErrors = {};
    // name
    if (!isNameValid(formState.form.name)) {
      validationErrors.name = true;
    }

    // subject alts (use an array to record which specific
    // alts are not valid)
    var subject_alts = [];
    formState.form.subject_alts.forEach((alt, i) => {
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
    // form validation -- end

    sendData(`/v1/certificates/${id}`, 'PUT', formState.form, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          navigate('/certificates');
        }
      }
    );
  };

  // consts related to rendering
  const renderApiItems =
    apiGetState.isLoaded &&
    !apiGetState.errorMessage &&
    apiGetCertOptionsState.isLoaded &&
    !apiGetCertOptionsState.errorMessage &&
    JSON.stringify(dummyForm.form) !== JSON.stringify(formState.form);

  const formUnchanged =
    apiGetState.certificate.name === formState.form.name &&
    apiGetState.certificate.description === formState.form.description &&
    apiGetState.certificate.private_key.id === formState.form.private_key_id &&
    apiGetState.certificate.challenge_method.value ===
      formState.form.challenge_method_value &&
    apiGetState.certificate.subject_alts === formState.form.subject_alts &&
    apiGetState.certificate.api_key_via_url ===
      formState.form.api_key_via_url &&
    apiGetState.certificate.country === formState.form.country &&
    apiGetState.certificate.city === formState.form.city &&
    apiGetState.certificate.organization === formState.form.organization &&
    apiGetState.certificate.organizational_unit ===
      formState.form.organizational_unit;

  // vars related to api
  var availableKeys;
  var availableMethods;

  if (renderApiItems) {
    // build options for available keys
    // default (current) option
    availableKeys = [
      {
        value: parseInt(apiGetState.certificate.private_key.id),
        name: apiGetState.certificate.private_key.name + ' - Current',
      },
    ];
    if (apiGetCertOptionsState?.certificate_options?.private_keys) {
      availableKeys = availableKeys.concat(
        apiGetCertOptionsState.certificate_options.private_keys.map((k) => ({
          value: parseInt(k.id),
          name: k.name,
        }))
      );
    }
    // build options for challenge method
    if (apiGetCertOptionsState?.certificate_options?.challenge_methods) {
      availableMethods = buildMethodsList(
        apiGetCertOptionsState.certificate_options.challenge_methods,
        apiGetState.certificate.challenge_method
      );
    }
  }
  // vars related to api -- end

  return (
    <>
      <FormContainer>
        <TitleBar title='Edit Certificate'>
          {renderApiItems && (
            <Button
              type='delete'
              onClick={deleteClickHandler}
              disabled={apiSendState.isSending}
            >
              Delete
            </Button>
          )}
        </TitleBar>

        {!apiGetState.isLoaded && <ApiLoading />}
        {apiGetState.errorMessage && (
          <ApiError>{apiGetState.errorMessage}</ApiError>
        )}

        {renderApiItems && (
          <>
            <DialogAlert
              title={`Are you sure you want to delete ${formState.form.name}?`}
              open={deleteOpen}
              onCancel={deleteCancelHandler}
              onConfirm={deleteConfirmHandler}
            >
              The account can be recovered as long as the associated key is not
              lost.
            </DialogAlert>

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

              <InputSelect
                label='ACME Account'
                id='acme_account_id'
                value={0}
                options={[
                  {
                    value: 0,
                    name:
                      apiGetState.certificate.acme_account.name +
                      (apiGetState.certificate.acme_account.is_staging
                        ? ' (Staging)'
                        : ''),
                  },
                ]}
                disabled
              />

              <InputSelect
                label='Private Key'
                id='private_key_id'
                options={availableKeys}
                value={formState.form.private_key_id}
                onChange={intInputChangeHandler}
                error={formState.validationErrors.private_key_id}
              />

              <InputSelect
                label='Challenge Method'
                id='challenge_method_value'
                options={availableMethods}
                value={formState.form.challenge_method_value}
                onChange={stringInputChangeHandler}
                error={formState.validationErrors.challenge_method_value}
              />

              <InputTextField
                label='Subject (and Common Name)'
                id='subject'
                value={apiGetState.certificate.subject}
                disabled
              />

              <InputTextArray
                label='Subject Alternate Names'
                id='subject_alts'
                name='subject_alts'
                value={formState.form.subject_alts}
                onChange={stringInputChangeHandler}
                error={formState.validationErrors.subject_alts}
              />

              <Typography component='h3' variant='subtitle2' sx={{ m: 2 }}>
                CSR Fields
              </Typography>

              <InputTextField
                label='Country (2 Letter Code)'
                id='country'
                value={formState.form.country}
                onChange={stringInputChangeHandler}
              />

              <InputTextField
                label='City'
                id='city'
                value={formState.form.city}
                onChange={stringInputChangeHandler}
              />

              <InputTextField
                label='Organization'
                id='organization'
                value={formState.form.organization}
                onChange={stringInputChangeHandler}
              />

              <InputTextField
                label='Organizational Unit'
                id='organizational_unit'
                value={formState.form.organizational_unit}
                onChange={stringInputChangeHandler}
              />

              <InputCheckbox
                id='api_key_via_url'
                checked={formState.form.api_key_via_url}
                onChange={checkChangeHandler}
              >
                Allow API Key via URL (for Legacy Clients)
              </InputCheckbox>

              {apiSendState.errorMessage &&
                formState.validationErrors.length > 0 && (
                  <FormError>
                    Error Posting -- {apiSendState.errorMessage}
                  </FormError>
                )}

              <FormFooter
                createdAt={apiGetState.certificate.created_at}
                updatedAt={apiGetState.certificate.updated_at}
              >
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
                  disabled={apiSendState.isSending || formUnchanged}
                >
                  Reset
                </Button>
                <Button
                  type='submit'
                  disabled={apiSendState.isSending || formUnchanged}
                >
                  Submit
                </Button>
              </FormFooter>
            </Form>
          </>
        )}
      </FormContainer>
      <Orders certId={id} sendApiState={apiSendState} sendData={sendData} />
    </>
  );
};

export default EditOneCert;
