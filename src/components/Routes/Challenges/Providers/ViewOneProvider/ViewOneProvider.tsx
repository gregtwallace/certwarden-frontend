import { type FC } from 'react';
import { type providerType } from '../../../../../types/api';

import { Box } from '@mui/material';

import GridItemContainer from '../../../../UI/Grid/GridItemContainer';
import GridItemText from '../../../../UI/Grid/GridItemText';
import FormRowRight from '../../../../UI/FormMui/FormRowRight';
import ButtonAsLink from '../../../../UI/Button/ButtonAsLink';

import ProviderTitle from './ProviderTitle';
import ProviderDomainsView from './ProviderDomainsView';

type propTypes = {
  provider: providerType;
};

const ViewOneProvider: FC<propTypes> = (props) => {
  const { provider } = props;

  // text for pre/post check times
  const precheckTime =
    provider.precheck_wait < 60
      ? provider.precheck_wait.toString() + ' seconds'
      : (provider.precheck_wait / 60).toFixed(1).toString() + ' minutes';
  const postcheckTime =
    provider.postcheck_wait < 60
      ? provider.postcheck_wait.toString() + ' seconds'
      : (provider.postcheck_wait / 60).toFixed(1).toString() + ' minutes';

  return (
    <GridItemContainer
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ProviderTitle provider={provider} />

      <ProviderDomainsView domains={provider.domains} />

      <GridItemText>Pre-Check Wait: {precheckTime}</GridItemText>
      <GridItemText>Post-Check Wait: {postcheckTime}</GridItemText>

      <Box
        sx={{
          minHeight: 0,
          flexGrow: 1,
        }}
      />

      <FormRowRight>
        <ButtonAsLink
          color='warning'
          to={`/challenges/providers/${provider.id.toString()}`}
        >
          Edit
        </ButtonAsLink>
      </FormRowRight>
    </GridItemContainer>
  );
};

export default ViewOneProvider;
