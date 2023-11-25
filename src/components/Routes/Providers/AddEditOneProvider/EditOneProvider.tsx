import { type FC, type FormEventHandler, type MouseEventHandler } from 'react';
import {
  type providerResponseType,
  parseProviderResponseType,
  type oneProviderDeleteResponseType,
  parseOneProviderDeleteResponse,
} from '../../../../types/api';
import { type providerFormStateType } from '../../../../types/frontend';

import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { showDebugInfo } from '../../../../helpers/environment';
import { inputHandlerFuncMaker } from '../../../../helpers/input-handler';
import { getProvider } from './providers';
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
import FormInfo from '../../../UI/FormMui/FormInfo';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const ONE_PROVIDER_URL = '/v1/app/challenges/providers/services';

const EditOneProvider: FC = () => {
  const { axiosSendState, apiCall } = useAxiosSend();
  const navigate = useNavigate();

  // get provider info
  const { id } = useParams();
  const thisProviderUrl = `${ONE_PROVIDER_URL}/${id}`;

  const { getState } = useAxiosGet<providerResponseType>(
    thisProviderUrl,
    parseProviderResponseType
  );

  // get provider type
  const provider = getProvider(getState.responseData?.provider.type || '');

  const makeStartingForm: () => providerFormStateType = useCallback(
    () => ({
      getResponseData: getState.responseData,
      getError: getState.error,
      provider_type_value: getState.responseData?.provider.type || '',
      provider_options: provider.providerOptionsForEdit
        ? provider.providerOptionsForEdit(
            getState.responseData?.provider.config
          )
        : undefined,
      dataToSubmit: getState.responseData?.provider.config || { domains: [''] },
      sendError: undefined,
      validationErrors: {},
    }),
    [getState, provider]
  );
  const [formState, setFormState] = useState<providerFormStateType>(
    makeStartingForm()
  );

  // reload starting form after GET loads
  useEffect(() => {
    setFormState(makeStartingForm());
  }, [makeStartingForm, setFormState]);

  // data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

  // delete handlers
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteConfirmHandler: MouseEventHandler = () => {
    setDeleteOpen(false);
    apiCall<oneProviderDeleteResponseType>(
      'DELETE',
      thisProviderUrl,
      { tag: formState.getResponseData?.provider.tag },
      parseOneProviderDeleteResponse
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate('/providers');
      } else {
        // failed, set error
        setFormState((prevState) => ({
          ...prevState,
          sendError: error,
        }));
      }
    });
  };

  // form submit
  const submitFormHandler: FormEventHandler = (event) => {
    event.preventDefault();

    // form provider type specific validation
    const validationErrors = provider.validationFunc(formState);

    // common domain validation
    // if singular wildcard domain, allow as this is wildcard provider
    if (
      JSON.stringify(formState.dataToSubmit['domains']) != JSON.stringify(['*'])
    ) {
      formState.dataToSubmit['domains'].forEach((domain, i) => {
        if (!isDomainValid(domain)) {
          validationErrors['dataToSubmit.domains.' + i] = true;
        }
      });
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    // client side validation -- end

    // submit to backend
    apiCall<providerResponseType>(
      'PUT',
      thisProviderUrl,
      {
        tag: formState.getResponseData?.provider.tag,
        [provider.configName]: formState.dataToSubmit,
      },
      parseProviderResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate('/providers');
      } else {
        // failed, set error
        setFormState((prevState) => ({
          ...prevState,
          sendError: error,
        }));
      }
    });
  };

  return (
    <FormContainer>
      <TitleBar title='Edit Challenge Provider'>
        {formState.getResponseData && (
          <Button
            color='error'
            onClick={() => setDeleteOpen(true)}
            disabled={axiosSendState.isSending}
          >
            Delete
          </Button>
        )}
      </TitleBar>

      {!formState.getResponseData && !formState.getError && <ApiLoading />}

      {formState.getError && (
        <ApiError
          statusCode={formState.getError.statusCode}
          message={formState.getError.message}
        />
      )}

      {formState.getResponseData && (
        <>
          <DialogAlert
            title={`Are you sure you want to delete provider ${
              formState.getResponseData.provider.type
            }${
              showDebugInfo
                ? ' (id:' + formState.getResponseData.provider.id + ') '
                : ''
            }?`}
            open={deleteOpen}
            onCancel={() => {
              setDeleteOpen(false);
            }}
            onConfirm={deleteConfirmHandler}
          >
            The following domain(s) will become unavilable for challenge solving
            unless there is a wilcard provider and it supports them.
            <br />
            {formState.getResponseData.provider.config.domains.join(', ')}
          </DialogAlert>

          <Form onSubmit={submitFormHandler}>
            <InputSelect
              id='provider_type_value'
              label='Provider Type'
              options={[
                {
                  value: 0,
                  name: provider.name,
                },
              ]}
              value={0}
              disabled
            />

            <FormInfo>
              Either list the domains you want this provider to be used for or
              list a single domain with the value of an asterisk (*) to use this
              provider as a catch-all (wildcard). Only one provider can be a
              wildcard provider and LeGo uses it for any domain not explicitly
              listed in another provider.
            </FormInfo>

            <InputArrayText
              id='dataToSubmit.domains'
              label='Domains'
              subLabel='Domain'
              minElements={1}
              value={formState.dataToSubmit.domains}
              onChange={inputChangeHandler}
              validationErrors={formState.validationErrors}
            />

            <provider.FormComponent
              formState={formState}
              onChange={inputChangeHandler}
            />

            {formState.sendError &&
              Object.keys(formState.validationErrors).length <= 0 && (
                <ApiError
                  statusCode={formState.sendError.statusCode}
                  message={formState.sendError.message}
                />
              )}

            <FormFooter
              cancelHref='/providers'
              resetOnClick={() => {
                setFormState(makeStartingForm());
              }}
              disabledAllButtons={axiosSendState.isSending}
              disabledResetButton={
                JSON.stringify(formState.dataToSubmit) ===
                JSON.stringify(formState.getResponseData.provider.config)
              }
            />
          </Form>
        </>
      )}
    </FormContainer>
  );
};

export default EditOneProvider;
