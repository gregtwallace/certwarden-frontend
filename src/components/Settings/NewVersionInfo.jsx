import { Link } from 'react-router-dom';

import useAxiosSend from '../../hooks/useAxiosSend';
import useNewVersion from '../../hooks/useNewVersion';

import { Typography } from '@mui/material';
import ApiError from '../UI/Api/ApiError';
import ApiLoading from '../UI/Api/ApiLoading';
import Button from '../UI/Button/Button';
import FormFooter from '../UI/FormMui/FormFooter';
import GridItemContainer from '../UI/Grid/GridItemContainer';
import GridTitle from '../UI/Grid/GridTitle';

const NewVersionInfo = () => {
  const { newVersion, reloadNewVersion } = useNewVersion();
  const [apiSendState, sendData] = useAxiosSend();

  // user clicks button to check for update
  const checkNewVersion = (event) => {
    event.preventDefault();

    sendData(`/v1/app/new-version`, 'POST', null, true).then((response) => {
      // refresh if success
      if (response.status >= 200 && response.status <= 299) {
        reloadNewVersion();
      }
    });
  };

  // only render when loaded and not error
  const renderApiItems =
    newVersion.isLoaded && !newVersion.errorMessage && !apiSendState.isSending;

  return (
    <GridItemContainer>
      <GridTitle title='App Updates' />

      {(!newVersion.isLoaded || apiSendState.isSending) && <ApiLoading />}
      {newVersion.errorMessage && (
        <ApiError
          code={newVersion.errorCode}
          message={newVersion.errorMessage}
        />
      )}

      {renderApiItems && (
        <>
          {newVersion.new_version.available ? (
            <>
              <Typography
                variant='p'
                sx={{ my: 1, color: 'success.main' }}
                display='block'
              >
                Update Available!
              </Typography>
              <Typography variant='p' sx={{ my: 1 }} display='block'>
                {newVersion.new_version.info.version}
              </Typography>
              <Typography variant='p' sx={{ my: 1 }} display='block'>
                Channel: {newVersion.new_version.info.channel}
              </Typography>

              {newVersion.new_version.config_version_matches && (
                <Typography
                  variant='p'
                  sx={{ my: 1, color: 'error.main' }}
                  display='block'
                >
                  Warning! New version config version does not match current
                  config version. <br /> Manual intervention is required to
                  upgrade.
                </Typography>
              )}
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
              No update in {newVersion.new_version.info?.channel} channel.
            </Typography>
          )}

          {apiSendState.errorMessage && (
            <ApiError
              code={apiSendState.errorCode}
              message={apiSendState.errorMessage}
            />
          )}

          <FormFooter>
            <Button onClick={checkNewVersion} disabled={apiSendState.isSending}>
              Check
            </Button>
          </FormFooter>
        </>
      )}
    </GridItemContainer>
  );
};

export default NewVersionInfo;
