import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useApiGet from '../../../hooks/useApiGet';
import useApiSend from '../../../hooks/useApiSend';
import { isNameValid } from '../../../helpers/form-validation';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import InputText from '../../UI/Form/InputText';
import InputSelect from '../../UI/Form/InputSelect';
import InputCheckbox from '../../UI/Form/InputCheckbox';
import FormInformation from '../../UI/Form/FormInformation';
import FormError from '../../UI/Form/FormError';
import InputHidden from '../../UI/Form/InputHidden';
import Button from '../../UI/Button/Button';
import Form from '../../UI/Form/Form';
import Modal from '../../UI/Modal/Modal';
import H2Header from '../../UI/Header/H2Header';

// TODO
// Add: deactivate button, rotate key button, refresh LE status button

const EditOneACMEAccount = () => {
  const { id } = useParams();
  const [apiGetState, updateGet] = useApiGet(
    `/v1/acmeaccounts/${id}`,
    'acme_account'
  );

  const [sendApiState, sendData] = useApiSend();
  const navigate = useNavigate();

  // set dummy state prior to apiGet loading
  // only includes values that will be used in payload
  const [formState, setFormState] = useState({
    acme_account: {
      id: -2, // dummy value
      name: '',
      description: '',
    },
    validationErrors: {},
  });

  // Function to set the form equal to the current API state
  const setFormToApi = useCallback(() => {
    setFormState({
      acme_account: {
        id: apiGetState.acme_account.id,
        name: apiGetState.acme_account.name,
        description: apiGetState.acme_account.description,
      },
      validationErrors: {},
    });
  }, [apiGetState]);

  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (apiGetState.isLoaded && !apiGetState.errorMessage) {
      setFormToApi();
    }
  }, [apiGetState, setFormToApi]);

  // data change handlers
  const inputChangeHandler = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      acme_account: {
        ...prevState.acme_account,
        [event.target.id]: event.target.value,
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
    //navigate('.');
    navigate('/acmeaccounts');
  };

  // delete handlers
  const deleteClickHandler = () => {
    setDeleteModal(true);
  };
  const deleteCancelHandler = () => {
    setDeleteModal(false);
  };
  const deleteConfirmHandler = () => {
    setDeleteModal(false);
    sendData(`/v1/acmeaccounts/${formState.acme_account.id}`, 'DELETE').then(
      (success) => {
        if (success) {
          // back to the accounts page
          //navigate('.');
          navigate('/acmeaccounts');
        }
      }
    );
  };

  // register ACME account handler
  const registerClickHandler = (event) => {
    event.preventDefault();

    sendData(
      `/v1/acmeaccounts/${formState.acme_account.id}/new-account`,
      'POST'
    ).then((success) => {
      if (success) {
        // update account from backend
        updateGet();
      }
    });
  };

  // change email handler
  const changeEmailClickHandler = (event) => {
    event.preventDefault();
    navigate(`/acmeaccounts/${formState.acme_account.id}/email`);
  };

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    /// client side validation
    let validationErrors = {};
    // check name
    if (!isNameValid(formState.acme_account.name)) {
      validationErrors.name = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    ///

    sendData(
      `/v1/acmeaccounts/${formState.acme_account.id}`,
      'PUT',
      formState.acme_account
    ).then((success) => {
      if (success) {
        // back to the previous page
        //navigate('.');
        navigate('/acmeaccounts');
      }
    });
  };

  if (apiGetState.errorMessage) {
    return <ApiError>{apiGetState.errorMessage}</ApiError>;
  } else if (!apiGetState.isLoaded) {
    return <ApiLoading />;
  } else {
    return (
      <>
        {deleteModal && (
          <Modal
            title={`Delete Key - ${formState.acme_account.name}`}
            hasCancel
            onClickCancel={deleteCancelHandler}
            hasConfirm
            onClickConfirm={deleteConfirmHandler}
          >
            Are you sure you want to delete the acme account named '
            {formState.acme_account.name}' ?<br />
            The account can be recovered as long as the associated key is not
            deleted.
          </Modal>
        )}
        <H2Header h2='ACME Account - Edit'>
          <Button
            type='delete'
            onClick={deleteClickHandler}
            disabled={sendApiState.isSending}
          >
            Delete
          </Button>
        </H2Header>
        <Form onSubmit={submitFormHandler}>
          {sendApiState.errorMessage && (
            <FormError>Error Posting -- {sendApiState.errorMessage}</FormError>
          )}

          <InputHidden id='id' name='id' value={formState.acme_account.id} />

          <InputText
            label='Account Name'
            id='name'
            name='name'
            value={formState.acme_account.name}
            onChange={inputChangeHandler}
            invalid={formState.validationErrors.name && true}
          />
          <InputText
            label='Description'
            id='description'
            name='description'
            value={formState.acme_account.description}
            onChange={inputChangeHandler}
          />
          {/* TODO: Allow multiple email addresses */}
          <InputText
            label='E-Mail Address'
            id='email'
            name='email'
            value={apiGetState.acme_account.email}
            onChange={inputChangeHandler}
            disabled
          />
          {(apiGetState.acme_account.status === 'valid' &&
            apiGetState.acme_account.kid !== '') && (
            <Button
              type='primary'
              onClick={changeEmailClickHandler}
              disabled={sendApiState.isSending}
            >
              Change Email
            </Button>
          )}

          <InputSelect
            label='Private Key'
            id='privateKey'
            emptyValue={
              apiGetState.acme_account.private_key.name +
              ' (' +
              apiGetState.acme_account.private_key.algorithm.name +
              ')'
            }
            disabled
          />

          <FormInformation>
            Status: {apiGetState.acme_account.status}
            {(apiGetState.acme_account.status === 'unknown' ||
              apiGetState.acme_account.status === '' ||
              apiGetState.acme_account.kid === '') && (
              <Button
                className='ml-2'
                type='primary'
                onClick={registerClickHandler}
                disabled={sendApiState.isSending}
              >
                Register
              </Button>
            )}
          </FormInformation>

          {apiGetState.acme_account.kid && (
            <FormInformation>
              Kid: {apiGetState.acme_account.kid}
            </FormInformation>
          )}

          <FormInformation>
            Account Type:{' '}
            {apiGetState.acme_account.is_staging ? 'Staging' : 'Production'}
          </FormInformation>

          <InputCheckbox id='accepted_tos' checked disabled>
            Accept Let's Encrypt Terms of Service
          </InputCheckbox>

          <FormInformation>
            <small>Created: {apiGetState.acme_account.created_at}</small>
          </FormInformation>
          <FormInformation>
            <small>Last Updated: {apiGetState.acme_account.updated_at}</small>
          </FormInformation>

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

export default EditOneACMEAccount;
