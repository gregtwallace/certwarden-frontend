import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxiosGet from '../../../hooks/useAxiosGet';
import useAxiosSend from '../../../hooks/useAxiosSend';
import { isNameValid } from '../../../helpers/form-validation';
import { devMode } from '../../../helpers/environment';

import { Typography } from '@mui/material';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import Button from '../../UI/Button/Button';
import DialogAlert from '../../UI/Dialog/DialogAlert';
import Form from '../../UI/FormMui/Form';
import FormContainer from '../../UI/FormMui/FormContainer';
import FormError from '../../UI/FormMui/FormError';
import FormFooter from '../../UI/FormMui/FormFooter';
import FormRowRight from '../../UI/FormMui/FormRowRight';
import InputCheckbox from '../../UI/FormMui/InputCheckbox';
import InputSelect from '../../UI/FormMui/InputSelect';
import InputTextField from '../../UI/FormMui/InputTextField';
import TitleBar from '../../UI/TitleBar/TitleBar';

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

  // set dummy state prior to apiGet loading
  // only includes values that will be used in payload
  const dummyForm = {
    form: {
      name: '',
      description: '',
    },
    validationErrors: {},
  };

  const [formState, setFormState] = useState(dummyForm);

  // Function to set the form equal to the current API state
  const setFormToApi = useCallback(() => {
    setFormState({
      form: {
        name: apiGetState.acme_account.name,
        description: apiGetState.acme_account.description,
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

    navigate(-1);
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
          navigate(-1);
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

    sendData(`/v1/acmeaccounts/${id}/new-account`, 'POST', null, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          // update account from backend
          updateGet();
        }
      }
    );
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
          navigate(-1);
        }
      }
    );
  };

  // consts related to rendering
  const renderApiItems =
    apiGetState.isLoaded &&
    !apiGetState.errorMessage &&
    JSON.stringify(dummyForm.form) !== JSON.stringify(formState.form);

  const formUnchanged =
    apiGetState.acme_account.name === formState.form.name &&
    apiGetState.acme_account.description === formState.form.description;

  const canDoAccountActions =
    apiGetState.acme_account.status === 'valid' &&
    apiGetState.acme_account.kid !== '';

  const canRegister =
    apiGetState.acme_account.status === 'unknown' ||
    apiGetState.acme_account.status === '' ||
    apiGetState.acme_account.kid === '';

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
              id='is_staging'
              checked={apiGetState.acme_account.is_staging}
              disabled
            >
              Staging Environment Account
            </InputCheckbox>

            <InputCheckbox
              id='accepted_tos'
              checked={apiGetState.acme_account.accepted_tos}
              disabled
            >
              Accept Let's Encrypt Terms of Service
            </InputCheckbox>

            {apiSendState.errorMessage &&
              Object.keys(formState.validationErrors).length <= 0 && (
                <FormError>
                  Error Sending -- {apiSendState.errorMessage}
                </FormError>
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
