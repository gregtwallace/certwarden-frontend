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

  const [privateKeyState, setPrivateKeysState] = useApiRequest(
    `/v1/privatekeys/keys/${id}`,
    'private_key'
  );

  // needed to fetch valid key algorithms
  const [algorithmsState] = useApiRequest(
    `/v1/privatekeys/algorithms`,
    'key_algorithms'
  );

  // data change handlers
  const nameChangeHandler = (event) => {
    setPrivateKeysState((prevState) => {
      return {
        ...prevState,
        private_key: { ...prevState.private_key, name: event.target.value },
      };
    });
  };
  const descriptionChangeHandler = (event) => {
    setPrivateKeysState((prevState) => {
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
    setPrivateKeysState((prevState) => {
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
    setPrivateKeysState((prevState) => {
      return {
        ...prevState,
        private_key: { ...prevState.orig_private_key },
      };
    });
  };

  if (privateKeyState.errorMessage || algorithmsState.errorMessage) {
    return (
      <>
        <ApiError>{privateKeyState.errorMessage}</ApiError>
        <ApiError>{algorithmsState.errorMessage}</ApiError>
      </>
    );
  } else if (!privateKeyState.isLoaded || !algorithmsState.isLoaded) {
    return <ApiLoading />;
  } else {
    return (
      <>
        <h2>Private Key - Edit</h2>
        <Form>
          <InputText
            label='Name'
            id='name'
            value={privateKeyState.private_key.name}
            onChange={nameChangeHandler}
          />
          <InputText
            label='Description'
            id='description'
            value={privateKeyState.private_key.description}
            onChange={descriptionChangeHandler}
          />
          <InputSelect
            label='Algorithm'
            id='algorithm'
            options={algorithmsState.key_algorithms}
            value={privateKeyState.private_key.algorithm.id}
            readOnly
          />

          <InputTextArea
            label='PEM Content (Read Only)'
            id='pemcontent'
            rows='8'
            value={privateKeyState.private_key.pem}
            readOnly
          />

          <InputText
            label='API Key (Read Only)'
            id='apikey'
            value={privateKeyState.private_key.api_key}
            readOnly
          />

          <FormInformation>
            <small>Created: {privateKeyState.private_key.created_at}</small>
          </FormInformation>
          <FormInformation>
            <small>
              Last Updated: {privateKeyState.private_key.updated_at}
            </small>
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
