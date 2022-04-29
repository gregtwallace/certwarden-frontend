import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useApiRequest from '../../../hooks/useApiRequest';
import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import Button from '../../UI/Button/Button';
import Form from '../../UI/Form/Form';
import FormInformation from '../../UI/Form/FormInformation';
import InputSelect from '../../UI/Form/InputSelect';
import InputText from '../../UI/Form/InputText';
import InputTextArea from '../../UI/Form/InputTextArea';
import H2Header from '../../UI/Header/H2Header';

const EditOnePrivateKey = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useApiRequest(
    `/v1/privatekeys/${id}`,
    'private_key'
  );

  // data change handlers
  const inputChangeHandler = (event) => {
    setState((prevState) => ({
      ...prevState,
      private_key: {
        ...prevState.private_key,
        [event.target.id]: event.target.value,
      },
    }));
  };

  // button handlers
  const submitClickHandler = (event) => {
    event.preventDefault();
  };
  const resetClickHandler = (event) => {
    event.preventDefault();
    setState((prevState) => {
      return {
        ...prevState,
        private_key: { ...prevState.orig_private_key },
      };
    });
  };
  const cancelClickHandler = (event) => {
    event.preventDefault();
    //navigate('.');
    navigate('/privatekeys');
  };

  if (state.errorMessage) {
    return <ApiError>{state.errorMessage}</ApiError>;
  } else if (!state.isLoaded) {
    return <ApiLoading />;
  } else {
    return (
      <>
        <H2Header h2='Private Key - Edit' />
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
          <InputSelect
            label='Algorithm'
            id='algorithm'
            options={[{ value: state.private_key.algorithm.value, name: state.private_key.algorithm.name}]}
            value={state.private_key.algorithm.value}

            disabled
          />

          <InputTextArea
            label='PEM Content'
            id='pemcontent'
            rows='8'
            value={state.private_key.pem}
            onChange={inputChangeHandler}
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
  }
};

export default EditOnePrivateKey;
