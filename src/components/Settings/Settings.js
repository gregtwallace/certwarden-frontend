import H2Header from '../UI/Header/H2Header';
import ChangePassword from './ChangePassword';
import BackendStatus from './BackendStatus';
import FrontendStatus from './FrontendStatus';

const Settings = () => {
  return (
    <>
      <H2Header h2='LeGo Settings' />
      
      <ChangePassword />

      <FrontendStatus />
      <BackendStatus />
    </>
  );
};

export default Settings;
