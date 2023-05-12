import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import useNewVersion from '../../hooks/useNewVersion';

import ApiError from '../UI/Api/ApiError';
import ApiLoading from '../UI/Api/ApiLoading';
import GridItemContainer from '../UI/Grid/GridItemContainer';
import GridTitle from '../UI/Grid/GridTitle';

const NewVersionInfo = () => {
  const { newVersion } = useNewVersion();

  // only render when loaded and not error
  const renderApiItems = newVersion.isLoaded && !newVersion.errorMessage;

  return (
    <GridItemContainer>
      <GridTitle title='App Updates' />

      {!newVersion.isLoaded && <ApiLoading />}
      {newVersion.errorMessage && (
        <ApiError
          code={newVersion.errorCode}
          message={newVersion.errorMessage}
        />
      )}

      {renderApiItems &&
        (newVersion.new_version.available ? (
          <>
            <Typography
              variant='p'
              sx={{ my: 1, color: 'error.dark' }}
              display='block'
            >
              New Version Available!
            </Typography>

            <Typography variant='p' sx={{ my: 1 }} display='block'>
              New Version: {newVersion.new_version.info.version}
            </Typography>

            <Typography variant='p' sx={{ my: 1 }} display='block'>
              Channel: {newVersion.new_version.info.channel}
            </Typography>

            {newVersion.new_version.info.url != '' && (
              <Typography
                component={Link}
                href={newVersion.new_version.info.url}
                target='_blank'
                sx={{ my: 1 }}
                display='block'
              >
                Link
              </Typography>
            )}
          </>
        ) : (
          <Typography variant='p' sx={{ my: 1 }} display='block'>
            No update in {newVersion.new_version.info.channel} channel.
          </Typography>
        ))}
    </GridItemContainer>
  );
};

export default NewVersionInfo;
