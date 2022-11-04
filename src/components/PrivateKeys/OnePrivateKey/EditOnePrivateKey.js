import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxiosGet from '../../../hooks/useAxiosGet';
import useAxiosSend from '../../../hooks/useAxiosSend';
import { isNameValid } from '../../../helpers/form-validation';
import { convertUnixTime } from '../../../helpers/unix-time';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import Button from '../../UI/Button/Button';
import Form from '../../UI/Form/Form';
import FormError from '../../UI/Form/FormError';
import FormInformation from '../../UI/Form/FormInformation';
import InputText from '../../UI/Form/InputText';
import H2Header from '../../UI/Header/H2Header';
import Modal from '../../UI/Modal/Modal';
import InputCheckbox from '../../UI/Form/InputCheckbox';

const EditOnePrivateKey = () => {
  const { id } = useParams();
  const [apiGetState] = useAxiosGet(
    `/v1/privatekeys/${id}`,
    'private_key',
    true
  );

  const [sendApiState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  // set dummy state prior to apiGet loading
  // only includes values that will be used in payload
  const [formState, setFormState] = useState({
    private_key: {
      name: '',
      description: '',
      api_key_via_url: null,
    },
    validationErrors: {},
  });

  // Function to set the form equal to the current API state
  const setFormToApi = useCallback(() => {
    setFormState({
      private_key: {
        name: apiGetState.private_key.name,
        description: apiGetState.private_key.description,
        api_key_via_url: apiGetState.private_key.api_key_via_url,
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
  // checkbox updates
  const checkChangeHandler = (event) => {
    setFormState((prevState) => {
      return {
        ...prevState,
        private_key: {
          ...prevState.private_key,
          [event.target.id]: event.target.checked,
        },
      };
    });
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
    sendData(
      `/v1/privatekeys/${id}`,
      'DELETE',
      null,
      true
    ).then((success) => {
      if (success) {
        // back to the private keys page
        //navigate('.');
        navigate('/privatekeys');
      }
    });
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
      `/v1/privatekeys/${id}`,
      'PUT',
      formState.private_key,
      true
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
          <FormInformation>
            API Key: {apiGetState.private_key.api_key}
          </FormInformation>

          <InputCheckbox
            id='api_key_via_url'
            checked={formState.private_key.api_key_via_url ? true : false}
            onChange={checkChangeHandler}
          >
            Allow API Key via URL{' '}
            <span className='text-danger'>
              (This should only be used for clients that absolutely need it.)
            </span>
          </InputCheckbox>

          <FormInformation>
            <small>
              Created: {convertUnixTime(apiGetState.private_key.created_at)}
            </small>
          </FormInformation>
          <FormInformation>
            <small>
              Last Updated:{' '}
              {convertUnixTime(apiGetState.private_key.updated_at)}
            </small>
          </FormInformation>

          <Button
            type='submit'
            disabled={
              sendApiState.isSending ||
              (apiGetState.private_key.name === formState.private_key.name &&
                apiGetState.private_key.description ===
                  formState.private_key.description &&
                apiGetState.private_key.api_key_via_url ===
                  formState.private_key.api_key_via_url)
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

export default EditOnePrivateKey;
