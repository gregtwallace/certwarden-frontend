import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useApiGet from '../../../hooks/useApiGet';
import useApiSend from '../../../hooks/useApiSend';
import { isNameValid } from '../../../helpers/form-validation';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import Button from '../../UI/Button/Button';
import Form from '../../UI/Form/Form';
import FormError from '../../UI/Form/FormError';
import FormInformation from '../../UI/Form/FormInformation';
import InputHidden from '../../UI/Form/InputHidden';
import InputText from '../../UI/Form/InputText';
import InputTextArea from '../../UI/Form/InputTextArea';
import H2Header from '../../UI/Header/H2Header';
import Modal from '../../UI/Modal/Modal';

const EditOnePrivateKey = () => {
  const { id } = useParams();
  const apiGetState = useApiGet(`/v1/privatekeys/${id}`, 'private_key');

  const [sendApiState, sendData] = useApiSend();
  const navigate = useNavigate();

  // set dummy state prior to apiGet loading
  // only includes values that will be used in payload
  const [formState, setFormState] = useState({
    private_key: {
      id: -2, // dummy value
      name: '',
      description: '',
    },
    validationErrors: {},
  });

  // Function to set the form equal to the current API state
  const setFormToApi = useCallback(() => {
    setFormState({
      private_key: {
        id: apiGetState.private_key.id,
        name: apiGetState.private_key.name,
        description: apiGetState.private_key.description,
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
      private_key: {
        ...prevState.private_key,
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
    navigate('/privatekeys');
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
    sendData(`/v1/privatekeys/${formState.private_key.id}`, 'DELETE').then(
      (success) => {
        if (success) {
          // back to the private keys page
          //navigate('.');
          navigate('/privatekeys');
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
    if (!isNameValid(formState.private_key.name)) {
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
      `/v1/privatekeys/${formState.private_key.id}`,
      'PUT',
      formState.private_key
    ).then((success) => {
      if (success) {
        // back to the private keys page
        //navigate('.');
        navigate('/privatekeys');
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
            title={`Delete Key - ${formState.private_key.name}`}
            hasCancel
            onClickCancel={deleteCancelHandler}
            hasConfirm
            onClickConfirm={deleteConfirmHandler}
          >
            Are you sure you want to delete the key named '
            {formState.private_key.name}' ?<br />
            This action cannot be undone and{' '}
            <strong className='text-danger'>
              the key will not be recoverable!
            </strong>{' '}
            If you do not have a backup of the key,{' '}
            <strong className='text-danger'>
              any associated accounts will also not be recoverable!
            </strong>
          </Modal>
        )}
        <H2Header h2='Private Key - Edit'>
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

          <InputHidden id='id' name='id' value={formState.private_key.id} />

          <InputText
            label='Name'
            id='name'
            name='name'
            value={formState.private_key.name}
            onChange={inputChangeHandler}
            invalid={formState.validationErrors.name && true}
          />
          <InputText
            label='Description'
            id='description'
            name='description'
            value={formState.private_key.description}
            onChange={inputChangeHandler}
          />

          <FormInformation>
            Algorithm: {apiGetState.private_key.algorithm.name}
          </FormInformation>
          <InputTextArea
            label='PEM Content'
            id='pem'
            value={apiGetState.private_key.pem}
            rows='8'
            readOnly
          />
          <FormInformation>
            API Key: {apiGetState.private_key.api_key}
          </FormInformation>

          <FormInformation>
            <small>Created: {apiGetState.private_key.created_at}</small>
          </FormInformation>
          <FormInformation>
            <small>Last Updated: {apiGetState.private_key.updated_at}</small>
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

export default EditOnePrivateKey;
