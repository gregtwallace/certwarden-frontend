import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  isDomainValid,
  isPortValid,
} from '../../../../../helpers/form-validation';

import useAxiosSend from '../../../../../hooks/useAxiosSend';

import ApiError from '../../../../UI/Api/ApiError';
import Button from '../../../../UI/Button/Button';
import InputTextArray from '../../../../UI/FormMui/InputTextArray';
import Form from '../../../../UI/FormMui/Form';
import FormFooter from '../../../../UI/FormMui/FormFooter';
import InputTextField from '../../../../UI/FormMui/InputTextField';

const Http01InternalAdd = () => {
  const [apiSendState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  const blankForm = {
    form: {
      domains: [''],
      port: '',
    },
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankForm);

  // data change handler
  const stringInputChangeHandler = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        [event.target.name]: event.target.value,
      },
    }));
  };
  // int change handler
  const intInputChangeHandler = (event) => {
    setFormState((prevState) => {
      return {
        ...prevState,
        form: {
          ...prevState.form,
          [event.target.name]: parseInt(event.target.value),
        },
      };
    });
  };

  // button handlers
  const resetClickHandler = (event) => {
    event.preventDefault();
    setFormState(blankForm);
  };

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    /// form validation
    let validationErrors = {};

    // domains
    var domains = [];
    formState.form.domains.forEach((domain, i) => {
      if (!isDomainValid(domain)) {
        domains.push(i);
      }
    });
    // if any alts invalid, create the error array
    if (domains.length !== 0) {
      validationErrors.domains = domains;
    }

    // port number
    if (!isPortValid(formState.form.port)) {
      validationErrors.port = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    //

    sendData(
      `/v1/app/challenges/providers/services`,
      'POST',
      { http_01_internal: { ...formState.form } },
      true
    ).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        // back to the private keys page
        navigate(`/providers/${response.data?.response?.record_id}`);
      }
    });
  };

  return (
    <Form onSubmit={submitFormHandler}>
      <InputTextArray
        label='Domains'
        subLabel='Domain'
        id='domains'
        name='domains'
        minElems={1}
        value={formState.form.domains}
        onChange={stringInputChangeHandler}
        error={formState.validationErrors.domains}
      />

      <InputTextField
        label='HTTP Server Port Number'
        id='port'
        value={formState.form.port}
        onChange={intInputChangeHandler}
        error={formState.validationErrors.port && true}
      />

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
          href='/providers'
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
  );
};

export default Http01InternalAdd;
