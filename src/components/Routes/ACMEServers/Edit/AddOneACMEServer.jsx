import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosSend from '../../../../hooks/useAxiosSend';
import { formChangeHandlerFunc } from '../../../../helpers/input-handler';
import {
  isDirectoryUrlValid,
  isNameValid,
} from '../../../../helpers/form-validation';

import ApiError from '../../../UI/Api/ApiError';
import Button from '../../../UI/Button/Button';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormFooter from '../../../UI/FormMui/FormFooter';
import InputCheckbox from '../../../UI/FormMui/InputCheckbox';
import InputTextField from '../../../UI/FormMui/InputTextField';
import TitleBar from '../../../UI/TitleBar/TitleBar';

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
  const inputChangeHandler = formChangeHandlerFunc(setFormState);

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
          id='form.name'
          label='Name'
          value={formState.form.name}
          onChange={inputChangeHandler}
          error={formState.validationErrors.name}
        />

        <InputTextField
          id='form.description'
          label='Description'
          value={formState.form.description}
          onChange={inputChangeHandler}
        />

        <InputTextField
          id='form.directory_url'
          label='Directory URL'
          value={formState.form.directory_url}
          onChange={inputChangeHandler}
          error={formState.validationErrors.directory_url}
        />

        <InputCheckbox
          id='form.is_staging'
          checked={formState.form.is_staging}
          onChange={inputChangeHandler}
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
            href='/acmeservers'
            disabled={apiSendState.isSending}
          >
            Cancel
          </Button>
          <Button
            type='reset'
            onClick={() => setFormState(blankForm)}
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
