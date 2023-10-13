import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { formChangeHandlerFunc } from '../../../../helpers/input-handler';
import { isNameValid } from '../../../../helpers/form-validation';
import { showDebugInfo } from '../../../../helpers/environment';

import { Typography } from '@mui/material';

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
  const [deactivateOpen, setDeactivateOpen] = useState(false);
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

    // client side validation of EAB (if it is required)
    if (apiGetState.acme_account.acme_server.external_account_required) {
      let validationErrors = {};
      // check Key ID is populated
      if (formState.form.eab_kid == '') {
        validationErrors.eab_kid = true;
      }

      // check HMAC Key is populated
      if (formState.form.eab_hmac_key == '') {
        validationErrors.eab_hmac_key = true;
      }

      setFormState((prevState) => ({
        ...prevState,
        validationErrors: validationErrors,
      }));
      if (Object.keys(validationErrors).length > 0) {
        return false;
      }
    }

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
              id='form.name'
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

            <InputTextField
              id='form.email'
              label='Contact E-Mail Address'
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
                href={`/acmeaccounts/${id}/email`}
                disabled={apiSendState.isSending || !canDoAccountActions}
              >
                Change Email
              </Button>
            </FormRowRight>

            <InputSelect
              id='form.acme_server_id'
              label='ACME Server'
              value={0}
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
              disabled
            />

            <InputSelect
              id='form.private_key_id'
              label='Private Key'
              value={0}
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
              disabled
            />

            <FormRowRight>
              <Button
                type='info'
                href={`/acmeaccounts/${id}/key-change`}
                disabled={apiSendState.isSending || !canDoAccountActions}
              >
                Rollover Key
              </Button>
            </FormRowRight>

            {canRegister &&
              apiGetState.acme_account.acme_server
                .external_account_required && (
                <>
                  <Typography>External Account Binding</Typography>

                  <InputTextField
                    id='form.eab_kid'
                    label='Key ID'
                    value={formState.form.eab_kid}
                    onChange={inputChangeHandler}
                    error={formState.validationErrors.eab_kid}
                  />

                  <InputTextField
                    id='form.eab_hmac_key'
                    label='HMAC Key'
                    value={formState.form.eab_hmac_key}
                    onChange={inputChangeHandler}
                    error={formState.validationErrors.eab_hmac_key}
                  />
                </>
              )}

            {showDebugInfo && apiGetState.acme_account.kid !== '' && (
              <Typography variant='p' sx={{ my: 1 }} display='block'>
                Kid: {apiGetState.acme_account.kid}
              </Typography>
            )}

            <Typography variant='p' sx={{ my: 1 }} display='block'>
              Account Status:{' '}
              {apiGetState.acme_account.status.charAt(0).toUpperCase() +
                apiGetState.acme_account.status.slice(1)}
            </Typography>

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
              id='form.accepted_tos'
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
                href='/acmeaccounts'
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
  );
};

export default EditOneACMEAccount;
