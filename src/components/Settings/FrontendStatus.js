import { frontendVersion } from '../../App';
import { devMode } from '../../helpers/environment';
import { apiUrl } from '../../helpers/environment';

import H5Header from '../UI/Header/H5Header';

const FrontendStatus = () => {
  return (
    <div className='container mb-5'>
      <H5Header h5='Frontend Status' />

      <p>Development Mode: {devMode ? 'true' : 'false'}</p>
      <p>Frontend Version: {`${frontendVersion}`}</p>
      <p>API URL: {apiUrl}</p>
    </div>
  );
};

export default FrontendStatus;
