import useNewVersion from '../../../hooks/useNewVersion';

import NavLink from './NavLink';
import UpgradeIcon from '@mui/icons-material/Upgrade';

const NewVersionLink = () => {
  // store new version available and info in context
  const { newVersion } = useNewVersion();

  return (
    <>
      {newVersion?.new_version?.available && (
        <NavLink
          to='/settings'
          neverSelect={true}
          iconComponent={UpgradeIcon}
          sx={{ color: 'success.main' }}
        >
          Update Available
        </NavLink>
      )}
    </>
  );
};

export default NewVersionLink;
