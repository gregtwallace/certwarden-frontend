import useAxiosGet from '../../hooks/useAxiosGet';

import ApiError from '../UI/Api/ApiError';
import ApiLoading from '../UI/Api/ApiLoading';
import H5Header from '../UI/Header/H5Header';

const BackendStatus = () => {
  const [apiGetState] = useAxiosGet('/status', 'server', true);

  if (apiGetState.errorMessage) {
    return <ApiError>{apiGetState.errorMessage}</ApiError>;
  } else if (!apiGetState.isLoaded) {
    return <ApiLoading />;
  } else {
    return (
      <div className='container mb-5'>
        <H5Header h5='Backend Status' />

        <p>Status: {apiGetState.server.status}</p>
        <p>
          Development Mode:{' '}
          {apiGetState.server.development_mode ? 'true' : 'false'}
        </p>
        <p>Backend Version: {apiGetState.server.version}</p>
        <p>Backend API URL: {apiGetState.server.api_url}</p>

        {apiGetState.server.frontend_url && (
          <p>Frontend URL: {apiGetState.server.frontend_url}</p>
        )}

        <p>
          ACME Production Directory: {apiGetState.server.acme_directories.prod}
        </p>
        <p>
          ACME Staging Directory: {apiGetState.server.acme_directories.staging}
        </p>
      </div>
    );
  }
};

export default BackendStatus;
