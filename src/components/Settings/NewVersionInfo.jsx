import useAxiosSend from '../../hooks/useAxiosSend';
import useNewVersion from '../../hooks/useNewVersion';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
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
                Update Available ({newVersion.new_version.info.version}) !
              </Typography>
              <Typography variant='p' sx={{ my: 1 }} display='block'>
                Channel: {newVersion.new_version.info.channel}
              </Typography>

              {!newVersion.new_version.config_version_matches && (
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

              {!newVersion.new_version.database_version_matches && (
                <Typography
                  variant='p'
                  sx={{ my: 1, color: 'error.main' }}
                  display='block'
                >
                  Warning! New version database version does not match current
                  version. <br /> LeGo will modify the db after upgrade. You
                  should backup your database file before upgrading.
                </Typography>
              )}

              {newVersion.new_version.info.url != '' && (
                <Typography
                  component={Link}
                  href={newVersion.new_version.info.url}
                  target='_blank'
                  rel='noreferrer'
                  sx={{ my: 1 }}
                  display='block'
                >
                  Click Here to View
                </Typography>
              )}
            </>
          ) : (
            <Typography variant='p' sx={{ my: 1 }} display='block'>
              No update.
            </Typography>
          )}

          {apiSendState.errorMessage && (
            <ApiError
              code={apiSendState.errorCode}
              message={apiSendState.errorMessage}
            />
          )}

          <FormFooter checkedAt={newVersion.new_version.last_checked_time}>
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
