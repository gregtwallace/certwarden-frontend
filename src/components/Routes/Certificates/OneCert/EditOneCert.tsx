import { type FC, type FormEventHandler, type MouseEventHandler } from 'react';
import {
  type oneCertificateResponseType,
  parseOneCertificateResponseType,
  type certificateOptionsResponseType,
  parseCertificateOptionsResponse,
  type certificateDeleteResponseType,
  parseCertificateDeleteResponseType,
} from '../../../../types/api';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../../types/frontend';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { inputHandlerFuncMaker } from '../../../../helpers/input-handler';
import {
  isDomainValid,
  isNameValid,
} from '../../../../helpers/form-validation';
import { newId } from '../../../../helpers/constants';
import { buildPrivateKeyOptions } from '../../../../helpers/options_builders';

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
import ButtonAsLink from '../../../UI/Button/ButtonAsLink';
import DialogAlert from '../../../UI/Dialog/DialogAlert';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormFooter from '../../../UI/FormMui/FormFooter';
import FormInfo from '../../../UI/FormMui/FormInfo';
import FormRowRight from '../../../UI/FormMui/FormRowRight';
import InputCheckbox from '../../../UI/FormMui/InputCheckbox';
import InputSelect from '../../../UI/FormMui/InputSelect';
import InputArrayText from '../../../UI/FormMui/InputArrayText';
import InputTextField from '../../../UI/FormMui/InputTextField';
import Orders from './Orders/Orders';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const ONE_CERTIFICATE_SERVER_URL = '/v1/certificates';
const CERTIFICATE_OPTIONS_URL = `/v1/certificates/${newId}`;

// form shape
type formObj = {
  getCertResponseData: oneCertificateResponseType | undefined;
  getCertError: frontendErrorType | undefined;
  getOptionsResponseData: certificateOptionsResponseType | undefined;
  getOptionsError: frontendErrorType | undefined;
  dataToSubmit: {
    name: string;
    description: string;
    private_key_id: number;
    subject_alts: string[];
    api_key_via_url: boolean;
    organization: string;
    organizational_unit: string;
    country: string;
    state: string;
    city: string;
  };
  sendError: frontendErrorType | undefined;
  validationErrors: validationErrorsType;
};

const EditOneCert: FC = () => {
  const { id } = useParams();
  const thisCertUrl = `${ONE_CERTIFICATE_SERVER_URL}/${id}`;
  const thisCertDownloadUrl = `${thisCertUrl}/download`;
  const thisCertApiKeyUrl = `${thisCertUrl}/apikey`;

  const [hasValidOrders, setHasValidOrders] = useState(false);

  const useAxiosSendHook = useAxiosSend();
  const { axiosSendState, apiCall, downloadFile } = useAxiosSendHook;
  const navigate = useNavigate();

  // fetch current state
  const { getState: getCertState } = useAxiosGet<oneCertificateResponseType>(
    thisCertUrl,
    parseOneCertificateResponseType
  );

  // get config options
  const { getState: getOptionsState } =
    useAxiosGet<certificateOptionsResponseType>(
      CERTIFICATE_OPTIONS_URL,
      parseCertificateOptionsResponse
    );

  // initialForm uses the cert response to create a starting form object
  const initialForm = useCallback(
    (
      certResponseData: oneCertificateResponseType | undefined,
      certError: frontendErrorType | undefined,
      optionsResponseData: certificateOptionsResponseType | undefined,
      optionsError: frontendErrorType | undefined
    ) => ({
      getCertResponseData: certResponseData,
      getCertError: certError,
      getOptionsResponseData: optionsResponseData,
      getOptionsError: optionsError,
      dataToSubmit: {
        name: certResponseData?.certificate.name || '',
        description: certResponseData?.certificate.description || '',
        private_key_id: certResponseData?.certificate.private_key.id || -1,
        subject_alts: certResponseData?.certificate.subject_alts || [],
        api_key_via_url: certResponseData?.certificate.api_key_via_url || false,
        organization: certResponseData?.certificate.organization || '',
        organizational_unit:
          certResponseData?.certificate.organizational_unit || '',
        country: certResponseData?.certificate.country || '',
        state: certResponseData?.certificate.state || '',
        city: certResponseData?.certificate.city || '',
      },
      sendError: undefined,
      validationErrors: {},
    }),
    []
  );
  const [formState, setFormState] = useState<formObj>(
    initialForm(undefined, undefined, undefined, undefined)
  );

  // set initial form after api loads
  useEffect(() => {
    setFormState(
      initialForm(
        getCertState.responseData,
        getCertState.error,
        getOptionsState.responseData,
        getOptionsState.error
      )
    );
  }, [setFormState, initialForm, getCertState, getOptionsState]);

  // data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

  // delete
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteConfirmHandler: MouseEventHandler = () => {
    setDeleteOpen(false);
    apiCall<certificateDeleteResponseType>(
      'DELETE',
      thisCertUrl,
      {},
      parseCertificateDeleteResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate('/certificates');
      } else {
        // failed, set error
        setFormState((prevState) => ({
          ...prevState,
          sendError: error,
        }));
      }
    });
  };

  // button handlers
  const downloadClickHandler: MouseEventHandler = () => {
    downloadFile(thisCertDownloadUrl).then(({ error }) => {
      setFormState((prevState) => ({
        ...prevState,
        sendError: error,
      }));
    });
  };

  // common api call for key roation
  const apiKeyRotation = (method: 'POST' | 'DELETE'): void => {
    apiCall<oneCertificateResponseType>(
      method,
      thisCertApiKeyUrl,
      {},
      parseOneCertificateResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        // update get response with updated info
        setFormState((prevState) => ({
          ...prevState,
          getCertResponseData: responseData,
          sendError: undefined,
        }));
      } else {
        // failed, set error
        setFormState((prevState) => ({
          ...prevState,
          sendError: error,
        }));
      }
    });
  };

  const newApiKeyClickHandler: MouseEventHandler = () => {
    apiKeyRotation('POST');
  };

  const retireApiKeyClickHandler: MouseEventHandler = () => {
    apiKeyRotation('DELETE');
  };

  // form submission handler
  const submitFormHandler: FormEventHandler = (event) => {
    event.preventDefault();

    // form validation
    const validationErrors: validationErrorsType = {};

    // name
    if (!isNameValid(formState.dataToSubmit.name)) {
      validationErrors['dataToSubmit.name'] = true;
    }

    // subject alts
    formState.dataToSubmit.subject_alts.forEach((alt, index) => {
      if (!isDomainValid(alt)) {
        validationErrors[`dataToSubmit.subject_alts.${index}`] = true;
      }
    });

    //TODO: CSR validation?

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    // form validation -- end

    apiCall<oneCertificateResponseType>(
      'PUT',
      thisCertUrl,
      formState.dataToSubmit,
      parseOneCertificateResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate('/certificates');
      } else {
        // failed, set error
        setFormState((prevState) => ({
          ...prevState,
          sendError: error,
        }));
      }
    });
  };

  return (
    <>
      <FormContainer>
        <TitleBar title='Edit Certificate'>
          {formState.getCertResponseData &&
            formState.getOptionsResponseData && (
              <>
                <Button
                  onClick={downloadClickHandler}
                  disabled={axiosSendState.isSending || !hasValidOrders}
                >
                  Download
                </Button>
                <Button
                  color='error'
                  onClick={() => setDeleteOpen(true)}
                  disabled={axiosSendState.isSending}
                >
                  Delete
                </Button>
              </>
            )}
        </TitleBar>

        {((!formState.getCertResponseData && !formState.getCertError) ||
          (!formState.getOptionsResponseData &&
            !formState.getOptionsError)) && <ApiLoading />}

        {formState.getCertError && (
          <ApiError
            statusCode={formState.getCertError.statusCode}
            message={formState.getCertError.message}
          />
        )}

        {formState.getOptionsError && (
          <ApiError
            statusCode={formState.getOptionsError.statusCode}
            message={formState.getOptionsError.message}
          />
        )}

        {formState.getCertResponseData && formState.getOptionsResponseData && (
          <>
            <DialogAlert
              title={`Are you sure you want to delete ${formState.dataToSubmit.name}?`}
              open={deleteOpen}
              onCancel={() => setDeleteOpen(false)}
              onConfirm={deleteConfirmHandler}
            >
              All orders associated with this certificate will also be deleted
              and irrecoverable.
              <br />
              Any associated account and private keys will be unchanged.
            </DialogAlert>

            <Form onSubmit={submitFormHandler}>
              <InputTextField
                id='dataToSubmit.name'
                label='Name'
                value={formState.dataToSubmit.name}
                onChange={inputChangeHandler}
                error={formState.validationErrors['dataToSubmit.name']}
              />

              <InputTextField
                id='dataToSubmit.description'
                label='Description'
                value={formState.dataToSubmit.description}
                onChange={inputChangeHandler}
              />

              <InputSelect
                id='disabled.acme_account'
                label='ACME Account'
                options={[
                  {
                    value: 0,
                    name:
                      formState.getCertResponseData.certificate.acme_account
                        .name +
                      (formState.getCertResponseData.certificate.acme_account
                        .acme_server.is_staging
                        ? ' (Staging)'
                        : ''),
                  },
                ]}
                value={0}
                disabled
              />

              <InputSelect
                id='dataToSubmit.private_key_id'
                label='Private Key'
                value={formState.dataToSubmit.private_key_id}
                onChange={inputChangeHandler}
                options={buildPrivateKeyOptions(
                  formState.getOptionsResponseData.certificate_options
                    .private_keys,
                  formState.getCertResponseData.certificate.private_key
                )}
              />

              <InputTextField
                id='disabled.subject'
                label='Subject (and Common Name)'
                value={formState.getCertResponseData.certificate.subject}
                disabled
              />

              <InputArrayText
                id='dataToSubmit.subject_alts'
                label='Subject Alternate Names'
                subLabel='Alternate Name'
                value={formState.dataToSubmit.subject_alts}
                onChange={inputChangeHandler}
                validationErrors={formState.validationErrors}
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
                  <FormInfo>
                    These fields are optional and appear to be ignored by some
                    CAs.
                  </FormInfo>

                  <InputTextField
                    id='dataToSubmit.country'
                    label='Country (2 Letter Code)'
                    value={formState.dataToSubmit.country}
                    onChange={inputChangeHandler}
                  />

                  <InputTextField
                    id='dataToSubmit.state'
                    label='State'
                    value={formState.dataToSubmit.state}
                    onChange={inputChangeHandler}
                  />

                  <InputTextField
                    id='dataToSubmit.city'
                    label='City'
                    value={formState.dataToSubmit.city}
                    onChange={inputChangeHandler}
                  />

                  <InputTextField
                    id='dataToSubmit.organization'
                    label='Organization'
                    value={formState.dataToSubmit.organization}
                    onChange={inputChangeHandler}
                  />

                  <InputTextField
                    id='dataToSubmit.organizational_unit'
                    label='Organizational Unit'
                    value={formState.dataToSubmit.organizational_unit}
                    onChange={inputChangeHandler}
                  />
                </AccordionDetails>
              </Accordion>

              <InputTextField
                id='disabled.api_key'
                label={
                  (formState.getCertResponseData.certificate.api_key_new
                    ? 'Old '
                    : '') + 'API Key'
                }
                value={formState.getCertResponseData.certificate.api_key}
                disabled
              />

              <FormRowRight>
                <ButtonAsLink
                  to={`/certificates/${id}/apikeys`}
                  color='warning'
                  disabled={axiosSendState.isSending}
                >
                  Edit API Keys
                </ButtonAsLink>

                {formState.getCertResponseData.certificate.api_key_new ? (
                  <Button
                    onClick={retireApiKeyClickHandler}
                    disabled={axiosSendState.isSending}
                  >
                    Retire Old API Key
                  </Button>
                ) : (
                  <Button
                    onClick={newApiKeyClickHandler}
                    disabled={axiosSendState.isSending}
                  >
                    New API Key
                  </Button>
                )}
              </FormRowRight>

              {formState.getCertResponseData.certificate.api_key_new && (
                <InputTextField
                  id='disabled.api_key_new'
                  label='New API Key'
                  value={formState.getCertResponseData.certificate.api_key_new}
                  disabled
                />
              )}

              <InputCheckbox
                id='dataToSubmit.api_key_via_url'
                checked={formState.dataToSubmit.api_key_via_url}
                onChange={inputChangeHandler}
              >
                Allow API Key via URL (for Legacy Clients)
              </InputCheckbox>

              {formState.sendError &&
                Object.keys(formState.validationErrors).length <= 0 && (
                  <ApiError
                    statusCode={formState.sendError.statusCode}
                    message={formState.sendError.message}
                  />
                )}

              <FormFooter
                cancelHref='/certificates'
                resetOnClick={() =>
                  setFormState((prevState) =>
                    initialForm(
                      prevState.getCertResponseData,
                      prevState.getCertError,
                      prevState.getOptionsResponseData,
                      prevState.getOptionsError
                    )
                  )
                }
                disabledAllButtons={axiosSendState.isSending}
                disabledResetButton={
                  JSON.stringify(formState.dataToSubmit) ===
                  JSON.stringify(
                    initialForm(
                      formState.getCertResponseData,
                      formState.getCertError,
                      formState.getOptionsResponseData,
                      formState.getOptionsError
                    ).dataToSubmit
                  )
                }
                createdAt={formState.getCertResponseData.certificate.created_at}
                updatedAt={formState.getCertResponseData.certificate.updated_at}
              />
            </Form>
          </>
        )}
      </FormContainer>

      {id !== undefined && (
        <Orders
          setHasValidOrders={setHasValidOrders}
          certId={parseInt(id)}
          useAxiosSend={useAxiosSendHook}
        />
      )}
    </>
  );
};

export default EditOneCert;
