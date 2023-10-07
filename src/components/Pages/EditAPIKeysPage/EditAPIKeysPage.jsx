import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import useAxiosGet from '../../../hooks/useAxiosGet';
import useAxiosSend from '../../../hooks/useAxiosSend';

import { Typography } from '@mui/material';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import Button from '../../UI/Button/Button';
import Form from '../../UI/FormMui/Form';
import FormContainer from '../../UI/FormMui/FormContainer';
import FormFooter from '../../UI/FormMui/FormFooter';
import FormRowRight from '../../UI/FormMui/FormRowRight';
import InputTextField from '../../UI/FormMui/InputTextField';
import TitleBar from '../../UI/TitleBar/TitleBar';

const EditAPIKeysPage = (props) => {
  const { id } = useParams();
  const [apiGetState] = useAxiosGet(
    `/v1/${props.itemTypeApiPath}/${id}`,
    props.itemTypeApiObjectName,
    true
  );

  const [apiSendState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({});

  // Function to set the form equal to the current API state
  const setFormToApi = useCallback(() => {
    setFormState({
      form: {
        api_key: apiGetState[props.itemTypeApiObjectName].api_key,
        api_key_new: apiGetState[props.itemTypeApiObjectName].api_key_new
          ? apiGetState[props.itemTypeApiObjectName].api_key_new
          : '',
      },
      validationErrors: {},
    });
  }, [apiGetState, props.itemTypeApiObjectName]);

  useEffect(() => {
    // execute actions after loaded
    if (apiGetState.isLoaded) {
      // if api error, redirect to root of object type
      if (apiGetState.errorMessage) {
        navigate(`/${props.itemTypeApiPath}`);
      }

      setFormToApi();
    }
  }, [apiGetState, setFormToApi, navigate, props.itemTypeApiPath]);

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

  // button handlers
  const resetClickHandler = (event) => {
    event.preventDefault();

    setFormToApi();
  };

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    // client side validation
    let validationErrors = {};
    // API Key
    if (formState.form.api_key.length < 10) {
      validationErrors.api_key = true;
    }
    // API Key (New) (AKA #2)
    if (
      formState.form.api_key_new.length !== 0 &&
      formState.form.api_key_new.length < 10
    ) {
      validationErrors.api_key_new = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    // client side validation -- end

    sendData(
      `/v1/${props.itemTypeApiPath}/${id}`,
      'PUT',
      formState.form,
      true
    ).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        navigate(`/${props.itemTypeApiPath}/${id}`);
      }
    });
  };

  // consts related to rendering
  // don't render if not loaded, error, or formState not yet set
  // formState set is needed to prevent animations of form fields
  // populating (when previously using a blank form object) or invalid
  // references to formState.form now that blank form object is gone
  const renderApiItems =
    apiGetState.isLoaded &&
    !apiGetState.errorMessage &&
    JSON.stringify({}) !== JSON.stringify(formState);

  var formUnchanged = false;
  if (renderApiItems) {
    // if api_key_new doesn't exist, do comparison against ''
    const new_key_unchanged =
      (apiGetState[props.itemTypeApiObjectName].api_key_new
        ? apiGetState[props.itemTypeApiObjectName].api_key_new
        : '') === formState.form.api_key_new;

    formUnchanged =
      apiGetState[props.itemTypeApiObjectName].api_key ===
        formState.form.api_key && new_key_unchanged;
  }

  return (
    <FormContainer>
      <TitleBar title='Manually Change API Key(s)' />
      {!apiGetState.isLoaded && <ApiLoading />}
      {apiGetState.errorMessage && (
        <ApiError
          code={apiGetState.errorCode}
          message={apiGetState.errorMessage}
        />
      )}

      {renderApiItems &&
        /* Render unavailable message if server returns redacted */
        (apiGetState[props.itemTypeApiObjectName].api_key === '[redacted]' ? (
          <Form>
            <Typography sx={{ px: 1, mt: 1, mb: 3 }}>
              This feature is not available when server is running as http.
            </Typography>

            <FormRowRight>
              <Button href={`/${props.itemTypeApiPath}/${id}`}>Back</Button>
            </FormRowRight>
          </Form>
        ) : (
          /* Function is available */
          <Form onSubmit={submitFormHandler}>
            <Typography sx={{ px: 1, mt: 1, mb: 3, color: 'error.main' }}>
              Do not manually edit the API Keys unless you have a specific need.
            </Typography>

            <Typography sx={{ px: 1, mt: 1, mb: 3 }}>
              Keys should be generated securely to avoid breaches and must be at
              least 10 characters in length, though practically you should make
              them much longer.
            </Typography>

            <InputTextField
              label='Name'
              id='name'
              value={apiGetState[props.itemTypeApiObjectName].name}
              disabled
            />

            <InputTextField
              label='Description'
              id='description'
              value={
                apiGetState[props.itemTypeApiObjectName].description
                  ? apiGetState[props.itemTypeApiObjectName].description
                  : 'None'
              }
              disabled
            />

            <Typography sx={{ px: 1, my: 3 }}>
              API Key 1 corresponds to the &apos;Old&apos; API Key. It must be
              populated.
            </Typography>

            <InputTextField
              label='API Key 1'
              id='api_key'
              name='api_key'
              value={formState.form.api_key}
              onChange={inputChangeHandler}
              error={formState.validationErrors.api_key && true}
            />

            <Typography sx={{ px: 1, my: 3 }}>
              API Key 2 corresponds to the &apos;New&apos; API Key. It may be
              blank in which case only API Key 1 will be used.
            </Typography>

            <InputTextField
              label='API Key 2'
              id='api_key_new'
              name='api_key_new'
              value={formState.form.api_key_new}
              onChange={inputChangeHandler}
              error={formState.validationErrors.api_key_new && true}
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
                href={`/${props.itemTypeApiPath}/${id}`}
                disabled={apiSendState.isSending}
              >
                Cancel
              </Button>
              <Button
                type='reset'
                onClick={resetClickHandler}
                disabled={apiSendState.isSending || formUnchanged}
              >
                Reset
              </Button>
              <Button
                type='submit'
                disabled={apiSendState.isSending || formUnchanged}
              >
                Submit
              </Button>
            </FormFooter>
          </Form>
        ))}
    </FormContainer>
  );
};

EditAPIKeysPage.propTypes = {
  itemTypeApiPath: PropTypes.string.isRequired,
  itemTypeApiObjectName: PropTypes.string.isRequired,
};

export default EditAPIKeysPage;
