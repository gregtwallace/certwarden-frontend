import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { isNameValid } from '../../../helpers/form-validation';

import useApiGet from '../../../hooks/useApiGet';
import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import Button from '../../UI/Button/Button';
import Form from '../../UI/Form/Form';
import FormInformation from '../../UI/Form/FormInformation';
import InputHidden from '../../UI/Form/InputHidden';
import InputSelect from '../../UI/Form/InputSelect';
import InputText from '../../UI/Form/InputText';
import InputTextArea from '../../UI/Form/InputTextArea';
import H2Header from '../../UI/Header/H2Header';
import Modal from '../../UI/Modal/Modal';

const EditOnePrivateKey = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const apiGetState = useApiGet(`/v1/privatekeys/${id}`, 'private_key');
  const [formState, setFormState] = useState({
    isLoaded: false,
  });
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (apiGetState.isLoaded && !apiGetState.errorMessage) {
      setFormState({
        private_key: apiGetState.private_key,
        validationErrors: {},
        isLoaded: apiGetState.isLoaded,
      });
    }
  }, [apiGetState]);

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
    setFormState((prevState) => {
      return {
        ...prevState,
        private_key: apiGetState.private_key,
        validationErrors: {},
      };
    });
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
    const requestOptions = {
      method: 'DELETE',
    };

    fetch(
      `${process.env.REACT_APP_API_NODE}/api/v1/privatekeys/${formState.private_key.id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .then(
        // back to the private keys page
        //navigate('.');
        navigate('/privatekeys')
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

    const data = new FormData(event.target);
    const payload = Object.fromEntries(data.entries());

    const requestOptions = {
      method: 'PUT',
      body: JSON.stringify(payload),
    };

    fetch(
      `${process.env.REACT_APP_API_NODE}/api/v1/privatekeys/${formState.private_key.id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .then(
        // back to the private keys page
        //navigate('.');
        navigate('/privatekeys')
      );
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
            </strong>
          </Modal>
        )}
        <H2Header h2='Private Key - Edit'>
          <Button type='delete' onClick={deleteClickHandler}>
            Delete
          </Button>
        </H2Header>
        <Form onSubmit={submitFormHandler}>
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
          <InputSelect
            label='Algorithm'
            id='algorithm'
            options={[
              {
                value: formState.private_key.algorithm.value,
                name: formState.private_key.algorithm.name,
              },
            ]}
            value={formState.private_key.algorithm.value}
            disabled
          />

          <InputTextArea
            label='PEM Content'
            id='pem'
            value={formState.private_key.pem}
            rows='8'
            onChange={inputChangeHandler}
            readOnly
          />

          <InputText
            label='API Key'
            id='apikey'
            value={formState.private_key.api_key}
            readOnly
          />

          <FormInformation>
            <small>Created: {formState.private_key.created_at}</small>
          </FormInformation>
          <FormInformation>
            <small>Last Updated: {formState.private_key.updated_at}</small>
          </FormInformation>

          <Button type='cancel' onClick={cancelClickHandler}>
            Cancel
          </Button>
          <Button type='reset' onClick={resetClickHandler}>
            Reset
          </Button>
          <Button type='submit'>Submit</Button>
        </Form>
      </>
    );
  }
};

export default EditOnePrivateKey;
