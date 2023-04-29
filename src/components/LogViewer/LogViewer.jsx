import useAxiosGet from '../../hooks/useAxiosGet';
import useAxiosSend from '../../hooks/useAxiosSend';
import { iso8601ToPretty } from '../../helpers/time';
import { downloadBlob } from '../../helpers/download';

import { Paper, TextField } from '@mui/material';

import ApiLoading from '../UI/Api/ApiLoading';
import ApiError from '../UI/Api/ApiError';
import Button from '../UI/Button/Button';
import TitleBar from '../UI/TitleBar/TitleBar';

const LogViewer = () => {
  const [apiGetState] = useAxiosGet('/v1/log', 'log_entries', true);
  const [, sendData] = useAxiosSend();

  const downloadAllClickHandler = () => {
    sendData(`/v1/logs`, 'GET', null, true, 'blob').then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        downloadBlob(response);
      }
    });
  };

  if (apiGetState.errorMessage) {
    return (
      <ApiError
        code={apiGetState.errorCode}
        message={apiGetState.errorMessage}
      />
    );
  } else if (!apiGetState.isLoaded) {
    return <ApiLoading />;
  } else {
    return (
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
        <TitleBar title='Most Recent Log' disableGutters sx={{ m: 0, px: 2 }}>
          <Button variant='contained' onClick={downloadAllClickHandler}>
            Download All Logs
          </Button>
        </TitleBar>

        <TextField
          id='logs'
          name='logs'
          fullWidth
          variant='standard'
          value={apiGetState?.log_entries
            .map(
              (entry) =>
                iso8601ToPretty(entry.ts) +
                ', ' +
                entry.level +
                ', ' +
                entry.caller +
                ', ' +
                entry.msg
            )
            .reverse()
            .join('\n')}
          readOnly
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
      </Paper>
    );
  }
};

export default LogViewer;
