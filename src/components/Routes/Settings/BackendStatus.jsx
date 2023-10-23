import useAxiosGet from '../../../hooks/useAxiosGet';
import { showDebugInfo } from '../../../helpers/environment';

import { Typography } from '@mui/material';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import GridItemContainer from '../../UI/Grid/GridItemContainer';
import GridTitle from '../../UI/Grid/GridTitle';

const BackendStatus = () => {
  const [apiGetState] = useAxiosGet('/status', 'server', true);

  // consts related to rendering
  const renderApiItems = apiGetState.isLoaded && !apiGetState.errorMessage;

  return (
    <GridItemContainer>
      <GridTitle title='Backend Status' />

      {!apiGetState.isLoaded && <ApiLoading />}
      {apiGetState.errorMessage && (
        <ApiError
          code={apiGetState.errorCode}
          message={apiGetState.errorMessage}
        />
      )}

      {renderApiItems && (
        <>
          <Typography variant='p' sx={{ my: 1 }} display='block'>
            Status:{' '}
            {apiGetState.server.status.charAt(0).toUpperCase() +
              apiGetState.server.status.slice(1)}
          </Typography>

          <Typography variant='p' sx={{ my: 1 }} display='block'>
            Version: {apiGetState.server.version}
          </Typography>

          {showDebugInfo && (
            <>
              <Typography variant='p' sx={{ my: 1 }} display='block'>
                Config Version: {apiGetState.server.config_version}
              </Typography>

              <Typography variant='p' sx={{ my: 1 }} display='block'>
                Database Version: {apiGetState.server.database_version}
              </Typography>
            </>
          )}

          <Typography variant='p' sx={{ my: 1 }} display='block'>
            Log Level:{' '}
            {apiGetState.server.log_level.charAt(0).toUpperCase() +
              apiGetState.server.log_level.slice(1)}
          </Typography>
        </>
      )}
    </GridItemContainer>
  );
};

export default BackendStatus;
