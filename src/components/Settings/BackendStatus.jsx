import useAxiosGet from '../../hooks/useAxiosGet';

import { Link, Typography } from '@mui/material';

import ApiError from '../UI/Api/ApiError';
import ApiLoading from '../UI/Api/ApiLoading';
import GridItemContainer from '../UI/Grid/GridItemContainer';
import GridTitle from '../UI/Grid/GridTitle';

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

          <Typography variant='p' sx={{ my: 1 }} display='block'>
            Development Mode:{' '}
            {apiGetState.server.development_mode ? 'Yes' : 'No'}
          </Typography>

          <Typography variant='p' sx={{ my: 1 }} display='block'>
            ACME Production Directory:{' '}
            <Link
              href={apiGetState.server.acme_directories.prod}
              target='_blank'
              rel='noreferrer'
            >
              {apiGetState.server.acme_directories.prod}
            </Link>
          </Typography>

          <Typography variant='p' sx={{ my: 1 }} display='block'>
            ACME Staging Directory:{' '}
            <Link
              href={apiGetState.server.acme_directories.staging}
              target='_blank'
              rel='noreferrer'
            >
              {apiGetState.server.acme_directories.staging}
            </Link>
          </Typography>
        </>
      )}
    </GridItemContainer>
  );
};

export default BackendStatus;
