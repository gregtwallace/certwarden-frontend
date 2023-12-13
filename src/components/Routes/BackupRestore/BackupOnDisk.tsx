import { type FC } from 'react';
import {
  type frontendErrorType,
  type validationErrorsType,
} from '../../../types/frontend';
import {
  type backupAllOnDiskResponseType,
  parseBackupAllOnDiskResponseType,
  type backupMakeResponseType,
  parseBackupMakeResponseType,
  type backupDeleteResponseType,
  parseBackupDeleteResponseType,
} from '../../../types/api';
import { type headerType } from '../../UI/TableMui/TableHeaderRow';

import { useState } from 'react';

import useAxiosGet from '../../../hooks/useAxiosGet';
import useAxiosSend from '../../../hooks/useAxiosSend';
import { convertUnixTime } from '../../../helpers/time';

import { Link } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { TableCell } from '@mui/material';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import ApiLoading from '../../UI/Api/ApiLoading';
import ApiError from '../../UI/Api/ApiError';
import Button from '../../UI/Button/Button';
import DialogAlert from '../../UI/Dialog/DialogAlert';
import IconButton from '../../UI/Button/IconButton';
import TableContainer from '../../UI/TableMui/TableContainer';
import TableHeaderRow from '../../UI/TableMui/TableHeaderRow';
import TitleBar from '../../UI/TitleBar/TitleBar';
import TableText from '../../UI/TableMui/TableText';

// backend API path
const BACKUP_ON_DISK_URL = '/v1/app/backup/disk';

// table headers and sortable param
// TODO make sortable on backend?
const tableHeaders: headerType[] = [
  {
    id: 'name',
    label: 'Name',
    sortable: false,
  },
  {
    id: 'size',
    label: 'Size',
    sortable: false,
  },
  {
    id: 'created_at',
    label: 'Created',
    sortable: false,
  },
  {
    id: 'delete',
    label: 'Delete',
    sortable: false,
  },
];

// form shape
type formObj = {
  sendSuccess: boolean | undefined;
  sendError: frontendErrorType | undefined;
  validationErrors: validationErrorsType;
};

const BackupOnDisk: FC = () => {
  const { axiosSendState, apiCall, downloadFile } = useAxiosSend();

  const { getState, updateGet } = useAxiosGet<backupAllOnDiskResponseType>(
    BACKUP_ON_DISK_URL,
    parseBackupAllOnDiskResponseType
  );

  const blankFormState: formObj = {
    sendSuccess: undefined,
    sendError: undefined,
    validationErrors: {},
  };
  const [formState, setFormState] = useState(blankFormState);

  // tell the server to make a backup in its backup folder
  const makeDiskBackupNowHandler = (): void => {
    apiCall<backupMakeResponseType>(
      'POST',
      BACKUP_ON_DISK_URL,
      {},
      parseBackupMakeResponseType
    ).then(({ error }) => {
      setFormState((prevState) => ({
        ...prevState,
        sendError: error,
      }));

      updateGet();
    });
  };

  // download an existing backup
  const downloadDiskBackupHandler = (filename: string): void => {
    downloadFile(BACKUP_ON_DISK_URL + '/' + filename).then(({ error }) => {
      setFormState((prevState) => ({
        ...prevState,
        sendError: error,
      }));
    });
  };

  // delete a disk backup
  const [deleteOpenedFor, setDeleteOpenedFor] = useState('');

  const deleteDiskBackupHandler = (filename: string): void => {
    setDeleteOpenedFor('');

    apiCall<backupDeleteResponseType>(
      'DELETE',
      BACKUP_ON_DISK_URL + '/' + filename,
      {},
      parseBackupDeleteResponseType
    ).then(({ error }) => {
      setFormState((prevState) => ({
        ...prevState,
        sendError: error,
      }));

      updateGet();
    });
  };

  return (
    <TableContainer>
      <TitleBar title='Backups On Disk'>
        <Button
          onClick={makeDiskBackupNowHandler}
          disabled={axiosSendState.isSending}
        >
          Backup Now
        </Button>
      </TitleBar>

      <DialogAlert
        title={`Are you sure you want to delete ${deleteOpenedFor}?`}
        open={deleteOpenedFor !== ''}
        onCancel={() => setDeleteOpenedFor('')}
        onConfirm={() => deleteDiskBackupHandler(deleteOpenedFor)}
      >
        This backup file will not be recoverable.
      </DialogAlert>

      <TableText>
        On disk backups are not cumulative and do not include previous on disk
        backups. Logs may or may not be included.
      </TableText>

      {!getState.responseData && !getState.error && <ApiLoading />}

      {getState.error && (
        <ApiError
          statusCode={getState.error.statusCode}
          message={getState.error.message}
        />
      )}

      {formState.sendError &&
        Object.keys(formState.validationErrors).length <= 0 && (
          <ApiError
            statusCode={formState.sendError.statusCode}
            message={formState.sendError.message}
          />
        )}

      {getState.responseData && (
        <Table size='small'>
          <TableHead>
            <TableHeaderRow headers={tableHeaders} />
          </TableHead>
          <TableBody>
            {getState.responseData?.backup_files
              .sort((a, b) => {
                // sort newest to be first TODO: Allow sorting changes
                const aTime = a.created_at ? a.created_at : a.modtime;
                const bTime = b.created_at ? b.created_at : b.modtime;
                return bTime - aTime;
              })
              .map((file) => (
                <TableRow key={file.name}>
                  <TableCell>
                    <Link
                      component='button'
                      onClick={() => downloadDiskBackupHandler(file.name)}
                    >
                      {file.name}
                    </Link>
                  </TableCell>
                  <TableCell>{(file.size / 1000000).toFixed(2)} MB</TableCell>
                  <TableCell>
                    {file.created_at
                      ? convertUnixTime(file.created_at, true)
                      : convertUnixTime(file.modtime, true)}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => setDeleteOpenedFor(file.name)}
                      tooltip='Delete'
                      color='error'
                    >
                      <CloseIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default BackupOnDisk;
