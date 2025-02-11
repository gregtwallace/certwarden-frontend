import { type FC } from 'react';
import { type providerType } from '../../../../../types/api';

import { Box } from '@mui/material';

import GridItemContainer from '../../../../UI/Grid/GridItemContainer';
// import GridItemText from '../../../UI/Grid/GridItemText';
import FormRowRight from '../../../../UI/FormMui/FormRowRight';
import ButtonAsLink from '../../../../UI/Button/ButtonAsLink';

import ProviderTitle from './ProviderTitle';
import ProviderDomainsView from './ProviderDomainsView';
// import ConfigView from './ConfigView';

type propTypes = {
  provider: providerType;
};

const ViewOneProvider: FC<propTypes> = (props) => {
  const { provider } = props;

  return (
    <GridItemContainer
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ProviderTitle provider={provider} />

      <ProviderDomainsView domains={provider.domains} />

      {/* <GridItemText>Config</GridItemText> */}
      {/* <ConfigView config={provider.config} /> */}

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
