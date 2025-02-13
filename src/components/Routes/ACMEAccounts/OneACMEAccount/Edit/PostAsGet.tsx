import { type FC, type FormEventHandler } from 'react';
import {
  type acmeAccountsResponseType,
  parseAcmeAccountsResponseType,
  type postAsGetResponseType,
  parsePostAsGetResponseType,
} from '../../../../../types/api';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../../../types/frontend';
import { selectInputOption } from '../../../../../helpers/input-handler';

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import useAxiosGet from '../../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../../hooks/useAxiosSend';
import {
  inputHandlerFuncMaker,
  inputHandlerFuncType,
} from '../../../../../helpers/input-handler';
import { isHttpsUrlValid } from '../../../../../helpers/form-validation';
import {
  type acmeAccount,
  buildAcmeAccountOptions,
} from '../../../../../helpers/options_builders';

import { Paper, TextField } from '@mui/material';

import ApiError from '../../../../UI/Api/ApiError';
import ApiLoading from '../../../../UI/Api/ApiLoading';
import Form from '../../../../UI/FormMui/Form';
import FormContainer from '../../../../UI/FormMui/FormContainer';
import FormFooter from '../../../../UI/FormMui/FormFooter';
import InputSelect from '../../../../UI/FormMui/InputSelect';
import InputTextField from '../../../../UI/FormMui/InputTextField';
import TitleBar from '../../../../UI/TitleBar/TitleBar';

const ACME_ACCOUNTS_URL = '/v1/acmeaccounts';

// form shape
type formObj = {
  dataToSubmit: {
    url: string;
  };
  dontSubmit: {
    acme_account_id: number;
  };
  sendResult: postAsGetResponseType | undefined;
  sendError: frontendErrorType | undefined;
  validationErrors: validationErrorsType;
};

const PostAsGet: FC = () => {
  const { id } = useParams();
  if (!id) {
    throw new Error('id is invalid');
  }

  const navigate = useNavigate();

  const { getState } = useAxiosGet<acmeAccountsResponseType>(
    ACME_ACCOUNTS_URL,
    parseAcmeAccountsResponseType
  );

  const { axiosSendState, apiCall } = useAxiosSend();

  const [formState, setFormState] = useState<formObj>({
    dataToSubmit: {
      url: '',
    },
    dontSubmit: {
      acme_account_id: Number(id),
    },
    sendResult: undefined,
    sendError: undefined,
    validationErrors: {},
  });

  // data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

  // data change handler for account selection (special to update url)
  const inputAcctSelectChangeHandler: inputHandlerFuncType = (
    event,
    convertValueTo
  ) => {
    // this should not be necessary
    if (typeof event.target.value !== 'number') {
      throw new Error('pag account select value not a number');
    }

    navigate(`/acmeaccounts/${event.target.value.toString()}/post-as-get`);
    inputChangeHandler(event, convertValueTo);
  };

  // build account options
  let acctOptions: selectInputOption<number>[] = [];
  if (getState.responseData?.acme_accounts) {
    acctOptions = buildAcmeAccountOptions(
      getState.responseData.acme_accounts,
      // filter out accounts that aren't valid or don't have a kid
      (acct: acmeAccount) => {
        return acct.status === 'valid' && acct.kid !== '';
      }
    );
  }

  // if page is loaded and the account # is not acceptable, redirect
  if (getState.responseData?.acme_accounts) {
    // returns -1 if not found
    const acctIndx = acctOptions.findIndex((value) => {
      return value.value === Number(id);
    });
    if (acctIndx < 0) {
      navigate('/acmeaccounts');
    }
  }

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
      `/v1/acmeaccounts/${formState.dontSubmit.acme_account_id.toString()}/post-as-get`,
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
        <TitleBar
          title='Debug POST-as-GET'
          helpURL='https://www.certwarden.com/docs/user_interface/acme_accounts/#debug-pag'
        />

        {!getState.responseData && !getState.error && <ApiLoading />}

        {getState.error && (
          <ApiError
            statusCode={getState.error.statusCode}
            message={getState.error.message}
          />
        )}

        {getState.responseData && (
          <Form onSubmit={submitFormHandler}>
            <InputSelect
              id='dontSubmit.acme_account_id'
              label='Sign With ACME Account'
              value={formState.dontSubmit.acme_account_id}
              onChange={inputAcctSelectChangeHandler}
              options={acctOptions}
            />

            <InputTextField
              id='disabled.description'
              label='Description'
              value={
                getState.responseData.acme_accounts.find(
                  (acct) => acct.id === formState.dontSubmit.acme_account_id
                )?.description ?? ''
              }
              disabled
            />

            <InputTextField
              id='disabled.kid'
              label='Account URL / KID'
              value={
                getState.responseData.acme_accounts.find(
                  (acct) => acct.id === formState.dontSubmit.acme_account_id
                )?.kid ?? ''
              }
              disabled
            />

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
        )}
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
            slotProps={{
              input: {
                disableUnderline: true,
                style: {
                  fontFamily: 'Monospace',
                  fontSize: 14,
                },
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
            slotProps={{
              input: {
                disableUnderline: true,
                style: {
                  fontFamily: 'Monospace',
                  fontSize: 14,
                },
              },
            }}
          />
        </Paper>
      )}
    </>
  );
};

export default PostAsGet;
