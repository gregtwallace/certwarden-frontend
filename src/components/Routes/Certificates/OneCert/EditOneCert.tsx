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
import { type certExtension } from './InputExtraExtensions/InputExtraExtensions';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { inputHandlerFuncMaker } from '../../../../helpers/input-handler';
import {
  isDomainValid,
  isEnvironmentParamValid,
  isHexStringValid,
  isNameValid,
  isOIDValid,
} from '../../../../helpers/form-validation';
import { newId } from '../../../../helpers/constants';
import { buildPrivateKeyOptions } from '../../../../helpers/options_builders';

import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
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
import InputExtraExtensions from './InputExtraExtensions/InputExtraExtensions';
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
    post_processing_command: string;
    post_processing_environment: string[];
    preferred_root_cn: string;
    organization: string;
    organizational_unit: string;
    country: string;
    state: string;
    city: string;
    csr_extra_extensions: certExtension[];
  };
  sendError: frontendErrorType | undefined;
  validationErrors: validationErrorsType;
};

const EditOneCert: FC = () => {
  const { id } = useParams();
  const thisCertUrl = `${ONE_CERTIFICATE_SERVER_URL}/${id}`;
  const thisCertDownloadUrl = `${thisCertUrl}/download`;
  const thisCertApiKeyUrl = `${thisCertUrl}/apikey`;
  const thisCertClientKeyUrl = `${thisCertUrl}/clientkey`;

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
        post_processing_command:
          certResponseData?.certificate.post_processing_command || '',
        post_processing_environment:
          certResponseData?.certificate.post_processing_environment || [],
        preferred_root_cn:
          certResponseData?.certificate.preferred_root_cn || '',
        organization: certResponseData?.certificate.organization || '',
        organizational_unit:
          certResponseData?.certificate.organizational_unit || '',
        country: certResponseData?.certificate.country || '',
        state: certResponseData?.certificate.state || '',
        city: certResponseData?.certificate.city || '',
        csr_extra_extensions:
          certResponseData?.certificate.csr_extra_extensions || [],
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

  // common key call for key rotation (both api and client key)
  const keyRotation = (
    method: 'POST' | 'DELETE',
    keyType: 'api' | 'client'
  ): void => {
    const callPath =
      keyType === 'api' ? thisCertApiKeyUrl : thisCertClientKeyUrl;

    apiCall<oneCertificateResponseType>(
      method,
      callPath,
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
    keyRotation('POST', 'api');
  };

  const retireApiKeyClickHandler: MouseEventHandler = () => {
    keyRotation('DELETE', 'api');
  };

  const newClientKeyClickHandler: MouseEventHandler = () => {
    keyRotation('POST', 'client');
  };

  const disableClientKeyClickHandler: MouseEventHandler = () => {
    keyRotation('DELETE', 'client');
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

    // post processing env vars
    formState.dataToSubmit.post_processing_environment.forEach(
      (param, index) => {
        // check each param
        if (!isEnvironmentParamValid(param)) {
          validationErrors[
            `dataToSubmit.post_processing_environment.${index}`
          ] = true;
        }
      }
    );

    //TODO: CSR validation?

    // CSR - Extra Extensions (check each)
    formState.dataToSubmit.csr_extra_extensions.forEach((extension, index) => {
      // Description can be any

      // OID must exist and be in proper format
      if (!isOIDValid(extension.oid)) {
        validationErrors[`dataToSubmit.csr_extra_extensions.${index}.oid`] =
          true;
      }

      // Hex Bytes Value must be in proper format, if exists
      if (!isHexStringValid(extension.value_hex)) {
        validationErrors[
          `dataToSubmit.csr_extra_extensions.${index}.value_hex`
        ] = true;
      }

      // Critical is ok as true or false
    });

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

  const formUnchanged =
    JSON.stringify(formState.dataToSubmit) ===
    JSON.stringify(
      initialForm(
        formState.getCertResponseData,
        formState.getCertError,
        formState.getOptionsResponseData,
        formState.getOptionsError
      ).dataToSubmit
    );

  return (
    <>
      <FormContainer>
        <TitleBar
          title='Edit Certificate'
          helpURL='https://www.certwarden.com/docs/user_interface/certificates/'
        >
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
              contentText='All orders associated with this certificate will also be deleted
              and irrecoverable. Any associated account and private keys will be unchanged.'
              open={deleteOpen}
              onCancel={() => setDeleteOpen(false)}
              onConfirm={deleteConfirmHandler}
            />

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
                id='disabled.acme_account_id'
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
                  aria-controls='post-processing-fields-content'
                  id='post-processing-fields-header'
                >
                  <FormInfo sx={{ p: 1 }}>Post Processing</FormInfo>
                </AccordionSummary>
                <AccordionDetails>
                  <FormInfo helpURL='https://www.certwarden.com/docs/using_certificates/client/'>
                    Cert Warden Client
                  </FormInfo>
                  <FormRowRight>
                    <InputTextField
                      id='disabled.post_processing_client_key'
                      label='Client AES Key'
                      value={
                        formState.getCertResponseData.certificate
                          .post_processing_client_key
                          ? formState.getCertResponseData.certificate
                              .post_processing_client_key
                          : '[Disabled]'
                      }
                      disabled={
                        formState.getCertResponseData.certificate
                          .post_processing_client_key === ''
                      }
                    />

                    {formState.getCertResponseData.certificate
                      .post_processing_client_key !== '' && (
                      <Button
                        size='small'
                        color='error'
                        onClick={disableClientKeyClickHandler}
                      >
                        Disable
                      </Button>
                    )}
                    <Button
                      size='small'
                      color='success'
                      onClick={newClientKeyClickHandler}
                    >
                      {formState.getCertResponseData.certificate
                        .post_processing_client_key === ''
                        ? 'Enable'
                        : 'Regen'}
                    </Button>
                  </FormRowRight>

                  <FormInfo helpURL='https://www.certwarden.com/docs/using_certificates/post_process_bin/'>
                    Script or Binary
                  </FormInfo>

                  <InputTextField
                    id='dataToSubmit.post_processing_command'
                    label='Path and Script or Binary'
                    value={formState.dataToSubmit.post_processing_command}
                    onChange={inputChangeHandler}
                  />

                  <InputArrayText
                    id='dataToSubmit.post_processing_environment'
                    label='Script Environment Variables'
                    subLabel='Variable'
                    value={formState.dataToSubmit.post_processing_environment}
                    onChange={inputChangeHandler}
                    validationErrors={formState.validationErrors}
                  />
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls='csr-fields-content'
                  id='csr-fields-header'
                >
                  <FormInfo
                    sx={{ p: 1 }}
                    helpURL='https://www.certwarden.com/docs/user_interface/certificates/#csr-fields'
                  >
                    CSR Fields
                  </FormInfo>
                </AccordionSummary>
                <AccordionDetails>
                  <FormInfo>
                    These fields are optional and some or all of them may be
                    ignored by the CA, with or without error.
                  </FormInfo>

                  <InputTextField
                    id='dataToSubmit.preferred_root_cn'
                    label="Preferred Root Cert's Common Name"
                    value={formState.dataToSubmit.preferred_root_cn}
                    onChange={inputChangeHandler}
                  />

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

                  <InputExtraExtensions
                    id='dataToSubmit.csr_extra_extensions'
                    value={formState.dataToSubmit.csr_extra_extensions}
                    onChange={inputChangeHandler}
                    validationErrors={formState.validationErrors}
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
                disabledResetButton={formUnchanged}
                lastAccess={
                  formState.getCertResponseData.certificate.last_access
                }
                createdAt={formState.getCertResponseData.certificate.created_at}
                updatedAt={formState.getCertResponseData.certificate.updated_at}
              />
            </Form>
          </>
        )}
      </FormContainer>

      {id !== undefined && formState.getCertResponseData !== undefined && (
        <Orders
          setHasValidOrders={setHasValidOrders}
          certId={parseInt(id)}
          useAxiosSend={useAxiosSendHook}
          disableButtons={!formUnchanged}
          certHasPostProcessing={
            formState.getCertResponseData.certificate
              .post_processing_command !== '' ||
            formState.getCertResponseData.certificate
              .post_processing_client_key !== ''
          }
        />
      )}
    </>
  );
};

export default EditOneCert;
