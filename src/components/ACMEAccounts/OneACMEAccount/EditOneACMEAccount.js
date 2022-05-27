import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useApiGet from '../../../hooks/useApiGet';
import useApiSend from '../../../hooks/useApiSend';
import { isEmailValidOrBlank, isNameValid } from '../../../helpers/form-validation';

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

const EditOneACMEAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const apiGetState = useApiGet(`/v1/acmeaccounts/${id}`, 'acme_account');
  const [sendApiState, sendData] = useApiSend();

  const [formState, setFormState] = useState({
    isLoaded: false,
  });

  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (apiGetState.isLoaded && !apiGetState.errorMessage) {
      setFormState({
        acme_account: apiGetState.acme_account,
        validationErrors: {},
        isLoaded: apiGetState.isLoaded,
      });
    }
  }, [apiGetState]);

  // form field updates
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
  const tosChangeHandler = (event) => {
    setFormState((prevState) => {
      return {
        ...prevState,
        acme_account: {
          ...prevState.acme_account,
          accepted_tos: event.target.checked,
        },
      };
    });
  };

  // button handlers
  const resetClickHandler = (event) => {
    event.preventDefault();
    setFormState((prevState) => {
      return {
        ...prevState,
        acme_account: { ...apiGetState.acme_account },
      };
    });
  };
  const cancelClickHandler = (event) => {
    event.preventDefault();
    //navigate('.');
    navigate('/acmeaccounts');
  };

  // delete handlers
  // TODO: Deactivate account?
  //  either as a separate button to deactivate/delete
  //  or just one button that does both??
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
          // back to the private keys page
          //navigate('.');
          navigate('/acmeaccounts');
        }
      }
    );
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
    // check email format (if present)
    if (!isEmailValidOrBlank(formState.acme_account.email)) {
      validationErrors.email = true;
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
      event
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
  } else if (!formState.isLoaded) {
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
            value={formState.acme_account.email}
            onChange={inputChangeHandler}
            invalid={formState.validationErrors.email && true}
          />

          <FormInformation>
            Status: {formState.acme_account.status}
          </FormInformation>
          <FormInformation>
            Type: {formState.acme_account.is_staging ? 'Staging' : 'Production'}
          </FormInformation>

          <InputSelect
            label='Private Key'
            id='privateKey'
            options={[
              {
                value: formState.acme_account.private_key_id,
                name: formState.acme_account.private_key_name,
              },
            ]}
            value={formState.acme_account.private_key_id}
            disabled
          />

          <InputCheckbox
            id='acceptedTos'
            name='accepted_tos'
            checked={formState.acme_account.accepted_tos ? true : ''}
            onChange={tosChangeHandler}
            disabled={apiGetState.acme_account.accepted_tos}
          >
            Accept Let's Encrypt Terms of Service
          </InputCheckbox>
          {/* Since checkbox doesn't have readonly and we want to send tos accept if already accepted */}
          {apiGetState.acme_account.accepted_tos && (
            <InputHidden id='acceptedTos' name='accepted_tos' value='on' />
          )}

          <FormInformation>
            <small>Created: {formState.acme_account.created_at}</small>
          </FormInformation>
          <FormInformation>
            <small>Last Updated: {formState.acme_account.updated_at}</small>
          </FormInformation>

          <Button
            type='cancel'
            onClick={cancelClickHandler}
            disabled={sendApiState.isSending}
          >
            Cancel
          </Button>
          <Button
            type='reset'
            onClick={resetClickHandler}
            disabled={sendApiState.isSending}
          >
            Reset
          </Button>
          <Button type='submit' disabled={sendApiState.isSending}>
            Submit
          </Button>
        </Form>
      </>
    );
  }
};

export default EditOneACMEAccount;
