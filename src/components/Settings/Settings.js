import GridContainer from '../UI/Grid/GridContainer';
import GridItemThird from '../UI/Grid/GridItemThird';

import ChangePassword from './ChangePassword';
import BackendStatus from './BackendStatus';
import FrontendStatus from './FrontendStatus';
import TitleBar from '../UI/Header/TitleBar';

const Settings = () => {
  return (
    <>
      <TitleBar title='Settings' />

      <GridContainer>
        <GridItemThird>
          <FrontendStatus />
        </GridItemThird>

        <GridItemThird>
          <BackendStatus />
        </GridItemThird>

        <GridItemThird>
          <ChangePassword />
        </GridItemThird>
      </GridContainer>
    </>
  );
};

export default Settings;
