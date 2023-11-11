import { type FC } from 'react';

import useNewVersion from '../../../hooks/useNewVersion';
import { convertUnixTime } from '../../../helpers/time';

import Link from '@mui/material/Link';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import Button from '../../UI/Button/Button';
import GridItemRowRight from '../../UI/Grid/GridItemRowRight';
import GridItemContainer from '../../UI/Grid/GridItemContainer';
import GridItemText from '../../UI/Grid/GridItemText';
import GridTitle from '../../UI/Grid/GridTitle';

const NewVersionInfo: FC = () => {
  const { newVersion, checkNewVersion, error } = useNewVersion();

  return (
    <GridItemContainer>
      <GridTitle title='App Updates' />

      {!newVersion && !error && <ApiLoading />}

      {error && (
        <ApiError statusCode={error.statusCode} message={error.message} />
      )}

      {newVersion && (
        <>
          {newVersion.available && newVersion.info ? (
            <>
              <GridItemText color='success.main'>
                Update Available ({newVersion.info.version}) !
              </GridItemText>
              <GridItemText>
                Channel:{' '}
                {newVersion.info.channel.charAt(0).toUpperCase() +
                  newVersion.info.channel.slice(1)}
              </GridItemText>

              {!newVersion.config_version_matches && (
                <GridItemText color='error.main'>
                  Warning: Update config version does not match current config
                  version. Please review the release notes.
                </GridItemText>
              )}

              {!newVersion.database_version_matches && (
                <GridItemText color='error.main'>
                  Warning: Update database version does not match current
                  database version. LeGo will modify the database after upgrade.
                  You should backup your database file before upgrading.
                </GridItemText>
              )}

              {newVersion.info.url != '' && (
                <GridItemText>
                  <Link
                    href={newVersion.info.url}
                    target='_blank'
                    rel='noreferrer'
                  >
                    Click Here to View
                  </Link>
                </GridItemText>
              )}
            </>
          ) : (
            <GridItemText>No update.</GridItemText>
          )}

          <GridItemText>
            Last Checked: {convertUnixTime(newVersion.last_checked_time, true)}
          </GridItemText>

          <GridItemRowRight>
            <Button onClick={checkNewVersion}>Check</Button>
          </GridItemRowRight>
        </>
      )}
    </GridItemContainer>
  );
};

export default NewVersionInfo;
