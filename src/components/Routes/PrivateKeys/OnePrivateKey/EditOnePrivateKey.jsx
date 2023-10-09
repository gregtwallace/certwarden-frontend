import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { formChangeHandlerFunc } from '../../../../helpers/input-handler';
import { isNameValid } from '../../../../helpers/form-validation';
import { downloadBlob } from '../../../../helpers/download';

import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import Button from '../../../UI/Button/Button';
import DialogAlert from '../../../UI/Dialog/DialogAlert';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormFooter from '../../../UI/FormMui/FormFooter';
import FormRowRight from '../../../UI/FormMui/FormRowRight';
import InputCheckbox from '../../../UI/FormMui/InputCheckbox';
import InputSelect from '../../../UI/FormMui/InputSelect';
import InputTextField from '../../../UI/FormMui/InputTextField';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const EditOnePrivateKey = () => {
  const { id } = useParams();
  const [apiGetState, updateGet] = useAxiosGet(
    `/v1/privatekeys/${id}`,
    'private_key',
    true
  );

  const [apiSendState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({});

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

  useEffect(() => {
    if (apiGetState.isLoaded && !apiGetState.errorMessage) {
      setFormToApi();
    }
  }, [apiGetState, setFormToApi]);

  // data change handler
  const inputChangeHandler = formChangeHandlerFunc(setFormState);

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

  const newApiKeyClickHandler = () => {
    sendData(`/v1/privatekeys/${id}/apikey`, 'POST', null, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          // reload key state
          updateGet();
        }
      }
    );
  };

  const retireApiKeyClickHandler = () => {
    sendData(`/v1/privatekeys/${id}/apikey`, 'DELETE', null, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          // reload key state
          updateGet();
        }
      }
    );
  };

  // delete handlers
  const [deleteOpen, setDeleteOpen] = useState(false);
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
        navigate('/privatekeys');
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
  // don't render if not loaded, error, or formState not yet set
  // formState set is needed to prevent animations of form fields
  // populating (when previously using a blank form object) or invalid
  // references to formState.form now that blank form object is gone
  const renderApiItems =
    apiGetState.isLoaded &&
    !apiGetState.errorMessage &&
    JSON.stringify({}) !== JSON.stringify(formState);

  var formUnchanged = true;
  if (renderApiItems) {
    formUnchanged =
      apiGetState.private_key.name === formState.form.name &&
      apiGetState.private_key.description === formState.form.description &&
      apiGetState.private_key.api_key_disabled ===
        formState.form.api_key_disabled &&
      apiGetState.private_key.api_key_via_url ===
        formState.form.api_key_via_url;
  }

  return (
    <FormContainer>
      <TitleBar title='Edit Private Key'>
        {renderApiItems && (
          <>
            <Button
              onClick={downloadClickHandler}
              disabled={
                apiSendState.isSending ||
                apiGetState.private_key.api_key === '[redacted]'
              }
            >
              Download Key
            </Button>
            <Button
              type='delete'
              onClick={deleteClickHandler}
              disabled={apiSendState.isSending}
            >
              Delete
            </Button>
          </>
        )}
      </TitleBar>

      {!apiGetState.isLoaded && <ApiLoading />}
      {apiGetState.errorMessage && (
        <ApiError
          code={apiGetState.errorCode}
          message={apiGetState.errorMessage}
        />
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
              id='form.name'
              value={formState.form.name}
              onChange={inputChangeHandler}
              error={formState.validationErrors.name && true}
            />

            <InputTextField
              label='Description'
              id='form.description'
              value={formState.form.description}
              onChange={inputChangeHandler}
            />

            <InputSelect
              label='Key Algorithm'
              id='form.algorithm_value'
              value={0}
              options={[
                { value: 0, name: apiGetState.private_key.algorithm.name },
              ]}
              disabled
            />

            <InputTextField
              label={
                (apiGetState.private_key.api_key_new ? 'Old ' : '') + 'API Key'
              }
              id='form.api_key'
              value={apiGetState.private_key.api_key}
              readOnly
              disabled={apiGetState.private_key.api_key === '[redacted]'}
            />

            <FormRowRight>
              <Button
                href={`/privatekeys/${id}/apikeys`}
                type='manually_edit'
                disabled={
                  apiSendState.isSending ||
                  apiGetState.private_key.api_key === '[redacted]'
                }
              >
                Edit API Keys
              </Button>

              {apiGetState.private_key.api_key_new ? (
                <Button
                  onClick={retireApiKeyClickHandler}
                  disabled={
                    apiSendState.isSending ||
                    apiGetState.private_key.api_key === '[redacted]'
                  }
                >
                  Retire Old API Key
                </Button>
              ) : (
                <Button
                  onClick={newApiKeyClickHandler}
                  disabled={
                    apiSendState.isSending ||
                    apiGetState.private_key.api_key === '[redacted]'
                  }
                >
                  New API Key
                </Button>
              )}
            </FormRowRight>

            {apiGetState.private_key.api_key_new && (
              <InputTextField
                label='New API Key'
                id='form.api_key_new'
                value={apiGetState.private_key.api_key_new}
                readOnly
                disabled={apiGetState.private_key.api_key === '[redacted]'}
              />
            )}

            <InputCheckbox
              id='form.api_key_disabled'
              checked={formState.form.api_key_disabled}
              onChange={(event) => inputChangeHandler(event, 'checkbox')}
            >
              Disable API Key
            </InputCheckbox>

            <InputCheckbox
              id='form.api_key_via_url'
              checked={formState.form.api_key_via_url}
              onChange={(event) => inputChangeHandler(event, 'checkbox')}
            >
              Allow API Key via URL (for Legacy Clients)
            </InputCheckbox>

            {apiSendState.errorMessage &&
              Object.keys(formState.validationErrors).length <= 0 && (
                <ApiError
                  code={apiSendState.errorCode}
                  message={apiSendState.errorMessage}
                />
              )}

            <FormFooter
              createdAt={apiGetState.private_key.created_at}
              updatedAt={apiGetState.private_key.updated_at}
            >
              <Button
                type='cancel'
                href='/privatekeys'
                disabled={apiSendState.isSending}
              >
                Cancel
              </Button>
              <Button
                type='reset'
                onClick={() => setFormToApi()}
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
