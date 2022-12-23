import useAxiosGet from '../../hooks/useAxiosGet';
import { iso8601ToPretty } from '../../helpers/time';

import { Paper, TextField } from '@mui/material';

import ApiLoading from '../UI/Api/ApiLoading';
import ApiError from '../UI/Api/ApiError';
import TitleBar from '../UI/Header/TitleBar';

const LogViewer = () => {
  const [apiGetState] = useAxiosGet('/v1/logs', 'logs', true);

  if (apiGetState.errorMessage) {
    return <ApiError>{apiGetState.errorMessage}</ApiError>;
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
        <TitleBar title='Logs' disableGutters sx={{ m: 0, px: 2 }} />

        <TextField
          id='logs'
          name='logs'
          fullWidth
          variant='standard'
          value={apiGetState?.logs
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
