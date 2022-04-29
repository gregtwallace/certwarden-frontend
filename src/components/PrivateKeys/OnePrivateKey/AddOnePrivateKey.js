import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import H2Header from '../../UI/Header/H2Header';
import Button from '../../UI/Button/Button';
import Form from '../../UI/Form/Form';

import FormInformation from '../../UI/Form/FormInformation';
import InputSelect from '../../UI/Form/InputSelect';
import InputText from '../../UI/Form/InputText';
import InputTextArea from '../../UI/Form/InputTextArea';

const AddOnePrivateKey = () => {
  // algorithm list
  // MUST keep in sync with list on the backend
  const keyAlgorithms = [
    { value: 'rsa2048', name: 'RSA 2048' },
    { value: 'ecdsa256', name: 'ECDSA P-256' },
  ];

  const navigate = useNavigate();

  const blankStateObject = {
    private_key: {
      id: '-1',
      name: '',
      description: '',
      algorithm: {
        value: '',
      },
      pem: '',
    },
  };

  const [state, setState] = useState(blankStateObject);

  // data change handlers
  const inputChangeHandler = (event) => {
    if (event.target.id === 'algorithm') {
      setState((prevState) => ({
        ...prevState,
        private_key: {
          ...prevState.private_key,
          algorithm: {
            value: event.target.value,
          },
        },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        private_key: {
          ...prevState.private_key,
          [event.target.id]: event.target.value,
        },
      }));
    }
  };

  // button handlers
  const submitClickHandler = (event) => {
    event.preventDefault();
  };
  const resetClickHandler = (event) => {
    event.preventDefault();
    setState((prevState) => blankStateObject);
  };
  const cancelClickHandler = (event) => {
    event.preventDefault();
    //navigate('.');
    navigate('/privatekeys');
  };

  return (
    <>
      <H2Header h2='Private Keys - Add' />
      <Form>
        <InputText
          label='Name'
          id='name'
          value={state.private_key.name}
          onChange={inputChangeHandler}
        />
        <InputText
          label='Description'
          id='description'
          value={state.private_key.description}
          onChange={inputChangeHandler}
        />
        <FormInformation>
          <strong>Select One of:</strong>
        </FormInformation>
        <InputSelect
          label='1) Generate Using Algorithm'
          id='algorithm'
          options={keyAlgorithms}
          value={state.private_key.algorithm.value}
          onChange={inputChangeHandler}
          emptyValue='- Select an Algorithm / Do Not Generate -'
        />
        <FormInformation>
          <strong>- OR -</strong>
        </FormInformation>
        <InputTextArea
          label='2) TODO: Paste PEM Content'
          id='pemcontent'
          rows='8'
          value={state.private_key.pem}
          onChange={inputChangeHandler}
          readOnly
        />
        <FormInformation>
          <strong>- OR -</strong>
        </FormInformation>
        <FormInformation>3) TODO: Upload PEM File</FormInformation>

        <Button type='submit' onClick={submitClickHandler}>
          Submit
        </Button>
        <Button type='reset' onClick={resetClickHandler}>
          Reset
        </Button>
        <Button type='cancel' onClick={cancelClickHandler}>
          Cancel
        </Button>
      </Form>
    </>
  );
};

export default AddOnePrivateKey;
