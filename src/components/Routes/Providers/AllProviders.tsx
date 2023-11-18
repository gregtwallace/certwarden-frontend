import { type FC } from 'react';
import {
  type providersResponseType,
  parseProvidersResponseType,
} from '../../../types/api';

import useAxiosGet from '../../../hooks/useAxiosGet';
import { newId } from '../../../helpers/constants';

import ApiLoading from '../../UI/Api/ApiLoading';
import ApiError from '../../UI/Api/ApiError';
import ButtonAsLink from '../../UI/Button/ButtonAsLink';
import GridContainer from '../../UI/Grid/GridContainer';
import GridItemThird from '../../UI/Grid/GridItemThird';
import TitleBar from '../../UI/TitleBar/TitleBar';
import ViewOneProvider from './ViewOneProvider/ViewOneProvider';

const PROVIDERS_URL = '/v1/app/challenges/providers/services';

const AllProviders: FC = () => {
  const { getState } = useAxiosGet<providersResponseType>(
    PROVIDERS_URL,
    parseProvidersResponseType
  );

  // once loaded, sort providers array
  if (getState.responseData) {
    getState.responseData.providers.sort((a, b) => {
      // sort by type first
      if (a.type < b.type) {
        return -1;
      }
      if (b.type < a.type) {
        return 1;
      }

      // if type ===, then sort by id
      return a.id - b.id;
    });
  }

  return (
    <>
      <TitleBar title='Challenge Providers'>
        <ButtonAsLink to={`/providers/${newId}`}>New Provider</ButtonAsLink>
      </TitleBar>

      <GridContainer>
        {!getState.responseData && !getState.error && <ApiLoading />}

        {getState.error && (
          <ApiError
            statusCode={getState.error.statusCode}
            message={getState.error.message}
          />
        )}

        {getState.responseData &&
          getState.responseData.providers.map((prov) => (
            <GridItemThird key={prov.id}>
              <ViewOneProvider provider={prov} />
            </GridItemThird>
          ))}
      </GridContainer>
    </>
  );
};

export default AllProviders;
