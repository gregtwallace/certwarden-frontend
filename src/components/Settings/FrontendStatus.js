import H5Header from '../UI/Header/H5Header';

// react app version
const frontendVersion = "0.3.0"

const FrontendStatus = () => {
  const apiUrl =
    process.env.NODE_ENV === 'production'
      ? window.env.API_URL
      : process.env.REACT_APP_API_URL;

  return (
    <div className='container mb-5'>
      <H5Header h5='Frontend Status' />

      <p>
        Development Mode:{' '}
        {!process.env.NODE_ENV ||
        process.env.NODE_ENV === 'development' ||
        window.env.DEV_MODE
          ? 'true'
          : 'false'}
      </p>
      <p>Frontend Version: {frontendVersion}</p>
      <p>API URL: {apiUrl}</p>
    </div>
  );
};

export default FrontendStatus;
