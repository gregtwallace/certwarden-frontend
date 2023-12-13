import { type FC } from 'react';

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
  return (
    <GridContainer>
      <TitleBar title='Settings' />

      <GridChildrenContainer>
        <GridItemThird>
          <FrontendStatus />
        </GridItemThird>

        <GridItemThird>
          <BackendStatus />
        </GridItemThird>

        <GridItemThird>
          <ChangePassword />
        </GridItemThird>

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
