import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { formChangeHandlerFunc } from '../../../../helpers/input-handler';
import {
  isDomainValid,
  isNameValid,
} from '../../../../helpers/form-validation';
import {
  newId,
  defaultKeyGenAlgorithmValue,
} from '../../../../helpers/constants';

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
import InputSelect from '../../../UI/FormMui/InputSelect';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormFooter from '../../../UI/FormMui/FormFooter';
import InputTextArray from '../../../UI/FormMui/InputTextArray';
import InputTextField from '../../../UI/FormMui/InputTextField';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const AddOneCert = () => {
  // fetch valid options (for private keys this is the algorithms list)
  const [apiGetState] = useAxiosGet(
    `/v1/certificates/${newId}`,
    'certificate_options',
    true
  );

  const [apiSendState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  const blankForm = {
    form: {
      name: '',
      description: '',
      private_key_id: newId,
      algorithm_value: defaultKeyGenAlgorithmValue,
      acme_account_id: '',
      subject: '',
      subject_alts: [],
      organization: '',
      organizational_unit: '',
      country: '',
      city: '',
    },
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankForm);

  // data change handler
  const inputChangeHandler = formChangeHandlerFunc(setFormState);

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    // form validation
    let validationErrors = {};
    // name
    if (!isNameValid(formState.form.name)) {
      validationErrors.name = true;
    }

    // check account is selected
    if (formState.form.acme_account_id === '') {
      validationErrors.acme_account_id = true;
    }

    // check private key is selected
    if (formState.form.private_key_id === '') {
      validationErrors.private_key_id = true;
    }

    // if generate new key is selected, confirm alg is selected
    if (
      formState.form.private_key_id === newId &&
      formState.form.algorithm_value === ''
    ) {
      validationErrors.algorithm_value = true;
    }

    // subject
    if (!isDomainValid(formState.form.subject)) {
      validationErrors.subject = true;
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
    // form validation -- end

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    //

    sendData(`/v1/certificates`, 'POST', formState.form, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          navigate(`/certificates/${response.data?.response?.record_id}`);
        }
      }
    );
  };

  // consts related to rendering
  // no check on blank form as blank is the starting state
  // which isn't changed by the apiGet
  const renderApiItems = apiGetState.isLoaded && !apiGetState.errorMessage;

  // vars related to api
  var availableAccounts;
  var availableKeys;

  if (renderApiItems) {
    // build options for available accounts
    if (apiGetState.certificate_options.acme_accounts) {
      availableAccounts = apiGetState.certificate_options.acme_accounts.map(
        (a) => ({
          value: parseInt(a.id),
          name: a.name + (a.acme_server.is_staging ? ' (Staging)' : ''),
        })
      );
    }
    // build options for available keys
    // add option to generate new
    availableKeys = [
      {
        value: newId,
        name: 'Generate New Key',
        alsoSet: [
          {
            name: 'form.algorithm_value',
            value: defaultKeyGenAlgorithmValue,
          },
        ],
      },
    ];
    // add list of available existing keys
    if (apiGetState.certificate_options.private_keys) {
      availableKeys.push(
        ...apiGetState.certificate_options.private_keys.map((k) => ({
          value: parseInt(k.id),
          name: k.name + ' (' + k.algorithm.name + ')',
          alsoSet: [
            {
              name: 'form.algorithm_value',
              value: undefined,
            },
          ],
        }))
      );
    }
  }

  // vars related to api -- end

  return (
    <FormContainer>
      <TitleBar title='New Certificate' />

      {!apiGetState.isLoaded && <ApiLoading />}
      {apiGetState.errorMessage && (
        <ApiError
          code={apiGetState.errorCode}
          message={apiGetState.errorMessage}
        />
      )}

      {renderApiItems && (
        <Form onSubmit={submitFormHandler}>
          <InputTextField
            id='form.name'
            label='Name'
            value={formState.form.name}
            onChange={inputChangeHandler}
            error={formState.validationErrors.name}
          />

          <InputTextField
            id='form.description'
            label='Description'
            value={formState.form.description}
            onChange={inputChangeHandler}
          />

          <InputSelect
            id='form.acme_account_id'
            label='ACME Account'
            value={formState.form.acme_account_id}
            onChange={inputChangeHandler}
            options={availableAccounts}
            error={formState.validationErrors.acme_account_id}
          />

          <InputSelect
            id='form.private_key_id'
            label='Private Key'
            value={formState.form.private_key_id}
            onChange={inputChangeHandler}
            options={availableKeys}
            error={formState.validationErrors.private_key_id}
          />

          {formState.form.private_key_id === newId && (
            <InputSelect
              id='form.algorithm_value'
              label='Key Generation Algorithm'
              value={formState.form.algorithm_value}
              onChange={inputChangeHandler}
              options={apiGetState.certificate_options.key_algorithms}
              error={formState.validationErrors.algorithm_value}
            />
          )}

          <InputTextField
            id='form.subject'
            label='Subject (and Common Name)'
            value={formState.form.subject}
            onChange={inputChangeHandler}
            error={formState.validationErrors.subject}
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
                These fields are optional and appear to be ignored by some CAs.
              </Typography>

              <InputTextField
                id='form.country'
                label='Country (2 Letter Code)'
                value={formState.form.country}
                onChange={inputChangeHandler}
              />

              <InputTextField
                id='form.city'
                label='City'
                value={formState.form.city}
                onChange={inputChangeHandler}
              />

              <InputTextField
                id='form.organization'
                label='Organization'
                value={formState.form.organization}
                onChange={inputChangeHandler}
              />

              <InputTextField
                id='form.organizational_unit'
                label='Organizational Unit'
                value={formState.form.organizational_unit}
                onChange={inputChangeHandler}
              />
            </AccordionDetails>
          </Accordion>

          {apiSendState.errorMessage &&
            Object.keys(formState.validationErrors).length <= 0 && (
              <ApiError
                code={apiSendState.errorCode}
                message={apiSendState.errorMessage}
              />
            )}

          <FormFooter>
            <Button
              type='cancel'
              href='/certificates'
              disabled={apiSendState.isSending}
            >
              Cancel
            </Button>
            <Button
              type='reset'
              onClick={() => setFormState(blankForm)}
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

export default AddOneCert;
