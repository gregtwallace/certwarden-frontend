import { useEffect } from 'react';

import useAxiosGet from '../../../hooks/useAxiosGet';
import useNewVersion from '../../../hooks/useNewVersion';

import NavLink from './NavLink';
import UpgradeIcon from '@mui/icons-material/Upgrade';

const NewVersionLink = () => {
  // fetch new version information
  const [apiGetState] = useAxiosGet(`/v1/app/new_version`, 'new_version', true);

  // store new version available and info in context
  const { setNewVersion } = useNewVersion();
  useEffect(() => {
    if (apiGetState.isLoaded) {
      setNewVersion(apiGetState);
    }
  }, [apiGetState, setNewVersion]);

  return (
    <>
      {apiGetState.new_version.available && (
        <NavLink to='/settings' neverSelect={true} iconComponent={UpgradeIcon}>
          Update Available
        </NavLink>
      )}
    </>
  );
};

export default NewVersionLink;
