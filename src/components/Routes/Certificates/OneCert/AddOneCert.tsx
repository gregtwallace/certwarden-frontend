import { type FC, type FormEventHandler } from 'react';
import {
  type certificateOptionsResponseType,
  parseCertificateOptionsResponse,
  type oneCertificateResponseType,
  parseOneCertificateResponseType,
} from '../../../../types/api';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../../types/frontend';
import { type selectInputOption } from '../../../../helpers/input-handler';
import { type certExtension } from './InputExtraExtensions/InputExtraExtensions';

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
import {
  newId,
  defaultKeyGenAlgorithmValue,
} from '../../../../helpers/constants';
import {
  buildAcmeAccountOptions,
  buildPrivateKeyOptions,
} from '../../../../helpers/options_builders';

import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import InputSelect from '../../../UI/FormMui/InputSelect';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormFooter from '../../../UI/FormMui/FormFooter';
import FormInfo from '../../../UI/FormMui/FormInfo';
import InputArrayText from '../../../UI/FormMui/InputArrayText';
import InputCheckbox from '../../../UI/FormMui/InputCheckbox';
import InputExtraExtensions from './InputExtraExtensions/InputExtraExtensions';
import InputTextField from '../../../UI/FormMui/InputTextField';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const NEW_CERTIFICATE_URL = '/v1/certificates';
const CERTIFICATE_OPTIONS_URL = `/v1/certificates/${newId}`;

// customize key builder to deal with option to generate new key
type privateKeyType = {
  id: number;
  name: string;
  algorithm: {
    name: string;
  };
};

const buildCustomPrivateKeyOptions = (
  availableKeys: privateKeyType[]
): selectInputOption<number>[] => {
  // make generate option
  const keyOptions: selectInputOption<number>[] = [
    {
      value: newId,
      name: 'Generate New Key',
      alsoSet: [
        {
          name: 'dataToSubmit.algorithm_value',
          value: defaultKeyGenAlgorithmValue,
        },
      ],
    },
  ];

  // concat base key list, modifying each option to include undefining algorithm
  return keyOptions.concat(
    buildPrivateKeyOptions(availableKeys).map((key) => ({
      ...key,
      alsoSet: [
        {
          name: 'dataToSubmit.algorithm_value',
          value: undefined,
        },
      ],
    }))
  );
};

// form shape
type formObj = {
  getResponseData: certificateOptionsResponseType | undefined;
  getError: frontendErrorType | undefined;
  dataToSubmit: {
    name: string;
    description: string;
    private_key_id: number | '';
    algorithm_value: string;
    acme_account_id: number | '';
    subject: string;
    subject_alts: string[];
    post_processing_command: string;
    post_processing_environment: string[];
    post_processing_client_enable: boolean;
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

const AddOneCert: FC = () => {
  // fetch new cert options
  const { getState } = useAxiosGet<certificateOptionsResponseType>(
    CERTIFICATE_OPTIONS_URL,
    parseCertificateOptionsResponse
  );

  const { axiosSendState, apiCall } = useAxiosSend();
  const navigate = useNavigate();

  const makeBlankForm: () => formObj = useCallback(
    () => ({
      getResponseData: getState.responseData,
      getError: getState.error,
      dataToSubmit: {
        name: '',
        description: '',
        private_key_id: newId,
        algorithm_value: defaultKeyGenAlgorithmValue,
        acme_account_id: '',
        subject: '',
        subject_alts: [],
        post_processing_command: '',
        post_processing_environment: [],
        post_processing_client_enable: false,
        organization: '',
        organizational_unit: '',
        country: '',
        state: '',
        city: '',
        csr_extra_extensions: [],
      },
      sendError: undefined,
      validationErrors: {},
    }),
    [getState]
  );
  const [formState, setFormState] = useState(makeBlankForm());

  // update state when GET loads
  useEffect(() => {
    setFormState(makeBlankForm());
  }, [makeBlankForm, setFormState]);

  // data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

  // form submission handler
  const submitFormHandler: FormEventHandler = (event) => {
    event.preventDefault();

    // form validation
    const validationErrors: validationErrorsType = {};

    // name
    if (!isNameValid(formState.dataToSubmit.name)) {
      validationErrors['dataToSubmit.name'] = true;
    }

    // check account is selected
    if (formState.dataToSubmit.acme_account_id === '') {
      validationErrors['dataToSubmit.acme_account_id'] = true;
    }

    // check private key is selected
    if (formState.dataToSubmit.private_key_id === '') {
      validationErrors['dataToSubmit.private_key_id'] = true;
    }

    // if generate new key is selected, confirm alg is selected
    if (
      formState.dataToSubmit.private_key_id === newId &&
      formState.dataToSubmit.algorithm_value === ''
    ) {
      validationErrors['dataToSubmit.algorithm_value'] = true;
    }

    // subject
    if (!isDomainValid(formState.dataToSubmit.subject)) {
      validationErrors['dataToSubmit.subject'] = true;
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

    // form validation -- end

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    //

    apiCall<oneCertificateResponseType>(
      'POST',
      NEW_CERTIFICATE_URL,
      formState.dataToSubmit,
      parseOneCertificateResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate(`/certificates/${responseData.certificate.id}`);
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
    <FormContainer>
      <TitleBar
        title='New Certificate'
        helpURL='https://www.legocerthub.com/docs/user_interface/certificates/'
      />

      {!formState.getResponseData && !formState.getError && <ApiLoading />}

      {formState.getError && (
        <ApiError
          statusCode={formState.getError.statusCode}
          message={formState.getError.message}
        />
      )}

      {formState.getResponseData && (
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
            id='dataToSubmit.acme_account_id'
            label='ACME Account'
            value={formState.dataToSubmit.acme_account_id}
            onChange={inputChangeHandler}
            options={buildAcmeAccountOptions(
              formState.getResponseData.certificate_options.acme_accounts
            )}
            error={formState.validationErrors['dataToSubmit.acme_account_id']}
          />

          <InputSelect
            id='dataToSubmit.private_key_id'
            label='Private Key'
            value={formState.dataToSubmit.private_key_id}
            onChange={inputChangeHandler}
            options={buildCustomPrivateKeyOptions(
              formState.getResponseData.certificate_options.private_keys
            )}
            error={formState.validationErrors['dataToSubmit.private_key_id']}
          />

          {formState.dataToSubmit.private_key_id === newId && (
            <InputSelect
              id='dataToSubmit.algorithm_value'
              label='Key Generation Algorithm'
              value={formState.dataToSubmit.algorithm_value}
              onChange={inputChangeHandler}
              options={
                formState.getResponseData.certificate_options.key_algorithms
              }
              error={formState.validationErrors['dataToSubmit.algorithm_value']}
            />
          )}

          <InputTextField
            id='dataToSubmit.subject'
            label='Subject (and Common Name)'
            value={formState.dataToSubmit.subject}
            onChange={inputChangeHandler}
            error={formState.validationErrors['dataToSubmit.subject']}
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
              <FormInfo helpURL='https://www.legocerthub.com/docs/using_certificates/lego_client/'>
                LeGo Client
              </FormInfo>
              <InputCheckbox
                id='dataToSubmit.post_processing_client_enable'
                checked={formState.dataToSubmit.post_processing_client_enable}
                onChange={inputChangeHandler}
              >
                Enable LeGo Client Post Processing
              </InputCheckbox>

              <FormInfo helpURL='https://www.legocerthub.com/docs/using_certificates/post_process_bin/'>
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
                helpURL='https://www.legocerthub.com/docs/user_interface/certificates/#csr-fields'
              >
                CSR Fields
              </FormInfo>
            </AccordionSummary>
            <AccordionDetails>
              <FormInfo>
                These fields are optional and some or all of them may be ignored
                by the CA, with or without error.
              </FormInfo>

              <InputTextField
                id='dataToSubmit.country'
                label='Country (2 Letter Code)'
                value={formState.dataToSubmit.country}
                onChange={inputChangeHandler}
              />

              <InputTextField
                id='dataToSubmit.state'
                label='State (2 Letter Code)'
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

          {formState.sendError &&
            Object.keys(formState.validationErrors).length <= 0 && (
              <ApiError
                statusCode={formState.sendError.statusCode}
                message={formState.sendError.message}
              />
            )}

          <FormFooter
            cancelHref='/certificates'
            resetOnClick={() => setFormState(makeBlankForm())}
            disabledAllButtons={axiosSendState.isSending}
            disabledResetButton={
              JSON.stringify(formState.dataToSubmit) ===
              JSON.stringify(makeBlankForm().dataToSubmit)
            }
          />
        </Form>
      )}
    </FormContainer>
  );
};

export default AddOneCert;
