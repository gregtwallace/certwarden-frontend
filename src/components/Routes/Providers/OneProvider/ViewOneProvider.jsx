import PropTypes from 'prop-types';

import { Typography } from '@mui/material';

import GridItemContainer from '../../../UI/Grid/GridItemContainer';
import ProviderTitle from './Common/ProviderTitle';
import ProviderDomainsView from './Common/ProviderDomainsView';

import ConfigView from './Common/ConfigView';

const ViewOneProvider = (props) => {
  return (
    <GridItemContainer>
      <ProviderTitle provider={props.provider} />
      <ProviderDomainsView domains={props.provider.config.domains} />

      <Typography level='body-xs' fontWeight='lg'>
        Config
      </Typography>

      <ConfigView config={props.provider.config} />
    </GridItemContainer>
  );
};

ViewOneProvider.propTypes = {
  provider: PropTypes.shape({
    id: PropTypes.number.isRequired,
    tag: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
  }).isRequired,
};

export default ViewOneProvider;
