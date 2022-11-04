import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxiosGet from '../../../hooks/useAxiosGet';
import useAxiosSend from '../../../hooks/useAxiosSend';
import { isNameValid } from '../../../helpers/form-validation';
import { convertUnixTime } from '../../../helpers/unix-time';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import InputText from '../../UI/Form/InputText';
import InputSelect from '../../UI/Form/InputSelect';
import InputCheckbox from '../../UI/Form/InputCheckbox';
import FormInformation from '../../UI/Form/FormInformation';
import FormError from '../../UI/Form/FormError';
import Button from '../../UI/Button/Button';
import Form from '../../UI/Form/Form';
import Modal from '../../UI/Modal/Modal';
import H2Header from '../../UI/Header/H2Header';

// TODO
// Add: refresh LE status button

const EditOneACMEAccount = () => {
  const { id } = useParams();
  const [apiGetState, updateGet] = useAxiosGet(
    `/v1/acmeaccounts/${id}`,
    'acme_account',
    true
  );

  const [sendApiState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  // set dummy state prior to apiGet loading
  // only includes values that will be used in payload
  const [formState, setFormState] = useState({
    acme_account: {
      name: '',
      description: '',
    },
    validationErrors: {},
  });

  // Function to set the form equal to the current API state
  const setFormToApi = useCallback(() => {
    setFormState({
      acme_account: {
        name: apiGetState.acme_account.name,
        description: apiGetState.acme_account.description,
      },
      validationErrors: {},
    });
  }, [apiGetState]);

  const [deactivateModal, setDeactivateModal] = useState(false);
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
    sendData(
      `/v1/acmeaccounts/${id}`,
      'DELETE',
      null,
      true
    ).then((success) => {
      if (success) {
        // back to the accounts page
        //navigate('.');
        navigate('/acmeaccounts');
      }
    });
  };

  // deactivate handlers
  const deactivateClickHandler = () => {
    setDeactivateModal(true);
  };
  const deactivateCancelHandler = () => {
    setDeactivateModal(false);
  };
  const deactivateConfirmHandler = () => {
    setDeactivateModal(false);

    sendData(
      `/v1/acmeaccounts/${id}/deactivate`,
      'POST',
      null,
      true
    ).then((success) => {
      if (success) {
        // update account from backend
        updateGet();
      }
    });
  };

  // register ACME account handler
  const registerClickHandler = (event) => {
    event.preventDefault();

    sendData(
      `/v1/acmeaccounts/${id}/new-account`,
      'POST',
      null,
      true
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
      `/v1/acmeaccounts/${id}`,
      'PUT',
      formState.acme_account,
      true
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
        {deactivateModal && (
          <Modal
            title={`Deactivate Account - ${formState.acme_account.name}`}
            hasCancel
            onClickCancel={deactivateCancelHandler}
            hasConfirm
            onClickConfirm={deactivateConfirmHandler}
          >
            Are you sure you want to deactivate the acme account '
            {formState.acme_account.name}' ?<br />
            <strong className='text-danger'>
              This process cannot be reversed! Ensure you understand all
              consequences of this action before confirming!
            </strong>
          </Modal>
        )}
        {deleteModal && (
          <Modal
            title={`Delete Account - ${formState.acme_account.name}`}
            hasCancel
            onClickCancel={deleteCancelHandler}
            hasConfirm
            onClickConfirm={deleteConfirmHandler}
          >
            Are you sure you want to delete the acme account '
            {formState.acme_account.name}' ?<br />
            The account can be recovered as long as the associated key is not
            deleted.
          </Modal>
        )}
        <H2Header h2='ACME Account - Edit'>
          {apiGetState.acme_account.status === 'valid' && (
            <Button
              type='deactivate'
              onClick={deactivateClickHandler}
              disabled={sendApiState.isSending}
            >
              Deactivate
            </Button>
          )}
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
          {apiGetState.acme_account.status === 'valid' &&
            apiGetState.acme_account.kid !== '' && (
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
            defaultName={
              apiGetState.acme_account.private_key.name +
              ' (' +
              apiGetState.acme_account.private_key.algorithm.name +
              ')'
            }
            disabled
          />
          {apiGetState.acme_account.status === 'valid' &&
            apiGetState.acme_account.kid !== '' && (
              <Button
                type='primary'
                onClick={rolloverClickHandler}
                disabled={sendApiState.isSending}
              >
                Rollover Account Key
              </Button>
            )}

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
            <small>
              Created: {convertUnixTime(apiGetState.acme_account.created_at)}
            </small>
          </FormInformation>
          <FormInformation>
            <small>
              Last Updated:{' '}
              {convertUnixTime(apiGetState.acme_account.updated_at)}
            </small>
          </FormInformation>

          <Button
            type='submit'
            disabled={
              sendApiState.isSending ||
              (apiGetState.acme_account.name === formState.acme_account.name &&
                apiGetState.acme_account.description ===
                  formState.acme_account.description)
            }
          >
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
