import { type FC, type FormEventHandler } from 'react';
import {
  type postAsGetResponseType,
  parsePostAsGetResponseType,
} from '../../../../../types/api';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../../../types/frontend';

import { useState } from 'react';
import { useParams } from 'react-router-dom';

import useAxiosSend from '../../../../../hooks/useAxiosSend';
import { inputHandlerFuncMaker } from '../../../../../helpers/input-handler';
import { isHttpsUrlValid } from '../../../../../helpers/form-validation';

import { Paper, TextField } from '@mui/material';

import ApiError from '../../../../UI/Api/ApiError';
import Form from '../../../../UI/FormMui/Form';
import FormContainer from '../../../../UI/FormMui/FormContainer';
import FormFooter from '../../../../UI/FormMui/FormFooter';
import InputTextField from '../../../../UI/FormMui/InputTextField';
import TitleBar from '../../../../UI/TitleBar/TitleBar';

// form shape
type formObj = {
  dataToSubmit: {
    url: string;
  };
  sendResult: postAsGetResponseType | undefined;
  sendError: frontendErrorType | undefined;
  validationErrors: validationErrorsType;
};

const PostAsGet: FC = () => {
  const { id } = useParams();
  const thisPostAsGetUrl = `/v1/acmeaccounts/${id}/post-as-get`;

  const { axiosSendState, apiCall } = useAxiosSend();

  const [formState, setFormState] = useState<formObj>({
    dataToSubmit: {
      url: '',
    },
    sendResult: undefined,
    sendError: undefined,
    validationErrors: {},
  });

  // data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

  // form submission handler
  const submitFormHandler: FormEventHandler = (event) => {
    event.preventDefault();

    // client side validation
    const validationErrors: validationErrorsType = {};

    // url
    if (!isHttpsUrlValid(formState.dataToSubmit.url)) {
      validationErrors['dataToSubmit.url'] = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    // client side validation -- end

    apiCall<postAsGetResponseType>(
      'POST',
      thisPostAsGetUrl,
      formState.dataToSubmit,
      parsePostAsGetResponseType
    ).then(({ responseData, error }) => {
      if (responseData) {
        setFormState((prevState) => ({
          ...prevState,
          sendResult: responseData,
          sendError: undefined,
        }));
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
    <>
      <FormContainer>
        <TitleBar title='Post-As-Get' />
        <Form onSubmit={submitFormHandler}>
          <InputTextField
            id='dataToSubmit.url'
            label='URL to PaG'
            value={formState.dataToSubmit.url}
            onChange={inputChangeHandler}
            error={formState.validationErrors['dataToSubmit.url']}
          />

          {formState.sendError &&
            Object.keys(formState.validationErrors).length <= 0 && (
              <ApiError
                statusCode={formState.sendError.statusCode}
                message={formState.sendError.message}
              />
            )}

          <FormFooter
            cancelHref={`/acmeaccounts/${id}`}
            disabledAllButtons={axiosSendState.isSending}
          />
        </Form>
      </FormContainer>

      {formState.sendResult !== undefined && (
        <Paper
          sx={{
            minHeight: 0,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 1,
          }}
        >
          <TitleBar title='Result' />

          <InputTextField
            id='sendResult.url'
            label='URL'
            value={formState.sendResult.url}
            disabled
          />

          <TextField
            id='sendResult.body'
            label='Response Body Content'
            variant='standard'
            value={formState.sendResult.body}
            sx={{ my: 2 }}
            multiline
            InputProps={{
              disableUnderline: true,
              style: {
                fontFamily: 'Monospace',
                fontSize: 14,
              },
            }}
          />

          <TextField
            id='sendResult.headers'
            label='Response Headers'
            variant='standard'
            value={JSON.stringify(formState.sendResult.headers, null, '\t')}
            sx={{ my: 2 }}
            multiline
            InputProps={{
              disableUnderline: true,
              style: {
                fontFamily: 'Monospace',
                fontSize: 14,
              },
            }}
          />
        </Paper>
      )}
    </>
  );
};

export default PostAsGet;
