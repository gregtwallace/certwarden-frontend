import { type FC, type FormEventHandler, type MouseEventHandler } from 'react';
import {
  type providerResponseType,
  parseProviderResponseType,
  type oneProviderDeleteResponseType,
  parseOneProviderDeleteResponse,
} from '../../../../../types/api';
import { type providerFormStateType } from '../../../../../types/frontend';

import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

import useAxiosGet from '../../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../../hooks/useAxiosSend';
import useClientSettings from '../../../../../hooks/useClientSettings';
import { inputHandlerFuncMaker } from '../../../../../helpers/input-handler';
import { getProvider } from './providers';
import { isDomainValid } from '../../../../../helpers/form-validation';

import ApiError from '../../../../UI/Api/ApiError';
import ApiLoading from '../../../../UI/Api/ApiLoading';
import Button from '../../../../UI/Button/Button';
import DialogAlert from '../../../../UI/Dialog/DialogAlert';
import Form from '../../../../UI/FormMui/Form';
import InputArrayText from '../../../../UI/FormMui/InputArrayText';
import InputSelect from '../../../../UI/FormMui/InputSelect';
import InputTextField from '../../../../UI/FormMui/InputTextField';
import FormContainer from '../../../../UI/FormMui/FormContainer';
import FormFooter from '../../../../UI/FormMui/FormFooter';
import TitleBar from '../../../../UI/TitleBar/TitleBar';

const ONE_PROVIDER_URL = '/v1/app/challenges/providers/services';

const EditOneProvider: FC = () => {
  // get provider info
  const { id } = useParams();
  if (!id) {
    throw new Error('id is invalid');
  }

  // debug?
  const { showDebugInfo } = useClientSettings();

  const { axiosSendState, apiCall } = useAxiosSend();
  const navigate = useNavigate();

  const thisProviderUrl = `${ONE_PROVIDER_URL}/${id}`;

  const { getState } = useAxiosGet<providerResponseType>(
    thisProviderUrl,
    parseProviderResponseType
  );

  // get provider type
  const provider = getProvider(getState.responseData?.provider.type ?? '');

  const makeStartingForm: () => providerFormStateType = useCallback(
    () => ({
      getResponseData: getState.responseData,
      getError: getState.error,
      provider_type_value: getState.responseData?.provider.type ?? '',
      provider_options: provider.providerOptionsForEdit
        ? provider.providerOptionsForEdit(
            getState.responseData?.provider.config
          )
        : undefined,
      dataToSubmit: {
        domains: getState.responseData?.provider.domains ?? [''],
        post_resource_provision_wait: getState.responseData?.provider.post_resource_provision_wait ?? 0,
      },
      configToSubmit: getState.responseData?.provider.config ?? {},
      sendError: undefined,
      validationErrors: {},
    }),
    [getState, provider]
  );
  const [formState, setFormState] =
    useState<providerFormStateType>(makeStartingForm());

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
        navigate('/challenges/providers');
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
      JSON.stringify(formState.dataToSubmit.domains) != JSON.stringify(['*'])
    ) {
      formState.dataToSubmit.domains.forEach((domain, i) => {
        if (!isDomainValid(domain, false)) {
          validationErrors['dataToSubmit.domains.' + i.toString()] = true;
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
        ...formState.dataToSubmit,
        tag: formState.getResponseData?.provider.tag,
        [provider.configName]: formState.configToSubmit,
      },
      parseProviderResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate('/challenges/providers');
      } else {
        // failed, set error
        setFormState((prevState) => ({
          ...prevState,
          sendError: error,
        }));
      }
    });
  };

  // generate delete dialog text
  let deleteText = 'Domain';
  if (formState.getResponseData) {
    // make code a little easier to read
    const domains = formState.getResponseData.provider.domains;

    // only one domain
    if (domains.length == 1) {
      if (!domains[0]) {
        throw new Error('invalid domain 0');
      }
      deleteText += ' ' + domains[0];
    } else if (domains.length > 1) {
      // more than one domain
      const lastDomain = domains[domains.length - 1];
      if (!lastDomain) {
        throw new Error('invalid domain 0');
      }

      // comma only used when >2 domains
      deleteText +=
        's ' +
        domains.slice(0, -1).join(', ') +
        (domains.length > 2 ? ',' : '') +
        ' and ' +
        lastDomain;
    }
  }
  deleteText +=
    ' will become unavailable for challenge solving unless there is a wildcard provider.';

  return (
    <FormContainer>
      <TitleBar title='Edit Challenge Provider' helpURL={provider.helpUrl}>
        {formState.getResponseData && (
          <Button
            color='error'
            onClick={() => {
              setDeleteOpen(true);
            }}
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
                ? ' (id:' +
                  formState.getResponseData.provider.id.toString() +
                  ') '
                : ''
            }?`}
            contentText={deleteText}
            open={deleteOpen}
            onCancel={() => {
              setDeleteOpen(false);
            }}
            onConfirm={deleteConfirmHandler}
          />

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

            <InputArrayText
              id='dataToSubmit.domains'
              label='Domains'
              subLabel='Domain'
              minElements={1}
              value={formState.dataToSubmit.domains}
              onChange={inputChangeHandler}
              validationErrors={formState.validationErrors}
              helpURL='https://www.certwarden.com/docs/user_interface/providers/#domains'
            />

            <InputTextField
              id='dataToSubmit.post_resource_provision_wait'
              label='Post Provision Wait (Seconds)'
              value={formState.dataToSubmit.post_resource_provision_wait}
              onChange={inputChangeHandler}
              error={formState.validationErrors['dataToSubmit.post_resource_provision_wait']}
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
              cancelHref='/challenges/providers'
              resetOnClick={() => {
                setFormState(makeStartingForm());
              }}
              disabledAllButtons={axiosSendState.isSending}
              disabledResetButton={
                JSON.stringify(formState.dataToSubmit.domains) ===
                  JSON.stringify(formState.getResponseData.provider.domains) &&
                JSON.stringify(formState.configToSubmit) ===
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
