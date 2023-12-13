import { type FC, type FormEventHandler } from 'react';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../types/frontend';

import { useState } from 'react';

import useAxiosSend from '../../../hooks/useAxiosSend';
import { inputHandlerFuncMaker } from '../../../helpers/input-handler';

import ApiError from '../../UI/Api/ApiError';
import Button from '../../UI/Button/Button';
import Form from '../../UI/FormMui/Form';
import FormContainer from '../../UI/FormMui/FormContainer';
import FormInfo from '../../UI/FormMui/FormInfo';
import FormRowRight from '../../UI/FormMui/FormRowRight';
import InputCheckbox from '../../UI/FormMui/InputCheckbox';
import TitleBar from '../../UI/TitleBar/TitleBar';

// backend API path
const BACKUP_NEW_DOWNLOAD_URL = '/v1/app/backup';

// form shape
type formObj = {
  query: {
    with_log_files: boolean;
    with_on_disk_backups: boolean;
  };
  sendSuccess: boolean | undefined;
  sendError: frontendErrorType | undefined;
  validationErrors: validationErrorsType;
};

const BackupNewDownload: FC = () => {
  const { axiosSendState, downloadFile } = useAxiosSend();

  const blankFormState: formObj = {
    query: {
      with_log_files: true,
      with_on_disk_backups: false,
    },
    sendSuccess: undefined,
    sendError: undefined,
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankFormState);

  // data change handler
  const inputChangeHandler = inputHandlerFuncMaker(setFormState);

  // download a backup of current state
  const downloadNewBackupHandler: FormEventHandler = (event) => {
    event.preventDefault();

    // no validation needed

    downloadFile(
      BACKUP_NEW_DOWNLOAD_URL +
        `?withlogs=${
          formState.query.with_log_files ? 'true' : 'false'
        }&withondiskbackups=${
          formState.query.with_on_disk_backups ? 'true' : 'false'
        }`
    ).then(({ error }) => {
      setFormState((prevState) => ({
        ...prevState,
        sendError: error,
      }));
    });
  };

  return (
    <FormContainer>
      <TitleBar title='Backup' />

      <Form onSubmit={downloadNewBackupHandler}>
        <FormInfo>
          Download a backup of the application&apos;s current state.
        </FormInfo>

        <FormInfo>
          Backups are not password protected or encrypted. You must keep them
          secure to avoid compromise of your PKI.
        </FormInfo>

        <InputCheckbox
          id='query.with_log_files'
          checked={formState.query.with_log_files}
          onChange={inputChangeHandler}
        >
          With Log Files
        </InputCheckbox>

        <InputCheckbox
          id='query.with_on_disk_backups'
          checked={formState.query.with_on_disk_backups}
          onChange={inputChangeHandler}
        >
          With On Disk Backups
        </InputCheckbox>

        {formState.sendError &&
          Object.keys(formState.validationErrors).length <= 0 && (
            <ApiError
              statusCode={formState.sendError.statusCode}
              message={formState.sendError.message}
            />
          )}

        <FormRowRight>
          <Button
            color='primary'
            type='submit'
            disabled={axiosSendState.isSending}
          >
            Download
          </Button>
        </FormRowRight>
      </Form>
    </FormContainer>
  );
};

export default BackupNewDownload;
