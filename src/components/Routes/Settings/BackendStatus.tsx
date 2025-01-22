import { type FC } from 'react';
import {
  parseBackendStatusResponse,
  type backendStatusResponseType,
} from '../../../types/api';

import useAxiosGet from '../../../hooks/useAxiosGet';
import useClientSettings from '../../../hooks/useClientSettings';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import GridItemContainer from '../../UI/Grid/GridItemContainer';
import GridItemText from '../../UI/Grid/GridItemText';
import GridTitle from '../../UI/Grid/GridTitle';

const STATUS_URL = '/status';

const BackendStatus: FC = () => {
  // debug?
  const { showDebugInfo } = useClientSettings();

  //backendStatusResponseType
  const { getState } = useAxiosGet<backendStatusResponseType>(
    STATUS_URL,
    parseBackendStatusResponse
  );

  return (
    <GridItemContainer>
      <GridTitle title='Backend Status' />

      {!getState.responseData && !getState.error && <ApiLoading />}

      {getState.error && (
        <ApiError
          statusCode={getState.error.statusCode}
          message={getState.error.message}
        />
      )}

      {getState.responseData && (
        <>
          <GridItemText>
            {' '}
            Status:{' '}
            {getState.responseData.server.status.charAt(0).toUpperCase() +
              getState.responseData.server.status.slice(1)}
          </GridItemText>

          <GridItemText>
            Version: {getState.responseData.server.version}
          </GridItemText>

          {showDebugInfo && (
            <>
              <GridItemText>
                Config Version: {getState.responseData.server.config_version}
              </GridItemText>

              <GridItemText>
                Database Version:{' '}
                {getState.responseData.server.database_version}
              </GridItemText>
            </>
          )}

          <GridItemText>
            Log Level:{' '}
            {getState.responseData.server.log_level.charAt(0).toUpperCase() +
              getState.responseData.server.log_level.slice(1)}
          </GridItemText>
        </>
      )}
    </GridItemContainer>
  );
};

export default BackendStatus;
