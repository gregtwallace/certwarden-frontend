import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { devMode } from '../../../../helpers/environment';
import { formChangeHandlerFunc } from '../../../../helpers/input-handler';
import { getProvider } from './provider-types';
import { isDomainValid } from '../../../../helpers/form-validation';

import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import Button from '../../../UI/Button/Button';
import DialogAlert from '../../../UI/Dialog/DialogAlert';
import Form from '../../../UI/FormMui/Form';
import InputSelect from '../../../UI/FormMui/InputSelect';
import InputArrayText from '../../../UI/FormMui/InputArrayText';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormFooter from '../../../UI/FormMui/FormFooter';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const EditOneProvider = () => {
  const [apiSendState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  // id from router path
  const { id } = useParams();

  // get provider info
  const [apiGetState] = useAxiosGet(
    `/v1/app/challenges/providers/services/${id}`,
    'provider',
    true
  );

  // get provider type
  const provider = getProvider(apiGetState.provider.type);

  // Form state
  const [formState, setFormState] = useState({});
  const setFormToApi = useCallback(() => {
    setFormState({
      provider_type_value: provider.value,
      provider_options: provider?.setProviderOptionsForEdit
        ? provider.setProviderOptionsForEdit(apiGetState.provider.config)
        : {},
      form: apiGetState.provider.config,
      validationErrors: {},
    });
  }, [apiGetState, provider]);

  useEffect(() => {
    if (apiGetState.isLoaded && !apiGetState.errorMessage) {
      setFormToApi();
    }
  }, [apiGetState, setFormToApi]);

  // data change handler
  const inputChangeHandler = formChangeHandlerFunc(setFormState);

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
    sendData(
      `/v1/app/challenges/providers/services/${id}`,
      'DELETE',
      { tag: apiGetState.provider.tag },
      true
    ).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        navigate('/providers');
      }
    });
  };

  // form submit
  const submitFormHandler = (event) => {
    event.preventDefault();

    // form provider type specific validation
    let validationErrors = provider.validationFunc(formState);

    // common domain validation
    let domains = [];
    // if singular wildcard domain, allow as this is wildcard provider
    if (JSON.stringify(formState.form.domains) != JSON.stringify(['*'])) {
      formState.form.domains.forEach((domain, i) => {
        if (!isDomainValid(domain, false)) {
          domains.push(i);
        }
      });
      // if any domain invalid, create the error array
      if (domains.length !== 0) {
        validationErrors.domains = domains;
      }
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    // client side validation -- end

    // submit to backend
    sendData(
      `/v1/app/challenges/providers/services/${id}`,
      'PUT',
      {
        [provider.configName]: formState.form,
        tag: apiGetState.provider.tag,
      },
      true
    ).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        // back to the private keys page
        navigate('/providers');
      }
    });
  };

  // check if should render
  const renderApiItems =
    apiGetState.isLoaded &&
    !apiGetState.errorMessage &&
    JSON.stringify({}) !== JSON.stringify(formState);

  let formUnchanged = true;
  if (renderApiItems) {
    formUnchanged =
      JSON.stringify(apiGetState.provider.config) ===
      JSON.stringify(formState.form);
  }

  return (
    <FormContainer>
      <TitleBar title='Edit Challenge Provider'>
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
        <ApiError
          code={apiGetState.errorCode}
          message={apiGetState.errorMessage}
        />
      )}

      {renderApiItems && (
        <>
          <DialogAlert
            title={`Are you sure you want to delete provider ${
              apiGetState.provider.type
            }${devMode ? ' (id:' + apiGetState.provider.id + ') ' : ''}?`}
            open={deleteOpen}
            onCancel={deleteCancelHandler}
            onConfirm={deleteConfirmHandler}
          >
            The following domains will become unavilable for challenge solving
            unless there is a wilcard provider and it supports them.
            <br />
            {apiGetState.provider.config.domains.join(', ')}
          </DialogAlert>

          <Form onSubmit={submitFormHandler}>
            <InputSelect
              id='provider_type_value'
              label='Provider Type'
              value={0}
              options={[
                {
                  value: 0,
                  name: provider.name,
                },
              ]}
              disabled
            />

            <InputArrayText
              id='form.domains'
              label='Domains'
              subLabel='Domain'
              minElements={1}
              value={formState.form.domains}
              onChange={inputChangeHandler}
              error={formState.validationErrors.domains}
            />

            <provider.FormComponent
              formState={formState}
              onChange={inputChangeHandler}
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

export default EditOneProvider;
