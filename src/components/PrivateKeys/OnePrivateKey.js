import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useApiRequest from '../../hooks/useApiRequest';
import ApiError from '../UI/Api/ApiError';
import ApiLoading from '../UI/Api/ApiLoading';
import Button from '../UI/Button/Button';

import Form from '../UI/Form/Form';
import FormInformation from '../UI/Form/FormInformation';
import InputSelect from '../UI/Form/InputSelect';
import InputText from '../UI/Form/InputText';
import InputTextArea from '../UI/Form/InputTextArea';

const OnePrivateKey = () => {
  const { id } = useParams();

  const [state, setState] = useApiRequest(
    `/v1/privatekeys/${id}`,
    'private_key'
  );

  useEffect(() => {
    // if we're making a new key, need to create a blank object in state for the form to populate
    if (parseInt(id) === -1) {
      setState((prevState) => ({
        ...prevState,
        private_key: {
          id: '',
          name: '',
          description: '',
          algorithm: {
            value: '',
            name: '',
          },
          pem: '',
          api_key: '',
          created_at: '',
          updated_at: '',
        },
      }));
    }
  }, [id, setState]);

  // algorithm list
  // MUST keep in sync with list on the backend
  const keyAlgorithms = [
    { value: 'rsa2048', name: 'RSA 2048' },
    { value: 'ecdsa256', name: 'ECDSA P-256' },
  ];

  // data change handlers
  const nameChangeHandler = (event) => {
    setState((prevState) => {
      return {
        ...prevState,
        private_key: { ...prevState.private_key, name: event.target.value },
      };
    });
  };
  const descriptionChangeHandler = (event) => {
    setState((prevState) => {
      return {
        ...prevState,
        private_key: {
          ...prevState.private_key,
          description: event.target.value,
        },
      };
    });
  };
  // TODO: Update this to properly handle new vs. old keys
  const algorithmChangeHandler = (event) => {
    setState((prevState) => {
      return {
        ...prevState,
        private_key: {
          ...prevState.private_key,
          algorithm: event.target.value,
        },
      };
    });
  };

  // button handlers
  const resetClickHandler = (event) => {
    event.preventDefault();
    setState((prevState) => {
      return {
        ...prevState,
        private_key: { ...prevState.orig_private_key },
      };
    });
  };

  if (state.errorMessage) {
    return <ApiError>{state.errorMessage}</ApiError>;
  } else if (!state.isLoaded) {
    return <ApiLoading />;
  } else {
    return (
      <>
        <h2>Private Key - Edit</h2>
        <Form>
          <InputText
            label='Name'
            id='name'
            value={state.private_key.name}
            onChange={nameChangeHandler}
          />
          <InputText
            label='Description'
            id='description'
            value={state.private_key.description}
            onChange={descriptionChangeHandler}
          />
          <InputSelect
            label='Algorithm'
            id='algorithm'
            options={keyAlgorithms}
            value={state.private_key.algorithm.value}
            onChange={algorithmChangeHandler}
            disabled
          />

          <InputTextArea
            label='PEM Content'
            id='pemcontent'
            rows='8'
            value={state.private_key.pem}
            readOnly
          />

          <InputText
            label='API Key'
            id='apikey'
            value={state.private_key.api_key}
            readOnly
          />

          <FormInformation>
            <small>Created: {state.private_key.created_at}</small>
          </FormInformation>
          <FormInformation>
            <small>Last Updated: {state.private_key.updated_at}</small>
          </FormInformation>

          <Button type='submit'>Submit</Button>
          <Button type='reset' onClick={resetClickHandler}>
            Reset
          </Button>
          <Button type='cancel'>Cancel</Button>
        </Form>
      </>
    );
  }
};

export default OnePrivateKey;
