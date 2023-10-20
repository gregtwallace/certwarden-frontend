import PropTypes from 'prop-types';
import { useState } from 'react';
import useNewVersion from '../../../hooks/useNewVersion';

import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import NavLink from './NavLink';
import UpgradeIcon from '@mui/icons-material/Upgrade';

const NewVersionLink = (props) => {
  const { bigView } = props;
  const { newVersion } = useNewVersion();

  // if update notice is closed, save version to local storage and don't remind
  // until next version
  const [ignoreVersion, setIgnoreVersion] = useState(
    localStorage.getItem('ignore_update_version')
  );

  // close update notice, save to local storage
  const closeHandler = () => {
    if (newVersion?.new_version?.info?.version) {
      localStorage.setItem(
        'ignore_update_version',
        newVersion.new_version.info.version
      );
      setIgnoreVersion(newVersion.new_version.info.version);
    }
  };

  // only render once loaded
  const canRender = newVersion.isLoaded && !newVersion.errorMessage;

  return (
    <>
      {canRender &&
        newVersion.new_version.available &&
        ignoreVersion != newVersion.new_version.info.version && (
          <NavLink
            to={newVersion.new_version.info.url}
            target='_blank'
            IconComponent={UpgradeIcon}
            color='success'
            secondaryAction={
              bigView && (
                <IconButton
                  edge='end'
                  aria-label='delete'
                  onClick={closeHandler}
                  to='https://wwww.google.com/'
                >
                  <Close fontSize='small' color='error' />
                </IconButton>
              )
            }
          >
            View Update
          </NavLink>
        )}
    </>
  );
};

NewVersionLink.propTypes = {
  bigView: PropTypes.bool,
};

export default NewVersionLink;
