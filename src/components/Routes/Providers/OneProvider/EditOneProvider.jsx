import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { devMode } from '../../../../helpers/environment';
import { providerTypes } from './provider-types';

import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import Button from '../../../UI/Button/Button';
import DialogAlert from '../../../UI/Dialog/DialogAlert';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import FormFooter from '../../../UI/FormMui/FormFooter';
import TitleBar from '../../../UI/TitleBar/TitleBar';

// empty component to use if form component is undefined
const DummyComponent = () => <></>;

const EditOneProvider = () => {
  const navigate = useNavigate();

  // id from router path
  const { id } = useParams();

  // get provider info
  const [apiGetState] = useAxiosGet(
    `/v1/app/challenges/providers/services/${id}`,
    'provider',
    true
  );

  // form state will be set by the child edit provider component
  // for a specific provider
  const [formState, setFormState] = useState({});

  // sender
  const [apiSendState, sendData] = useAxiosSend();

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

  // get correct edit component and config name
  const providerType = providerTypes.find((obj) => {
    return obj.value === apiGetState?.provider?.type;
  });
  var ProviderFormComponent = providerType?.editComponent;
  const providerConfigName = providerType?.config_name;

  // prevent undefined error
  if (ProviderFormComponent == undefined) {
    ProviderFormComponent = DummyComponent;
  }

  // form submit
  const submitFormHandler = (event) => {
    event.preventDefault();

    // client side validation
    let validationErrors = {};

    // TODO

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
        [providerConfigName]: { ...formState.form },
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

  // reset to original form
  const resetForm = () => {
    setFormState((prevState) => ({
      form: prevState.formOriginal,
      formOriginal: prevState.formOriginal,
      changed: false,
      validationErrors: {},
    }));
  };

  // check if should render
  const renderApiItems = apiGetState.isLoaded && !apiGetState.errorMessage;

  return (
    <FormContainer>
      <TitleBar title='Edit Challenge Provider'>
        {renderApiItems && (
          <>
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
            <ProviderFormComponent
              apiGetState={apiGetState}
              formState={formState}
              setFormState={setFormState}
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
                href='/privatekeys'
                disabled={apiSendState.isSending}
              >
                Cancel
              </Button>
              <Button
                type='reset'
                onClick={resetForm}
                disabled={apiSendState.isSending || !formState.changed}
              >
                Reset
              </Button>
              <Button
                type='submit'
                disabled={apiSendState.isSending || !formState.changed}
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
