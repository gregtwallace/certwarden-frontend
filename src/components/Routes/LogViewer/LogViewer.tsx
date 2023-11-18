import { type FC, type MouseEventHandler } from 'react';
import { type logResponseType, parseLogResponseType } from '../../../types/api';
import { type frontendErrorType } from '../../../types/frontend';

import { useState } from 'react';
import useAxiosGet from '../../../hooks/useAxiosGet';
import useAxiosSend from '../../../hooks/useAxiosSend';
import { iso8601StringToPretty } from '../../../helpers/time';

import { Paper, TextField } from '@mui/material';

import ApiLoading from '../../UI/Api/ApiLoading';
import ApiError from '../../UI/Api/ApiError';
import Button from '../../UI/Button/Button';
import TitleBar from '../../UI/TitleBar/TitleBar';

const VIEW_LOG_URL = '/v1/app/log';
const DOWNLOAD_LOGS_URL = '/v1/app/logs';

const LogViewer: FC = () => {
  const { getState } = useAxiosGet<logResponseType>(
    VIEW_LOG_URL,
    parseLogResponseType
  );

  const { axiosSendState, downloadFile } = useAxiosSend();
  const [downloadError, setDownloadError] = useState<
    frontendErrorType | undefined
  >(undefined);

  const downloadAllClickHandler: MouseEventHandler = () => {
    downloadFile(DOWNLOAD_LOGS_URL).then(({ error }) => {
      setDownloadError(error);
    });
  };

  return (
    <>
      <Paper
        sx={{
          minHeight: 0,
          flexGrow: 1,
          height: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 1,
        }}
      >
        <TitleBar title='Most Recent Log'>
          <Button
            onClick={downloadAllClickHandler}
            disabled={axiosSendState.isSending}
          >
            Download All Logs
          </Button>
        </TitleBar>

        {downloadError && (
          <ApiError
            statusCode={downloadError.statusCode}
            message={downloadError.message}
          />
        )}

        {!getState.responseData && !getState.error && <ApiLoading />}

        {getState.error && (
          <ApiError
            statusCode={getState.error.statusCode}
            message={getState.error.message}
          />
        )}

        {getState.responseData && (
          <TextField
            id='logs'
            name='logs'
            fullWidth
            variant='standard'
            value={getState.responseData.log_entries
              .map(
                (entry) =>
                  iso8601StringToPretty(entry.ts) +
                  ', ' +
                  entry.level +
                  ', ' +
                  entry.caller +
                  ', ' +
                  entry.msg
              )
              .reverse()
              .join('\n')}
            sx={{ my: 1, px: 1, overflowY: 'auto' }}
            multiline
            InputProps={{
              disableUnderline: true,
              style: {
                fontFamily: 'Monospace',
                fontSize: 14,
              },
            }}
          />
        )}
      </Paper>
    </>
  );
};

export default LogViewer;
