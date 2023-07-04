import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { isNameValid } from '../../../../helpers/form-validation';
import { devMode } from '../../../../helpers/environment';

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
import InputTextField from '../../../UI/FormMui/InputTextField';
import TitleBar from '../../../UI/TitleBar/TitleBar';

// TODO
// Add: refresh LE status button

const EditOneACMEAccount = () => {
  const { id } = useParams();
  const [apiGetState, updateGet] = useAxiosGet(
    `/v1/acmeaccounts/${id}`,
    'acme_account',
    true
  );

  const [apiSendState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({});

  // Function to set the form equal to the current API state
  const setFormToApi = useCallback(() => {
    setFormState({
      form: {
        name: apiGetState.acme_account.name,
        description: apiGetState.acme_account.description,
        eab_kid: '',
        eab_hmac_key: '',
      },
      validationErrors: {},
    });
  }, [apiGetState]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  useEffect(() => {
    if (apiGetState.isLoaded && !apiGetState.errorMessage) {
      setFormToApi();
    }
  }, [apiGetState, setFormToApi]);

  // data change handlers
  const inputChangeHandler = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        [event.target.name]: event.target.value,
      },
    }));
  };

  // button handlers
  const resetClickHandler = (event) => {
    event.preventDefault();

    setFormToApi();
  };
  const cancelClickHandler = (event) => {
    event.preventDefault();
    navigate('/acmeaccounts');
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
    sendData(`/v1/acmeaccounts/${id}`, 'DELETE', null, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          // back to the accounts page
          navigate('/acmeaccounts');
        }
      }
    );
  };

  // deactivate handlers
  const deactivateClickHandler = () => {
    setDeactivateOpen(true);
  };
  const deactivateCancelHandler = () => {
    setDeactivateOpen(false);
  };
  const deactivateConfirmHandler = () => {
    setDeactivateOpen(false);

    sendData(`/v1/acmeaccounts/${id}/deactivate`, 'POST', null, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          // update account from backend
          updateGet();
        }
      }
    );
  };

  // register ACME account handler
  const registerClickHandler = (event) => {
    event.preventDefault();

    sendData(
      `/v1/acmeaccounts/${id}/new-account`,
      'POST',
      formState.form,
      true
    ).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        // update account from backend
        updateGet();
      }
    });
  };

  // change email handler
  const changeEmailClickHandler = (event) => {
    event.preventDefault();
    navigate(`/acmeaccounts/${id}/email`);
  };

  // rollover key handler
  const rolloverClickHandler = (event) => {
    event.preventDefault();
    navigate(`/acmeaccounts/${id}/key-change`);
  };

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    // client side validation
    let validationErrors = {};
    // check name
    if (!isNameValid(formState.form.name)) {
      validationErrors.name = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    // client side validation -- end

    sendData(`/v1/acmeaccounts/${id}`, 'PUT', formState.form, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          navigate('/acmeaccounts');
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
    JSON.stringify({}) !== JSON.stringify(formState);

  var formUnchanged = true;
  var canDoAccountActions = false;
  var canRegister = false;
  if (renderApiItems) {
    formUnchanged =
      apiGetState.acme_account.name === formState.form.name &&
      apiGetState.acme_account.description === formState.form.description;

    canDoAccountActions =
      apiGetState.acme_account.status === 'valid' &&
      apiGetState.acme_account.kid !== '';

    canRegister =
      apiGetState.acme_account.status === 'unknown' ||
      apiGetState.acme_account.status === '' ||
      apiGetState.acme_account.kid === '';
  }

  return (
    <FormContainer>
      <TitleBar title='Edit ACME Account'>
        {renderApiItems && (
          <>
            <Button
              type='deactivate'
              onClick={deactivateClickHandler}
              disabled={apiSendState.isSending || !canDoAccountActions}
            >
              Deactivate
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
            The account can be recovered as long as the associated key is not
            lost.
          </DialogAlert>

          <DialogAlert
            title={`Are you sure you want to deactivate ${formState.form.name}?`}
            open={deactivateOpen}
            onCancel={deactivateCancelHandler}
            onConfirm={deactivateConfirmHandler}
          >
            This process cannot be reversed! Ensure you understand all
            consequences of this action before confirming!
          </DialogAlert>

          <Form onSubmit={submitFormHandler}>
            <InputTextField
              label='Name'
              id='name'
              value={formState.form.name}
              onChange={inputChangeHandler}
              error={formState.validationErrors.name && true}
            />

            <InputTextField
              label='Description'
              id='description'
              name='description'
              value={formState.form.description}
              onChange={inputChangeHandler}
            />

            <InputTextField
              label='Contact E-Mail Address'
              id='email'
              name='email'
              value={
                apiGetState.acme_account.email
                  ? apiGetState.acme_account.email
                  : 'None'
              }
              disabled
            />

            <FormRowRight>
              <Button
                type='info'
                onClick={changeEmailClickHandler}
                disabled={apiSendState.isSending || !canDoAccountActions}
              >
                Change Email
              </Button>
            </FormRowRight>

            <InputSelect
              id='acme_server_id'
              label='ACME Server'
              options={[
                {
                  value: 0,
                  name:
                    apiGetState.acme_account.acme_server.name +
                    (apiGetState.acme_account.acme_server.is_staging
                      ? ' (Staging)'
                      : ''),
                },
              ]}
              value={0}
              disabled
            />

            <InputSelect
              label='Private Key'
              id='private_key_id'
              options={[
                {
                  value: 0,
                  name:
                    apiGetState.acme_account.private_key.name +
                    ' (' +
                    apiGetState.acme_account.private_key.algorithm.name +
                    ')',
                },
              ]}
              value={0}
              disabled
            />

            <FormRowRight>
              <Button
                type='info'
                onClick={rolloverClickHandler}
                disabled={apiSendState.isSending || !canDoAccountActions}
              >
                Rollover Key
              </Button>
            </FormRowRight>

            {devMode && (
              <Typography variant='p' sx={{ my: 1 }} display='block'>
                Kid: {apiGetState.acme_account.kid}
              </Typography>
            )}

            <Typography variant='p' sx={{ my: 1 }} display='block'>
              Account Status:{' '}
              {apiGetState.acme_account.status.charAt(0).toUpperCase() +
                apiGetState.acme_account.status.slice(1)}
            </Typography>

            {canRegister && (
              <>
                <Accordion sx={{ mb: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='csr-fields-content'
                    id='csr-fields-header'
                  >
                    <Typography>
                      External Account Binding (if Required)
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ mb: 2 }}>
                      Only required by some CAs and even then only required for
                      account creation (and not account recovery).
                    </Typography>

                    <InputTextField
                      label='Key ID'
                      id='eab_kid'
                      name='eab_kid'
                      value={formState.form.eab_kid}
                      onChange={inputChangeHandler}
                    />

                    <InputTextField
                      label='HMAC Key'
                      id='eab_hmac_key'
                      name='eab_hmac_key'
                      value={formState.form.eab_hmac_key}
                      onChange={inputChangeHandler}
                    />
                  </AccordionDetails>
                </Accordion>
              </>
            )}

            <FormRowRight>
              <Button
                className='ml-2'
                type='primary'
                onClick={registerClickHandler}
                disabled={apiSendState.isSending || !canRegister}
              >
                Register
              </Button>
            </FormRowRight>

            <InputCheckbox
              id='accepted_tos'
              checked={apiGetState.acme_account.accepted_tos}
              disabled
            >
              Accept CA&apos;s Terms of Service
            </InputCheckbox>

            {apiSendState.errorMessage &&
              Object.keys(formState.validationErrors).length <= 0 && (
                <ApiError
                  code={apiSendState.errorCode}
                  message={apiSendState.errorMessage}
                />
              )}

            <FormFooter
              createdAt={apiGetState.acme_account.created_at}
              updatedAt={apiGetState.acme_account.updated_at}
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
  );
};

export default EditOneACMEAccount;
