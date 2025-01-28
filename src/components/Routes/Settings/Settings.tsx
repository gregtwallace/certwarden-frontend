import { type FC } from 'react';

import useAuth from '../../../hooks/useAuth';

import GridChildrenContainer from '../../UI/Grid/GridChildrenContainer';
import GridContainer from '../../UI/Grid/GridContainer';
import GridItemThird from '../../UI/Grid/GridItemThird';

import TitleBar from '../../UI/TitleBar/TitleBar';
import BackupRestoreSettings from './BackupRestoreSettings';
import ChangePassword from './ChangePassword';
import BackendStatus from './BackendStatus';
import FrontendStatus from './FrontendStatus';
import NewVersionInfo from './NewVersionInfo';
import Shutdown from './Shutdown';

const Settings: FC = () => {
  const { getUserType } = useAuth();
  const userType = getUserType();

  return (
    <GridContainer>
      <TitleBar
        title='Settings'
        helpURL='https://www.certwarden.com/docs/user_interface/settings/'
      />

      <GridChildrenContainer>
        <GridItemThird>
          <FrontendStatus />
        </GridItemThird>

        <GridItemThird>
          <BackendStatus />
        </GridItemThird>

        {userType === 'local' && (
          <GridItemThird>
            <ChangePassword />
          </GridItemThird>
        )}

        <GridItemThird>
          <NewVersionInfo />
        </GridItemThird>

        <GridItemThird>
          <BackupRestoreSettings />
        </GridItemThird>

        <GridItemThird>
          <Shutdown />
        </GridItemThird>
      </GridChildrenContainer>
    </GridContainer>
  );
};

export default Settings;
