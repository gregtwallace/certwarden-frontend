import { frontendVersion, devMode } from '../../App';
import { API_URL } from '../../api/axios';

import H5Header from '../UI/Header/H5Header';

const FrontendStatus = () => {
  return (
    <div className='container mb-5'>
      <H5Header h5='Frontend Status' />

      <p>Development Mode: {devMode ? 'true' : 'false'}</p>
      <p>Frontend Version: {`${frontendVersion}`}</p>
      <p>API URL: {API_URL}</p>
    </div>
  );
};

export default FrontendStatus;
