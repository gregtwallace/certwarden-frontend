import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosSend from '../../../hooks/useAxiosSend';
import {
  isDirectoryUrlValid,
  isNameValid,
} from '../../../helpers/form-validation';

import ApiError from '../../UI/Api/ApiError';
import Button from '../../UI/Button/Button';
import Form from '../../UI/FormMui/Form';
import FormContainer from '../../UI/FormMui/FormContainer';
import FormFooter from '../../UI/FormMui/FormFooter';
import InputCheckbox from '../../UI/FormMui/InputCheckbox';
import InputTextField from '../../UI/FormMui/InputTextField';
import TitleBar from '../../UI/TitleBar/TitleBar';

const AddOneACMEServer = () => {
  const [apiSendState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  const blankForm = {
    form: {
      name: '',
      description: '',
      directory_url: '',
      is_staging: false,
    },
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankForm);

  // data change handler
  const inputChangeHandler = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        [event.target.name]: event.target.value,
      },
    }));
  };
  // checkbox updates
  const checkChangeHandler = (event) => {
    setFormState((prevState) => {
      return {
        ...prevState,
        form: {
          ...prevState.form,
          [event.target.name]: event.target.checked,
        },
      };
    });
  };

  // button handlers
  const resetClickHandler = (event) => {
    event.preventDefault();
    setFormState(blankForm);
  };
  const cancelClickHandler = (event) => {
    event.preventDefault();

    navigate('/acmeservers');
  };

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    /// form validation
    let validationErrors = {};
    // name
    if (!isNameValid(formState.form.name)) {
      validationErrors.name = true;
    }

    // directory_url
    if (!isDirectoryUrlValid(formState.form.directory_url)) {
      validationErrors.directory_url = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    //

    sendData(`/v1/acmeservers`, 'POST', formState.form, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          // to the acme server's page
          navigate(`/acmeservers/${response.data?.response?.record_id}`);
        }
      }
    );
  };

  return (
    <FormContainer>
      <TitleBar title='New ACME Server' />
      <Form onSubmit={submitFormHandler}>
        <InputTextField
          label='Name'
          id='name'
          value={formState.form.name}
          onChange={inputChangeHandler}
          error={formState.validationErrors.name && true}
        />

        <InputTextField
          label='Description'
          id='description'
          value={formState.form.description}
          onChange={inputChangeHandler}
        />

        <InputTextField
          label='Directory URL'
          id='directory_url'
          value={formState.form.directory_url}
          onChange={inputChangeHandler}
          error={formState.validationErrors.directory_url && true}
        />

        <InputCheckbox
          id='is_staging'
          checked={formState.form.is_staging}
          onChange={checkChangeHandler}
        >
          Staging Environment Server
        </InputCheckbox>

        {apiSendState.errorMessage &&
          Object.keys(formState.validationErrors).length <= 0 && (
            <ApiError
              code={apiSendState.errorCode}
              message={apiSendState.errorMessage}
            />
          )}

        <FormFooter>
          <Button
            type='cancel'
            onClick={cancelClickHandler}
            disabled={apiSendState.isSending}
          >
            Cancel
          </Button>
          <Button
            type='reset'
            onClick={resetClickHandler}
            disabled={apiSendState.isSending}
          >
            Reset
          </Button>
          <Button type='submit' disabled={apiSendState.isSending}>
            Submit
          </Button>
        </FormFooter>
      </Form>
    </FormContainer>
  );
};

export default AddOneACMEServer;
