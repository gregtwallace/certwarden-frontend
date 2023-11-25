import { type FC, type FormEventHandler } from 'react';
import {
  type objectWithApiKeysType,
  parseObjectWithApiKeysResponse,
} from '../../../types/api';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../types/frontend';

import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxiosGet from '../../../hooks/useAxiosGet';
import useAxiosSend from '../../../hooks/useAxiosSend';
import { inputHandlerFuncMaker } from '../../../helpers/input-handler';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import Form from '../../UI/FormMui/Form';
import FormContainer from '../../UI/FormMui/FormContainer';
import FormFooter from '../../UI/FormMui/FormFooter';
import FormInfo from '../../UI/FormMui/FormInfo';
import InputTextField from '../../UI/FormMui/InputTextField';
import TitleBar from '../../UI/TitleBar/TitleBar';

// form shape
type formObj = {
  getResponseData: objectWithApiKeysType | undefined;
  getError: frontendErrorType | undefined;
  dataToSubmit: {
    api_key: string;
    api_key_new: string;
  };
  sendError: frontendErrorType | undefined;
  validationErrors: validationErrorsType;
};

type propTypes = {
  objectType: 'privatekeys' | 'certificates';
};

const EditAPIKeysPage: FC<propTypes> = (props) => {
  const { objectType } = props;

  const { id } = useParams();
  const { getState } = useAxiosGet<objectWithApiKeysType>(
    `/v1/${objectType}/${id}`,
    parseObjectWithApiKeysResponse
  );

  const { axiosSendState, apiCall } = useAxiosSend();
  const navigate = useNavigate();

  // initialForm uses the key response to create a starting form object
  const initialForm = useCallback(
    (
      responseData: objectWithApiKeysType | undefined,
      error: frontendErrorType | undefined
    ) => ({
      getResponseData: responseData,
      getError: error,
      dataToSubmit: {
        api_key: responseData?.api_key || '',
        api_key_new: responseData?.api_key_new || '',
      },
      sendError: undefined,
      validationErrors: {},
    }),
    []
  );
  const [formState, setFormState] = useState<formObj>(
    initialForm(undefined, undefined)
  );

  // set initial form after api loads
  useEffect(() => {
    setFormState(initialForm(getState.responseData, getState.error));
  }, [getState, setFormState, initialForm]);

  // data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

  // form submission handler
  const submitFormHandler: FormEventHandler = (event) => {
    event.preventDefault();

    // client side validation
    const validationErrors: validationErrorsType = {};

    // API Key
    if (formState.dataToSubmit.api_key.length < 10) {
      validationErrors['dataToSubmit.api_key'] = true;
    }
    // API Key (New) (AKA #2)
    if (
      formState.dataToSubmit.api_key_new.length !== 0 &&
      formState.dataToSubmit.api_key_new.length < 10
    ) {
      validationErrors['dataToSubmit.api_key_new'] = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    // client side validation -- end

    apiCall<objectWithApiKeysType>(
      'PUT',
      `/v1/${objectType}/${id}`,
      formState.dataToSubmit,
      parseObjectWithApiKeysResponse
    ).then(({ responseData, error }) => {
      if (responseData) {
        navigate(`/${objectType}/${id}`);
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
      <TitleBar title='Manually Change API Key(s)' />

      {!formState.getResponseData && !formState.getError && <ApiLoading />}

      {formState.getError && (
        <ApiError
          statusCode={formState.getError.statusCode}
          message={formState.getError.message}
        />
      )}

      {formState.getResponseData && (
        <Form onSubmit={submitFormHandler}>
          <FormInfo color='error.main'>
            Do not manually edit the API Keys unless you have a specific need.
            Use the &quot;New&quot; and &quot;Retire&quot; buttons on the
            previous page instead, as these generate cryptographically random
            API keys.
          </FormInfo>

          <FormInfo>
            Keys should be generated securely to avoid breaches and must be at
            least 10 characters in length, though practically you should make
            them longer.
          </FormInfo>

          <InputTextField
            id='getResponseData.name'
            label='Name'
            value={formState.getResponseData.name}
            disabled
          />

          <InputTextField
            id='getResponseData.description'
            label='Description'
            value={
              formState.getResponseData.description !== ''
                ? formState.getResponseData.description
                : 'None'
            }
            disabled
          />

          <FormInfo>
            API Key 1 corresponds to the &apos;Old&apos; API Key. It must be
            populated.
          </FormInfo>

          <InputTextField
            id='dataToSubmit.api_key'
            label='API Key 1'
            value={formState.dataToSubmit.api_key}
            onChange={inputChangeHandler}
            error={formState.validationErrors['dataToSubmit.api_key']}
          />

          <FormInfo>
            API Key 2 corresponds to the &apos;New&apos; API Key. It may be
            blank in which case only API Key 1 will be used.
          </FormInfo>

          <InputTextField
            id='dataToSubmit.api_key_new'
            label='API Key 2'
            value={formState.dataToSubmit.api_key_new}
            onChange={inputChangeHandler}
            error={formState.validationErrors['dataToSubmit.api_key_new']}
          />

          {formState.sendError &&
            Object.keys(formState.validationErrors).length <= 0 && (
              <ApiError
                statusCode={formState.sendError.statusCode}
                message={formState.sendError.message}
              />
            )}

          <FormFooter
            cancelHref={`/${objectType}/${id}`}
            resetOnClick={() =>
              setFormState((prevState) =>
                initialForm(prevState.getResponseData, prevState.getError)
              )
            }
            disabledAllButtons={axiosSendState.isSending}
            disabledResetButton={
              JSON.stringify(formState.dataToSubmit) ===
              JSON.stringify(
                initialForm(formState.getResponseData, formState.getError)
                  .dataToSubmit
              )
            }
          />
        </Form>
      )}
    </FormContainer>
  );
};

export default EditAPIKeysPage;
