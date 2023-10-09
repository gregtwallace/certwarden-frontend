import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { formChangeHandlerFunc } from '../../../../helpers/input-handler';
import {
  isDomainValid,
  isNameValid,
} from '../../../../helpers/form-validation';
import { newId } from '../../../../helpers/constants';
import { downloadBlob } from '../../../../helpers/download';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import Button from '../../../UI/Button/Button';
import DialogAlert from '../../../UI/Dialog/DialogAlert';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormFooter from '../../../UI/FormMui/FormFooter';
import FormRowRight from '../../../UI/FormMui/FormRowRight';
import InputCheckbox from '../../../UI/FormMui/InputCheckbox';
import InputSelect from '../../../UI/FormMui/InputSelect';
import InputTextArray from '../../../UI/FormMui/InputTextArray';
import InputTextField from '../../../UI/FormMui/InputTextField';
import Orders from './Orders/Orders';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const EditOneCert = () => {
  const [hasValidOrders, setHasValidOrders] = useState(false);

  const [apiSendState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  // fetch current state
  const { id } = useParams();
  const [apiGetState, updateCertGet] = useAxiosGet(
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

  const [formState, setFormState] = useState({});

  // Function to set the form equal to the current API state
  const setFormToApi = useCallback(() => {
    setFormState({
      form: {
        name: apiGetState.certificate.name,
        description: apiGetState.certificate.description,
        private_key_id: apiGetState.certificate.private_key.id,
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

  // data change handler
  const inputChangeHandler = formChangeHandlerFunc(setFormState);

  // delete handlers
  const [deleteOpen, setDeleteOpen] = useState(false);
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
          navigate('/certificates');
        }
      }
    );
  };

  // button handlers
  const downloadClickHandler = () => {
    if (apiGetState?.certificate?.name) {
      sendData(
        `/v1/certificates/${id}/download`,
        'GET',
        null,
        true,
        'blob'
      ).then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          downloadBlob(response);
        }
      });
    }
  };

  const newApiKeyClickHandler = () => {
    sendData(`/v1/certificates/${id}/apikey`, 'POST', null, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          // reload state
          updateCertGet();
        }
      }
    );
  };

  const retireApiKeyClickHandler = () => {
    sendData(`/v1/certificates/${id}/apikey`, 'DELETE', null, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          // reload state
          updateCertGet();
        }
      }
    );
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
  // don't render if not loaded, error, or formState not yet set
  // formState set is needed to prevent animations of form fields
  // populating (when previously using a blank form object) or invalid
  // references to formState.form now that blank form object is gone
  const renderApiItems =
    apiGetState.isLoaded &&
    !apiGetState.errorMessage &&
    apiGetCertOptionsState.isLoaded &&
    !apiGetCertOptionsState.errorMessage &&
    JSON.stringify({}) !== JSON.stringify(formState);

  // vars related to api
  var availableKeys;
  var formUnchanged = true;

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

    // does form match get api call
    formUnchanged =
      apiGetState.certificate.name === formState.form.name &&
      apiGetState.certificate.description === formState.form.description &&
      apiGetState.certificate.private_key.id ===
        formState.form.private_key_id &&
      JSON.stringify(apiGetState.certificate.subject_alts) ===
        JSON.stringify(formState.form.subject_alts) &&
      apiGetState.certificate.api_key_via_url ===
        formState.form.api_key_via_url &&
      apiGetState.certificate.country === formState.form.country &&
      apiGetState.certificate.city === formState.form.city &&
      apiGetState.certificate.organization === formState.form.organization &&
      apiGetState.certificate.organizational_unit ===
        formState.form.organizational_unit;
  }
  // vars related to api -- end

  return (
    <>
      <FormContainer>
        <TitleBar title='Edit Certificate'>
          {renderApiItems && (
            <>
              <Button
                onClick={downloadClickHandler}
                disabled={apiSendState.isSending || !hasValidOrders}
              >
                Download
              </Button>
              <Button
                type='delete'
                onClick={deleteClickHandler}
                disabled={apiSendState.isSending}
              >
                Delete
              </Button>
            </>
          )}
        </TitleBar>

        {!apiGetState.isLoaded && <ApiLoading />}
        {apiGetState.errorMessage && (
          <ApiError
            code={apiGetState.errorCode}
            message={apiGetState.errorMessage}
          />
        )}

        {renderApiItems && (
          <>
            <DialogAlert
              title={`Are you sure you want to delete ${formState.form.name}?`}
              open={deleteOpen}
              onCancel={deleteCancelHandler}
              onConfirm={deleteConfirmHandler}
            >
              All orders associated with this certificate will also be deleted
              and irrecoverable.
              <br />
              Any associated account and private keys will be unchanged.
            </DialogAlert>

            <Form onSubmit={submitFormHandler}>
              <InputTextField
                label='Name'
                id='form.name'
                value={formState.form.name}
                onChange={inputChangeHandler}
                error={formState.validationErrors.name && true}
              />

              <InputTextField
                label='Description'
                id='form.description'
                value={formState.form.description}
                onChange={inputChangeHandler}
              />

              <InputSelect
                label='ACME Account'
                id='form.acme_account_id'
                value={0}
                options={[
                  {
                    value: 0,
                    name:
                      apiGetState.certificate.acme_account.name +
                      (apiGetState.certificate.acme_account.acme_server
                        .is_staging
                        ? ' (Staging)'
                        : ''),
                  },
                ]}
                disabled
              />

              <InputSelect
                label='Private Key'
                id='form.private_key_id'
                options={availableKeys}
                value={formState.form.private_key_id}
                onChange={(event) => inputChangeHandler(event, 'number')}
                error={formState.validationErrors.private_key_id}
              />

              <InputTextField
                label='Subject (and Common Name)'
                id='form.subject'
                value={apiGetState.certificate.subject}
                disabled
              />

              <InputTextArray
                label='Subject Alternate Names'
                subLabel='Alternate Name'
                id='form.subject_alts'
                value={formState.form.subject_alts}
                onChange={inputChangeHandler}
                error={formState.validationErrors.subject_alts}
              />

              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls='csr-fields-content'
                  id='csr-fields-header'
                >
                  <Typography>CSR Fields</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ mb: 2 }}>
                    These fields are optional and appear to be ignored by some
                    CAs.
                  </Typography>

                  <InputTextField
                    label='Country (2 Letter Code)'
                    id='form.country'
                    value={formState.form.country}
                    onChange={inputChangeHandler}
                  />

                  <InputTextField
                    label='City'
                    id='form.city'
                    value={formState.form.city}
                    onChange={inputChangeHandler}
                  />

                  <InputTextField
                    label='Organization'
                    id='form.organization'
                    value={formState.form.organization}
                    onChange={inputChangeHandler}
                  />

                  <InputTextField
                    label='Organizational Unit'
                    id='form.organizational_unit'
                    value={formState.form.organizational_unit}
                    onChange={inputChangeHandler}
                  />
                </AccordionDetails>
              </Accordion>

              <InputTextField
                label={
                  (apiGetState.certificate.api_key_new ? 'Old ' : '') +
                  'API Key'
                }
                id='form.api_key'
                value={apiGetState.certificate.api_key}
                readOnly
                disabled={apiGetState.certificate.api_key.includes('*')}
              />

              <FormRowRight>
                <Button
                  href={`/certificates/${id}/apikeys`}
                  type='manually_edit'
                  disabled={
                    apiSendState.isSending ||
                    apiGetState.certificate.api_key.includes('*')
                  }
                >
                  Edit API Keys
                </Button>

                {apiGetState.certificate.api_key_new ? (
                  <Button
                    onClick={retireApiKeyClickHandler}
                    disabled={
                      apiSendState.isSending ||
                      apiGetState.certificate.api_key.includes('*')
                    }
                  >
                    Retire Old API Key
                  </Button>
                ) : (
                  <Button
                    onClick={newApiKeyClickHandler}
                    disabled={
                      apiSendState.isSending ||
                      apiGetState.certificate.api_key.includes('*')
                    }
                  >
                    New API Key
                  </Button>
                )}
              </FormRowRight>

              {apiGetState.certificate.api_key_new && (
                <InputTextField
                  label='New API Key'
                  id='form.api_key_new'
                  value={apiGetState.certificate.api_key_new}
                  readOnly
                  disabled={apiGetState.certificate.api_key.includes('*')}
                />
              )}

              <InputCheckbox
                id='form.api_key_via_url'
                checked={formState.form.api_key_via_url}
                onChange={(event) => inputChangeHandler(event, 'checkbox')}
              >
                Allow API Key via URL (for Legacy Clients)
              </InputCheckbox>

              {apiSendState.errorMessage &&
                Object.keys(formState.validationErrors).length <= 0 && (
                  <ApiError
                    code={apiSendState.errorCode}
                    message={apiSendState.errorMessage}
                  />
                )}

              <FormFooter
                createdAt={apiGetState.certificate.created_at}
                updatedAt={apiGetState.certificate.updated_at}
              >
                <Button
                  type='cancel'
                  href='/certificates'
                  disabled={apiSendState.isSending}
                >
                  Cancel
                </Button>
                <Button
                  type='reset'
                  onClick={() => setFormToApi()}
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
      <Orders
        setHasValidOrders={setHasValidOrders}
        certId={id}
        sendApiState={apiSendState}
        sendData={sendData}
      />
    </>
  );
};

export default EditOneCert;
