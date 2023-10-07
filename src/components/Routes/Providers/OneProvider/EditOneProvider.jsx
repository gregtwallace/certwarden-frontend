import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { devMode } from '../../../../helpers/environment';
import { formChangeHandlerFunc } from '../../../../helpers/input-handler';
import { providerTypes } from './provider-types';

import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import Button from '../../../UI/Button/Button';
import DialogAlert from '../../../UI/Dialog/DialogAlert';
import Form from '../../../UI/FormMui/Form';
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

  // provider and form state
  const [formState, setFormState] = useState({});

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

  // set initial form state from api get
  const setInitialFormState = useCallback(() => {
    if (apiGetState.isLoaded && !apiGetState.errorMessage) {
      // get provider
      var providerType = providerTypes.find((obj) => {
        return obj.value === apiGetState.provider.type;
      });

      setFormState({
        form: apiGetState.provider.config,
        providerType: providerType,
        validationErrors: {},
      });
    }
  }, [apiGetState, setFormState]);

  // set initial form on load
  useEffect(() => {
    setInitialFormState();
  }, [setInitialFormState]);

  // reset form fields
  const resetForm = () => {
    setInitialFormState();
  };

  // input handlers
  const formStateChangeHandler = formChangeHandlerFunc(setFormState);

  // form submit
  const submitFormHandler = (event) => {
    event.preventDefault();

    // client side validation
    const validationErrors = formState.providerType.validationErrorsFunc(
      formState.form
    );

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
        [formState.providerType.config_name]: { ...formState.form },
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

  var formUnchanged = true;
  if (renderApiItems) {
    formUnchanged =
      JSON.stringify(apiGetState.provider.config) ===
      JSON.stringify(formState.form);
  }

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
            <formState.providerType.FormComponent
              formState={formState}
              onChange={formStateChangeHandler}
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
                onClick={resetForm}
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
