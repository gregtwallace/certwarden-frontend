import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useApiSend from '../../../hooks/useApiSend';
import { isNameValid } from '../../../helpers/form-validation';

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
  // algorithm list
  // MUST keep in sync with list on the backend
  const keyAlgorithms = [
    { value: 'rsa2048', name: 'RSA 2048-bit' },
    { value: 'rsa3072', name: 'RSA 3072-bit' },
    { value: 'rsa4096', name: 'RSA 4096-bit' },
    { value: 'ecdsap256', name: 'ECDSA P-256' },
    { value: 'ecdsap384', name: 'ECDSA P-384' },
  ];

  const [ sendApiState, sendData ] = useApiSend();
  const navigate = useNavigate();

  const blankFormState = {
    private_key: {
      id: '-1',
      name: '',
      description: '',
      algorithm: {
        value: '',
      },
      pem: '',
    },
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankFormState);

  // data change handlers
  const inputChangeHandler = (event) => {
    if (event.target.id === 'algorithm') {
      setFormState((prevState) => ({
        ...prevState,
        private_key: {
          ...prevState.private_key,
          algorithm: {
            value: event.target.value,
          },
        },
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        private_key: {
          ...prevState.private_key,
          [event.target.id]: event.target.value,
        },
      }));
    }
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
    // TODO: Ensure only 1 of the 3 options is in use
    // algorithm - since this is limited to a list, assume valid unless blank
    if (formState.private_key.algorithm.value === '') {
      validationErrors.algorithm = true;
    }
    // TODO: PEM Content & PEM File Upload

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    //

    sendData(`/v1/privatekeys`, 'POST', event)
    .then((success) => {
      if (success) {
        // back to the private keys page
        //navigate('.');
        navigate('/privatekeys')
      }
    });
  };

  return (
    <>
      <H2Header h2='Private Keys - Add' />
      <Form onSubmit={submitFormHandler}>
        {sendApiState.errorMessage && <FormError>Error Posting -- {sendApiState.errorMessage}</FormError>}

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
          id='algorithm'
          name='algorithm.value'
          options={keyAlgorithms}
          value={formState.private_key.algorithm.value}
          onChange={inputChangeHandler}
          emptyValue='- Select an Algorithm / Do Not Generate -'
          disabled={formState.private_key.pem && true}
          invalid={formState.validationErrors.algorithm && true}
        />
        <FormInformation>
          <strong>- OR -</strong>
        </FormInformation>
        <InputTextArea
          label='2) TODO: Paste PEM Content'
          id='pem'
          name='pem'
          rows='8'
          value={formState.private_key.pem}
          onChange={inputChangeHandler}
          disabled
          // disabled={formState.private_key.algorithm.value && true}
        />
        <FormInformation>
          <strong>- OR -</strong>
        </FormInformation>
        <FormInformation>3) TODO: Upload PEM File</FormInformation>

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
};

export default AddOnePrivateKey;
