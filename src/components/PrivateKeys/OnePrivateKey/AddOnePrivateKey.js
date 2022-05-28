import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useApiGet from '../../../hooks/useApiGet';
import useApiSend from '../../../hooks/useApiSend';
import { isNameValid } from '../../../helpers/form-validation';
import { newId } from '../../../App';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import H2Header from '../../UI/Header/H2Header';
import Button from '../../UI/Button/Button';
import Form from '../../UI/Form/Form';
import FormInformation from '../../UI/Form/FormInformation';
import InputSelect from '../../UI/Form/InputSelect';
import InputText from '../../UI/Form/InputText';
import InputTextArea from '../../UI/Form/InputTextArea';
import InputHidden from '../../UI/Form/InputHidden';
import FormError from '../../UI/Form/FormError';

const AddOnePrivateKey = () => {
  // fetch valid options (for private keys this is the algorithms list)
  const apiGetState = useApiGet(
    `/v1/privatekeys/${newId}`,
    'private_key_options'
  );

  const [sendApiState, sendData] = useApiSend();
  const navigate = useNavigate();

  const blankFormState = {
    private_key: {
      id: newId,
      name: '',
      description: '',
      algorithm_value: '',
      pem: '',
    },
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankFormState);

  // data change handler
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
    setFormState(blankFormState);
  };
  const cancelClickHandler = (event) => {
    event.preventDefault();
    //navigate('.');
    navigate('/privatekeys');
  };

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    /// form validation
    let validationErrors = [];
    // name
    if (!isNameValid(formState.private_key.name)) {
      validationErrors.name = true;
    }
    // don't bother checking algorithm, as it is a dropdown select
    // pem (TODO)

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    //

    sendData(`/v1/privatekeys`, 'POST', event).then((success) => {
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
        <H2Header h2='Private Keys - Add' />
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
            <strong>Select One of:</strong>
          </FormInformation>
          <InputSelect
            label='1) Generate Using Algorithm'
            id='algorithm_value'
            name='algorithm_value'
            options={apiGetState.private_key_options.key_algorithms}
            value={formState.private_key.algorithm_value}
            onChange={inputChangeHandler}
            emptyValue='- Select an Algorithm / Do Not Generate -'
            disabled={formState.private_key.pem && true}
            invalid={formState.validationErrors.algorithm && true}
          />
          <FormInformation>
            <strong>- OR -</strong>
          </FormInformation>
          <InputTextArea
            label='2) Paste PEM Content'
            id='pem'
            name='pem'
            rows='8'
            value={formState.private_key.pem}
            onChange={inputChangeHandler}
            disabled={formState.private_key.algorithm_value && true}
            invalid={formState.validationErrors.pem && true}
          />

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

export default AddOnePrivateKey;
