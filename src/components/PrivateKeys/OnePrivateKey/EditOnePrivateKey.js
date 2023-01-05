import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxiosGet from '../../../hooks/useAxiosGet';
import useAxiosSend from '../../../hooks/useAxiosSend';
import { isNameValid } from '../../../helpers/form-validation';
import { downloadBlob } from '../../../helpers/download';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import Button from '../../UI/Button/Button';
import DialogAlert from '../../UI/Dialog/DialogAlert';
import Form from '../../UI/FormMui/Form';
import FormContainer from '../../UI/FormMui/FormContainer';
import FormError from '../../UI/FormMui/FormError';
import FormFooter from '../../UI/FormMui/FormFooter';
import FormRowRight from '../../UI/FormMui/FormRowRight';
import InputCheckbox from '../../UI/FormMui/InputCheckbox';
import InputSelect from '../../UI/FormMui/InputSelect';
import InputTextField from '../../UI/FormMui/InputTextField';
import TitleBar from '../../UI/TitleBar/TitleBar';

const EditOnePrivateKey = () => {
  const { id } = useParams();
  const [apiGetState] = useAxiosGet(
    `/v1/privatekeys/${id}`,
    'private_key',
    true
  );

  const [apiSendState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  // set dummy state prior to apiGet loading
  // only includes values that will be used in payload
  const dummyForm = {
    form: {
      name: '',
      description: '',
      api_key_disabled: false,
      api_key_via_url: false,
    },
    validationErrors: {},
  };

  const [formState, setFormState] = useState(dummyForm);

  // Function to set the form equal to the current API state
  const setFormToApi = useCallback(() => {
    setFormState({
      form: {
        name: apiGetState.private_key.name,
        description: apiGetState.private_key.description,
        api_key_disabled: apiGetState.private_key.api_key_disabled,
        api_key_via_url: apiGetState.private_key.api_key_via_url,
      },
      validationErrors: {},
    });
  }, [apiGetState]);

  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (apiGetState.isLoaded && !apiGetState.errorMessage) {
      setFormToApi();
    }
  }, [apiGetState, setFormToApi]);

  // data change handlers
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
  const downloadClickHandler = () => {
    if (apiGetState?.private_key?.name) {
      sendData(
        `/v1/privatekeys/${id}/download`,
        'GET',
        null,
        true,
        'blob'
      ).then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          downloadBlob(response);
        }
      });
    }
  };

  const resetClickHandler = (event) => {
    event.preventDefault();

    setFormToApi();
  };
  const cancelClickHandler = (event) => {
    event.preventDefault();

    navigate(-1);
  };

  // delete handlers
  const deleteClickHandler = () => {
    setDeleteOpen(true);
  };
  const deleteCancelHandler = () => {
    setDeleteOpen(false);
  };
  const deleteConfirmHandler = () => {
    setDeleteOpen(false);
    sendData(`/v1/privatekeys/${id}`, 'DELETE', null, true).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        navigate(-1);
      }
    });
  };

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    // client side validation
    let validationErrors = {};
    // check name
    if (!isNameValid(formState.form.name)) {
      validationErrors.name = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    // client side validation -- end

    sendData(`/v1/privatekeys/${id}`, 'PUT', formState.form, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          // back to the private keys page
          navigate('/privatekeys');
        }
      }
    );
  };

  // consts related to rendering
  const renderApiItems =
    apiGetState.isLoaded &&
    !apiGetState.errorMessage &&
    JSON.stringify(dummyForm.form) !== JSON.stringify(formState.form);

  const formUnchanged =
    apiGetState.private_key.name === formState.form.name &&
    apiGetState.private_key.description === formState.form.description &&
    apiGetState.private_key.api_key_disabled === formState.form.api_key_disabled &&
    apiGetState.private_key.api_key_via_url === formState.form.api_key_via_url;

  return (
    <FormContainer>
      <TitleBar title='Edit Private Key'>
        {renderApiItems && (
          <Button
            type='delete'
            onClick={deleteClickHandler}
            disabled={apiSendState.isSending}
          >
            Delete
          </Button>
        )}
      </TitleBar>

      {!apiGetState.isLoaded && <ApiLoading />}
      {apiGetState.errorMessage && (
        <ApiError>{apiGetState.errorMessage}</ApiError>
      )}

      {renderApiItems && (
        <>
          <DialogAlert
            title={`Are you sure you want to delete ${formState.form.name}?`}
            open={deleteOpen}
            onCancel={deleteCancelHandler}
            onConfirm={deleteConfirmHandler}
          >
            This action cannot be undone and the key will NOT be recoverable!{' '}
          </DialogAlert>

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

            <InputSelect
              label='Key Algorithm'
              id='algorithm_value'
              value={0}
              options={[
                { value: 0, name: apiGetState.private_key.algorithm.name },
              ]}
              disabled
            />

            <InputTextField
              label='API Key'
              id='api_key'
              value={apiGetState.private_key.api_key}
              readOnly
              disabled={apiGetState.private_key.api_key === '[redacted]'}
            />

            <FormRowRight>
              <Button
                onClick={downloadClickHandler}
                disabled={
                  apiSendState.isSending ||
                  apiGetState.private_key.api_key === '[redacted]'
                }
              >
                Download
              </Button>
            </FormRowRight>

            <InputCheckbox
              id='api_key_disabled'
              checked={formState.form.api_key_disabled}
              onChange={checkChangeHandler}
            >
              Disable API Key
            </InputCheckbox>

            <InputCheckbox
              id='api_key_via_url'
              checked={formState.form.api_key_via_url}
              onChange={checkChangeHandler}
            >
              Allow API Key via URL (for Legacy Clients)
            </InputCheckbox>

            {apiSendState.errorMessage &&
              Object.keys(formState.validationErrors).length <= 0 && (
                <FormError>
                  Error Sending -- {apiSendState.errorMessage}
                </FormError>
              )}

            <FormFooter
              createdAt={apiGetState.private_key.created_at}
              updatedAt={apiGetState.private_key.updated_at}
            >
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
        </>
      )}
    </FormContainer>
  );
};

export default EditOnePrivateKey;
