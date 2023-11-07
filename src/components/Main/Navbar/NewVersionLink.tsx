import { type FC } from 'react';

import { useState } from 'react';

import useNewVersion from '../../../hooks/useNewVersion';

import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import UpgradeIcon from '@mui/icons-material/Upgrade';

import NavLink from './NavLink';

// prop types
type propTypes = {
  showSecondaryAction: boolean;
};

// component
const NewVersionLink: FC<propTypes> = (props) => {
  const { showSecondaryAction } = props;
  const { newVersion } = useNewVersion();

  // if update notice is closed, save version to local storage and don't remind
  // until next version
  const [ignoreVersion, setIgnoreVersion] = useState(
    localStorage.getItem('ignore_update_version')
  );

  // close update notice, save to local storage
  const closeHandler = (): void => {
    if (newVersion?.info.version) {
      localStorage.setItem('ignore_update_version', newVersion.info.version);
      setIgnoreVersion(newVersion.info.version);
    }
  };

  return (
    <>
      {newVersion &&
        newVersion.available &&
        ignoreVersion != newVersion.info.version && (
          <NavLink
            to={newVersion.info.url}
            target='_blank'
            IconComponent={UpgradeIcon}
            iconColor='success'
            secondaryAction={
              showSecondaryAction && (
                <IconButton
                  edge='end'
                  aria-label='delete'
                  onClick={closeHandler}
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

export default NewVersionLink;
